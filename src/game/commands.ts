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
사용 가능한 명령어
────────────────────────
[이동]
  go <사냥터>     사냥터로 이동 (예: go 숲1)
  hunt / explore  현재 사냥터에서 탐색
  town / cd ~     마을로 이동
  shop            상점 입장

[상태]
  status / st     능력치·장비 확인
  inv / inventory 인벤토리
  skills          보유 스킬 목록
  look / ls       현재 위치 정보
  zones           사냥터 목록

[아이템]
  equip <이름>    장비 장착
  unequip <부위>  장비 해제
  use <이름>      소모품 사용
  buy <이름>      상점 구매
  sell <이름> [n] 아이템 판매 (기본 1개)
  shop list       상점 목록

[전투] (전투 중에만)
  attack / a      기본 공격
  skill <이름>    스킬 사용
  defend / d      방어
  use <포션>      소모품 사용
  flee            도망

[시스템]
  help            이 도움말
  save            저장
  load            불러오기
  clear / cls     화면 지우기
  history         명령 기록
  reset           새 게임 (저장 삭제 아님)
`.trim()

export function handleCommand(state: GameState, raw: string): CommandResult {
  const line = raw.trim()
  if (!line) return { state, refreshUi: false }

  state.history.push(line)
  if (state.history.length > 100) state.history.shift()
  pushMessage(state, 'input', `❯ ${line}`)

  const [cmd, ...rest] = tokenize(line)
  const arg = rest.join(' ').trim()
  const c = cmd.toLowerCase()

  if (state.mode === 'combat') {
    return handleCombatCommand(state, c, arg, rest)
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
      pushMessage(state, 'system', '화면을 지웠습니다.')
      break

    case 'history':
      if (!state.history.length) pushMessage(state, 'output', '(명령 기록 없음)')
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
        pushMessage(state, 'error', '저장된 데이터가 없습니다.')
        break
      }
      const loaded = loadGame()
      if (!loaded) {
        pushMessage(state, 'error', '저장 데이터를 읽을 수 없습니다.')
        break
      }
      Object.assign(state, loaded)
      pushMessage(state, 'success', '저장 데이터를 불러왔습니다.')
      pushMessage(state, 'system', `환영합니다, ${state.player.name}. 위치: ${locLabel(state)}`)
      break
    }

    case 'reset': {
      const name = state.player.name
      const fresh = createInitialState()
      fresh.player.name = name
      Object.assign(state, fresh)
      pushMessage(state, 'system', '새 게임을 시작합니다. (저장 파일은 유지됨 — 덮어쓰려면 save)')
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
        // skill outside combat — show info
        const sid = resolveSkillQuery(arg, state.player)
        if (!sid) pushMessage(state, 'error', '알 수 없는 스킬입니다.')
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
      pushMessage(state, 'success', '마을로 이동했습니다. 상점(shop), 사냥터(go 숲1)를 이용하세요.')
      break

    case 'cd':
      if (arg === '~' || arg === '/' || arg === 'town' || arg === '마을') {
        state.player.location = 'town'
        pushMessage(state, 'success', '마을로 이동했습니다.')
      } else if (arg) {
        return handleGo(state, arg)
      } else {
        pushMessage(state, 'error', '사용법: cd ~ | cd <사냥터>')
      }
      break

    case 'go':
    case 'goto':
    case 'move':
      if (!arg) {
        pushMessage(state, 'error', '사용법: go <사냥터>  (예: go 숲1)')
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
          pushMessage(state, 'error', '상점/마을에서만 이용할 수 있습니다. (town)')
          break
        }
        state.player.location = 'shop'
        pushMessage(state, 'success', '상점에 입장했습니다.')
        pushMessage(state, 'output', formatShop())
      } else {
        pushMessage(state, 'error', '사용법: shop | shop list')
      }
      break

    case 'buy':
      return handleBuy(state, arg)

    case 'sell':
      return handleSell(state, rest)

    case 'equip':
      if (!arg) {
        pushMessage(state, 'error', '사용법: equip <아이템이름>')
        break
      }
      {
        const found = findInventoryItem(state.player, arg)
        if (!found) {
          pushMessage(state, 'error', '인벤토리에서 아이템을 찾을 수 없습니다.')
          break
        }
        pushMessage(state, 'success', equipItem(state.player, found.itemId))
      }
      break

    case 'unequip':
      if (!arg) {
        pushMessage(state, 'error', '사용법: unequip <부위>')
        break
      }
      pushMessage(state, 'success', unequipItem(state.player, arg))
      break

    case 'use':
      if (!arg) {
        pushMessage(state, 'error', '사용법: use <소모품>')
        break
      }
      {
        const id = findConsumableId(state.player, arg)
        if (!id) {
          pushMessage(state, 'error', '소모품을 찾을 수 없습니다.')
          break
        }
        const msg = useConsumable(state.player, id)
        pushMessage(state, msg?.includes('없습니다') || msg?.includes('아닙니다') ? 'error' : 'success', msg ?? '')
      }
      break

    case 'attack':
    case 'a':
    case 'defend':
    case 'd':
    case 'flee':
      pushMessage(state, 'error', '전투 중이 아닙니다. 사냥터에서 hunt 로 탐색하세요.')
      break

    default:
      // 사냥터 이름을 직접 입력한 경우
      if (findZone(cmd) || findZone(line)) {
        return handleGo(state, line)
      }
      pushMessage(state, 'error', `알 수 없는 명령어: ${cmd}  (help 입력)`)
  }

  return { state, refreshUi: true }
}

function handleCombatCommand(
  state: GameState,
  c: string,
  arg: string,
  rest: string[],
): CommandResult {
  if (!state.combat) {
    state.mode = 'idle'
    return { state, refreshUi: true }
  }

  if (c === 'help' || c === '?') {
    pushMessage(
      state,
      'system',
      '전투 명령: attack(a) | skill <이름> | defend(d) | use <포션> | flee | status | inv',
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
    pushMessage(state, 'system', '(전투 상태는 저장되지 않습니다)')
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
      pushMessage(state, 'error', '사용법: skill <스킬이름>  (skills 로 목록 확인)')
      return { state, refreshUi: true }
    }
    const sid = resolveSkillQuery(arg, state.player)
    if (!sid) {
      pushMessage(state, 'error', '알 수 없는 스킬입니다.')
      return { state, refreshUi: true }
    }
    result = playerSkill(state.player, state.combat, sid)
  } else if (c === 'use') {
    if (!arg) {
      pushMessage(state, 'error', '사용법: use <소모품>')
      return { state, refreshUi: true }
    }
    const id = findConsumableId(state.player, arg)
    if (!id) {
      pushMessage(state, 'error', '소모품을 찾을 수 없습니다.')
      return { state, refreshUi: true }
    }
    result = playerUseItem(state.player, state.combat, id)
  } else {
    pushMessage(state, 'error', `전투 중에는 attack / skill / defend / use / flee 만 가능합니다.`)
    return { state, refreshUi: true }
  }

  for (const msg of result.messages) {
    pushMessage(state, 'combat', msg)
  }

  if (result.ended) {
    state.mode = 'idle'
    state.combat = null
    if (result.victory) {
      pushMessage(state, 'success', '전투 승리! 계속 탐색하려면 hunt')
    } else if (result.fled) {
      pushMessage(state, 'system', '전투에서 벗어났습니다.')
    }
  }

  void rest
  return { state, refreshUi: true }
}

function handleGo(state: GameState, query: string): CommandResult {
  const zone = findZone(query)
  if (!zone) {
    pushMessage(state, 'error', `알 수 없는 사냥터입니다. zones 로 목록을 확인하세요.`)
    return { state, refreshUi: true }
  }
  if (state.player.level < zone.minLevel) {
    pushMessage(
      state,
      'error',
      `${zone.name} 입장 조건: Lv.${zone.minLevel}+ (현재 Lv.${state.player.level})`,
    )
    return { state, refreshUi: true }
  }
  state.player.location = zone.id
  pushMessage(state, 'success', `${zone.name}에 도착했습니다. — ${zone.description}`)
  pushMessage(state, 'system', '탐색하려면 hunt (또는 explore) 를 입력하세요.')
  return { state, refreshUi: true }
}

function handleHunt(state: GameState): CommandResult {
  const zone = ZONES[state.player.location]
  if (!zone) {
    pushMessage(state, 'error', '사냥터에 있을 때만 탐색할 수 있습니다. (go 숲1)')
    return { state, refreshUi: true }
  }

  const roll = Math.random()
  // 80% 몬스터, 10% 아이템, 10% 골드
  if (roll < 0.8) {
    const mid = pick(zone.monsters)
    state.combat = startCombat(mid)
    state.mode = 'combat'
    for (const line of state.combat.log) pushMessage(state, 'combat', line)
    pushMessage(
      state,
      'system',
      '명령: attack | skill <이름> | defend | use <포션> | flee',
    )
  } else if (roll < 0.9) {
    const itemId = pick(zone.forageItems)
    addItem(state.player, itemId, 1)
    const item = getItem(itemId)
    pushMessage(state, 'loot', `바닥에 아이템이 있다! ${item?.name} 획득.`)
  } else {
    const gold = randInt(zone.goldMin, zone.goldMax)
    state.player.gold += gold
    pushMessage(state, 'loot', `떨어진 골드 주머니를 주웠다! +${gold}G (보유 ${state.player.gold}G)`)
  }
  return { state, refreshUi: true }
}

function handleBuy(state: GameState, arg: string): CommandResult {
  if (state.player.location !== 'shop' && state.player.location !== 'town') {
    pushMessage(state, 'error', '상점/마을에서만 구매할 수 있습니다. (shop)')
    return { state, refreshUi: true }
  }
  if (!arg) {
    pushMessage(state, 'error', '사용법: buy <아이템이름>')
    return { state, refreshUi: true }
  }

  const item = resolveShopItem(arg)
  if (!item || item.buyPrice == null) {
    pushMessage(state, 'error', '상점에서 판매하지 않는 아이템입니다. (shop list)')
    return { state, refreshUi: true }
  }
  if (state.player.gold < item.buyPrice) {
    pushMessage(state, 'error', `골드가 부족합니다. (가격 ${item.buyPrice}G, 보유 ${state.player.gold}G)`)
    return { state, refreshUi: true }
  }
  state.player.gold -= item.buyPrice
  addItem(state.player, item.id, 1)
  state.player.location = 'shop'
  pushMessage(
    state,
    'success',
    `${item.name} 구매 완료! -${item.buyPrice}G (잔액 ${state.player.gold}G)`,
  )
  return { state, refreshUi: true }
}

function handleSell(state: GameState, rest: string[]): CommandResult {
  if (state.player.location !== 'shop' && state.player.location !== 'town') {
    pushMessage(state, 'error', '상점/마을에서만 판매할 수 있습니다. (shop)')
    return { state, refreshUi: true }
  }
  if (!rest.length) {
    pushMessage(state, 'error', '사용법: sell <아이템이름> [수량]')
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
    pushMessage(state, 'error', '인벤토리에 해당 아이템이 없습니다.')
    return { state, refreshUi: true }
  }
  if (found.qty < qty) {
    pushMessage(state, 'error', `수량이 부족합니다. (보유 ${found.qty})`)
    return { state, refreshUi: true }
  }
  const item = getItem(found.itemId)!
  // 재판매가 = 정가의 1/3 (정가 없는 드롭 아이템은 sellPrice 사용 — 낮게 책정)
  const unit =
    item.buyPrice != null ? Math.floor(item.buyPrice / 3) : item.sellPrice
  const total = unit * qty
  removeItem(state.player, found.itemId, qty)
  state.player.gold += total
  state.player.location = 'shop'
  pushMessage(
    state,
    'success',
    `${item.name} x${qty} 판매! +${total}G (단가 ${unit}G, 잔액 ${state.player.gold}G)`,
  )
  return { state, refreshUi: true }
}

function resolveShopItem(query: string) {
  const q = query.trim().toLowerCase()
  for (const id of SHOP_CATALOG) {
    const item = ITEMS[id]
    if (item.id === q || item.name.toLowerCase() === q || item.name === query.trim()) return item
  }
  return undefined
}

function tokenize(line: string): string[] {
  return line.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((s) => s.replace(/^"|"$/g, '')) ?? []
}

export function welcome(state: GameState): void {
  pushMessage(state, 'system', '══════════════════════════════════════')
  pushMessage(state, 'system', '  DevQuest IDE — Terminal RPG v0.1')
  pushMessage(state, 'system', '  초저렙 구간 (숲1~숲3)')
  pushMessage(state, 'system', '══════════════════════════════════════')
  pushMessage(state, 'output', '마을에 도착했습니다. help 로 명령어를 확인하세요.')
  pushMessage(state, 'output', '추천: status → go 숲1 → hunt')
  if (hasSave()) {
    pushMessage(state, 'system', '저장된 데이터가 있습니다. load 로 불러올 수 있습니다.')
  }
}

function locLabel(state: GameState): string {
  const loc = state.player.location
  if (loc === 'town') return '마을'
  if (loc === 'shop') return '상점'
  return ZONES[loc]?.name ?? loc
}

function formatStatus(state: GameState): string {
  const p = state.player
  clampVitals(p)
  const maxHp = getEffectiveMaxHp(p)
  const maxMp = getEffectiveMaxMp(p)
  const need = expToNext(p.level)
  const lines = [
    `이름: ${p.name}  |  위치: ${locLabel(state)}`,
    `레벨: ${p.level}  |  EXP ${p.exp}/${need}  |  골드 ${p.gold}G`,
    `HP ${p.hp}/${maxHp}  |  MP ${p.mp}/${maxMp}`,
    `ATK ${getTotalAtk(p)} (기본 ${p.baseAtk})  |  DEF ${getTotalDef(p)} (기본 ${p.baseDef})`,
    '── 장착 장비 ──',
  ]
  for (const slot of SLOT_ORDER) {
    const id = p.equipment[slot]
    const item = id ? getItem(id) : undefined
    lines.push(
      `  ${SLOT_LABELS[slot].padEnd(4)}: ${item ? `${item.name} (${formatItemStats(item)})` : '(없음)'}`,
    )
  }
  return lines.join('\n')
}

function itemKindLabel(item: ItemDef): string {
  if (item.kind === 'consumable') return '소모'
  if (item.slot) return SLOT_LABELS[item.slot]
  return '장비'
}

function formatInventory(state: GameState): string {
  const p = state.player
  if (!p.inventory.length) return '인벤토리가 비어 있습니다.'
  const lines = [`인벤토리 (${p.inventory.length}종) | 골드 ${p.gold}G`, '────────────']
  for (const e of p.inventory) {
    const item = getItem(e.itemId)
    if (!item) continue
    lines.push(
      `  [${itemKindLabel(item)}] ${item.name} x${e.qty}  — ${formatItemStats(item)}  (매입가 ${item.sellPrice}G)`,
    )
  }
  return lines.join('\n')
}

function formatSkills(state: GameState): string {
  const lines = ['보유 스킬', '────────']
  for (const id of state.player.skills) {
    const s = SKILLS[id]
    lines.push(`  ${s.name} (MP ${s.mpCost}) — ${s.description}`)
  }
  const locked = Object.values(SKILLS).filter((s) => !state.player.skills.includes(s.id))
  if (locked.length) {
    lines.push('── 미해금 ──')
    for (const s of locked) {
      lines.push(`  ${s.name} (Lv.${s.unlockLevel}+)`)
    }
  }
  return lines.join('\n')
}

function formatLook(state: GameState): string {
  const loc = state.player.location
  if (loc === 'town') {
    return '마을 — 안전한 거점입니다.\n  shop 으로 상점 이용, go 숲1 등으로 사냥터 이동.'
  }
  if (loc === 'shop') {
    return '상점 — buy / sell / shop list 를 사용할 수 있습니다.\n  town 으로 마을 복귀.'
  }
  const zone = ZONES[loc]
  if (zone) {
    return `${zone.name} — ${zone.description}\n  hunt 로 탐색 | town 으로 귀환`
  }
  return `위치: ${loc}`
}

function formatZones(level: number): string {
  const lines = ['사냥터 목록', '────────']
  for (const z of Object.values(ZONES)) {
    const ok = level >= z.minLevel ? '✓' : '✗'
    lines.push(`  [${ok}] ${z.name}  (Lv.${z.minLevel}+) — ${z.description}`)
  }
  return lines.join('\n')
}

function formatShop(): string {
  const lines = [
    '상점 목록 (판매가 = 정가의 약 1/3)',
    '※ 상점 장비는 드롭 장비보다 가성비가 낮습니다.',
    '────────────',
  ]
  for (const id of SHOP_CATALOG) {
    const item = ITEMS[id]
    lines.push(
      `  [${itemKindLabel(item)}] ${item.name}  ${item.buyPrice}G  — ${formatItemStats(item)}`,
    )
  }
  lines.push('────────────')
  lines.push('구매: buy <이름>  |  판매: sell <이름> [수량]')
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
