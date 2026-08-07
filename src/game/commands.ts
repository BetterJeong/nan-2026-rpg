import { findZone, SHOP_CATALOG, SKILLS, ZONES, expToNext } from './data/content'
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
} from './i18n'
import type { GameState, ItemDef } from './types'
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
      pushMessage(state, 'output', formatLook(state))
      break

    case 'zones':
    case 'maps':
      pushMessage(state, 'output', formatZones(state.player.level))
      break

    case 'town':
    case 'home':
      state.player.location = 'town'
      pushMessage(state, 'success', t('ok.town'))
      break

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
  state.player.location = zone.id
  pushMessage(
    state,
    'success',
    t('ok.arrived', { zone: zoneLabel(zone.id), desc: zoneDesc(zone.id) }),
  )
  pushMessage(state, 'system', t('ok.huntHint'))
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
  pushMessage(state, 'output', t('welcome.hint'))
  if (!getSettings().languageChosen) {
    pushMessage(state, 'success', t('welcome.lang'))
  }
  if (hasSave()) {
    pushMessage(state, 'system', t('welcome.save'))
  }
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
  const locked = Object.values(SKILLS).filter((s) => !state.player.skills.includes(s.id))
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
    return t('look.zone', { zone: zoneLabel(loc), desc: zoneDesc(loc) })
  }
  return t('look.pwd', { loc })
}

function formatZones(level: number): string {
  const lines = [t('zones.head'), '-----']
  for (const z of Object.values(ZONES)) {
    const ok = level >= z.minLevel ? t('zones.ok') : t('zones.locked')
    lines.push(
      t('zones.line', {
        ok,
        name: zoneLabel(z.id),
        level: z.minLevel,
        desc: zoneDesc(z.id),
      }),
    )
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
