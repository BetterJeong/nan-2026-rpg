import { SKILLS, ZONES } from './data/content'
import { formatItemStats, getItem, ITEMS } from './data/items'
import {
  getLang,
  itemLabel,
  itemMatchesQuery,
  skillEffectDesc,
  skillLabel,
  skillMatchesQuery,
  slotLabel,
  t,
  zoneDesc,
  zoneLabel,
} from './i18n'
import type { GameState } from './types'

export type HelpTopicId =
  | 'travel'
  | 'combat'
  | 'skills'
  | 'items'
  | 'town'
  | 'status'
  | 'system'

const TOPIC_ALIASES: Record<HelpTopicId, string[]> = {
  travel: [
    'travel',
    'go',
    'hunt',
    'explore',
    'zones',
    'zone',
    'boss',
    'auto',
    'autohunt',
    '이동',
    '사냥',
    '사냥터',
    '존',
    '자동전투',
  ],
  combat: ['combat', 'battle', 'fight', 'attack', 'defend', 'flee', '전투', '싸움'],
  skills: ['skills', 'skill', '스킬'],
  items: [
    'items',
    'item',
    'inv',
    'inventory',
    'equip',
    'unequip',
    'use',
    'buy',
    'sell',
    'shop',
    '아이템',
    '인벤',
    '인벤토리',
    '장비',
    '상점',
  ],
  town: [
    'town',
    'npc',
    'npcs',
    'talk',
    'lookaround',
    'rest',
    '마을',
    '대화',
    '둘러보기',
    '휴식',
  ],
  status: ['status', 'stats', 'stat', 'look', 'name', 'rename', '상태', '능력치', '닉네임'],
  system: [
    'system',
    'settings',
    'save',
    'load',
    'lang',
    'theme',
    'fast',
    'autosave',
    '시스템',
    '설정',
    '저장',
  ],
}

function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

function resolveTopic(query: string): HelpTopicId | null {
  const q = normalizeQuery(query)
  if (!q) return null
  for (const [topic, aliases] of Object.entries(TOPIC_ALIASES) as Array<[HelpTopicId, string[]]>) {
    if (aliases.some((a) => a.toLowerCase() === q)) return topic
  }
  return null
}

function findSkillId(query: string): string | null {
  for (const id of Object.keys(SKILLS)) {
    if (SKILLS[id].hidden) continue
    if (skillMatchesQuery(id, query)) return id
  }
  return null
}

function findItemId(query: string): string | null {
  for (const item of Object.values(ITEMS)) {
    if (itemMatchesQuery(item, query)) return item.id
  }
  return null
}

function findZoneId(query: string): string | null {
  const q = normalizeQuery(query)
  for (const z of Object.values(ZONES)) {
    if (z.id === q || z.name.toLowerCase() === q) return z.id
    if (z.aliases?.some((a) => a.toLowerCase() === q || a === query.trim())) return z.id
    if (zoneLabel(z.id).toLowerCase() === q) return z.id
  }
  return null
}

function stripPrefix(query: string, prefixes: string[]): string | null {
  const q = normalizeQuery(query)
  for (const p of prefixes) {
    const pl = p.toLowerCase()
    if (q === pl) return ''
    if (q.startsWith(`${pl} `)) return query.trim().slice(p.length).trim()
  }
  return null
}

function formatIndex(): string {
  const topics = (['travel', 'combat', 'skills', 'items', 'town', 'status', 'system'] as HelpTopicId[])
    .map((id) => t(`help.topicLine.${id}`))
    .join('\n')
  return [t('help.indexHead'), topics, '', t('help.indexFoot')].join('\n')
}

function formatTopic(topic: HelpTopicId): string {
  return t(`help.topic.${topic}`)
}

function formatSkillHelp(skillId: string, state: GameState): string {
  const known = state.player.skills.includes(skillId)
  const unlock = SKILLS[skillId]?.unlockLevel ?? 1
  return t('help.skillDetail', {
    name: skillLabel(skillId),
    effect: skillEffectDesc(skillId),
    unlock,
    owned: known ? t('help.skillOwned') : t('help.skillLocked', { level: unlock }),
  })
}

function formatItemHelp(itemId: string, state: GameState): string {
  const item = getItem(itemId)
  if (!item) return t('help.unknown', { q: itemId })
  const owned = state.player.inventory.find((e) => e.itemId === itemId)
  const equipped =
    item.slot && state.player.equipment[item.slot] === itemId ? t('help.itemEquipped') : ''
  const kind =
    item.kind === 'consumable'
      ? t('kind.cons')
      : item.slot
        ? slotLabel(item.slot)
        : t('kind.gear')
  const priceBits: string[] = []
  if (item.buyPrice != null) priceBits.push(t('help.itemBuy', { price: item.buyPrice }))
  if (item.sellPrice != null) priceBits.push(t('help.itemSell', { price: item.sellPrice }))
  return t('help.itemDetail', {
    name: itemLabel(item),
    kind,
    stats: formatItemStats(item),
    desc: item.description,
    prices: priceBits.length ? priceBits.join(' · ') : t('help.itemNoPrice'),
    owned: owned ? t('help.itemOwned', { qty: owned.qty }) : t('help.itemNotOwned'),
    equipped,
  }).trim()
}

function formatZoneHelp(zoneId: string): string {
  const z = ZONES[zoneId]
  if (!z) return t('help.unknown', { q: zoneId })
  return t('help.zoneDetail', {
    name: zoneLabel(zoneId),
    level: z.minLevel,
    desc: zoneDesc(zoneId),
  })
}

/** Resolve `help` / `help <topic|skill|item|zone>` into console text. */
export function formatHelp(state: GameState, rawArg = ''): string {
  const arg = rawArg.trim()
  if (!arg) return formatIndex()

  // explicit prefixes: help skill slash / help item wood-sword / help zone mistwood
  const skillRest = stripPrefix(arg, ['skill', 'skills', '스킬'])
  if (skillRest !== null) {
    if (!skillRest) return formatTopic('skills')
    const sid = findSkillId(skillRest)
    if (sid) return formatSkillHelp(sid, state)
    return t('help.unknown', { q: skillRest })
  }

  const itemRest = stripPrefix(arg, ['item', 'items', '아이템'])
  if (itemRest !== null) {
    if (!itemRest) return formatTopic('items')
    const iid = findItemId(itemRest)
    if (iid) return formatItemHelp(iid, state)
    return t('help.unknown', { q: itemRest })
  }

  const zoneRest = stripPrefix(arg, ['zone', 'zones', '존', '사냥터'])
  if (zoneRest !== null) {
    if (!zoneRest) return formatTopic('travel')
    const zid = findZoneId(zoneRest)
    if (zid) return formatZoneHelp(zid)
    return t('help.unknown', { q: zoneRest })
  }

  const topic = resolveTopic(arg)
  if (topic) return formatTopic(topic)

  const skillId = findSkillId(arg)
  if (skillId) return formatSkillHelp(skillId, state)

  const itemId = findItemId(arg)
  if (itemId) return formatItemHelp(itemId, state)

  const zoneId = findZoneId(arg)
  if (zoneId) return formatZoneHelp(zoneId)

  return t('help.unknown', { q: arg })
}

/** Suggest chips after viewing help. */
export function helpSuggestChips(rawArg = ''): Array<{ cmd: string; label: string }> {
  const arg = rawArg.trim()
  if (!arg) {
    const topics =
      getLang() === 'ko'
        ? [
            { cmd: 'help 이동', label: 'help 이동' },
            { cmd: 'help 전투', label: 'help 전투' },
            { cmd: 'help 스킬', label: 'help 스킬' },
            { cmd: 'help 아이템', label: 'help 아이템' },
            { cmd: 'help 마을', label: 'help 마을' },
            { cmd: 'help 시스템', label: 'help 시스템' },
          ]
        : [
            { cmd: 'help travel', label: 'help travel' },
            { cmd: 'help combat', label: 'help combat' },
            { cmd: 'help skills', label: 'help skills' },
            { cmd: 'help items', label: 'help items' },
            { cmd: 'help town', label: 'help town' },
            { cmd: 'help system', label: 'help system' },
          ]
    return topics
  }
  return [{ cmd: 'help', label: 'help' }]
}
