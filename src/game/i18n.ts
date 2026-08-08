import type { ItemDef, EquipSlot } from './types'
import { SLOT_LABELS } from './types'
import { getItem } from './data/items'
import { MONSTERS, SKILLS, ZONES } from './data/content'

export type Lang = 'en' | 'ko'

type Vars = Record<string, string | number | boolean | undefined | null>

const ITEM_KO: Record<string, string> = {
  hp_potion_s: '체력포션(소)',
  hp_potion_m: '체력포션(중)',
  mp_potion_s: '마나포션(소)',
  mp_potion_m: '마나포션(중)',
  wood_sword: '나무검',
  rusty_dagger: '녹슨단검',
  iron_blade: '철검',
  cloth_cap: '천모자',
  leather_hood: '가죽후드',
  cloth_shirt: '천상의',
  leather_vest: '가죽조끼',
  cloth_pants: '천하의',
  leather_pants: '가죽하의',
  straw_boots: '짚신',
  leather_boots: '가죽신발',
  cloth_gloves: '천장갑',
  leather_gloves: '가죽장갑',
  copper_ring: '구리반지',
  tin_ring: '주석반지',
  wood_necklace: '나무목걸이',
  amber_necklace: '호박목걸이',
  hunter_blade: '사냥꾼의검',
  forest_cloak: '숲의망토',
  hp_potion_l: '체력포션(대)',
  mp_potion_l: '마나포션(대)',
  coral_blade: '산호검',
  brine_vest: '염수조끼',
  tide_boots: '조수신발',
  tide_gloves: '조수장갑',
  tide_greaves: '조수각반',
  tide_cap: '조수모자',
  pearl_ring: '진주반지',
  siren_charm: '사이렌부적',
  abyss_trident: '심연삼지창',
  frost_axe: '서리도끼',
  peak_helm: '정상투구',
  granite_plate: '화강암갑옷',
  frost_boots: '서리신발',
  frost_gloves: '서리장갑',
  granite_greaves: '화강암각반',
  storm_ring: '폭풍반지',
  peak_charm: '정상부적',
  ruin_blade: '폐허의검',
  guardian_blade: '수호자의검',
  grove_mantle: '고목망토',
  leviathan_fang: '리바이어선송곳니',
  abyss_mail: '심연갑옷',
  tyrant_edge: '패왕의검',
  summit_aegis: '정상방패',
  shop_wood_sword: '상점나무검',
  shop_cloth_set_helm: '상점천모자',
  shop_cloth_armor: '상점천상의',
  shop_cloth_legs: '상점천하의',
  shop_boots: '상점신발',
  shop_gloves: '상점장갑',
  shop_ring: '상점구리반지',
  shop_necklace: '상점목걸이',
  shop_iron_sword: '상점철검',
}

const MONSTER_KO: Record<string, string> = {
  slime: '슬라임',
  forest_bug: '숲벌레',
  wolf_pup: '새끼늑대',
  wild_boar: '멧돼지',
  goblin: '고블린',
  forest_spider: '숲거미',
  elder_wolf: '늙은늑대',
  treant_sapling: '어린트리언트',
  shore_crab: '해안게',
  salt_slime: '소금슬라임',
  pirate_rat: '해적쥐',
  reef_shark: '산호상어',
  drowned_sailor: '익사한선원',
  kraken_spawn: '크라켄유생',
  cliff_goat: '절벽염소',
  ice_bat: '얼음박쥐',
  frost_wolf: '서리늑대',
  cliff_golem: '절벽골렘',
  storm_eagle: '폭풍독수리',
  peak_wraith: '정상망령',
  grove_guardian: '숲의수호자',
  tide_leviathan: '조수리바이어선',
  tyrant: '타이런트',
}

const ZONE_KO: Record<string, string> = {
  mistwood: '안개숲',
  thornpath: '가시길',
  eldergrove: '고목숲',
  saltshore: '소금해안',
  tidewreck: '난파만',
  abysscove: '심연만',
  foothill: '산기슭',
  frostpass: '서리고개',
  peakruin: '정상폐허',
  town: '마을',
  shop: '상점',
}

const SKILL_KO: Record<string, string> = {
  slash: '슬래시',
  focus: '포커스',
  mend: '멘드',
  bash: '배시',
  tide_cut: '타이드컷',
  avalanche: '애벌란치',
  root_crush: '루트크러시',
  grove_mend: '그로브멘드',
  tidal_crush: '타이달크러시',
  abyss_mend: '어비스멘드',
  tyrant_smash: '타이런트스매시',
  peak_mend: '피크멘드',
}

const SLOT_KO: Record<EquipSlot, string> = {
  helmet: '모자',
  armor: '상의',
  legs: '하의',
  boots: '신발',
  gloves: '장갑',
  weapon: '무기',
  ring: '반지',
  necklace: '목걸이',
}

type Dict = Record<string, string>

const EN: Dict = {
  'help.indexHead': `help
────────────────────────
topics:`,
  'help.indexFoot': `usage: help <topic>
  also: help <skill> | help <item> | help <zone>
  e.g. help combat · help slash · help hp-potion-s`,
  'help.topicLine.travel': '  travel   — go / hunt / zones / boss / auto',
  'help.topicLine.combat': '  combat   — attack / skill / defend / flee',
  'help.topicLine.skills': '  skills   — unlocks & casting',
  'help.topicLine.items': '  items    — equip / use / shop',
  'help.topicLine.town': '  town     — lookaround / talk / rest',
  'help.topicLine.status': '  status   — stats / inv / name',
  'help.topicLine.system': '  system   — save / lang / settings',
  'help.topic.travel': `[travel]
  go <zone>        enter a hunting zone (see: zones)
  hunt / explore   search the current zone
  auto / autohunt  auto-hunt (stop / 중지 to cancel)
  boss / challenge challenge the zone boss (apex zones)
  town / cd ~      return to town
  zones            list hunting zones

tips: higher zones need level — and sometimes a cleared boss.
try: help mistwood · help zones`,
  'help.topic.combat': `[combat]
  attack / a       basic attack
  skill <name>     cast a skill (costs MP)
  defend / d       brace for the next hit
  use <potion>     use a consumable
  flee             try to escape (bosses resist)

in battle you can still: status · inv · skills · help · save
try: help skills · help slash`,
  'help.topic.skills': `[skills]
  skills           list known (and locked) skills
  skill <name>     cast in combat

skills unlock by level. help <skill> shows the effect.
try: help mend · help bash`,
  'help.topic.items': `[items]
  inv / inventory  bag contents
  equip <name>     wear gear
  unequip <slot>   remove gear
  use <name>       use a consumable
  shop / shop list open shop catalog
  buy <name|#>     buy
  sell <name> [n]  sell

help <item> shows stats & prices.
try: help wood-sword · help hp-potion-s`,
  'help.topic.town': `[town]
  lookaround       see who is in town
  talk <name>      talk (then reply 1/2/3)
  rest             recover HP/MP
  shop             enter the shop

people change each lookaround. affinity grows with good replies.`,
  'help.topic.status': `[status]
  status / st      stats & equipment
  inv / inventory  inventory
  skills           skills
  look / ls        where you are
  zones            hunting zones
  name / rename    change nickname`,
  'help.topic.system': `[system]
  save / load      save or load
  autosave [min]   autosave interval (1-60)
  lang <en|ko>     language
  settings         settings UI
  theme dark|light
  fast on|off      message pacing
  fontsize <n>     terminal font size
  hints on|off     combat command hints
  clear / history / reset`,
  'help.skillDetail': `[skill] {name}
  {effect}
  {owned}
  cast: skill {name}`,
  'help.skillOwned': 'owned',
  'help.skillLocked': 'locked (Lv.{level}+)',
  'help.itemDetail': `[item] {name}
  {kind} · {stats}
  {desc}
  {prices}
  {owned}{equipped}`,
  'help.itemBuy': 'buy {price}G',
  'help.itemSell': 'sell {price}G',
  'help.itemNoPrice': 'no shop price',
  'help.itemOwned': 'in bag x{qty}',
  'help.itemNotOwned': 'not in bag',
  'help.itemEquipped': ' · equipped',
  'help.zoneDetail': `[zone] {name} (Lv.{level}+)
  {desc}
  enter: go {name}
  then: hunt · auto · (boss if available)`,
  'help.unknown': 'help: unknown topic "{q}" — try help',
  'combat.help': `[combat] attack | skill <name> | defend | use | flee
  more: help combat · help skills`,

  'welcome.title': 'DevQuest — Terminal RPG',
  'welcome.hint': 'type help — or tap a chip below',
  'welcome.lang': 'language: tap 한국어 / English below',
  'welcome.save': 'save found — type load to continue.',

  'err.unknownCmd': 'error: command not found: {cmd}  (try help)',
  'err.notInCombat': 'error: not in combat. use hunt in a zone',
  'err.unknownZone': 'error: unknown zone. see zones',
    'err.zoneBossGate': 'error: {zone} locked — defeat {boss} first',
  'err.bossOnlyApex': 'error: boss only in apex zones (eldergrove / abysscove / peakruin)',
'err.zoneLevel': 'error: {zone} requires Lv.{need}+ (you are Lv.{level})',
  'err.huntOnlyZone': 'error: hunt only works in a zone (go mistwood)',
  'err.npcTown': 'error: people are in town (town → lookaround)',
  'err.unknownNpc': 'error: unknown person. lookaround first',
  'err.npcNeedLook': 'error: lookaround first to see who is here',
  'err.npcTalkOnce': 'error: already talked once this lookaround — lookaround again',
  'err.npcNotPresent': 'error: {name} is not here right now',
  'err.npcChoose': 'error: choose a reply: 1 | 2 | 3 (or type the reply text)',
  'err.npcNoPending': 'error: no open conversation',
  'err.shopOnly': 'error: shop only available in town (town)',
  'err.restTown': 'error: rest only in town (town)',
  'err.buyOnly': 'error: buy only in shop/town (shop)',
  'err.sellOnly': 'error: sell only in shop/town (shop)',
  'err.notSold': 'error: not sold here (shop list)',
  'err.gold': 'error: insufficient gold (price {price}G, have {gold}G)',
  'err.noItemInv': 'error: item not in inventory',
  'err.qty': 'error: not enough qty (have {qty})',
  'err.noConsumable': 'error: consumable not found',
  'err.unknownSkill': 'error: unknown skill',
  'err.noSave': 'error: no save found',
  'err.corruptSave': 'error: corrupt save',
  'err.usage.go': 'usage: go <zone>  (e.g. go mistwood)',
  'err.usage.cd': 'usage: cd ~ | cd <zone>',
  'err.usage.shop': 'usage: shop | shop list',
  'err.usage.equip': 'usage: equip <item>',
  'err.usage.unequip': 'usage: unequip <slot>',
  'err.usage.use': 'usage: use <consumable>',
  'err.usage.buy': 'usage: buy <item|#>  (see shop list)',
  'err.usage.sell': 'usage: sell <item> [qty]',
  'err.usage.skill': 'usage: skill <name>  (see skills)',
  'err.usage.theme': 'usage: theme dark | theme light',
  'err.usage.fontsize': 'usage: fontsize <{min}-{max}>',
  'err.usage.autosave': 'error: usage autosave <{min}-{max}>',
  'err.usage.inspector': 'usage: inspector on | off',
  'err.usage.hud': 'usage: hud on | off',
  'err.usage.hints': 'usage: hints on | off',
  'err.usage.explorer': 'usage: explorer compact | normal',
  'err.usage.lang': 'usage: lang en | lang ko',
  'err.usage.name': 'usage: name <new>',
  'err.nameInvalid': 'error: nickname must be 2-12 characters with no spaces',
  'err.nameDailyLimit': 'error: nickname already changed today — try again tomorrow',
  'err.nameSame': 'error: that is already your nickname',
  'err.nameBusy': 'error: finish combat / reply first, then change nickname',
  'err.usage.fast': 'usage: fast on | off  (or: pace fast | pace normal)',
  'err.usage.settings':
    'usage: settings | settings close | settings list | settings reset | settings appearance|game|terminal',
  'err.combatOnly': 'error: in combat use attack|skill|defend|use|flee',

  'ok.cleared': 'cleared.',
  'ok.noHistory': '(no history)',
  'ok.saved': 'game saved. (localStorage)',
  'ok.loaded': 'save loaded.',
  'ok.welcomeBack': 'welcome, {name}. pwd: {loc}',
  'ok.newGame': 'new game started. (save file kept — overwrite with save)',
  'ok.adminTest': 'admin demo loadout applied. (not saved until you type save)',
  'ok.adminTestHint':
    'DEMO ~45s: status → 둘러보기 → talk → 1/2 → go 고목숲 → hunt → skill bash → town',
  'ok.town': 'moved to town.',
  'ok.townShort': 'moved to town.',
  'ok.talkHint': 'usage: talk <name>  (someone from lookaround)',
  'ok.rest': 'rested. HP {hp}/{maxHp} | MP {mp}/{maxMp}',
  'ok.restAlready': 'already at full HP/MP.',
  'ok.shopEnter': 'entered shop.',
  'ok.arrived': 'arrived: {zone} — {desc}',
    'ok.bossHint': '',
'ok.huntHint': '',
  'ok.bought': 'bought {item} -{price}G (balance {gold}G)',
  'ok.sold': 'sold {item} x{qty} +{total}G (unit {unit}G, balance {gold}G)',
  'ok.victory': 'victory.',
  'ok.fled': 'left combat.',
  'ok.settingsOpen': 'opened settings UI (close: settings close)',
  'ok.settingsClose': 'closed settings. back to terminal.',
  'ok.settingsReset': 'settings reset to defaults',
  'ok.settingsCat': 'settings > {cat}',
  'ok.theme': 'theme set to {theme}',
  'ok.font': 'font size set to {size}px',
  'ok.autosave': 'autosave interval set to {min} min',
  'ok.inspector': 'inspector {state}',
  'ok.hud': 'hud {state}',
  'ok.hints': 'combat hints {state}',
  'ok.explorer': 'explorer: {mode}',
  'ok.lang': 'language set to {lang}',
  'ok.name': 'nickname set: {name}',
  'info.name': 'nickname: {name}',
  'ok.fast': 'fast mode {state}',
  'ok.autoStart': 'auto-hunt started',
  'ok.autoHint': 'type stop to cancel',
  'ok.autoAlready': 'auto-hunt already running (stop to cancel)',
  'ok.autoStopManual': 'auto-hunt stopped',
  'ok.autoStopDeath': 'auto-hunt stopped — you were defeated',
  'err.autoZoneOnly': 'error: auto-hunt only in a hunting zone',
  'err.autoNoBoss': 'error: auto-hunt cannot run in boss fights',
  'err.autoNotRunning': 'error: auto-hunt is not running',
  'err.autoBusy': 'error: auto-hunting — type stop to cancel',
  'ui.autoPlaceholder': 'auto-hunt… type stop',
  'ok.lootItem': 'found item: {item}',
  'ok.lootGold': 'found gold pouch: +{gold}G (wallet {total}G)',

  'combat.cmds': 'cmds: attack | skill <name> | defend | use <potion> | flee',
  'combat.saveNote': '(combat state is not saved)',
    'combat.appearBoss': 'BOSS {name} (Lv.{level}) appears!',
'combat.appear': 'A wild {name} (Lv.{level}) appears!',
  'combat.attack': 'attack -> {name} took {dmg} dmg. (HP {hp}/{max})',
  'combat.skillDmg': '{skill}! {name} took {dmg} dmg. (MP -{mp}, HP {hp}/{max})',
  'combat.skillHeal': '{skill}! HP {before} -> {after} (MP -{mp})',
  'combat.defend': 'you brace for the next hit',
  'combat.fleeOk': 'flee: success',
    'combat.fleeFailBoss': 'flee: failed (boss blocks escape)',
'combat.fleeFail': 'flee: failed',
  'combat.hitGuard': '(guard) {name} hits for {dmg}',
    'combat.bossSkill': '{name} casts {skill}! you take {dmg}',
  'combat.bossSkillGuard': '(guard) {name} casts {skill}! you take {dmg}',
  'combat.bossHeal': '{name} uses {skill}! healed {heal} (HP {hp}/{max})',
  'combat.bossRegen': '{name} recovers! +{heal} HP (HP {hp}/{max})',
  'combat.lethalWarn': '⚠ {name} is winding up a finishing blow…',
  'combat.lethalBlocked': 'you guard just in time! {name}\'s finishing blow is blocked',
  'combat.lethalHit': '{name} lands the finishing blow. you are slain.',
  'combat.bossUnlockSea': 'SEA region unlocked — go saltshore',
  'combat.bossUnlockMountain': 'MOUNTAIN region unlocked — go foothill',
  'combat.bossClearPeak': 'Tyrant fallen. The summit is yours.',
  'combat.bossRechallenge': 'boss already cleared — gate stays open',
'combat.hit': '{name} hits for {dmg}',
  'combat.yourHp': 'your HP {hp}/{max}',
  'combat.dead': 'you were defeated... waking up in town',
  'combat.deadGold': 'gold -{loss}G -> {gold}G | cd ~/town',
  'combat.deadVitals': 'respawn vitals: HP {hp}/{maxHp} | MP {mp}/{maxMp}',
  'combat.win': '{name} defeated',
  'combat.reward': '+{exp} EXP | +{gold}G',
  'combat.drop': 'loot: {item}',
  'combat.regen': 'recover +{hp} HP / +{mp} MP → HP {curHp}/{maxHp} | MP {curMp}/{maxMp}',
  'combat.errSkill': 'error: unknown skill',
  'combat.errLocked': 'error: skill not unlocked',
  'combat.errMp': 'error: not enough MP (need {need}, have {have})',
  'combat.errUse': 'error: use failed',

  'player.errNotConsumable': 'error: not a usable consumable',
  'player.errNoItem': 'error: item not found',
  'player.used': 'used {item}. {parts}',
  'player.errNotEquip': 'error: not equippable',
  'player.equipped': 'equipped {item}{prev}',
  'player.unequippedPrev': ' (unequipped {item})',
  'player.errSlot': 'error: invalid slot (helmet|armor|legs|boots|gloves|weapon|ring|necklace)',
  'player.errEmptySlot': 'error: nothing equipped in that slot',
  'player.unequipped': 'unequipped {item}',
  'player.skillUnlock': 'skill unlocked: {skill} — {effect}',
  'player.levelUp': 'level up! Lv.{level} | ATK {atk} / DEF {def} | HP/MP restored',

  'info.autosave': 'autosave: every {min} min (default {def}, range {lo}-{hi})\nusage: autosave <minutes>',
  'info.theme': 'theme: {theme}  (theme dark | theme light)',
  'info.font': 'fontSize: {size}px  (fontsize {lo}-{hi})',
  'info.inspector': 'showInspector: {value}',
  'info.hud': 'showHud: {value}',
  'info.hints': 'combatHints: {value}',
  'info.explorer': 'compactExplorer: {value}  (explorer compact | normal)',
  'info.lang': 'language: {lang}  (lang en | lang ko)\nplace names & lookaround follow the selected language.',
  'info.fast': 'fastMode: {value}  (fast on = quicker text, off = slower default)',

  'stat.name': 'name: {name}  |  pwd: {loc}',
  'stat.level': 'level: {level}  |  EXP {exp}/{need}  |  gold {gold}G',
  'stat.vitals': 'HP {hp}/{maxHp}  |  MP {mp}/{maxMp}',
  'stat.atkdef': 'ATK {atk} (base {baseAtk})  |  DEF {def} (base {baseDef})',
  'stat.equip': '-- equipment --',
  'stat.none': '(none)',
  'inv.empty': 'inventory empty.',
  'inv.head': 'inventory ({n} kinds) | gold {gold}G',
  'inv.line': '  [{kind}] {item} x{qty}  — {stats}  (sell {sell}G)',
  'inv.hint': 'hint: equip <item>  (e.g. equip {example})  |  unequip <slot>',
  'inv.hintNone': 'hint: no gear in bag · buy from shop or hunt for drops',
  'skills.head': 'skills',
  'skills.line': '  {name} (MP {mp}) — {desc}',
  'skills.locked': '-- locked --',
  'skills.lockedLine': '  {name} (Lv.{level}+)',
  'look.town': 'town — quiet streets and familiar faces.',
  'look.shop': 'shop — shelves of gear and potions.',
  'look.bossHint': '',
  'look.zone': '{zone} — {desc}',
  'look.pwd': 'pwd: {loc}',
  'npc.lookHead': 'people around town (this visit)',
  'npc.lookLine': '  {name} — {title}  |  affinity Lv.{stage} ({score})',
  'npc.lookFoot': 'talk <name>',
  'npc.chooseHead': 'choose your reply:',
  'npc.choiceLine': '  {n}. {text}',
  'npc.chooseFoot': '1 / 2 / 3',
  'npc.youSaid': 'you: {text}',
  'npc.reactGood': '{name} seems pleased. (affinity +{delta})',
  'npc.reactOk': '{name} nods. (affinity +{delta})',
  'npc.reactBad': '{name} looks awkward. (affinity {delta})',
  'npc.reactFlat': '{name} stays quiet.',
  'npc.affinityNow': '{name} affinity: {score}',
  'npc.gift': 'gift from {name}! {item} x{qty}',
  'npc.talkDone': 'conversation over.',
  'zones.head': 'zones',
  'zones.line': '  [{ok}] {name}  (Lv.{level}+) — {desc}',
  'zones.ok': 'ok',
    'zones.needBoss': '  [need: {boss}]',
  'zones.bossAvail': '',
  'zones.bossDone': '  [boss cleared]',
'zones.locked': 'locked',
  'shop.head1': 'shop catalog (sellback ~= 1/3 of list price)',
  'shop.head2': 'note: shop gear has worse value than drops',
  'shop.head3': 'buy by number: buy 1   |   buy by name: buy hp-potion-s',
  'shop.line': '  {no}. [{kind}] {item}  {price}G  — {stats}',
  'shop.foot': 'buy <1-{n}|name>  |  sell <name> [qty]',
  'kind.cons': 'cons',
  'kind.gear': 'gear',

  'ui.explorer': 'Explorer',
  'ui.world': 'WORLD',
  'ui.regionForest': 'FOREST',
  'ui.regionSea': 'SEA',
  'ui.regionMountain': 'MOUNTAIN',
  'ui.quick': 'QUICK',
  'ui.town': 'town',
  'ui.shop': 'shop',
  'ui.lookaround': 'lookaround',
  'ui.status': 'status',
  'ui.hunt': 'hunt',
  'ui.boss': 'boss',
  'ui.help': 'help',
  'ui.save': 'save',
  'ui.settings': 'Settings',
  'ui.categories': 'CATEGORIES',
  'ui.actions': 'ACTIONS',
  'ui.backTerminal': 'Back to Terminal',
  'ui.resetDefaults': 'Reset Defaults',
  'ui.hintExplorer': 'Click a node or type a command in the CLI.',
  'ui.hintSettings': 'Or type: settings | theme dark | lang ko',
  'ui.inspector': 'Inspector',
  'ui.player': 'Player',
  'ui.environment': 'Environment',
  'ui.equipment': 'Equipment',
  'ui.skills': 'Skills',
  'ui.inventory': 'Inventory',
  'ui.empty': '(empty)',
  'ui.combatTarget': 'Combat Target',
  'ui.hudCombat': 'IN COMBAT',
  'ui.placeholder': 'type help · help combat · help slash',
  'ui.searchSettings': 'Search settings',
  'ui.close': 'Close',
  'ui.appearance': 'Appearance',
  'ui.game': 'Game',
  'ui.terminal': 'Terminal',
  'ui.appearanceDesc': 'Color theme, language, and layout chrome',
  'ui.gameDesc': 'Gameplay environment options',
  'ui.terminalDesc': 'CLI appearance',
  'ui.colorTheme': 'Color Theme',
  'ui.colorThemeDesc': 'Dark / Light mode for the whole IDE UI',
  'ui.language': 'Language',
  'ui.languageDesc': 'UI & messages language (place names follow language)',
  'ui.nickname': 'Nickname',
  'ui.nicknameDesc': 'Change once per local day (2–12 chars, no spaces)',
  'ui.nicknameDescUsed': 'Already changed today — available again tomorrow',
  'ui.nicknameApply': 'Apply',
  'ui.showInspector': 'Show Inspector',
  'ui.showInspectorDesc': 'Right-side inspector panel',
  'ui.compactExplorer': 'Compact Explorer',
  'ui.compactExplorerDesc': 'Narrower left sidebar, hide hints',
  'ui.autosave': 'Autosave Interval',
  'ui.autosaveDesc': 'Auto-save every N minutes (1-60)',
  'ui.showHud': 'Show HUD',
  'ui.showHudDesc': 'Top status strip (HP / MP / EXP)',
  'ui.combatHints': 'Combat Hints',
  'ui.combatHintsDesc': 'Show command list when battle starts',
  'ui.fastMode': 'Fast Mode',
  'ui.fastModeDesc': 'Quicker message pacing (off = slower, more dramatic)',
  'ui.fontSize': 'Font Size',
  'ui.fontSizeDesc': 'Terminal and prompt font size (11-18px)',
  'ui.dark': 'Dark+ (default)',
  'ui.light': 'Light+',
  'ui.langEn': 'English',
  'ui.langKo': '한국어',
}

const KO: Dict = {
  'help.indexHead': `help
────────────────────────
주제:`,
  'help.indexFoot': `usage: help <주제>
  또는: help <스킬> | help <아이템> | help <사냥터>
  예: help 전투 · help slash · help hp-potion-s`,
  'help.topicLine.travel': '  이동     — go / hunt / zones / boss / auto',
  'help.topicLine.combat': '  전투     — attack / skill / defend / flee',
  'help.topicLine.skills': '  스킬     — 해금과 사용',
  'help.topicLine.items': '  아이템   — 장착 / 사용 / 상점',
  'help.topicLine.town': '  마을     — 둘러보기 / talk / rest',
  'help.topicLine.status': '  상태     — status / inv / name',
  'help.topicLine.system': '  시스템   — save / lang / settings',
  'help.topic.travel': `[이동]
  go <장소>        사냥터 이동 (zones 로 목록)
  hunt / explore   현재 사냥터 탐색
  auto / 자동전투  자동전투 (stop / 중지로 종료)
  boss / challenge 보스 도전 (상한 존)
  town / cd ~      마을로
  zones            사냥터 목록

높은 존은 레벨·보스 클리어가 필요할 수 있어요.
예: help 안개숲 · help 이동`,
  'help.topic.combat': `[전투]
  attack / a       기본 공격
  skill <이름>     스킬 (MP 소모)
  defend / d       방어 자세
  use <포션>       소모품 사용
  flee             도망 (보스는 어렵습니다)

전투 중에도: status · inv · skills · help · save
예: help 스킬 · help slash`,
  'help.topic.skills': `[스킬]
  skills           보유/미해금 스킬 목록
  skill <이름>     전투 중 사용

레벨이 오르면 스킬이 해금됩니다. help <스킬> 로 효과 확인.
예: help mend · help bash`,
  'help.topic.items': `[아이템]
  inv / inventory  인벤토리
  equip <이름>     장비 장착
  unequip <슬롯>   장비 해제
  use <이름>       소모품 사용
  shop / shop list 상점
  buy <이름|#>     구매
  sell <이름> [n]  판매

help <아이템> 으로 스탯·가격을 볼 수 있어요.
예: help wood-sword · help hp-potion-s`,
  'help.topic.town': `[마을]
  둘러보기         마을에 있는 사람 보기
  talk <이름>      대화 (답변 1/2/3)
  rest             HP/MP 회복
  shop             상점

둘러볼 때마다 사람이 달라질 수 있어요. 좋은 답이 호감을 올립니다.`,
  'help.topic.status': `[상태]
  status / st      능력치·장비
  inv / inventory  인벤토리
  skills           스킬
  look / ls        현재 위치
  zones            사냥터
  name / 닉네임    닉네임 변경`,
  'help.topic.system': `[시스템]
  save / load      저장 / 불러오기
  autosave [분]    자동저장 간격 (1-60)
  lang <en|ko>     언어
  settings         설정 화면
  theme dark|light
  fast on|off      메시지 속도
  fontsize <n>     글자 크기
  hints on|off     전투 명령 힌트
  clear / history / reset`,
  'help.skillDetail': `[스킬] {name}
  {effect}
  {owned}
  사용: skill {name}`,
  'help.skillOwned': '보유 중',
  'help.skillLocked': '미해금 (Lv.{level}+)',
  'help.itemDetail': `[아이템] {name}
  {kind} · {stats}
  {desc}
  {prices}
  {owned}{equipped}`,
  'help.itemBuy': '구매 {price}G',
  'help.itemSell': '매입 {price}G',
  'help.itemNoPrice': '상점가 없음',
  'help.itemOwned': '가방 x{qty}',
  'help.itemNotOwned': '가방에 없음',
  'help.itemEquipped': ' · 장착 중',
  'help.zoneDetail': `[사냥터] {name} (Lv.{level}+)
  {desc}
  이동: go {name}
  이후: hunt · auto · (가능하면 boss)`,
  'help.unknown': 'help: 알 수 없는 주제 "{q}" — help 를 입력해 보세요',
  'combat.help': `[전투] attack | skill <이름> | defend | use | flee
  더보기: help 전투 · help 스킬`,

  'welcome.title': 'DevQuest — Terminal RPG',
  'welcome.hint': 'help 입력 — 또는 아래 칩을 눌러 보세요',
  'welcome.lang': '언어: 아래 칩에서 한국어 / English 선택',
  'welcome.save': '저장 데이터 있음 — load 로 이어하기',

  'err.unknownCmd': 'error: 알 수 없는 명령어: {cmd}  (help 입력)',
  'err.notInCombat': 'error: 전투 중이 아닙니다. 사냥터에서 hunt 하세요',
  'err.unknownZone': 'error: 알 수 없는 사냥터입니다. zones 확인',
    'err.zoneBossGate': 'error: {zone} 잠김 — 먼저 {boss} 를 처치하세요',
  'err.bossOnlyApex': 'error: 보스는 상한 존에서만 (고목숲 / 심연만 / 정상폐허)',
'err.zoneLevel': 'error: {zone} 입장 조건 Lv.{need}+ (현재 Lv.{level})',
  'err.huntOnlyZone': 'error: 사냥터에서만 탐색 가능 (go 안개숲)',
  'err.npcTown': 'error: 사람들은 마을에 있습니다 (town → 둘러보기)',
  'err.unknownNpc': 'error: 알 수 없는 사람. 먼저 둘러보기',
  'err.npcNeedLook': 'error: 먼저 둘러보기로 누가 있는지 확인하세요',
  'err.npcTalkOnce': 'error: 이번 둘러보기에서는 이미 대화했습니다 — 다시 둘러보기',
  'err.npcNotPresent': 'error: 지금은 {name} 이(가) 없어요',
  'err.npcChoose': 'error: 답변을 고르세요: 1 | 2 | 3 (또는 선택지 내용 입력)',
  'err.npcNoPending': 'error: 진행 중인 대화가 없습니다',
  'err.shopOnly': 'error: 상점/마을에서만 이용 가능 (town)',
  'err.restTown': 'error: 마을에서만 휴식 가능 (town)',
  'err.buyOnly': 'error: 상점/마을에서만 구매 가능 (shop)',
  'err.sellOnly': 'error: 상점/마을에서만 판매 가능 (shop)',
  'err.notSold': 'error: 상점에서 판매하지 않는 아이템 (shop list)',
  'err.gold': 'error: 골드 부족 (가격 {price}G, 보유 {gold}G)',
  'err.noItemInv': 'error: 인벤토리에 아이템이 없습니다',
  'err.qty': 'error: 수량 부족 (보유 {qty})',
  'err.noConsumable': 'error: 소모품을 찾을 수 없습니다',
  'err.unknownSkill': 'error: 알 수 없는 스킬',
  'err.noSave': 'error: 저장 데이터 없음',
  'err.corruptSave': 'error: 저장 데이터 손상',
  'err.usage.go': 'usage: go <장소>  (예: go 안개숲)',
  'err.usage.cd': 'usage: cd ~ | cd <장소>',
  'err.usage.shop': 'usage: shop | shop list',
  'err.usage.equip': 'usage: equip <item>',
  'err.usage.unequip': 'usage: unequip <slot>',
  'err.usage.use': 'usage: use <consumable>',
  'err.usage.buy': 'usage: buy <item|#>  (shop list 참고)',
  'err.usage.sell': 'usage: sell <item> [qty]',
  'err.usage.skill': 'usage: skill <name>  (skills 참고)',
  'err.usage.theme': 'usage: theme dark | theme light',
  'err.usage.fontsize': 'usage: fontsize <{min}-{max}>',
  'err.usage.autosave': 'error: usage autosave <{min}-{max}>',
  'err.usage.inspector': 'usage: inspector on | off',
  'err.usage.hud': 'usage: hud on | off',
  'err.usage.hints': 'usage: hints on | off',
  'err.usage.explorer': 'usage: explorer compact | normal',
  'err.usage.lang': 'usage: lang en | lang ko',
  'err.usage.name': 'usage: name <새이름>',
  'err.nameInvalid': 'error: 닉네임은 공백 없이 2~12자여야 합니다',
  'err.nameDailyLimit': 'error: 오늘은 이미 닉네임을 변경했습니다 — 내일 다시 시도하세요',
  'err.nameSame': 'error: 이미 같은 닉네임입니다',
  'err.nameBusy': 'error: 전투·대화 답변을 끝낸 뒤 닉네임을 변경하세요',
  'err.usage.fast': 'usage: fast on | off  (또는: pace fast | pace normal)',
  'err.usage.settings':
    'usage: settings | settings close | settings list | settings reset | settings appearance|game|terminal',
  'err.combatOnly': 'error: 전투 중에는 attack|skill|defend|use|flee 만 가능',

  'ok.cleared': '화면을 지웠습니다.',
  'ok.noHistory': '(명령 기록 없음)',
  'ok.saved': '저장 완료. (localStorage)',
  'ok.loaded': '저장 데이터를 불러왔습니다.',
  'ok.welcomeBack': '환영합니다, {name}. 위치: {loc}',
  'ok.newGame': '새 게임을 시작합니다. (세이브 파일 유지 — 덮어쓰려면 save)',
  'ok.adminTest': '데모용 테스트 로드아웃 적용. (save 하기 전까지 저장 안 됨)',
  'ok.adminTestHint':
    '데모 ~45초: status → 둘러보기 → talk → 1/2 → go 고목숲 → hunt → skill bash → town',
  'ok.town': '마을로 이동했습니다.',
  'ok.townShort': '마을로 이동했습니다.',
  'ok.talkHint': 'usage: talk <이름>  (둘러보기 목록에 있는 사람)',
  'ok.rest': '휴식 완료. HP {hp}/{maxHp} | MP {mp}/{maxMp}',
  'ok.restAlready': '이미 HP/MP가 가득입니다.',
  'ok.shopEnter': '상점에 입장했습니다.',
  'ok.arrived': '도착: {zone} — {desc}',
    'ok.bossHint': '',
'ok.huntHint': '',
  'ok.bought': '{item} 구매 -{price}G (잔액 {gold}G)',
  'ok.sold': '{item} x{qty} 판매 +{total}G (단가 {unit}G, 잔액 {gold}G)',
  'ok.victory': '전투 승리!',
  'ok.fled': '전투에서 벗어났습니다.',
  'ok.settingsOpen': '설정 화면을 열었습니다 (닫기: settings close)',
  'ok.settingsClose': '설정 닫음. 터미널로 복귀.',
  'ok.settingsReset': '설정을 기본값으로 초기화했습니다',
  'ok.settingsCat': '설정 > {cat}',
  'ok.theme': '테마: {theme}',
  'ok.font': '글자 크기: {size}px',
  'ok.autosave': '자동저장 간격: {min}분',
  'ok.inspector': 'inspector {state}',
  'ok.hud': 'hud {state}',
  'ok.hints': '전투 힌트 {state}',
  'ok.explorer': 'explorer: {mode}',
  'ok.lang': '언어: {lang}',
  'ok.name': '닉네임 변경: {name}',
  'info.name': '닉네임: {name}',
  'ok.fast': '빠른 모드 {state}',
  'ok.autoStart': '자동전투 시작',
  'ok.autoHint': '끝내려면 stop',
  'ok.autoAlready': '이미 자동전투 중 (stop 으로 종료)',
  'ok.autoStopManual': '자동전투 종료',
  'ok.autoStopDeath': '자동전투 종료 — 전투에서 패배',
  'err.autoZoneOnly': 'error: 사냥터에서만 자동전투 가능',
  'err.autoNoBoss': 'error: 보스전에서는 자동전투 불가',
  'err.autoNotRunning': 'error: 자동전투가 실행 중이 아닙니다',
  'err.autoBusy': 'error: 자동전투 중 — 끝내려면 stop',
  'ui.autoPlaceholder': '자동전투 중… stop 입력',
  'ok.lootItem': '아이템 획득: {item}',
  'ok.lootGold': '골드 획득: +{gold}G (보유 {total}G)',

  'combat.cmds': '명령: attack | skill <name> | defend | use <potion> | flee',
  'combat.saveNote': '(전투 상태는 저장되지 않습니다)',
    'combat.appearBoss': '보스 {name} (Lv.{level}) 출현!',
'combat.appear': '야생의 {name} (Lv.{level}) 출현!',
  'combat.attack': '공격 -> {name}에게 {dmg} 피해. (HP {hp}/{max})',
  'combat.skillDmg': '{skill}! {name}에게 {dmg} 피해. (MP -{mp}, HP {hp}/{max})',
  'combat.skillHeal': '{skill}! HP {before} -> {after} (MP -{mp})',
  'combat.defend': '자세를 낮춰 다음 공격을 대비한다',
  'combat.fleeOk': '도망 성공',
    'combat.fleeFailBoss': '도망 실패 (보스가 길을 막음)',
'combat.fleeFail': '도망 실패',
  'combat.hitGuard': '(방어) {name}의 공격 {dmg}',
    'combat.bossSkill': '{name}의 {skill}! {dmg} 피해',
  'combat.bossSkillGuard': '(방어) {name}의 {skill}! {dmg} 피해',
  'combat.bossHeal': '{name}의 {skill}! {heal} 회복 (HP {hp}/{max})',
  'combat.bossRegen': '{name}이(가) 체력을 회복한다! +{heal} (HP {hp}/{max})',
  'combat.lethalWarn': '⚠ {name}이(가) 최후의 일격을 준비 중이다…',
  'combat.lethalBlocked': '간신히 막아냈다! {name}의 최후 일격이 빗나간다',
  'combat.lethalHit': '{name}의 최후 일격이 꽂힌다. 쓰러졌다.',
  'combat.bossUnlockSea': '바다 지역 해금 — go saltshore',
  'combat.bossUnlockMountain': '산 지역 해금 — go foothill',
  'combat.bossClearPeak': '타이런트를 쓰러뜨렸다. 정상이 열렸다.',
  'combat.bossRechallenge': '이미 클리어한 보스 — 게이트는 열린 상태',
'combat.hit': '{name}의 공격 {dmg}',
  'combat.yourHp': '내 HP {hp}/{max}',
  'combat.dead': '쓰러졌습니다... 마을에서 눈을 뜹니다',
  'combat.deadGold': '골드 -{loss}G -> {gold}G | 마을로 이동',
  'combat.deadVitals': '부활 상태: HP {hp}/{maxHp} | MP {mp}/{maxMp}',
  'combat.win': '{name} 처치',
  'combat.reward': '+{exp} EXP | +{gold}G',
  'combat.drop': '드롭: {item}',
  'combat.regen': '전투 후 회복 +{hp} HP / +{mp} MP → HP {curHp}/{maxHp} | MP {curMp}/{maxMp}',
  'combat.errSkill': 'error: 알 수 없는 스킬',
  'combat.errLocked': 'error: 아직 해금되지 않은 스킬',
  'combat.errMp': 'error: 마나 부족 (필요 {need}, 보유 {have})',
  'combat.errUse': 'error: 사용 실패',

  'player.errNotConsumable': 'error: 사용할 수 있는 소모품이 아닙니다',
  'player.errNoItem': 'error: 아이템이 없습니다',
  'player.used': '{item} 사용. {parts}',
  'player.errNotEquip': 'error: 장착할 수 없는 아이템',
  'player.equipped': '{item} 장착{prev}',
  'player.unequippedPrev': ' (해제: {item})',
  'player.errSlot': 'error: 잘못된 부위 (helmet|armor|legs|boots|gloves|weapon|ring|necklace)',
  'player.errEmptySlot': 'error: 해당 부위에 장비가 없습니다',
  'player.unequipped': '{item} 해제',
  'player.skillUnlock': '스킬 해금: {skill} — {effect}',
  'player.levelUp': '레벨 업! Lv.{level} | ATK {atk} / DEF {def} | HP/MP 회복',

  'info.autosave': '자동저장: {min}분마다 (기본 {def}, 범위 {lo}-{hi})\nusage: autosave <minutes>',
  'info.theme': '테마: {theme}  (theme dark | theme light)',
  'info.font': '글자 크기: {size}px  (fontsize {lo}-{hi})',
  'info.inspector': 'showInspector: {value}',
  'info.hud': 'showHud: {value}',
  'info.hints': 'combatHints: {value}',
  'info.explorer': 'compactExplorer: {value}  (explorer compact | normal)',
  'info.lang': '언어: {lang}  (lang en | lang ko)\n장소·둘러보기·이름은 선택한 언어에 맞춥니다.',
  'info.fast': 'fastMode: {value}  (fast on = 빠르게, off = 기본 천천히)',

  'stat.name': '이름: {name}  |  위치: {loc}',
  'stat.level': '레벨: {level}  |  EXP {exp}/{need}  |  골드 {gold}G',
  'stat.vitals': 'HP {hp}/{maxHp}  |  MP {mp}/{maxMp}',
  'stat.atkdef': 'ATK {atk} (기본 {baseAtk})  |  DEF {def} (기본 {baseDef})',
  'stat.equip': '-- 장착 장비 --',
  'stat.none': '(없음)',
  'inv.empty': '인벤토리가 비어 있습니다.',
  'inv.head': '인벤토리 ({n}종) | 골드 {gold}G',
  'inv.line': '  [{kind}] {item} x{qty}  — {stats}  (매입가 {sell}G)',
  'inv.hint': '장착: equip <item>  (예: equip {example})  |  해제: unequip <slot>',
  'inv.hintNone': '힌트: 가방에 장비 없음 · shop 구매 또는 hunt 드롭',
  'skills.head': '보유 스킬',
  'skills.line': '  {name} (MP {mp}) — {desc}',
  'skills.locked': '-- 미해금 --',
  'skills.lockedLine': '  {name} (Lv.{level}+)',
  'look.town': '마을 — 익숙한 거리와 사람들.',
  'look.shop': '상점 — 장비와 포션이 진열되어 있다.',
  'look.bossHint': '',
  'look.zone': '{zone} — {desc}',
  'look.pwd': '위치: {loc}',
  'npc.lookHead': '지금 마을에 있는 사람들',
  'npc.lookLine': '  {name} — {title}  |  호감 Lv.{stage} ({score})',
  'npc.lookFoot': 'talk <이름>',
  'npc.chooseHead': '답변을 고르세요:',
  'npc.choiceLine': '  {n}. {text}',
  'npc.chooseFoot': '1 / 2 / 3',
  'npc.youSaid': '나: {text}',
  'npc.reactGood': '{name} 표정이 밝아졌어요. (호감 +{delta})',
  'npc.reactOk': '{name} 이(가) 고개를 끄덕입니다. (호감 +{delta})',
  'npc.reactBad': '{name} 분위기가 어색해졌어요. (호감 {delta})',
  'npc.reactFlat': '{name} 반응이 덤덤합니다.',
  'npc.affinityNow': '{name} 호감도: {score}',
  'npc.gift': '{name}의 선물! {item} x{qty}',
  'npc.talkDone': '대화가 끝났다.',
  'zones.head': '사냥터',
  'zones.line': '  [{ok}] {name}  (Lv.{level}+) — {desc}',
  'zones.ok': '가능',
    'zones.needBoss': '  [필요: {boss}]',
  'zones.bossAvail': '',
  'zones.bossDone': '  [보스 클리어]',
'zones.locked': '잠김',
  'shop.head1': '상점 목록 (판매가 ≈ 정가의 1/3)',
  'shop.head2': '참고: 상점 장비는 드롭보다 가성비가 낮습니다',
  'shop.head3': '번호 구매: buy 1   |   이름 구매: buy hp-potion-s',
  'shop.line': '  {no}. [{kind}] {item}  {price}G  — {stats}',
  'shop.foot': 'buy <1-{n}|name>  |  sell <name> [qty]',
  'kind.cons': '소모',
  'kind.gear': '장비',

  'ui.explorer': 'Explorer',
  'ui.world': 'WORLD',
  'ui.regionForest': 'FOREST · 숲',
  'ui.regionSea': 'SEA · 바다',
  'ui.regionMountain': 'MOUNTAIN · 산',
  'ui.quick': 'QUICK',
  'ui.town': '마을',
  'ui.shop': '상점',
  'ui.lookaround': '둘러보기',
  'ui.status': '상태',
  'ui.hunt': '사냥',
  'ui.boss': '보스',
  'ui.help': '도움말',
  'ui.save': '저장',
  'ui.settings': '설정',
  'ui.categories': 'CATEGORIES',
  'ui.actions': 'ACTIONS',
  'ui.backTerminal': '터미널로 돌아가기',
  'ui.resetDefaults': '기본값으로 초기화',
  'ui.hintExplorer': '클릭하거나 CLI에 명령어를 입력하세요.',
  'ui.hintSettings': '또는: settings | theme dark | lang en',
  'ui.inspector': 'Inspector',
  'ui.player': '플레이어',
  'ui.environment': '환경',
  'ui.equipment': '장비',
  'ui.skills': '스킬',
  'ui.inventory': '인벤토리',
  'ui.empty': '(비어 있음)',
  'ui.combatTarget': '전투 대상',
  'ui.hudCombat': '전투중',
  'ui.placeholder': 'help · help 전투 · help slash',
  'ui.searchSettings': '설정 검색',
  'ui.close': '닫기',
  'ui.appearance': '외관',
  'ui.game': '게임',
  'ui.terminal': '터미널',
  'ui.appearanceDesc': '테마, 언어, 레이아웃',
  'ui.gameDesc': '게임플레이 환경',
  'ui.terminalDesc': 'CLI 모양',
  'ui.colorTheme': '색 테마',
  'ui.colorThemeDesc': '전체 IDE 다크/라이트 모드',
  'ui.language': '언어',
  'ui.languageDesc': 'UI·메시지 언어 (장소·둘러보기·이름은 언어에 맞춤)',
  'ui.nickname': '닉네임',
  'ui.nicknameDesc': '로컬 날짜 기준 하루 1회 (2~12자, 공백 불가)',
  'ui.nicknameDescUsed': '오늘은 이미 변경함 — 내일 다시 가능',
  'ui.nicknameApply': '적용',
  'ui.showInspector': 'Inspector 표시',
  'ui.showInspectorDesc': '우측 정보 패널',
  'ui.compactExplorer': 'Explorer 좁게',
  'ui.compactExplorerDesc': '왼쪽 사이드바 축소, 힌트 숨김',
  'ui.autosave': '자동저장 간격',
  'ui.autosaveDesc': 'N분마다 자동 저장 (1-60)',
  'ui.showHud': 'HUD 표시',
  'ui.showHudDesc': '상단 HP/MP/EXP 바',
  'ui.combatHints': '전투 힌트',
  'ui.combatHintsDesc': '전투 시작 시 명령 목록 표시',
  'ui.fastMode': '빠른 모드',
  'ui.fastModeDesc': '메시지 출력을 빠르게 (끄면 기본 천천히)',
  'ui.fontSize': '글자 크기',
  'ui.fontSizeDesc': '터미널·프롬프트 크기 (11-18px)',
  'ui.dark': 'Dark+ (기본)',
  'ui.light': 'Light+',
  'ui.langEn': 'English',
  'ui.langKo': '한국어',
}

const TABLES: Record<Lang, Dict> = { en: EN, ko: KO }

let currentLang: Lang = 'en'

export function getLang(): Lang {
  return currentLang
}

export function setLang(lang: Lang): void {
  currentLang = lang === 'ko' ? 'ko' : 'en'
}

export function t(key: string, vars?: Vars): string {
  const table = TABLES[currentLang] ?? EN
  let text = table[key] ?? EN[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v ?? ''))
    }
  }
  return text
}

export function itemLabel(idOrItem: string | ItemDef): string {
  const item = typeof idOrItem === 'string' ? getItem(idOrItem) : idOrItem
  if (!item) return typeof idOrItem === 'string' ? idOrItem : '?'
  if (currentLang === 'ko') return ITEM_KO[item.id] ?? item.name
  return item.name
}

export function monsterLabel(id: string): string {
  const m = MONSTERS[id]
  if (!m) return id
  if (currentLang === 'ko') return MONSTER_KO[id] ?? m.name
  return m.name
}

export function zoneLabel(id: string): string {
  if (id === 'town' || id === 'shop') {
    return currentLang === 'ko' ? ZONE_KO[id] : id
  }
  const z = ZONES[id]
  if (!z) return id
  if (currentLang === 'ko') return ZONE_KO[id] ?? z.name
  return z.name
}

/** Place name for `go <place>` — matches Explorer label for the current language. */
export function zoneArg(id: string): string {
  return zoneLabel(id)
}

/** lookaround command as shown/run in the current language. */
export function lookaroundCmd(): string {
  return currentLang === 'ko' ? '둘러보기' : 'lookaround'
}

export function goCmd(zoneId: string): string {
  return `go ${zoneArg(zoneId)}`
}

export function zoneDesc(id: string): string {
  const z = ZONES[id]
  if (!z) return ''
  if (currentLang === 'ko') {
    const map: Record<string, string> = {
      mistwood: '안개 낀 숲 외곽. 초보용. (권장 Lv.1+)',
      thornpath: '가시덤불 길. 위협이 커진다. (권장 Lv.3+)',
      eldergrove: '고목이 우거진 숲. (권장 Lv.5+)',
      saltshore: '소금 냄새 나는 해변. 바다 입문. (권장 Lv.7+)',
      tidewreck: '조수에 잠긴 난파만. (권장 Lv.9+)',
      abysscove: '깊은 만. 물살이 무겁다. (권장 Lv.11+)',
      foothill: '바위 산기슭. 산 입문. (권장 Lv.13+)',
      frostpass: '바람 부는 서리고개. (권장 Lv.15+)',
      peakruin: '정상 폐허. 공기가 얇다. (권장 Lv.17+)',
    }
    return map[id] ?? z.description
  }
  return z.description
}

export function skillLabel(id: string): string {
  const s = SKILLS[id]
  if (!s) return id
  if (currentLang === 'ko') return SKILL_KO[id] ?? s.name
  return s.name
}

export function skillDesc(id: string): string {
  const s = SKILLS[id]
  if (!s) return ''
  if (currentLang === 'ko') {
    const map: Record<string, string> = {
      slash: '강한 일격. (MP 5)',
      focus: '집중 공격. (MP 8)',
      mend: '상처 회복. (MP 10)',
      bash: '강력한 강타. (MP 12)',
      tide_cut: '파도 베기. (MP 14)',
      avalanche: '산사태. (MP 18)',
    }
    return map[id] ?? s.description
  }
  return s.description
}

/** Full effect text shown once when a skill is unlocked. */
export function skillEffectDesc(id: string): string {
  if (currentLang === 'ko') {
    const map: Record<string, string> = {
      slash: '공격력 160% 피해 (MP 5)',
      focus: '공격력 130% + 4 피해 (MP 8)',
      mend: 'HP 35 회복 (MP 10)',
      bash: '공격력 200% 피해 (MP 12)',
      tide_cut: '공격력 185% + 6 피해 (MP 14)',
      avalanche: '공격력 230% 피해 (MP 18)',
    }
    return map[id] ?? skillDesc(id)
  }
  const map: Record<string, string> = {
    slash: '160% ATK damage (MP 5)',
    focus: '130% ATK + 4 damage (MP 8)',
    mend: 'heal 35 HP (MP 10)',
    bash: '200% ATK damage (MP 12)',
    tide_cut: '185% ATK + 6 damage (MP 14)',
    avalanche: '230% ATK damage (MP 18)',
  }
  return map[id] ?? skillDesc(id)
}

export function slotLabel(slot: EquipSlot): string {
  return currentLang === 'ko' ? SLOT_KO[slot] : SLOT_LABELS[slot]
}

export function parseLang(arg: string): Lang | null {
  const a = arg.trim().toLowerCase()
  if (a === 'en' || a === 'english' || a === 'eng') return 'en'
  if (a === 'ko' || a === 'kr' || a === 'korean' || a === '한국어' || a === '한글') return 'ko'
  return null
}

export function itemMatchesQuery(item: ItemDef, query: string): boolean {
  const raw = query.trim()
  const q = raw.toLowerCase()
  const dashed = item.id.replace(/_/g, '-')
  if (item.id === q || dashed === q || item.name.toLowerCase() === q || item.name === raw) {
    return true
  }
  const ko = ITEM_KO[item.id]
  return !!ko && (ko === raw || ko.toLowerCase() === q)
}

export function skillMatchesQuery(skillId: string, query: string): boolean {
  const s = SKILLS[skillId]
  if (!s) return false
  const raw = query.trim()
  const q = raw.toLowerCase()
  if (s.id === q || s.name.toLowerCase() === q || s.name === raw) return true
  const ko = SKILL_KO[skillId]
  return !!ko && (ko === raw || ko.toLowerCase() === q)
}
