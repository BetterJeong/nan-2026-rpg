# DevQuest — IDE Concept RPG

VS Code 스타일 UI에서 CLI 명령으로 진행하는 웹 RPG입니다.  
개발하는 척 몰래 게임을 즐겨보세요.

플레이: https://betterjeong.github.io/nan-2026-rpg/

---

## 게임 방법

### UI 구성

| 영역 | 역할 |
|------|------|
| 왼쪽 Explorer | 마을 / 상점 / 사냥터 / 퀵 커맨드 |
| 가운데 CLI | 실제 플레이 화면 (명령 입력) |
| 우측 Inspector | HP·장비·스킬·인벤·전투 대상 |
| CLI 상단 HUD | Lv / EXP / GOLD / 현재 위치(+전투중) · 좁으면 다음 줄에 HP / MP |
| 입력창 위 추천 칩 | 상황별 추천 명령 (탭하면 즉시 실행) |

모바일에서는 상단 **☰ Explorer / ℹ Inspector** 로 좌·우 패널을 드로어로 엽니다.  
추천 칩을 눌러 실행할 때는 키보드를 열지 않습니다 (직접 입력창을 터치하면 키보드 사용).

### 기본 진행 순서

1. `status` — 내 능력치 확인  
2. `go mistwood` — 사냥터 입장  
3. `hunt` — 탐색 (몬스터 / 아이템 / 골드)  
4. 전투 시 `attack` / `skill slash` / `defend` / `use hp-potion-s` / `flee`  
5. `go eldergrove` → `boss` — 숲 보스 클리어 → **바다 해금**  
6. 바다·산도 동일하게 상한 존에서 `boss` (바다→산 해금)  
7. `town` → `shop` — 포션·장비 구매 / 판매  
8. `equip …` — 장비 장착  
9. `save` — 진행 저장 (브라우저 localStorage)  
   - 기본 **5분마다 자동저장** (`autosave <분>` 으로 1~60분 변경 가능)

### 탐색 이벤트 (`hunt`)

| 확률 | 결과 |
|------|------|
| 80% | 몬스터 조우 → 턴제 전투 |
| 10% | 아이템 획득 |
| 10% | 골드 획득 |

### 전투

플레이어 1회 → 적 1회 번갈아 공격합니다.

| 명령 | 효과 |
|------|------|
| `attack` / `a` | 기본 공격 |
| `skill <name>` | 스킬 (MP 소모) |
| `defend` / `d` | 이번 적 공격 피해 50% |
| `use <potion>` | 소모품 사용 (턴 소비) |
| `flee` | 도망 (일반: 레벨 차 반영 / **보스: 성공률 매우 낮음**) |

패배 시 마을로 리스폰되며 **골드 20% 손실**, HP/MP는 **최대치의 50%**로 부활합니다.

### 보스

각 지역 **상한 존**에서만 `boss` (별칭 `challenge`)로 도전합니다.

| 존 | 보스 | 최초 클리어 효과 |
|----|------|------------------|
| `eldergrove` | `grove-guardian` | **바다** 지역 해금 |
| `abysscove` | `tide-leviathan` | **산** 지역 해금 |
| `peakruin` | `tyrant` | 클리어 메시지 (재도전 가능) |

- 보스는 일반 공격 외에 **스킬·회복**을 씀
- `flee` 성공률 **약 8%**
- 드롭 확률 **약 18~20%** (보스 전용 고급 장비)
- 재도전 가능. 게이트 해금은 **최초 1회**만 필요
- Explorer / `zones`에서 보스·게이트 잠금 상태를 확인 가능

보스 전용 드롭 예: `guardian-blade`, `grove-mantle`, `leviathan-fang`, `abyss-mail`, `tyrant-edge`, `summit-aegis`

### 마을 NPC · 호감도

마을(또는 상점)에서 **둘러보기 → 대화(2턴) → 답변 선택**으로 호감도를 올립니다.

| 명령 | 별칭 | 설명 |
|------|------|------|
| `lookaround` | `둘러보기`, `people`, `npcs`, `look around` | 지금 마을에 있는 사람 **랜덤 2~4명** 표시 |
| `talk <name>` | `npc`, `speak` | 목록에 있는 사람과 대화 (**둘러보기 1회당 1번**, 질문은 두 번) |
| `1` / `2` / `3` | `reply 1` 등 | 각 턴마다 답변 선택 |

**주민 6명**

| 이름 | 역할 |
|------|------|
| `mira` | 여관 주인 |
| `bram` | 상점 주인 |
| `rowan` | 떠돌이 모험가 |
| `lila` | 음유시인 |
| `kenji` | 대장장이 견습 |
| `sena` | 약초상 |

각 인물 **24개** 대화(호감 0:12 / 1~3:각 4), 대화마다 **2턴**. 호감이 오르면 더 개인적인 이야기가 열립니다.

**호감도**

| 단계 | 필요 점수(대략) | 선물 |
|------|-----------------|------|
| 1 | 15 | 포션 등 |
| 2 | 35 | 장비·포션 |
| 3 | 60 | 더 좋은 장비 |

좋은 답변은 호감↑. 세 선택지 모두 자연스러운 말투이며, NPC 성격에 맞는 답이 더 많이 오릅니다.  
호감·선물 기록은 세이브에 저장됩니다.

```text
town
lookaround
talk mira
2
1
lookaround
talk sena
3
2
```

### 회복

| 방법 | 효과 |
|------|------|
| `rest` (마을에서만) | HP/MP **풀 회복** |
| 전투 승리 | 최대치의 **약 12%** 소량 회복 (이미 풀이면 생략) |
| 레벨업 | HP/MP **풀 회복** (+ max 증가) |
| 포션 | `use mp-potion-s` 등 |

### 전체 명령어

CLI에 `help`를 입력해도 동일한 목록을 볼 수 있습니다.  
표의 **별칭**은 같은 동작을 하는 다른 입력입니다.

#### 이동

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `go <zone>` | `goto`, `move` | 사냥터로 이동. 레벨·보스 게이트 미달이면 입장 불가. 존 이름만 입력해도 이동됨 | KO: `go 안개숲` / EN: `go mistwood` |
| `hunt` | `explore`, `search` | 현재 사냥터 탐색 (몬스터 80% / 아이템 10% / 골드 10%) | `hunt` |
| `boss` | `challenge` | 지역 상한 존에서 보스 도전 (스킬 사용, 희귀 드롭). 최초 클리어 시 다음 지역 해금 | `boss` |
| `town` | `home` | 마을로 이동 | `town` |
| `lookaround` | `둘러보기`, `people`, `npcs`, `look around` | 마을에 있는 사람 목록 (매번 랜덤) | KO: `둘러보기` / EN: `lookaround` |
| `talk <name>` | `npc`, `speak` | 목록의 사람과 대화 (둘러보기당 1회) → `1`/`2`/`3` 답변 | KO: `talk 미라` / EN: `talk mira` |
| `rest` | `sleep`, `recover` | 마을에서 HP/MP 풀 회복 | `rest` |
| `cd ~` | `cd /`, `cd town` | 마을로 이동 (리눅스식) | `cd ~` |
| `cd <zone>` | — | `go`와 동일하게 사냥터 이동 | `cd thornpath` |
| `shop` | — | 상점 입장 (마을/상점에서만) | `shop` |
| `shop list` | `shop ls` | 상점 카탈로그 출력 | `shop list` |

#### 상태 / 정보

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `status` | `st`, `stat` | 레벨·HP/MP·ATK/DEF·장착 장비 전체 확인 | `status` |
| `inv` | `inventory`, `i` | 인벤토리와 판매가 확인 | `inv` |
| `skills` | — | 보유 스킬 / 미해금 스킬 목록 | `skills` |
| `skill <name>` | — | (비전투) 스킬 상세 설명 | `skill slash` |
| `look` | `ls`, `pwd` | 현재 위치와 가능한 행동 안내 | `look` |
| `zones` | `maps` | 사냥터 목록·입장 레벨·보스 게이트 상태 | `zones` |

#### 아이템 / 상점

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `equip <name>` | — | 인벤 장비를 해당 슬롯에 장착 (기존 장비는 인벤으로) | `equip wood-sword` |
| `unequip <slot>` | — | 슬롯 장비 해제 → 인벤으로 | `unequip weapon` |
| `use <name>` | — | 소모품 사용 (비전투·전투 모두 가능, 전투 시 턴 소비) | `use hp-potion-s` |
| `buy <name|#>` | — | 상점에서 구매. 이름 또는 목록 번호 (`buy 1`, `buy #3`) | `buy 1` / `buy hp-potion-m` |
| `sell <name> [n]` | — | 아이템 판매. 수량 생략 시 1개. 판매가 ≈ 정가의 1/3 | `sell cloth-cap 2` |

장비 슬롯: `helmet` `armor` `legs` `boots` `gloves` `weapon` `ring` `necklace`  
(한글 별칭도 인식: 모자, 상의, 하의, 신발, 장갑, 무기, 반지, 목걸이)

#### 전투 (전투 중에만)

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `attack` | `a`, `hit` | 기본 공격 | `attack` |
| `skill <name>` | `s`, `cast` | 스킬 사용 (MP 소모, 미해금/MP 부족 시 실패) | `skill slash` |
| `defend` | `d`, `guard` | 방어. 이번 적 공격 피해 절반 | `defend` |
| `use <name>` | — | 전투 중 소모품 사용 (턴 소비 후 적 공격) | `use mp-potion-s` |
| `flee` | `run`, `escape` | 도망. 실패하면 적 턴 진행. 보스전은 성공률 매우 낮음 | `flee` |

전투 중에도 `status`, `inv`, `skills`, `help`, `clear`, `history`, `save` 는 사용 가능합니다.  
(`save` 시 전투 상태는 저장되지 않음)

#### 시스템

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `help` | `?`, `man` | 전체 명령어 도움말 | `help` |
| `save` | — | 현재 상태를 localStorage에 저장. **자동 저장**도 동작 (기본 5분) | `save` |
| `load` | — | 저장 데이터 불러오기 | `load` |
| `autosave` | — | 현재 자동저장 간격 확인 | `autosave` |
| `autosave <min>` | — | 자동저장 간격 변경 (**1~60분**) | `autosave 10` |
| `theme <mode>` | — | 테마 변경 (`dark` / `light`) | `theme light` |
| `lang <en\|ko>` | `language`, `locale` | UI·메시지 언어 변경 (장소·둘러보기·이름은 언어에 맞춤) | `lang ko` |
| `fast on\|off` | `pace`, `speed` | 메시지 출력 속도 (기본 off = 천천히) | `fast on` |
| `fontsize <n>` | — | 터미널 글자 크기 (11–18) | `fontsize 14` |
| `inspector on\|off` | — | 우측 Inspector 표시 | `inspector off` |
| `hud on\|off` | — | 상단 HUD 표시 | `hud off` |
| `explorer compact\|normal` | — | 왼쪽 Explorer 좁게/기본 | `explorer compact` |
| `hints on\|off` | `combathints` | 전투 시작 시 명령 힌트 | `hints off` |
| `settings` | `preferences`, `config` | 설정 UI 열기 (선택 사항) | `settings` |
| `settings close` | — | 설정 UI 닫고 터미널로 | `settings close` |
| `settings list` | — | 현재 설정 값 출력 | `settings list` |
| `settings reset` | — | 설정 기본값 복구 | `settings reset` |
| `clear` | `cls` | CLI 화면 지우기 | `clear` |
| `history` | — | 최근 입력 명령 기록 보기 (↑/↓ 키로도 재입력 가능) | `history` |
| `reset` | — | 새 게임 시작. 저장 파일은 삭제되지 않음 (덮어쓰려면 `save`) | `reset` |

### 추천 명령 칩

입력창 **바로 위**에 현재 상황에 맞는 명령이 칩으로 뜹니다. 탭하면 바로 실행됩니다.

| 상황 | 추천 예 |
|------|---------|
| 마을 | `둘러보기`/`lookaround`, `talk …`, `rest`, `shop`, `go 안개숲`/`go mistwood` … |
| 사냥터 | `hunt`, `town`, (`boss` 상한 존), `status`, `inv` … |
| 상점 | `shop list`, `buy 1`, `town` … |
| 전투 | `attack`, `skill slash`, `defend`, `use …`, `flee` |
| `inv` 직후 | 가방 장비에 대해 `equip wood-sword` 등 |
| 첫 방문 | `한국어` / `English` 언어 선택 칩 |

### 메시지 출력 속도 (페이싱)

명령 결과를 **한 줄씩** 보여 주며, 종류에 따라 딜레이가 다릅니다 (전투·탐색이 더 김).  
출력 중에는 입력·칩이 잠깐 잠깁니다.

| 모드 | 설정 | 설명 |
|------|------|------|
| 기본 | `fast off` | 천천히 (기본값) |
| Fast | `fast on` | 빠른 출력 |

설정 UI: Game → Fast Mode

### 설정

설정은 **CLI 명령이 기본**이고, VS Code 스타일 설정 화면은 **같은 값을 바꾸는 추가 UI**입니다.  
둘 중 어디로 바꿔도 `localStorage`에 동일하게 저장됩니다.

#### CLI로 전부 설정 (설정 화면 없이도 OK)

| 명령 | 설명 | 예시 |
|------|------|------|
| `theme dark\|light` | 다크/라이트 모드 | `theme light` |
| `lang en\|ko` | 한국어/영어 메시지·UI (장소·둘러보기·이름은 언어에 맞춤) | `lang ko` |
| `autosave [1-60]` | 자동저장 간격(분) 확인/변경 | `autosave 10` |
| `fontsize [11-18]` | 터미널 폰트 크기 | `fontsize 14` |
| `inspector on\|off` | 우측 Inspector 표시 | `inspector off` |
| `hud on\|off` | 상단 HUD 표시 | `hud off` |
| `explorer compact\|normal` | 왼쪽 탐색기 좁게/기본 | `explorer compact` |
| `hints on\|off` | 전투 시작 시 명령 힌트 | `hints off` |
| `fast on\|off` | 메시지 출력 속도 (on = 빠르게, 기본 off = 천천히) | `fast on` |
| `settings list` | 현재 설정 값 출력 | `settings list` |
| `settings reset` | 설정 기본값 복구 | `settings reset` |

#### 설정 화면 (추가 진입점)

| 여는 방법 | 설명 |
|-----------|------|
| 왼쪽 ⚙️ | Settings 뷰 |
| Explorer → `settings` | 동일 |
| `settings` / `preferences` / `config` | CLI로 UI 열기 |
| `settings close` | 터미널 뷰로 복귀 |
| 탭 `settings.json` | 설정 탭 |

설정 화면이 열려 있어도 **아래 CLI 입력창은 그대로** 쓸 수 있습니다.

설정 저장 키: `nan-2026-rpg-settings`

### 언어 (한국어 / 영어)

메시지·UI·아이템/몬스터 **표시 이름**만 바뀌고, **명령어는 항상 영어**입니다 (`go`, `hunt`, `buy` 등).

| 방법 | 예시 |
|------|------|
| CLI | `lang ko` / `lang en` |
| 설정 UI | Appearance → Language |
| 추천 칩 (첫 방문) | `한국어` / `English` 탭 |
| 영문 아이템 명령 | `buy hp-potion-s` (한국어 UI에서도 동일) |

기본값은 **브라우저 언어**입니다 (한국어 브라우저 → `ko`).  
첫 방문 시 입력창 위에 **한국어 / English** 칩이 먼저 뜨고, 한 번 고르면 사라집니다. 선택값은 설정에 저장됩니다.

### 저장 / 자동저장

| 구분 | 키 | 내용 |
|------|-----|------|
| 게임 세이브 | `nan-2026-rpg-save` | 레벨, HP/MP, 골드, 인벤, 장비, 위치, 보스 클리어, **NPC 호감·선물** 등 |
| 설정 | `nan-2026-rpg-settings` | 테마, 언어, fast, HUD, autosave 간격 등 |
| 자동저장 간격 (레거시) | `nan-2026-rpg-autosave-min` | 분 단위 (설정으로도 저장됨) |

#### 수동 저장

| 명령 | 설명 |
|------|------|
| `save` | 지금 상태를 즉시 저장 |
| `load` | 저장된 상태 불러오기 |

- 전투 중 `save` 해도 **전투 상태는 저장되지 않음** (위치·스탯·인벤만 유지)
- 같은 브라우저·같은 사이트에서만 유지됨 (시크릿 모드/저장소 삭제 시 사라짐)

#### 자동저장

| 항목 | 값 |
|------|-----|
| 기본 간격 | **5분** |
| 변경 가능 범위 | **1분 ~ 60분 (1시간)** |
| 동작 | 타이머마다 `save`와 동일하게 localStorage에 기록 |
| CLI 알림 | `autosave: game saved. (localStorage)` |

```text
autosave        # 현재 간격 확인
autosave 10     # 10분마다 자동저장
autosave 1      # 최소 1분
autosave 60     # 최대 1시간
```

간격 설정은 게임 세이브와 **별도로** 저장되므로, `reset`을 해도 자동저장 주기는 유지됩니다.

---

## 개발 / 테스트 (히든 명령)

`help`·추천 칩에는 **나오지 않는** 어드민용 로드아웃입니다. 밸런스·보스·게이트 확인용.

### 명령

```text
hellothisistestforadmin
```

전투 중이어도 동작합니다. 입력 즉시 테스트 상태로 덮어씁니다.

### 적용되는 상태

| 항목 | 값 |
|------|-----|
| Level | 19 |
| Gold | 5000 |
| 스킬 | 해금 가능한 전체 |
| 보스 게이트 | 숲·바다 보스 클리어됨 → **전 지역 입장 가능** |
| 장비 | 정상급 풀세트 장착 (`tyrant-edge` 등) |
| 인벤 | 대/중 포션 + 보스·산악 장비 여분 |
| 위치 | `town` |
| 세이브 | **자동 저장 안 함** — 유지하려면 `save` |

최종 보스(`tyrant`)는 아직 클리어하지 않은 상태라 `go peakruin` → `boss`로 바로 시험할 수 있습니다.

### 추천 테스트 플로우

```text
hellothisistestforadmin
lang ko
fast on
go peakruin
boss
```

다른 구간 확인 예:

| 목적 | 명령 |
|------|------|
| 바다 사냥 | `go saltshore` → `hunt` |
| 바다 보스 | `go abysscove` → `boss` |
| 산 입문 | `go foothill` → `hunt` |
| 최종 보스 | `go peakruin` → `boss` |
| 게이트 목록 | `zones` |
| 원래 세이브로 복귀 | `load` (미리 저장해 둔 경우) |
| 새 게임 | `reset` |

> 데모/제출용 영상에는 이 명령을 쓰지 말고, 일반 플레이 흐름으로 찍는 것을 권장합니다.

---

## 로컬 실행

```bash
npm install
npm run dev
```

빌드 / GitHub Pages용:

```bash
npm run build
```

`vite` base는 `./` (상대 경로)라서 Pages 하위 경로에서도 동작합니다.

---

## 밸런스

초기 개발용 **초저렙** 기준입니다. 수치는 `src/game/data/` 와 `player.ts` 에 정의되어 있습니다.

### 플레이어 시작

| 항목 | 값 |
|------|----|
| Level | 1 |
| ATK / DEF | 5 / 5 |
| HP / MP | 50 / 30 |
| Gold | 50 |
| 시작 아이템 | `hp-potion-s` ×3, `mp-potion-s` ×2 |
| 시작 스킬 | `slash` |

### 레벨업

필요 EXP: `floor(20 + (Lv-1)×18 + (Lv-1)^1.5 × 4)`  
예: Lv1→2 = 20, 이후 완만히 증가

레벨업마다:

| 스탯 | 증가 |
|------|------|
| base ATK | +2 |
| base DEF | +1 |
| max HP | +10 |
| max MP | +5 |
| HP / MP | 완전 회복 |

### 스킬 해금

| 스킬 | Lv | MP | 효과 |
|------|----|----|------|
| `slash` | 1 | 5 | ATK ×160% |
| `mend` | 2 | 10 | HP +35 |
| `focus` | 3 | 8 | ATK ×130% + 4 |
| `bash` | 5 | 12 | ATK ×200% |
| `tide-cut` | 8 | 14 | ATK ×185% + 6 |
| `avalanche` | 13 | 18 | ATK ×230% |

### 사냥터 (3난이도 × 3존 = 9) + 보스 게이트

진행: **숲 → (eldergrove `boss`) → 바다 → (abysscove `boss`) → 산 → (peakruin `boss`)**

| Region | Zone | 입장 | 대표 몬스터 / 보스 |
|--------|------|------|-------------|
| Forest | `mistwood` | Lv.1+ | slime, forest-bug, wolf-pup |
| Forest | `thornpath` | Lv.3+ | wild-boar, goblin, forest-spider |
| Forest | `eldergrove` | Lv.5+ | elder-wolf, treant… / **보스 `grove-guardian`** |
| Sea | `saltshore` | Lv.7+ **+숲보스** | shore-crab, salt-slime, pirate-rat |
| Sea | `tidewreck` | Lv.9+ **+숲보스** | reef-shark, drowned-sailor |
| Sea | `abysscove` | Lv.11+ **+숲보스** | kraken-spawn / **보스 `tide-leviathan`** |
| Mountain | `foothill` | Lv.13+ **+바다보스** | cliff-goat, ice-bat, frost-wolf |
| Mountain | `frostpass` | Lv.15+ **+바다보스** | cliff-golem, storm-eagle |
| Mountain | `peakruin` | Lv.17+ **+바다보스** | peak-wraith / **보스 `tyrant`** |

레거시 별칭: `forest1`→mistwood, `forest2`→thornpath, `forest3`→eldergrove (한글: 안개숲/가시길/고목숲 등)

일반 몬스터는 존이 올라갈수록 HP/ATK/DEF·보상이 증가합니다 (보스가 지역 정점).  
일반 드롭률 대략 **25~40%**, 보스 드롭은 **약 18~20%** (고급 장비).

### 보스 요약

| ID | 대략 Lv | 드롭 예 | 게이트 |
|----|---------|---------|--------|
| `grove_guardian` | 7 | `guardian-blade`, `grove-mantle` | → Sea |
| `tide_leviathan` | 13 | `leviathan-fang`, `abyss-mail` | → Mountain |
| `tyrant` | 19 | `tyrant-edge`, `summit-aegis` | (최종) |

### 데미지 공식

```text
raw = ATK - DEF × 0.5
damage = max(1, floor(raw × (1 ± 15%)))
```

스킬은 ATK에 `power` / `bonus`를 적용한 뒤 같은 공식을 씁니다.

### 장비 / 상점

- 장비 슬롯: helmet, armor, legs, boots, gloves, weapon, ring, necklace  
- 소모품 가격은 회복량에 비례  
  - `hp-potion-s` 25G / +30 HP  
  - `hp-potion-m` 60G / +70 HP  
  - `hp-potion-l` 90G / +120 HP  
  - `mp-potion-s` 20G / +20 MP  
  - `mp-potion-m` 50G / +45 MP  
  - `mp-potion-l` 75G / +70 MP  
- **판매가** = 정가가 있으면 `floor(정가 / 3)`, 드롭 전용은 낮은 `sellPrice`
