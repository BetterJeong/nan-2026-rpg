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
| CLI 상단 HUD | Lv / HP / MP / EXP / GOLD |

### 기본 진행 순서

1. `status` — 내 능력치 확인  
2. `go forest1` — 사냥터 입장  
3. `hunt` — 탐색 (몬스터 / 아이템 / 골드)  
4. 전투 시 `attack` / `skill slash` / `defend` / `use hp-potion-s` / `flee`  
5. `town` → `shop` — 포션·장비 구매 / 판매  
6. `equip wood-sword` — 장비 장착  
7. `save` — 진행 저장 (브라우저 localStorage)

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
| `flee` | 도망 (레벨 차에 따라 성공률 변동) |

패배 시 마을로 리스폰되며 **골드 20% 손실**, HP/MP 일부만 회복됩니다.

### 전체 명령어

CLI에 `help`를 입력해도 동일한 목록을 볼 수 있습니다.  
표의 **별칭**은 같은 동작을 하는 다른 입력입니다.

#### 이동

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `go <zone>` | `goto`, `move` | 사냥터로 이동. 레벨 조건 미달이면 입장 불가. 존 이름만 입력해도 이동됨 | `go forest1` / `숲1` |
| `hunt` | `explore`, `search` | 현재 사냥터 탐색 (몬스터 80% / 아이템 10% / 골드 10%) | `hunt` |
| `town` | `home` | 마을로 이동 | `town` |
| `cd ~` | `cd /`, `cd town` | 마을로 이동 (리눅스식) | `cd ~` |
| `cd <zone>` | — | `go`와 동일하게 사냥터 이동 | `cd forest2` |
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
| `zones` | `maps` | 사냥터 목록과 입장 레벨 | `zones` |

#### 아이템 / 상점

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `equip <name>` | — | 인벤 장비를 해당 슬롯에 장착 (기존 장비는 인벤으로) | `equip wood-sword` |
| `unequip <slot>` | — | 슬롯 장비 해제 → 인벤으로 | `unequip weapon` |
| `use <name>` | — | 소모품 사용 (비전투·전투 모두 가능, 전투 시 턴 소비) | `use hp-potion-s` |
| `buy <name>` | — | 상점에서 구매 (마을/상점, 골드 필요) | `buy hp-potion-m` |
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
| `flee` | `run`, `escape` | 도망. 실패하면 적 턴 진행. 레벨 차에 따라 성공률 변동 | `flee` |

전투 중에도 `status`, `inv`, `skills`, `help`, `clear`, `history`, `save` 는 사용 가능합니다.  
(`save` 시 전투 상태는 저장되지 않음)

#### 시스템

| 명령 | 별칭 | 설명 | 예시 |
|------|------|------|------|
| `help` | `?`, `man` | 전체 명령어 도움말 | `help` |
| `save` | — | 현재 상태를 localStorage에 저장 | `save` |
| `load` | — | 저장 데이터 불러오기 | `load` |
| `clear` | `cls` | CLI 화면 지우기 | `clear` |
| `history` | — | 최근 입력 명령 기록 보기 (↑/↓ 키로도 재입력 가능) | `history` |
| `reset` | — | 새 게임 시작. 저장 파일은 삭제되지 않음 (덮어쓰려면 `save`) | `reset` |

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

### 사냥터

| Zone | 입장 | 대표 몬스터 | 권장 |
|------|------|-------------|------|
| `forest1` | Lv.1+ | slime, forest-bug, wolf-pup | 시작 구간 |
| `forest2` | Lv.3+ | wild-boar, goblin, forest-spider | 중반 |
| `forest3` | Lv.5+ | elder-wolf, treant-sapling | 초저렙 상한 |

몬스터는 대략 **ATK ≈ 플레이어 동레벨 체감 기준 약간 위협**, DEF/HP는 존이 올라갈수록 증가합니다.  
드롭률은 대략 **25~36%**.

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
  - `mp-potion-s` 20G / +20 MP  
  - `mp-potion-m` 50G / +45 MP  
- **판매가** = 정가가 있으면 `floor(정가 / 3)`, 드롭 전용은 낮은 `sellPrice`
