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
import { pushMessage, saveGame, loadGame, hasSave, clearMessages, createInitialState } from './save'
import type { GameState, ItemDef } from './types'
import { SLOT_LABELS, SLOT_ORDER } from './types'

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

const HELP_TEXT = `
available commands
────────────────────────
[travel]
  go <zone>       enter a hunting zone (e.g. go forest1)
  hunt / explore  search current zone
  town / cd ~     return to town
  shop            enter shop

[status]
  status / st     stats + equipment
  inv / inventory inventory
  skills          known skills
  look / ls       current location
  zones           list hunting zones

[items]
  equip <name>    equip gear
  unequip <slot>  unequip slot
  use <name>      use consumable
  buy <name|#>    buy from shop (name or catalog #)
  sell <name> [n] sell item (default qty 1)
  shop list       shop catalog

[combat] (in battle only)
  attack / a      basic attack
  skill <name>    cast skill
  defend / d      guard
  use <potion>    use consumable
  flee            run away

[system]
  help            this help
  save            save game
  load            load save
  clear / cls     clear screen
  history         command history
  reset           new game (keeps save file)
`.trim()

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
      pushMessage(state, 'system', HELP_TEXT)
      break

    case 'clear':
    case 'cls':
      clearMessages(state)
      pushMessage(state, 'system', 'cleared.')
      break

    case 'history':
      if (!state.history.length) pushMessage(state, 'output', '(no history)')
      else {
        state.history.slice(-30).forEach((h, i) => {
          pushMessage(state, 'output', ` ${String(i + 1).padStart(3)}. ${h}`)
        })
      }
      break

    case 'save':
      pushMessage(state, 'success', saveGame(state))
      break

    case 'load': {
      if (!hasSave()) {
        pushMessage(state, 'error', 'error: no save found')
        break
      }
      const loaded = loadGame()
      if (!loaded) {
        pushMessage(state, 'error', 'error: corrupt save')
        break
      }
      Object.assign(state, loaded)
      pushMessage(state, 'success', 'save loaded.')
      pushMessage(state, 'system', `welcome, ${state.player.name}. pwd: ${locLabel(state)}`)
      break
    }

    case 'reset': {
      const name = state.player.name
      const fresh = createInitialState()
      fresh.player.name = name
      Object.assign(state, fresh)
      pushMessage(state, 'system', 'new game started. (save file kept — overwrite with save)')
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
        if (!sid) pushMessage(state, 'error', 'error: unknown skill')
        else {
          const s = SKILLS[sid]
          pushMessage(
            state,
            'output',
            `${s.name} | MP ${s.mpCost} | Lv.${s.unlockLevel}+ | ${s.description}`,
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
      pushMessage(state, 'success', 'moved to town. try: shop | go forest1')
      break

    case 'cd':
      if (arg === '~' || arg === '/' || arg === 'town' || arg === '마을') {
        state.player.location = 'town'
        pushMessage(state, 'success', 'moved to town.')
      } else if (arg) {
        return handleGo(state, arg)
      } else {
        pushMessage(state, 'error', 'usage: cd ~ | cd <zone>')
      }
      break

    case 'go':
    case 'goto':
    case 'move':
      if (!arg) {
        pushMessage(state, 'error', 'usage: go <zone>  (e.g. go forest1)')
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
          pushMessage(state, 'error', 'error: shop only available in town (town)')
          break
        }
        state.player.location = 'shop'
        pushMessage(state, 'success', 'entered shop.')
        pushMessage(state, 'output', formatShop())
      } else {
        pushMessage(state, 'error', 'usage: shop | shop list')
      }
      break

    case 'buy':
      return handleBuy(state, arg)

    case 'sell':
      return handleSell(state, rest)

    case 'equip':
      if (!arg) {
        pushMessage(state, 'error', 'usage: equip <item>')
        break
      }
      {
        const found = findInventoryItem(state.player, arg)
        if (!found) {
          pushMessage(state, 'error', 'error: item not in inventory')
          break
        }
        const msg = equipItem(state.player, found.itemId)
        pushMessage(state, isErrorMsg(msg) ? 'error' : 'success', msg)
      }
      break

    case 'unequip':
      if (!arg) {
        pushMessage(state, 'error', 'usage: unequip <slot>')
        break
      }
      {
        const msg = unequipItem(state.player, arg)
        pushMessage(state, isErrorMsg(msg) ? 'error' : 'success', msg)
      }
      break

    case 'use':
      if (!arg) {
        pushMessage(state, 'error', 'usage: use <consumable>')
        break
      }
      {
        const id = findConsumableId(state.player, arg)
        if (!id) {
          pushMessage(state, 'error', 'error: consumable not found')
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
      pushMessage(state, 'error', 'error: not in combat. use hunt in a zone')
      break

    default:
      if (findZone(cmd) || findZone(line)) {
        return handleGo(state, line)
      }
      pushMessage(state, 'error', `error: command not found: ${cmd}  (try help)`)
  }

  return { state, refreshUi: true }
}

function handleCombatCommand(state: GameState, c: string, arg: string): CommandResult {
  if (!state.combat) {
    state.mode = 'idle'
    return { state, refreshUi: true }
  }

  if (c === 'help' || c === '?') {
    pushMessage(
      state,
      'system',
      'combat: attack(a) | skill <name> | defend(d) | use <potion> | flee | status | inv',
    )
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
    pushMessage(state, 'system', '(combat state is not saved)')
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
      pushMessage(state, 'error', 'usage: skill <name>  (see skills)')
      return { state, refreshUi: true }
    }
    const sid = resolveSkillQuery(arg, state.player)
    if (!sid) {
      pushMessage(state, 'error', 'error: unknown skill')
      return { state, refreshUi: true }
    }
    result = playerSkill(state.player, state.combat, sid)
  } else if (c === 'use') {
    if (!arg) {
      pushMessage(state, 'error', 'usage: use <consumable>')
      return { state, refreshUi: true }
    }
    const id = findConsumableId(state.player, arg)
    if (!id) {
      pushMessage(state, 'error', 'error: consumable not found')
      return { state, refreshUi: true }
    }
    result = playerUseItem(state.player, state.combat, id)
  } else {
    pushMessage(state, 'error', 'error: in combat use attack|skill|defend|use|flee')
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
      pushMessage(state, 'success', 'victory. continue with hunt')
    } else if (result.fled) {
      pushMessage(state, 'system', 'left combat.')
    }
  }

  return { state, refreshUi: true }
}

function handleGo(state: GameState, query: string): CommandResult {
  const zone = findZone(query)
  if (!zone) {
    pushMessage(state, 'error', 'error: unknown zone. see zones')
    return { state, refreshUi: true }
  }
  if (state.player.level < zone.minLevel) {
    pushMessage(
      state,
      'error',
      `error: ${zone.name} requires Lv.${zone.minLevel}+ (you are Lv.${state.player.level})`,
    )
    return { state, refreshUi: true }
  }
  state.player.location = zone.id
  pushMessage(state, 'success', `arrived: ${zone.name} — ${zone.description}`)
  pushMessage(state, 'system', 'hint: type hunt (or explore) to search')
  return { state, refreshUi: true }
}

function handleHunt(state: GameState): CommandResult {
  const zone = ZONES[state.player.location]
  if (!zone) {
    pushMessage(state, 'error', 'error: hunt only works in a zone (go forest1)')
    return { state, refreshUi: true }
  }

  const roll = Math.random()
  if (roll < 0.8) {
    const mid = pick(zone.monsters)
    state.combat = startCombat(mid)
    state.mode = 'combat'
    for (const line of state.combat.log) pushMessage(state, 'combat', line)
    pushMessage(state, 'system', 'cmds: attack | skill <name> | defend | use <potion> | flee')
  } else if (roll < 0.9) {
    const itemId = pick(zone.forageItems)
    addItem(state.player, itemId, 1)
    const item = getItem(itemId)
    pushMessage(state, 'loot', `found item: ${item?.name}`)
  } else {
    const gold = randInt(zone.goldMin, zone.goldMax)
    state.player.gold += gold
    pushMessage(state, 'loot', `found gold pouch: +${gold}G (wallet ${state.player.gold}G)`)
  }
  return { state, refreshUi: true }
}

function handleBuy(state: GameState, arg: string): CommandResult {
  if (state.player.location !== 'shop' && state.player.location !== 'town') {
    pushMessage(state, 'error', 'error: buy only in shop/town (shop)')
    return { state, refreshUi: true }
  }
  if (!arg) {
    pushMessage(state, 'error', 'usage: buy <item|#>  (see shop list)')
    return { state, refreshUi: true }
  }

  const item = resolveShopItem(arg)
  if (!item || item.buyPrice == null) {
    pushMessage(state, 'error', 'error: not sold here (shop list)')
    return { state, refreshUi: true }
  }
  if (state.player.gold < item.buyPrice) {
    pushMessage(
      state,
      'error',
      `error: insufficient gold (price ${item.buyPrice}G, have ${state.player.gold}G)`,
    )
    return { state, refreshUi: true }
  }
  state.player.gold -= item.buyPrice
  addItem(state.player, item.id, 1)
  state.player.location = 'shop'
  pushMessage(
    state,
    'success',
    `bought ${item.name} -${item.buyPrice}G (balance ${state.player.gold}G)`,
  )
  return { state, refreshUi: true }
}

function handleSell(state: GameState, rest: string[]): CommandResult {
  if (state.player.location !== 'shop' && state.player.location !== 'town') {
    pushMessage(state, 'error', 'error: sell only in shop/town (shop)')
    return { state, refreshUi: true }
  }
  if (!rest.length) {
    pushMessage(state, 'error', 'usage: sell <item> [qty]')
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
    pushMessage(state, 'error', 'error: item not in inventory')
    return { state, refreshUi: true }
  }
  if (found.qty < qty) {
    pushMessage(state, 'error', `error: not enough qty (have ${found.qty})`)
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
    `sold ${item.name} x${qty} +${total}G (unit ${unit}G, balance ${state.player.gold}G)`,
  )
  return { state, refreshUi: true }
}

function resolveShopItem(query: string) {
  const raw = query.trim()
  // catalog number: buy 1, buy #3
  const numMatch = raw.match(/^#?(\d+)$/)
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1
    if (idx >= 0 && idx < SHOP_CATALOG.length) {
      return ITEMS[SHOP_CATALOG[idx]]
    }
    return undefined
  }
  const q = raw.toLowerCase()
  for (const id of SHOP_CATALOG) {
    const item = ITEMS[id]
    if (item.id === q || item.name.toLowerCase() === q || item.name === raw) return item
  }
  return undefined
}

function tokenize(line: string): string[] {
  return line.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((s) => s.replace(/^"|"$/g, '')) ?? []
}

export function welcome(state: GameState): void {
  pushMessage(state, 'system', '======================================')
  pushMessage(state, 'system', '  DevQuest IDE — Terminal RPG v0.1')
  pushMessage(state, 'system', '  early game zones: forest1..forest3')
  pushMessage(state, 'system', '======================================')
  pushMessage(state, 'output', 'you are in town. type help for commands.')
  pushMessage(state, 'output', 'hint: status -> go forest1 -> hunt')
  if (hasSave()) {
    pushMessage(state, 'system', 'save detected. type load to restore.')
  }
}

function locLabel(state: GameState): string {
  const loc = state.player.location
  if (loc === 'town') return 'town'
  if (loc === 'shop') return 'shop'
  return ZONES[loc]?.name ?? loc
}

function formatStatus(state: GameState): string {
  const p = state.player
  clampVitals(p)
  const maxHp = getEffectiveMaxHp(p)
  const maxMp = getEffectiveMaxMp(p)
  const need = expToNext(p.level)
  const lines = [
    `name: ${p.name}  |  pwd: ${locLabel(state)}`,
    `level: ${p.level}  |  EXP ${p.exp}/${need}  |  gold ${p.gold}G`,
    `HP ${p.hp}/${maxHp}  |  MP ${p.mp}/${maxMp}`,
    `ATK ${getTotalAtk(p)} (base ${p.baseAtk})  |  DEF ${getTotalDef(p)} (base ${p.baseDef})`,
    '-- equipment --',
  ]
  for (const slot of SLOT_ORDER) {
    const id = p.equipment[slot]
    const item = id ? getItem(id) : undefined
    lines.push(
      `  ${SLOT_LABELS[slot].padEnd(8)}: ${item ? `${item.name} (${formatItemStats(item)})` : '(none)'}`,
    )
  }
  return lines.join('\n')
}

function itemKindLabel(item: ItemDef): string {
  if (item.kind === 'consumable') return 'cons'
  if (item.slot) return SLOT_LABELS[item.slot]
  return 'gear'
}

function formatInventory(state: GameState): string {
  const p = state.player
  if (!p.inventory.length) return 'inventory empty.'
  const lines = [`inventory (${p.inventory.length} kinds) | gold ${p.gold}G`, '------------']
  for (const e of p.inventory) {
    const item = getItem(e.itemId)
    if (!item) continue
    lines.push(
      `  [${itemKindLabel(item)}] ${item.name} x${e.qty}  — ${formatItemStats(item)}  (sell ${item.sellPrice}G)`,
    )
  }
  return lines.join('\n')
}

function formatSkills(state: GameState): string {
  const lines = ['skills', '------']
  for (const id of state.player.skills) {
    const s = SKILLS[id]
    lines.push(`  ${s.name} (MP ${s.mpCost}) — ${s.description}`)
  }
  const locked = Object.values(SKILLS).filter((s) => !state.player.skills.includes(s.id))
  if (locked.length) {
    lines.push('-- locked --')
    for (const s of locked) {
      lines.push(`  ${s.name} (Lv.${s.unlockLevel}+)`)
    }
  }
  return lines.join('\n')
}

function formatLook(state: GameState): string {
  const loc = state.player.location
  if (loc === 'town') {
    return 'town — safe hub.\n  shop to trade, go forest1 to hunt.'
  }
  if (loc === 'shop') {
    return 'shop — buy <name|#> / sell / shop list.\n  town to leave.'
  }
  const zone = ZONES[loc]
  if (zone) {
    return `${zone.name} — ${zone.description}\n  hunt to search | town to return`
  }
  return `pwd: ${loc}`
}

function formatZones(level: number): string {
  const lines = ['zones', '-----']
  for (const z of Object.values(ZONES)) {
    const ok = level >= z.minLevel ? 'ok' : 'locked'
    lines.push(`  [${ok}] ${z.name}  (Lv.${z.minLevel}+) — ${z.description}`)
  }
  return lines.join('\n')
}

function formatShop(): string {
  const lines = [
    'shop catalog (sellback ~= 1/3 of list price)',
    'note: shop gear has worse value than drops',
    'buy by number: buy 1   |   buy by name: buy hp-potion-s',
    '------------',
  ]
  SHOP_CATALOG.forEach((id, i) => {
    const item = ITEMS[id]
    const no = String(i + 1).padStart(2, ' ')
    lines.push(
      `  ${no}. [${itemKindLabel(item)}] ${item.name}  ${item.buyPrice}G  — ${formatItemStats(item)}`,
    )
  })
  lines.push('------------')
  lines.push(`buy <1-${SHOP_CATALOG.length}|name>  |  sell <name> [qty]`)
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
