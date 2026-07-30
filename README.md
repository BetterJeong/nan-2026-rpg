# DevQuest — IDE Concept RPG

Visual Studio Code 스타일 UI에서 CLI 명령으로 진행하는 웹 RPG입니다.

## 기술 스택

- **TypeScript** + **Vite** — 타입 안전성과 GitHub Pages 정적 배포에 적합
- 빌드 결과물(`dist`)만 배포하면 되므로 유지보수가 단순합니다

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## GitHub Pages

`main` 브랜치에 push하면 Actions가 자동 배포합니다.

저장소 Settings → Pages → Source를 **GitHub Actions**로 설정하세요.

`vite.config.ts`의 `base`가 리포지토리 경로(`/nan-2026-rpg/`)와 일치해야 합니다.

## 주요 명령어

| 명령 | 설명 |
|------|------|
| `help` | 전체 명령어 |
| `go 숲1` | 사냥터 이동 |
| `hunt` | 탐색 (몬스터/아이템/골드) |
| `attack` / `skill` / `defend` / `use` / `flee` | 전투 |
| `shop` / `buy` / `sell` | 상점 |
| `equip` / `use` / `status` / `inv` | 장비·상태 |
| `save` / `load` / `clear` / `history` | 시스템 |
