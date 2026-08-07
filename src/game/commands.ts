import {
  findZone,
  getBossForZone,
  hasDefeatedBoss,
  requiredBossForZone,
  SHOP_CATALOG,
  SKILLS,
  ZONES,
  expToNext,
} from './data/content'
import { formatItemStats, getItem, ITEMS } from './data/items'
import {
  findConsumableId,
  playerAttack,
  playerDefend,
  playerFlee,
  playerSkill,
  playerUseItem,
  resolveSkillQuery,
  startCombat,
} from './combat'
import {
  addItem,
  clampVitals,
  createAdminTestPlayer,
  equipItem,
  findInventoryItem,
  fullRest,
  getEffectiveMaxHp,
  getEffectiveMaxMp,
  getTotalAtk,
  getTotalDef,
  inventoryQty,
  isErrorMsg,
  removeItem,
  unequipItem,
  useConsumable,
} from './player'
import {
  pushMessage,
  saveGame,
  loadGame,
  hasSave,
  clearMessages,
  createInitialState,
  getAutosaveMinutes,
  setAutosaveMinutes,
  restartAutosaveTimer,
  DEFAULT_AUTOSAVE_MIN,
  MIN_AUTOSAVE_MIN,
  MAX_AUTOSAVE_MIN,
} from './save'
import {
  closeSettings,
  formatSettingsStatus,
  getSettings,
  openSettings,
  patchSettings,
  resetSettings,
  shouldShowCombatHints,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type SettingsCategory,
} from './settings'
import {
  ensureNpcMaps,
  findNpc,
  formatNpcLine,
  getAffinityScore,
  getAffinityStage,
  getGiftedStage,
  NPCS,
  npcLabel,
  pickDialogue,
  pickPresentNpcs,
} from './data/npcs'
import {
  getLang,
  itemLabel,
  itemMatchesQuery,
  parseLang,
  skillDesc,
  skillLabel,
  slotLabel,
  t,
  zoneDesc,
  zoneLabel,
  monsterLabel,
} from './i18n'
import type { GameState, ItemDef, PlayerState } from './types'
import { SLOT_ORDER } from './types'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export type CommandResult = {
  state: GameState
  refreshUi: boolean
}

export function handleCommand(state: GameState, raw: string): CommandResult {
  const line = raw.trim()
  if (!line) return { state, refreshUi: false }

  state.history.push(line)
  if (state.history.length > 100) state.history.shift()
  pushMessage(state, 'input', `$ ${line}`)

  const [cmd, ...rest] = tokenize(line)
  const arg = rest.join(' ').trim()
  const c = cmd.toLowerCase()

  // Hidden admin fixture (works even mid-combat)
  if (c === 'hellothisistestforadmin') {
    const name = state.player.name
    state.player = createAdminTestPlayer(name)
    state.mode = 'idle'
    state.combat = null
    state.townSocial = null
    pushMessage(state, 'success', t('ok.adminTest'))
    pushMessage(state, 'system', t('ok.adminTestHint'))
    return { state, refreshUi: true }
  }

  // Affinity reply (1/2/3 or choice text) while a town talk is pending
  if (state.townSocial?.pending) {
    const replyIdx = parseReplyIndex(state, line, c, arg)
    if (replyIdx != null) {
      return handleNpcReply(state, replyIdx)
    }
    if (c !== 'status' && c !== 'st' && c !== 'stat' && c !== 'inv' && c !== 'inventory' && c !== 'i' && c !== 'help' && c !== '?' && c !== 'man') {
      pushMessage(state, 'error', t('err.npcChoose'))
      return { state, refreshUi: true }
    }
  }

  if (state.mode === 'combat') {
    return handleCombatCommand(state, c, arg)
  }

  switch (c) {
    case 'help':
    case '?':
    case 'man':
      pushMessage(state, 'system', t('help.body'))
      break

    case 'clear':
    case 'cls':
      clearMessages(state)
      pushMessage(state, 'system', t('ok.cleared'))
      break

    case 'history':
      if (!state.history.length) pushMessage(state, 'output', t('ok.noHistory'))
      else {
        state.history.slice(-30).forEach((h, i) => {
          pushMessage(state, 'output', ` ${String(i + 1).padStart(3)}. ${h}`)
        })
      }
      break

    case 'save':
      pushMessage(state, 'success', saveGame(state))
      break

    case 'lang':
    case 'language':
    case 'locale': {
      if (!arg) {
        pushMessage(state, 'output', t('info.lang', { lang: getLang() }))
        break
      }
      const lang = parseLang(arg)
      if (!lang) {
        pushMessage(state, 'error', t('err.usage.lang'))
        break
      }
      const res = patchSettings({ locale: lang, languageChosen: true })
      if (!res.ok) {
        pushMessage(state, 'error', res.error)
        break
      }
      pushMessage(state, 'success', t('ok.lang', { lang }))
      break
    }

    case 'settings':
    case 'setting':
    case 'preferences':
    case 'prefs':
    case 'config': {
      const a = arg.toLowerCase()
      if (!arg || a === 'open' || a === 'ui') {
        openSettings()
        pushMessage(state, 'success', t('ok.settingsOpen'))
        pushMessage(state, 'output', formatSettingsStatus())
        break
      }
      if (a === 'close' || a === 'back' || a === 'game' || a === 'terminal') {
        closeSettings()
        pushMessage(state, 'success', t('ok.settingsClose'))
        break
      }
      if (a === 'list' || a === 'status' || a === 'show') {
        pushMessage(state, 'output', formatSettingsStatus())
        break
      }
      if (a === 'reset') {
        resetSettings()
        restartAutosaveTimer()
        pushMessage(state, 'success', t('ok.settingsReset'))
        break
      }
      const cat = parseSettingsCategory(arg)
      if (cat) {
        openSettings(cat)
        pushMessage(state, 'success', t('ok.settingsCat', { cat }))
        break
      }
      pushMessage(state, 'error', t('err.usage.settings'))
      break
    }

    case 'theme': {
      if (!arg) {
        pushMessage(state, 'output', t('info.theme', { theme: getSettings().theme }))
        break
      }
      const mode = arg.toLowerCase()
      if (mode !== 'dark' && mode !== 'light') {
        pushMessage(state, 'error', t('err.usage.theme'))
        break
      }
      const res = patchSettings({ theme: mode })
      if (!res.ok) {
        pushMessage(state, 'error', res.error)
        break
      }
      pushMessage(state, 'success', t('ok.theme', { theme: mode }))
      break
    }

    case 'inspector': {
      const v = parseOnOff(arg)
      if (v === null && arg) {
        pushMessage(state, 'error', t('err.usage.inspector'))
        break
      }
      if (v === null) {
        pushMessage(state, 'output', t('info.inspector', { value: getSettings().showInspector }))
        break
      }
      patchSettings({ showInspector: v })
      pushMessage(state, 'success', t('ok.inspector', { state: v ? 'on' : 'off' }))
      break
    }

    case 'hud': {
      const v = parseOnOff(arg)
      if (v === null && arg) {
        pushMessage(state, 'error', t('err.usage.hud'))
        break
      }
      if (v === null) {
        pushMessage(state, 'output', t('info.hud', { value: getSettings().showHud }))
        break
      }
      patchSettings({ showHud: v })
      pushMessage(state, 'success', t('ok.hud', { state: v ? 'on' : 'off' }))
      break
    }

    case 'hints':
    case 'combathints': {
      const v = parseOnOff(arg)
      if (v === null && arg) {
        pushMessage(state, 'error', t('err.usage.hints'))
        break
      }
      if (v === null) {
        pushMessage(state, 'output', t('info.hints', { value: getSettings().combatHints }))
        break
      }
      patchSettings({ combatHints: v })
      pushMessage(state, 'success', t('ok.hints', { state: v ? 'on' : 'off' }))
      break
    }

    case 'fast':
    case 'pace':
    case 'speed': {
      if (!arg) {
        pushMessage(
          state,
          'output',
          t('info.fast', { value: getSettings().fastMode ? 'on' : 'off' }),
        )
        break
      }
      const a = arg.toLowerCase()
      let v: boolean | null = parseOnOff(arg)
      if (v === null) {
        if (a === 'fast') v = true
        else if (a === 'normal' || a === 'slow' || a === 'default') v = false
      }
      if (v === null) {
        pushMessage(state, 'error', t('err.usage.fast'))
        break
      }
      patchSettings({ fastMode: v })
      pushMessage(state, 'success', t('ok.fast', { state: v ? 'on' : 'off' }))
      break
    }

    case 'explorer': {
      const a = arg.toLowerCase()
      if (!a) {
        pushMessage(
          state,
          'output',
          t('info.explorer', { value: getSettings().compactExplorer }),
        )
        break
      }
      if (a === 'compact' || a === 'narrow') {
        patchSettings({ compactExplorer: true })
        pushMessage(state, 'success', t('ok.explorer', { mode: 'compact' }))
        break
      }
      if (a === 'normal' || a === 'default' || a === 'wide') {
        patchSettings({ compactExplorer: false })
        pushMessage(state, 'success', t('ok.explorer', { mode: 'normal' }))
        break
      }
      pushMessage(state, 'error', t('err.usage.explorer'))
      break
    }

    case 'fontsize':
    case 'font-size': {
      if (!arg) {
        pushMessage(
          state,
          'output',
          t('info.font', {
            size: getSettings().fontSize,
            lo: FONT_SIZE_MIN,
            hi: FONT_SIZE_MAX,
          }),
        )
        break
      }
      if (!/^\d+$/.test(arg)) {
        pushMessage(
          state,
          'error',
          t('err.usage.fontsize', { min: FONT_SIZE_MIN, max: FONT_SIZE_MAX }),
        )
        break
      }
      const res = patchSettings({ fontSize: parseInt(arg, 10) })
      if (!res.ok) {
        pushMessage(state, 'error', res.error)
        break
      }
      pushMessage(state, 'success', t('ok.font', { size: getSettings().fontSize }))
      break
    }

    case 'autosave': {
      if (!arg) {
        pushMessage(
          state,
          'output',
          t('info.autosave', {
            min: getAutosaveMinutes(),
            def: DEFAULT_AUTOSAVE_MIN,
            lo: MIN_AUTOSAVE_MIN,
            hi: MAX_AUTOSAVE_MIN,
          }),
        )
        break
      }
      const mins = Number(arg)
      if (!/^\d+$/.test(arg) || !Number.isInteger(mins)) {
        pushMessage(
          state,
          'error',
          t('err.usage.autosave', { min: MIN_AUTOSAVE_MIN, max: MAX_AUTOSAVE_MIN }),
        )
        break
      }
      const res = patchSettings({ autosaveMinutes: mins })
      if (!res.ok) {
        pushMessage(state, 'error', res.error)
        break
      }
      setAutosaveMinutes(mins)
      restartAutosaveTimer()
      pushMessage(state, 'success', t('ok.autosave', { min: mins }))
      break
    }

    case 'load': {
      if (!hasSave()) {
        pushMessage(state, 'error', t('err.noSave'))
        break
      }
      const loaded = loadGame()
      if (!loaded) {
        pushMessage(state, 'error', t('err.corruptSave'))
        break
      }
      Object.assign(state, loaded)
      pushMessage(state, 'success', t('ok.loaded'))
      pushMessage(
        state,
        'system',
        t('ok.welcomeBack', { name: state.player.name, loc: locLabel(state) }),
      )
      break
    }

    case 'reset': {
      const name = state.player.name
      const fresh = createInitialState()
      fresh.player.name = name
      Object.assign(state, fresh)
      pushMessage(state, 'system', t('ok.newGame'))
      welcome(state)
      break
    }

    case 'status':
    case 'st':
    case 'stat':
      pushMessage(state, 'output', formatStatus(state))
      break

    case 'name':
    case 'rename':
    case '닉네임':
    case 'nick':
    case 'nickname':
      return handleRename(state, arg)

    case 'inv':
    case 'inventory':
    case 'i':
      pushMessage(state, 'output', formatInventory(state))
      break

    case 'skills':
    case 'skill':
      if (arg && c === 'skill') {
        const sid = resolveSkillQuery(arg, state.player)
        if (!sid) pushMessage(state, 'error', t('err.unknownSkill'))
        else {
          const s = SKILLS[sid]
          pushMessage(
            state,
            'output',
            `${skillLabel(sid)} | MP ${s.mpCost} | Lv.${s.unlockLevel}+ | ${skillDesc(sid)}`,
          )
        }
      } else {
        pushMessage(state, 'output', formatSkills(state))
      }
      break

    case 'look':
    case 'ls':
    case 'pwd':
      if (
        arg.toLowerCase() === 'around' ||
        arg === '동네' ||
        arg === '마을' ||
        arg === '사람들'
      ) {
        return handleLookAround(state)
      }
      pushMessage(state, 'output', formatLook(state))
      break

    case 'zones':
    case 'maps':
      pushMessage(state, 'output', formatZones(state.player.level, state.player.bossesDefeated))
      break

    case 'town':
    case 'home':
      state.player.location = 'town'
      state.townSocial = null
      pushMessage(state, 'success', t('ok.town'))
      break

    case 'lookaround':
    case 'around':
    case '둘러보기':
    case 'people':
      return handleLookAround(state)

    case 'talk':
    case 'npc':
    case 'speak':
      return handleTalk(state, arg)

    case 'npcs':
      return handleLookAround(state)

    case 'rest':
    case 'sleep':
    case 'recover': {
      if (state.player.location !== 'town') {
        pushMessage(state, 'error', t('err.restTown'))
        break
      }
      const beforeHp = state.player.hp
      const beforeMp = state.player.mp
      fullRest(state.player)
      const maxHp = getEffectiveMaxHp(state.player)
      const maxMp = getEffectiveMaxMp(state.player)
      if (beforeHp >= maxHp && beforeMp >= maxMp) {
        pushMessage(state, 'system', t('ok.restAlready'))
      } else {
        pushMessage(
          state,
          'success',
          t('ok.rest', {
            hp: state.player.hp,
            maxHp,
            mp: state.player.mp,
            maxMp,
          }),
        )
      }
      break
    }

    case 'cd':
      if (arg === '~' || arg === '/' || arg === 'town' || arg === '마을') {
        state.player.location = 'town'
        state.townSocial = null
        pushMessage(state, 'success', t('ok.townShort'))
      } else if (arg) {
        return handleGo(state, arg)
      } else {
        pushMessage(state, 'error', t('err.usage.cd'))
      }
      break

    case 'go':
    case 'goto':
    case 'move':
      if (!arg) {
        pushMessage(state, 'error', t('err.usage.go'))
        break
      }
      return handleGo(state, arg)

    case 'hunt':
    case 'explore':
    case 'search':
      return handleHunt(state)

    case 'boss':
    case 'challenge':
      return handleBoss(state)

    case 'shop':
      if (!arg || arg === 'list' || arg === 'ls') {
        if (state.player.location !== 'shop' && state.player.location !== 'town') {
          pushMessage(state, 'error', t('err.shopOnly'))
          break
        }
        state.player.location = 'shop'
        pushMessage(state, 'success', t('ok.shopEnter'))
        pushMessage(state, 'output', formatShop())
      } else {
        pushMessage(state, 'error', t('err.usage.shop'))
      }
      break

    case 'buy':
      return handleBuy(state, arg)

    case 'sell':
      return handleSell(state, rest)

    case 'equip':
      if (!arg) {
        pushMessage(state, 'error', t('err.usage.equip'))
        break
      }
      {
        const found = findInventoryItem(state.player, arg)
        if (!found) {
          pushMessage(state, 'error', t('err.noItemInv'))
          break
        }
        const msg = equipItem(state.player, found.itemId)
        pushMessage(state, isErrorMsg(msg) ? 'error' : 'success', msg)
      }
      break

    case 'unequip':
      if (!arg) {
        pushMessage(state, 'error', t('err.usage.unequip'))
        break
      }
      {
        const msg = unequipItem(state.player, arg)
        pushMessage(state, isErrorMsg(msg) ? 'error' : 'success', msg)
      }
      break

    case 'use':
      if (!arg) {
        pushMessage(state, 'error', t('err.usage.use'))
        break
      }
      {
        const id = findConsumableId(state.player, arg)
        if (!id) {
          pushMessage(state, 'error', t('err.noConsumable'))
          break
        }
        const msg = useConsumable(state.player, id)
        pushMessage(state, isErrorMsg(msg) ? 'error' : 'success', msg ?? '')
      }
      break

    case 'attack':
    case 'a':
    case 'defend':
    case 'd':
    case 'flee':
      pushMessage(state, 'error', t('err.notInCombat'))
      break

    default:
      if (findZone(cmd) || findZone(line)) {
        return handleGo(state, line)
      }
      pushMessage(state, 'error', t('err.unknownCmd', { cmd }))
  }

  return { state, refreshUi: true }
}

function handleCombatCommand(state: GameState, c: string, arg: string): CommandResult {
  if (!state.combat) {
    state.mode = 'idle'
    return { state, refreshUi: true }
  }

  if (c === 'help' || c === '?') {
    pushMessage(state, 'system', t('combat.help'))
    return { state, refreshUi: true }
  }
  if (c === 'status' || c === 'st') {
    pushMessage(state, 'output', formatStatus(state))
    return { state, refreshUi: true }
  }
  if (c === 'inv' || c === 'inventory' || c === 'i') {
    pushMessage(state, 'output', formatInventory(state))
    return { state, refreshUi: true }
  }
  if (c === 'skills') {
    pushMessage(state, 'output', formatSkills(state))
    return { state, refreshUi: true }
  }
  if (c === 'clear' || c === 'cls') {
    clearMessages(state)
    return { state, refreshUi: true }
  }
  if (c === 'history') {
    state.history.slice(-20).forEach((h, i) => pushMessage(state, 'output', ` ${i + 1}. ${h}`))
    return { state, refreshUi: true }
  }
  if (c === 'save') {
    pushMessage(state, 'success', saveGame(state))
    pushMessage(state, 'system', t('combat.saveNote'))
    return { state, refreshUi: true }
  }
  if (c === 'lang' || c === 'language' || c === 'locale') {
    if (!arg) {
      pushMessage(state, 'output', t('info.lang', { lang: getLang() }))
      return { state, refreshUi: true }
    }
    const lang = parseLang(arg)
    if (!lang) {
      pushMessage(state, 'error', t('err.usage.lang'))
      return { state, refreshUi: true }
    }
    patchSettings({ locale: lang, languageChosen: true })
    pushMessage(state, 'success', t('ok.lang', { lang }))
    return { state, refreshUi: true }
  }

  let result
  if (c === 'attack' || c === 'a' || c === 'hit') {
    result = playerAttack(state.player, state.combat)
  } else if (c === 'defend' || c === 'd' || c === 'guard') {
    result = playerDefend(state.player, state.combat)
  } else if (c === 'flee' || c === 'run' || c === 'escape') {
    result = playerFlee(state.player, state.combat)
  } else if (c === 'skill' || c === 's' || c === 'cast') {
    if (!arg) {
      pushMessage(state, 'error', t('err.usage.skill'))
      return { state, refreshUi: true }
    }
    const sid = resolveSkillQuery(arg, state.player)
    if (!sid) {
      pushMessage(state, 'error', t('err.unknownSkill'))
      return { state, refreshUi: true }
    }
    result = playerSkill(state.player, state.combat, sid)
  } else if (c === 'use') {
    if (!arg) {
      pushMessage(state, 'error', t('err.usage.use'))
      return { state, refreshUi: true }
    }
    const id = findConsumableId(state.player, arg)
    if (!id) {
      pushMessage(state, 'error', t('err.noConsumable'))
      return { state, refreshUi: true }
    }
    result = playerUseItem(state.player, state.combat, id)
  } else {
    pushMessage(state, 'error', t('err.combatOnly'))
    return { state, refreshUi: true }
  }

  for (const msg of result.messages) {
    const kind = isErrorMsg(msg) ? 'error' : 'combat'
    pushMessage(state, kind, msg)
  }

  if (result.ended) {
    state.mode = 'idle'
    state.combat = null
    if (result.victory) {
      pushMessage(state, 'success', t('ok.victory'))
    } else if (result.fled) {
      pushMessage(state, 'system', t('ok.fled'))
    }
  }

  return { state, refreshUi: true }
}

function normalizeChoiceQuery(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function matchChoiceByText(state: GameState, query: string): number | null {
  const pending = state.townSocial?.pending
  if (!pending) return null
  const q = normalizeChoiceQuery(query)
  if (!q) return null

  const npc = NPCS[pending.npcId]
  const dialogue = npc?.dialogues.find((d) => d.id === pending.dialogueId)
  if (!npc || !dialogue) return null

  const pool = pending.beat === 1 ? dialogue.choices : dialogue.afterChoices
  const playerName = state.player.name
  const texts = pending.choiceOrder.map((origIdx) => {
    const ch = pool[origIdx]
    if (!ch) return { ko: '', en: '' }
    return {
      ko: normalizeChoiceQuery(formatNpcLine(ch.ko, playerName)),
      en: normalizeChoiceQuery(formatNpcLine(ch.en, playerName)),
    }
  })

  // Exact match (either language)
  for (let i = 0; i < texts.length; i++) {
    if (texts[i].ko === q || texts[i].en === q) return i
  }

  // Unique prefix
  const prefixes: number[] = []
  for (let i = 0; i < texts.length; i++) {
    const { ko, en } = texts[i]
    if ((ko && ko.startsWith(q)) || (en && en.startsWith(q))) prefixes.push(i)
  }
  if (prefixes.length === 1) return prefixes[0]

  // Unique substring (query in choice, or choice in query for short pasted variants)
  const contains: number[] = []
  for (let i = 0; i < texts.length; i++) {
    const { ko, en } = texts[i]
    if (
      (ko && (ko.includes(q) || (q.length >= 4 && q.includes(ko)))) ||
      (en && (en.includes(q) || (q.length >= 4 && q.includes(en))))
    ) {
      contains.push(i)
    }
  }
  if (contains.length === 1) return contains[0]

  return null
}

function parseReplyIndex(state: GameState, line: string, cmd: string, arg: string): number | null {
  if (cmd === '1' || cmd === '2' || cmd === '3') return Number(cmd) - 1
  if (cmd === 'reply' || cmd === 'answer' || cmd === 'choose' || cmd === '선택') {
    const n = Number(arg.trim().split(/\s+/)[0])
    if (n >= 1 && n <= 3) return n - 1
    const byArg = matchChoiceByText(state, arg)
    if (byArg != null) return byArg
  }
  return matchChoiceByText(state, line)
}

function inTownArea(state: GameState): boolean {
  return state.player.location === 'town' || state.player.location === 'shop'
}

function handleLookAround(state: GameState): CommandResult {
  if (!inTownArea(state)) {
    pushMessage(state, 'error', t('err.npcTown'))
    return { state, refreshUi: true }
  }
  ensureNpcMaps(state.player)
  const present = pickPresentNpcs()
  state.townSocial = { present, talked: false, pending: null }
  const lines = [t('npc.lookHead'), '------']
  for (const id of present) {
    const n = NPCS[id]
    if (!n) continue
    const title = getLang() === 'ko' ? n.titleKo : n.titleEn
    const score = getAffinityScore(state.player, id)
    const stage = getAffinityStage(score)
    lines.push(
      t('npc.lookLine', {
        name: npcLabel(n),
        title,
        stage,
        score,
      }),
    )
  }
  lines.push('------')
  lines.push(t('npc.lookFoot'))
  pushMessage(state, 'output', lines.join('\n'))
  return { state, refreshUi: true }
}

function shuffleChoiceOrder(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

function showChoices(
  state: GameState,
  choices: { en: string; ko: string; delta: number }[],
  order: number[],
): void {
  pushMessage(state, 'system', t('npc.chooseHead'))
  order.forEach((origIdx, displayIdx) => {
    const ch = choices[origIdx]
    const text = formatNpcLine(getLang() === 'ko' ? ch.ko : ch.en, state.player.name)
    pushMessage(state, 'output', t('npc.choiceLine', { n: displayIdx + 1, text }))
  })
  pushMessage(state, 'system', t('npc.chooseFoot'))
}

function handleTalk(state: GameState, query: string): CommandResult {
  if (!inTownArea(state)) {
    pushMessage(state, 'error', t('err.npcTown'))
    return { state, refreshUi: true }
  }
  ensureNpcMaps(state.player)
  if (!state.townSocial || state.townSocial.present.length === 0) {
    pushMessage(state, 'error', t('err.npcNeedLook'))
    return { state, refreshUi: true }
  }
  if (state.townSocial.pending) {
    pushMessage(state, 'error', t('err.npcChoose'))
    return { state, refreshUi: true }
  }
  if (state.townSocial.talked) {
    pushMessage(state, 'error', t('err.npcTalkOnce'))
    return { state, refreshUi: true }
  }
  if (!query) {
    pushMessage(state, 'system', t('ok.talkHint'))
    return { state, refreshUi: true }
  }
  const npc = findNpc(query)
  if (!npc) {
    pushMessage(state, 'error', t('err.unknownNpc'))
    return { state, refreshUi: true }
  }
  if (!state.townSocial.present.includes(npc.id)) {
    pushMessage(state, 'error', t('err.npcNotPresent', { name: npcLabel(npc) }))
    return { state, refreshUi: true }
  }

  const seen = state.player.npcDialogueSeen[npc.id] ?? []
  const stage = getAffinityStage(getAffinityScore(state.player, npc.id))
  const dialogue = pickDialogue(npc, seen, stage)
  const choiceOrder = shuffleChoiceOrder(dialogue.choices.length)
  state.townSocial.pending = {
    npcId: npc.id,
    dialogueId: dialogue.id,
    beat: 1,
    choiceOrder,
  }

  const npcLine = formatNpcLine(
    getLang() === 'ko' ? dialogue.npcKo : dialogue.npcEn,
    state.player.name,
  )
  pushMessage(state, 'output', npcLine)
  showChoices(state, dialogue.choices, choiceOrder)
  return { state, refreshUi: true }
}

function applyAffinityDelta(
  state: GameState,
  npcId: string,
  npcName: string,
  choice: { en: string; ko: string; delta: number },
): void {
  const before = getAffinityScore(state.player, npcId)
  const next = Math.max(0, before + choice.delta)
  state.player.npcAffinity[npcId] = next
  const afterStage = getAffinityStage(next)

  const youSaid = formatNpcLine(getLang() === 'ko' ? choice.ko : choice.en, state.player.name)
  pushMessage(state, 'output', t('npc.youSaid', { text: youSaid }))

  if (choice.delta > 2) {
    pushMessage(state, 'success', t('npc.reactGood', { name: npcName, delta: choice.delta }))
  } else if (choice.delta > 0) {
    pushMessage(state, 'system', t('npc.reactOk', { name: npcName, delta: choice.delta }))
  } else {
    pushMessage(state, 'system', t('npc.reactFlat', { name: npcName }))
  }

  pushMessage(
    state,
    'output',
    t('npc.affinityNow', { name: npcName, score: next, stage: afterStage }),
  )
}

function grantAffinityGifts(state: GameState, npcId: string): void {
  const npc = NPCS[npcId]
  if (!npc) return
  const score = getAffinityScore(state.player, npcId)
  const afterStage = getAffinityStage(score)
  const gifted = getGiftedStage(state.player, npcId)
  for (let stage = gifted + 1; stage <= afterStage; stage++) {
    const gift = npc.gifts.find((g) => g.stage === stage)
    if (!gift) continue
    addItem(state.player, gift.itemId, gift.qty)
    state.player.npcGiftStage[npcId] = stage
    pushMessage(
      state,
      'loot',
      t('npc.gift', {
        name: npcLabel(npc),
        stage,
        item: itemLabel(gift.itemId),
        qty: gift.qty,
      }),
    )
  }
}

function handleNpcReply(state: GameState, choiceIndex: number): CommandResult {
  const social = state.townSocial
  if (!social?.pending) {
    pushMessage(state, 'error', t('err.npcNoPending'))
    return { state, refreshUi: true }
  }
  ensureNpcMaps(state.player)
  const { npcId, dialogueId, beat, choiceOrder } = social.pending
  const npc = NPCS[npcId]
  const dialogue = npc?.dialogues.find((d) => d.id === dialogueId)
  if (!npc || !dialogue) {
    social.pending = null
    pushMessage(state, 'error', t('err.unknownNpc'))
    return { state, refreshUi: true }
  }

  const origIdx = choiceOrder[choiceIndex]
  if (origIdx == null) {
    pushMessage(state, 'error', t('err.npcChoose'))
    return { state, refreshUi: true }
  }

  if (beat === 1) {
    const choice = dialogue.choices[origIdx]
    if (!choice) {
      pushMessage(state, 'error', t('err.npcChoose'))
      return { state, refreshUi: true }
    }
    applyAffinityDelta(state, npcId, npcLabel(npc), choice)

    const nextOrder = shuffleChoiceOrder(dialogue.afterChoices.length)
    social.pending = { npcId, dialogueId, beat: 2, choiceOrder: nextOrder }
    const afterLine = formatNpcLine(
      getLang() === 'ko' ? dialogue.afterKo : dialogue.afterEn,
      state.player.name,
    )
    pushMessage(state, 'output', afterLine)
    showChoices(state, dialogue.afterChoices, nextOrder)
    return { state, refreshUi: true }
  }

  // beat 2 — end conversation
  const choice = dialogue.afterChoices[origIdx]
  if (!choice) {
    pushMessage(state, 'error', t('err.npcChoose'))
    return { state, refreshUi: true }
  }
  applyAffinityDelta(state, npcId, npcLabel(npc), choice)

  const seen = state.player.npcDialogueSeen[npcId] ?? []
  if (!seen.includes(dialogueId)) {
    state.player.npcDialogueSeen[npcId] = [...seen, dialogueId]
  }

  grantAffinityGifts(state, npcId)
  social.pending = null
  social.talked = true
  pushMessage(state, 'system', t('npc.talkDone'))
  return { state, refreshUi: true }
}

function handleGo(state: GameState, query: string): CommandResult {
  const zone = findZone(query)
  if (!zone) {
    pushMessage(state, 'error', t('err.unknownZone'))
    return { state, refreshUi: true }
  }
  if (state.player.level < zone.minLevel) {
    pushMessage(
      state,
      'error',
      t('err.zoneLevel', {
        zone: zoneLabel(zone.id),
        need: zone.minLevel,
        level: state.player.level,
      }),
    )
    return { state, refreshUi: true }
  }
  const needBoss = requiredBossForZone(zone)
  if (needBoss && !hasDefeatedBoss(state.player.bossesDefeated, needBoss)) {
    pushMessage(
      state,
      'error',
      t('err.zoneBossGate', {
        zone: zoneLabel(zone.id),
        boss: monsterLabel(needBoss),
      }),
    )
    return { state, refreshUi: true }
  }
  state.player.location = zone.id
  state.townSocial = null
  pushMessage(
    state,
    'success',
    t('ok.arrived', { zone: zoneLabel(zone.id), desc: zoneDesc(zone.id) }),
  )
  pushMessage(state, 'system', t('ok.huntHint'))
  if (getBossForZone(zone.id)) {
    pushMessage(state, 'system', t('ok.bossHint'))
  }
  return { state, refreshUi: true }
}

function handleBoss(state: GameState): CommandResult {
  const zoneId = state.player.location
  const bossId = getBossForZone(zoneId)
  if (!bossId) {
    pushMessage(state, 'error', t('err.bossOnlyApex'))
    return { state, refreshUi: true }
  }
  state.combat = startCombat(bossId)
  state.mode = 'combat'
  for (const line of state.combat.log) pushMessage(state, 'combat', line)
  if (shouldShowCombatHints()) {
    pushMessage(state, 'system', t('combat.cmds'))
  }
  return { state, refreshUi: true }
}

function handleHunt(state: GameState): CommandResult {
  const zone = ZONES[state.player.location]
  if (!zone) {
    pushMessage(state, 'error', t('err.huntOnlyZone'))
    return { state, refreshUi: true }
  }

  const roll = Math.random()
  if (roll < 0.8) {
    const mid = pick(zone.monsters)
    state.combat = startCombat(mid)
    state.mode = 'combat'
    for (const line of state.combat.log) pushMessage(state, 'combat', line)
    if (shouldShowCombatHints()) {
      pushMessage(state, 'system', t('combat.cmds'))
    }
  } else if (roll < 0.9) {
    const itemId = pick(zone.forageItems)
    addItem(state.player, itemId, 1)
    pushMessage(state, 'loot', t('ok.lootItem', { item: itemLabel(itemId) }))
  } else {
    const gold = randInt(zone.goldMin, zone.goldMax)
    state.player.gold += gold
    pushMessage(
      state,
      'loot',
      t('ok.lootGold', { gold, total: state.player.gold }),
    )
  }
  return { state, refreshUi: true }
}

function handleBuy(state: GameState, arg: string): CommandResult {
  if (state.player.location !== 'shop' && state.player.location !== 'town') {
    pushMessage(state, 'error', t('err.buyOnly'))
    return { state, refreshUi: true }
  }
  if (!arg) {
    pushMessage(state, 'error', t('err.usage.buy'))
    return { state, refreshUi: true }
  }

  const item = resolveShopItem(arg)
  if (!item || item.buyPrice == null) {
    pushMessage(state, 'error', t('err.notSold'))
    return { state, refreshUi: true }
  }
  if (state.player.gold < item.buyPrice) {
    pushMessage(
      state,
      'error',
      t('err.gold', { price: item.buyPrice, gold: state.player.gold }),
    )
    return { state, refreshUi: true }
  }
  state.player.gold -= item.buyPrice
  addItem(state.player, item.id, 1)
  state.player.location = 'shop'
  pushMessage(
    state,
    'success',
    t('ok.bought', {
      item: itemLabel(item),
      price: item.buyPrice,
      gold: state.player.gold,
    }),
  )
  return { state, refreshUi: true }
}

function handleSell(state: GameState, rest: string[]): CommandResult {
  if (state.player.location !== 'shop' && state.player.location !== 'town') {
    pushMessage(state, 'error', t('err.sellOnly'))
    return { state, refreshUi: true }
  }
  if (!rest.length) {
    pushMessage(state, 'error', t('err.usage.sell'))
    return { state, refreshUi: true }
  }

  let qty = 1
  const last = rest[rest.length - 1]
  let nameParts = rest
  if (/^\d+$/.test(last) && rest.length > 1) {
    qty = parseInt(last, 10)
    nameParts = rest.slice(0, -1)
  }
  const name = nameParts.join(' ')
  const found = findInventoryItem(state.player, name)
  if (!found) {
    pushMessage(state, 'error', t('err.noItemInv'))
    return { state, refreshUi: true }
  }
  if (found.qty < qty) {
    pushMessage(state, 'error', t('err.qty', { qty: found.qty }))
    return { state, refreshUi: true }
  }
  const item = getItem(found.itemId)!
  const unit = item.buyPrice != null ? Math.floor(item.buyPrice / 3) : item.sellPrice
  const total = unit * qty
  removeItem(state.player, found.itemId, qty)
  state.player.gold += total
  state.player.location = 'shop'
  pushMessage(
    state,
    'success',
    t('ok.sold', {
      item: itemLabel(item),
      qty,
      total,
      unit,
      gold: state.player.gold,
    }),
  )
  return { state, refreshUi: true }
}

function resolveShopItem(query: string) {
  const raw = query.trim()
  const numMatch = raw.match(/^#?(\d+)$/)
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1
    if (idx >= 0 && idx < SHOP_CATALOG.length) {
      return ITEMS[SHOP_CATALOG[idx]]
    }
    return undefined
  }
  for (const id of SHOP_CATALOG) {
    const item = ITEMS[id]
    if (itemMatchesQuery(item, raw)) return item
  }
  return undefined
}

function localDateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function canRenameToday(player: PlayerState): boolean {
  return player.lastNameChangeDate !== localDateKey()
}

export type RenameApplyResult =
  | { ok: true; name: string }
  | { ok: false; error: 'invalid' | 'same' | 'daily' }

/** Shared rename rules for CLI and settings UI. */
export function applyRename(player: PlayerState, raw: string): RenameApplyResult {
  const next = raw.trim()
  if (/\s/.test(next) || next.length < 2 || next.length > 12) {
    return { ok: false, error: 'invalid' }
  }
  if (next === player.name) {
    return { ok: false, error: 'same' }
  }
  if (!canRenameToday(player)) {
    return { ok: false, error: 'daily' }
  }
  player.name = next
  player.lastNameChangeDate = localDateKey()
  return { ok: true, name: next }
}

function handleRename(state: GameState, raw: string): CommandResult {
  const next = raw.trim()
  if (!next) {
    pushMessage(state, 'output', t('info.name', { name: state.player.name }))
    return { state, refreshUi: true }
  }
  const res = applyRename(state.player, next)
  if (!res.ok) {
    if (res.error === 'invalid') pushMessage(state, 'error', t('err.nameInvalid'))
    else if (res.error === 'same') pushMessage(state, 'error', t('err.nameSame'))
    else pushMessage(state, 'error', t('err.nameDailyLimit'))
    return { state, refreshUi: true }
  }
  pushMessage(state, 'success', t('ok.name', { name: res.name }))
  return { state, refreshUi: true }
}

function tokenize(line: string): string[] {
  return line.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((s) => s.replace(/^"|"$/g, '')) ?? []
}

function parseSettingsCategory(query: string): SettingsCategory | null {
  const q = query.trim().toLowerCase()
  if (q === 'appearance' || q === 'theme' || q === 'ui' || q === '외관') return 'appearance'
  if (q === 'game' || q === 'gameplay' || q === '게임') return 'game'
  if (q === 'terminal' || q === 'cli' || q === 'editor' || q === '터미널') return 'terminal'
  return null
}

function parseOnOff(arg: string): boolean | null {
  const a = arg.trim().toLowerCase()
  if (!a) return null
  if (a === 'on' || a === 'true' || a === '1' || a === 'yes') return true
  if (a === 'off' || a === 'false' || a === '0' || a === 'no') return false
  return null
}

export function welcome(state: GameState): void {
  pushMessage(state, 'success', t('welcome.title'))
  if (!getSettings().languageChosen) {
    pushMessage(state, 'success', t('welcome.lang'))
  }

  if (hasSave()) {
    const loaded = loadGame()
    if (loaded) {
      Object.assign(state, loaded)
      pushMessage(state, 'success', t('ok.loaded'))
      pushMessage(
        state,
        'system',
        t('ok.welcomeBack', { name: state.player.name, loc: locLabel(state) }),
      )
      return
    }
    pushMessage(state, 'error', t('err.corruptSave'))
  }

  pushMessage(state, 'output', t('welcome.hint'))
}

function locLabel(state: GameState): string {
  return zoneLabel(state.player.location)
}

function formatStatus(state: GameState): string {
  const p = state.player
  clampVitals(p)
  const maxHp = getEffectiveMaxHp(p)
  const maxMp = getEffectiveMaxMp(p)
  const need = expToNext(p.level)
  const lines = [
    t('stat.name', { name: p.name, loc: locLabel(state) }),
    t('stat.level', { level: p.level, exp: p.exp, need, gold: p.gold }),
    t('stat.vitals', { hp: p.hp, maxHp, mp: p.mp, maxMp }),
    t('stat.atkdef', {
      atk: getTotalAtk(p),
      baseAtk: p.baseAtk,
      def: getTotalDef(p),
      baseDef: p.baseDef,
    }),
    t('stat.equip'),
  ]
  for (const slot of SLOT_ORDER) {
    const id = p.equipment[slot]
    const item = id ? getItem(id) : undefined
    lines.push(
      `  ${slotLabel(slot).padEnd(8)}: ${
        item ? `${itemLabel(item)} (${formatItemStats(item)})` : t('stat.none')
      }`,
    )
  }
  return lines.join('\n')
}

function itemKindLabel(item: ItemDef): string {
  if (item.kind === 'consumable') return t('kind.cons')
  if (item.slot) return slotLabel(item.slot)
  return t('kind.gear')
}

function formatInventory(state: GameState): string {
  const p = state.player
  if (!p.inventory.length) return t('inv.empty')
  const lines = [t('inv.head', { n: p.inventory.length, gold: p.gold }), '------------']
  let firstGearName: string | null = null
  for (const e of p.inventory) {
    const item = getItem(e.itemId)
    if (!item) continue
    if (!firstGearName && item.kind === 'equipment') {
      firstGearName = item.name
    }
    lines.push(
      t('inv.line', {
        kind: itemKindLabel(item),
        item: itemLabel(item),
        qty: e.qty,
        stats: formatItemStats(item),
        sell: item.sellPrice,
      }),
    )
  }
  lines.push('------------')
  if (firstGearName) {
    lines.push(t('inv.hint', { example: firstGearName }))
  } else {
    lines.push(t('inv.hintNone'))
  }
  return lines.join('\n')
}

function formatSkills(state: GameState): string {
  const lines = [t('skills.head'), '------']
  for (const id of state.player.skills) {
    const s = SKILLS[id]
    lines.push(
      t('skills.line', {
        name: skillLabel(id),
        mp: s.mpCost,
        desc: skillDesc(id),
      }),
    )
  }
  const locked = Object.values(SKILLS).filter(
    (s) => !s.hidden && !state.player.skills.includes(s.id),
  )
  if (locked.length) {
    lines.push(t('skills.locked'))
    for (const s of locked) {
      lines.push(t('skills.lockedLine', { name: skillLabel(s.id), level: s.unlockLevel }))
    }
  }
  return lines.join('\n')
}

function formatLook(state: GameState): string {
  const loc = state.player.location
  if (loc === 'town') return t('look.town')
  if (loc === 'shop') return t('look.shop')
  const zone = ZONES[loc]
  if (zone) {
    const lines = [t('look.zone', { zone: zoneLabel(loc), desc: zoneDesc(loc) })]
    if (getBossForZone(loc)) {
      lines.push(t('look.bossHint'))
    }
    return lines.join('\n')
  }
  return t('look.pwd', { loc })
}

function formatZones(level: number, defeated: string[] = []): string {
  const lines = [t('zones.head'), '-----']
  for (const z of Object.values(ZONES)) {
    const levelOk = level >= z.minLevel
    const needBoss = requiredBossForZone(z)
    const bossOk = !needBoss || hasDefeatedBoss(defeated, needBoss)
    const ok = levelOk && bossOk ? t('zones.ok') : t('zones.locked')
    let line = t('zones.line', {
      ok,
      name: zoneLabel(z.id),
      level: z.minLevel,
      desc: zoneDesc(z.id),
    })
    if (needBoss && !bossOk) {
      line += t('zones.needBoss', { boss: monsterLabel(needBoss) })
    }
    const bossId = getBossForZone(z.id)
    if (bossId) {
      const cleared = hasDefeatedBoss(defeated, bossId)
      line += cleared ? t('zones.bossDone') : t('zones.bossAvail')
    }
    lines.push(line)
  }
  return lines.join('\n')
}

function formatShop(): string {
  const lines = [t('shop.head1'), t('shop.head2'), t('shop.head3'), '------------']
  SHOP_CATALOG.forEach((id, i) => {
    const item = ITEMS[id]
    const no = String(i + 1).padStart(2, ' ')
    lines.push(
      t('shop.line', {
        no,
        kind: itemKindLabel(item),
        item: itemLabel(item),
        price: item.buyPrice,
        stats: formatItemStats(item),
      }),
    )
  })
  lines.push('------------')
  lines.push(t('shop.foot', { n: SHOP_CATALOG.length }))
  return lines.join('\n')
}

export function getHud(state: GameState): {
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  exp: number
  expMax: number
  gold: number
  location: string
  mode: string
} {
  const p = state.player
  return {
    level: p.level,
    hp: p.hp,
    maxHp: getEffectiveMaxHp(p),
    mp: p.mp,
    maxMp: getEffectiveMaxMp(p),
    exp: p.exp,
    expMax: expToNext(p.level),
    gold: p.gold,
    location: locLabel(state),
    mode: state.mode === 'combat' ? 'COMBAT' : 'IDLE',
  }
}

export { inventoryQty }
