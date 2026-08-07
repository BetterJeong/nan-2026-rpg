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
  'help.body': `available commands
────────────────────────
[travel]
  go <zone>       enter a hunting zone (e.g. go mistwood)
  hunt / explore  search current zone
  boss / challenge  fight region boss (apex zones)
  lookaround      see who is in town (random each time)
  talk <name>     talk (1 chat / lookaround, 2 turns) then 1|2|3
  npcs            same as lookaround
  town / cd ~     return to town
  shop            enter shop
  rest            full HP/MP recover (town only)

[status]
  status / st     stats + equipment
  inv / inventory inventory
  skills          known skills
  look / ls       current location
  zones           list hunting zones
  name / rename   change nickname (once per local day)

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
  save / load     save or load game
  lang <en|ko>    language (commands stay English)
  settings        open settings UI
  theme <mode>    dark | light
  fontsize <n>    terminal font size
  inspector on|off
  hud on|off
  explorer compact|normal
  hints on|off
  fast on|off     faster message pacing (default: off = slower)
  autosave [min]  autosave interval (1-60)
  clear / cls     clear screen
  history         command history
  reset           new game (keeps save file)`,

  'welcome.title': 'DevQuest — Terminal RPG',
  'welcome.hint': 'start: go mistwood → hunt → eldergrove boss  (or tap chips)',
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
  'err.usage.name': 'usage: name <new>  (2-12 chars, no spaces, once per day)',
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
  'ok.adminTest': 'admin test loadout applied. (not saved until you type save)',
  'ok.adminTestHint': 'Lv.19 · gates open · peak gear · go peakruin → boss  |  or go saltshore / foothill',
  'ok.town': 'moved to town. try: lookaround | shop | rest | go mistwood',
  'ok.townShort': 'moved to town.',
  'ok.talkHint': 'usage: talk <name>  (someone from lookaround)',
  'ok.rest': 'rested. HP {hp}/{maxHp} | MP {mp}/{maxMp}',
  'ok.restAlready': 'already at full HP/MP.',
  'ok.shopEnter': 'entered shop.',
  'ok.arrived': 'arrived: {zone} — {desc}',
    'ok.bossHint': 'hint: type boss to challenge the region guardian',
'ok.huntHint': 'hint: type hunt (or explore) to search',
  'ok.bought': 'bought {item} -{price}G (balance {gold}G)',
  'ok.sold': 'sold {item} x{qty} +{total}G (unit {unit}G, balance {gold}G)',
  'ok.victory': 'victory. continue with hunt',
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
  'info.name': 'nickname: {name}\nusage: name <new>  (once per day)',
  'ok.fast': 'fast mode {state}',
  'ok.lootItem': 'found item: {item}',
  'ok.lootGold': 'found gold pouch: +{gold}G (wallet {total}G)',

  'combat.cmds': 'cmds: attack | skill <name> | defend | use <potion> | flee',
  'combat.help': 'combat: attack(a) | skill <name> | defend(d) | use <potion> | flee | status | inv',
  'combat.saveNote': '(combat state is not saved)',
    'combat.appearBoss': 'BOSS {name} (Lv.{level}) appears!',
'combat.appear': 'A wild {name} (Lv.{level}) appears!',
  'combat.attack': 'attack -> {name} took {dmg} dmg. (HP {hp}/{max})',
  'combat.skillDmg': '{skill}! {name} took {dmg} dmg. (MP -{mp}, HP {hp}/{max})',
  'combat.skillHeal': '{skill}! HP {before} -> {after} (MP -{mp})',
  'combat.defend': 'defend: incoming damage halved this turn',
  'combat.fleeOk': 'flee: success',
    'combat.fleeFailBoss': 'flee: failed (boss blocks escape)',
'combat.fleeFail': 'flee: failed',
  'combat.hitGuard': '(guard) {name} hits for {dmg}',
    'combat.bossSkill': '{name} casts {skill}! you take {dmg}',
  'combat.bossSkillGuard': '(guard) {name} casts {skill}! you take {dmg}',
  'combat.bossHeal': '{name} uses {skill}! healed {heal} (HP {hp}/{max})',
  'combat.bossUnlockSea': 'SEA region unlocked — go saltshore',
  'combat.bossUnlockMountain': 'MOUNTAIN region unlocked — go foothill',
  'combat.bossClearPeak': 'Tyrant fallen. The summit is yours.',
  'combat.bossRechallenge': 'boss already cleared — gate stays open',
'combat.hit': '{name} hits for {dmg}',
  'combat.yourHp': 'your HP {hp}/{max}',
  'combat.dead': 'you were defeated... respawning in town (lost 20% gold)',
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
  'player.skillUnlock': 'skill unlocked: {skill}',
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
  'look.town': 'town — safe hub.\n  lookaround | talk <name> | shop | rest | go mistwood',
  'look.shop': 'shop — buy <name|#> / sell / shop list.\n  lookaround | town to leave.',
  'look.bossHint': '  boss — challenge the region guardian',
  'look.zone': '{zone} — {desc}\n  hunt to search | town to return',
  'look.pwd': 'pwd: {loc}',
  'npc.lookHead': 'people around town (this visit)',
  'npc.lookLine': '  {name} — {title}  |  affinity Lv.{stage} ({score})',
  'npc.lookFoot': 'talk <name> once, then reply with 1 | 2 | 3',
  'npc.chooseHead': 'choose your reply:',
  'npc.choiceLine': '  {n}. {text}',
  'npc.chooseFoot': 'type 1 / 2 / 3 — or paste the reply text',
  'npc.youSaid': 'you: {text}',
  'npc.reactGood': '{name} seems pleased. (affinity +{delta})',
  'npc.reactOk': '{name} nods. (affinity +{delta})',
  'npc.reactBad': '{name} looks awkward. (affinity {delta})',
  'npc.reactFlat': '{name} stays quiet.',
  'npc.affinityNow': '{name} affinity: {score} (stage {stage}/3)',
  'npc.gift': 'gift from {name} (stage {stage})! {item} x{qty}',
  'npc.talkDone': 'conversation over (2 turns). lookaround again to chat more.',
  'zones.head': 'zones',
  'zones.line': '  [{ok}] {name}  (Lv.{level}+) — {desc}',
  'zones.ok': 'ok',
    'zones.needBoss': '  [need: {boss}]',
  'zones.bossAvail': '  [boss ready]',
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
  'ui.placeholder': 'type help to see commands',
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
  'ui.combatHintsDesc': 'Print combat command hints when a battle starts',
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
  'help.body': `사용 가능 명령어
────────────────────────
[이동]
  go <장소>       사냥터 이동 (예: go 안개숲)
  hunt / explore  현재 사냥터 탐색
  boss / challenge  지역 보스 도전 (상한 존)
  둘러보기        마을에 있는 사람 (매번 랜덤)  ※ lookaround 도 가능
  talk <이름>     대화 (둘러보기당 1번·2턴) 후 1|2|3
  npcs            둘러보기와 동일
  town / cd ~     마을로 이동
  shop            상점 입장
  rest            HP/MP 풀 회복 (마을에서만)

[상태]
  status / st     능력치·장비 확인
  inv / inventory 인벤토리
  skills          보유 스킬
  look / ls       현재 위치
  zones           사냥터 목록
  name / 닉네임   닉네임 변경 (로컬 날짜 기준 하루 1회)

[아이템]
  equip <name>    장비 장착
  unequip <slot>  장비 해제
  use <name>      소모품 사용
  buy <name|#>    상점 구매 (이름 또는 번호)
  sell <name> [n] 판매 (기본 1개)
  shop list       상점 목록

[전투] (전투 중)
  attack / a      기본 공격
  skill <name>    스킬
  defend / d      방어
  use <potion>    소모품
  flee            도망

[시스템]
  help            이 도움말
  save / load     저장 / 불러오기
  lang <en|ko>    언어 변경 (장소·둘러보기 등은 언어에 맞춤)
  settings        설정 화면
  theme <mode>    dark | light
  fontsize <n>    터미널 글자 크기
  inspector on|off
  hud on|off
  explorer compact|normal
  hints on|off
  fast on|off     메시지 출력 빠르게 (기본 off = 천천히)
  autosave [min]  자동저장 간격 (1-60분)
  clear / cls     화면 지우기
  history         명령 기록
  reset           새 게임 (세이브 파일 유지)`,

  'welcome.title': 'DevQuest — Terminal RPG',
  'welcome.hint': '시작: go 안개숲 → hunt → 고목숲 에서 boss',
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
  'err.usage.name': 'usage: name <새이름>  (2~12자, 공백 불가, 하루 1회)',
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
  'ok.adminTest': '어드민 테스트 로드아웃 적용. (save 하기 전까지 저장 안 됨)',
  'ok.adminTestHint': 'Lv.19 · 게이트 개방 · 정상급 장비 · go 정상폐허 → boss  |  go 소금해안 / 산기슭',
  'ok.town': '마을로 이동. 둘러보기 | shop | rest | go 안개숲',
  'ok.townShort': '마을로 이동했습니다.',
  'ok.talkHint': 'usage: talk <이름>  (둘러보기 목록에 있는 사람)',
  'ok.rest': '휴식 완료. HP {hp}/{maxHp} | MP {mp}/{maxMp}',
  'ok.restAlready': '이미 HP/MP가 가득입니다.',
  'ok.shopEnter': '상점에 입장했습니다.',
  'ok.arrived': '도착: {zone} — {desc}',
    'ok.bossHint': '힌트: boss 로 지역 수호자에게 도전',
'ok.huntHint': '탐색하려면 hunt (또는 explore)',
  'ok.bought': '{item} 구매 -{price}G (잔액 {gold}G)',
  'ok.sold': '{item} x{qty} 판매 +{total}G (단가 {unit}G, 잔액 {gold}G)',
  'ok.victory': '전투 승리! 계속하려면 hunt',
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
  'info.name': '닉네임: {name}\nusage: name <새이름>  (하루 1회)',
  'ok.fast': '빠른 모드 {state}',
  'ok.lootItem': '아이템 획득: {item}',
  'ok.lootGold': '골드 획득: +{gold}G (보유 {total}G)',

  'combat.cmds': '명령: attack | skill <name> | defend | use <potion> | flee',
  'combat.help': '전투: attack(a) | skill <name> | defend(d) | use <potion> | flee | status | inv',
  'combat.saveNote': '(전투 상태는 저장되지 않습니다)',
    'combat.appearBoss': '보스 {name} (Lv.{level}) 출현!',
'combat.appear': '야생의 {name} (Lv.{level}) 출현!',
  'combat.attack': '공격 -> {name}에게 {dmg} 피해. (HP {hp}/{max})',
  'combat.skillDmg': '{skill}! {name}에게 {dmg} 피해. (MP -{mp}, HP {hp}/{max})',
  'combat.skillHeal': '{skill}! HP {before} -> {after} (MP -{mp})',
  'combat.defend': '방어: 이번 적 공격 피해 절반',
  'combat.fleeOk': '도망 성공',
    'combat.fleeFailBoss': '도망 실패 (보스가 길을 막음)',
'combat.fleeFail': '도망 실패',
  'combat.hitGuard': '(방어) {name}의 공격 {dmg}',
    'combat.bossSkill': '{name}의 {skill}! {dmg} 피해',
  'combat.bossSkillGuard': '(방어) {name}의 {skill}! {dmg} 피해',
  'combat.bossHeal': '{name}의 {skill}! {heal} 회복 (HP {hp}/{max})',
  'combat.bossUnlockSea': '바다 지역 해금 — go saltshore',
  'combat.bossUnlockMountain': '산 지역 해금 — go foothill',
  'combat.bossClearPeak': '타이런트를 쓰러뜨렸다. 정상이 열렸다.',
  'combat.bossRechallenge': '이미 클리어한 보스 — 게이트는 열린 상태',
'combat.hit': '{name}의 공격 {dmg}',
  'combat.yourHp': '내 HP {hp}/{max}',
  'combat.dead': '쓰러졌습니다... 마을에서 부활 (골드 20% 손실)',
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
  'player.skillUnlock': '스킬 해금: {skill}',
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
  'look.town': '마을 — 안전한 거점.\n  둘러보기 | talk <이름> | shop | rest | go 안개숲',
  'look.shop': '상점 — buy <이름|#> / sell / shop list.\n  둘러보기 | town 으로 나가기.',
  'look.bossHint': '  boss — 지역 수호자에게 도전',
  'look.zone': '{zone} — {desc}\n  hunt 로 탐색 | town 으로 귀환',
  'look.pwd': '위치: {loc}',
  'npc.lookHead': '지금 마을에 있는 사람들',
  'npc.lookLine': '  {name} — {title}  |  호감 Lv.{stage} ({score})',
  'npc.lookFoot': 'talk <이름> 한 번 → 답변은 1 | 2 | 3',
  'npc.chooseHead': '답변을 고르세요:',
  'npc.choiceLine': '  {n}. {text}',
  'npc.chooseFoot': '1 / 2 / 3 또는 선택지 내용 입력',
  'npc.youSaid': '나: {text}',
  'npc.reactGood': '{name} 표정이 밝아졌어요. (호감 +{delta})',
  'npc.reactOk': '{name} 이(가) 고개를 끄덕입니다. (호감 +{delta})',
  'npc.reactBad': '{name} 분위기가 어색해졌어요. (호감 {delta})',
  'npc.reactFlat': '{name} 반응이 덤덤합니다.',
  'npc.affinityNow': '{name} 호감도: {score} (단계 {stage}/3)',
  'npc.gift': '{name} 의 선물 (호감 {stage}단계)! {item} x{qty}',
  'npc.talkDone': '대화 종료 (2턴). 다시 대화하려면 둘러보기',
  'zones.head': '사냥터',
  'zones.line': '  [{ok}] {name}  (Lv.{level}+) — {desc}',
  'zones.ok': '가능',
    'zones.needBoss': '  [필요: {boss}]',
  'zones.bossAvail': '  [보스 가능]',
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
  'ui.placeholder': 'help 입력으로 명령어 보기',
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
  'ui.combatHintsDesc': '전투 시작 시 명령 안내 출력',
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
      eldergrove: '고목이 우거진 숲. 숲 상한 — boss 로 도전. (권장 Lv.5+)',
      saltshore: '소금 냄새 나는 해변. 바다 입문. (권장 Lv.7+)',
      tidewreck: '조수에 잠긴 난파만. (권장 Lv.9+)',
      abysscove: '깊은 만. 바다 상한 — boss 로 도전. (권장 Lv.11+)',
      foothill: '바위 산기슭. 산 입문. (권장 Lv.13+)',
      frostpass: '바람 부는 서리고개. (권장 Lv.15+)',
      peakruin: '정상 폐허. 산 상한 — boss 로 도전. (권장 Lv.17+)',
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
      slash: '강한 일격. 공격력 160% 피해. (MP 5)',
      focus: '집중 공격. 공격력 130% + 4 피해. (MP 8)',
      mend: '상처 회복. HP 35 회복. (MP 10)',
      bash: '강력한 강타. 공격력 200% 피해. (MP 12)',
      tide_cut: '파도 베기. 공격력 185% + 6. (MP 14)',
      avalanche: '산사태. 공격력 230% 피해. (MP 18)',
    }
    return map[id] ?? s.description
  }
  return s.description
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
