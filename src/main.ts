import './style.css'
import { ZONES, MONSTERS, SKILLS } from './game/data/content'
import { getItem } from './game/data/items'
import { handleCommand, welcome, getHud } from './game/commands'
import { createInitialState } from './game/save'
import { getTotalAtk, getTotalDef, getEffectiveMaxHp, getEffectiveMaxMp } from './game/player'
import { SLOT_LABELS, SLOT_ORDER } from './game/types'
import type { GameState } from './game/types'

let state: GameState = createInitialState()
let historyIndex = -1
let draft = ''

const app = document.querySelector<HTMLDivElement>('#app')!

function renderShell(): void {
  app.innerHTML = `
    <div class="titlebar">
      <div class="titlebar-dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="titlebar-title">DevQuest — nan-2026-rpg — terminal.rpg</div>
    </div>
    <div class="workspace">
      <nav class="activity" aria-label="Activity Bar">
        <div class="activity-btn active" title="Explorer">📁</div>
        <div class="activity-btn" title="Search">🔍</div>
        <div class="activity-btn" title="Source Control">⑂</div>
        <div class="activity-btn" title="Extensions">▦</div>
      </nav>
      <aside class="explorer" id="explorer"></aside>
      <main class="editor">
        <div class="tabbar">
          <div class="tab active"><span class="dot"></span> terminal.rpg</div>
          <div class="tab">readme.md</div>
        </div>
        <div class="cli-hud" id="hud"></div>
        <div class="terminal" id="terminal"></div>
        <div class="cli-input-row">
          <span class="cli-prompt" id="prompt">player@town:~$</span>
          <input class="cli-input" id="cli" type="text" autocomplete="off" spellcheck="false"
            placeholder="명령어 입력 (help)" autofocus />
        </div>
      </main>
      <aside class="inspector" id="inspector"></aside>
    </div>
    <footer class="statusbar">
      <div class="statusbar-left">
        <span>⎇ main*</span>
        <span id="sb-loc">마을</span>
      </div>
      <div class="statusbar-right">
        <span>UTF-8</span>
        <span>TypeScript RPG</span>
        <span>Ln 1, Col 1</span>
      </div>
    </footer>
  `

  const cli = document.querySelector<HTMLInputElement>('#cli')!
  cli.addEventListener('keydown', onKeyDown)

  // Explorer 클릭으로 이동
  document.querySelector('#explorer')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('.tree-item') as HTMLElement | null
    if (!t || t.classList.contains('locked')) return
    const cmd = t.dataset.cmd
    if (cmd) runCommand(cmd)
  })
}

function onKeyDown(e: KeyboardEvent): void {
  const cli = e.target as HTMLInputElement
  if (e.key === 'Enter') {
    const value = cli.value
    cli.value = ''
    historyIndex = -1
    draft = ''
    runCommand(value)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!state.history.length) return
    if (historyIndex === -1) draft = cli.value
    historyIndex = Math.min(state.history.length - 1, historyIndex + 1)
    cli.value = state.history[state.history.length - 1 - historyIndex]
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex <= 0) {
      historyIndex = -1
      cli.value = draft
      return
    }
    historyIndex -= 1
    cli.value = state.history[state.history.length - 1 - historyIndex]
  } else if (e.key === 'Tab') {
    e.preventDefault()
  }
}

function runCommand(raw: string): void {
  handleCommand(state, raw)
  refresh()
}

function refresh(): void {
  renderHud()
  renderTerminal()
  renderExplorer()
  renderInspector()
  updatePrompt()
  const sb = document.querySelector('#sb-loc')
  if (sb) sb.textContent = getHud(state).location
}

function renderHud(): void {
  const h = getHud(state)
  const hpPct = Math.max(0, Math.min(100, (h.hp / h.maxHp) * 100))
  const mpPct = Math.max(0, Math.min(100, (h.mp / h.maxMp) * 100))
  const expPct = Math.max(0, Math.min(100, (h.exp / h.expMax) * 100))
  const el = document.querySelector('#hud')!
  el.innerHTML = `
    <div class="hud-item"><span class="hud-label">Lv</span><strong>${h.level}</strong></div>
    <div class="hud-item">
      <span class="hud-label">HP</span>
      <div class="hud-bar hp"><i style="width:${hpPct}%"></i></div>
      <span>${h.hp}/${h.maxHp}</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">MP</span>
      <div class="hud-bar mp"><i style="width:${mpPct}%"></i></div>
      <span>${h.mp}/${h.maxMp}</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">EXP</span>
      <div class="hud-bar exp"><i style="width:${expPct}%"></i></div>
      <span>${h.exp}/${h.expMax}</span>
    </div>
    <div class="hud-item"><span class="hud-label">GOLD</span><span>${h.gold}G</span></div>
    <div class="hud-mode ${state.mode === 'combat' ? 'combat' : 'idle'}">${h.mode}</div>
  `
}

function renderTerminal(): void {
  const term = document.querySelector('#terminal')!
  term.innerHTML = state.messages
    .map((m) => `<div class="term-line ${m.kind}">${escapeHtml(m.text)}</div>`)
    .join('')
  term.scrollTop = term.scrollHeight
}

function renderExplorer(): void {
  const p = state.player
  const loc = p.location
  const zonesHtml = Object.values(ZONES)
    .map((z) => {
      const locked = p.level < z.minLevel
      const active = loc === z.id
      return `<div class="tree-item ${locked ? 'locked' : ''} ${active ? 'active' : ''}"
        data-cmd="${locked ? '' : `go ${z.name}`}" title="${z.description}">
        <span class="icon">🌲</span>${z.name}
        ${locked ? `<span style="margin-left:auto;font-size:10px;color:#888">Lv.${z.minLevel}</span>` : ''}
      </div>`
    })
    .join('')

  document.querySelector('#explorer')!.innerHTML = `
    <div class="panel-header">Explorer</div>
    <div class="explorer-section">
      <div class="explorer-section-title">WORLD</div>
      <div class="tree-item ${loc === 'town' || loc === 'shop' ? 'active' : ''}" data-cmd="town">
        <span class="icon">🏠</span>마을
      </div>
      <div class="tree-item ${loc === 'shop' ? 'active' : ''}" data-cmd="shop">
        <span class="icon">🛒</span>상점
      </div>
      ${zonesHtml}
    </div>
    <div class="explorer-section">
      <div class="explorer-section-title">QUICK</div>
      <div class="tree-item" data-cmd="status"><span class="icon">📊</span>status</div>
      <div class="tree-item" data-cmd="inv"><span class="icon">🎒</span>inventory</div>
      <div class="tree-item" data-cmd="hunt"><span class="icon">⚔️</span>hunt</div>
      <div class="tree-item" data-cmd="help"><span class="icon">❓</span>help</div>
      <div class="tree-item" data-cmd="save"><span class="icon">💾</span>save</div>
    </div>
    <p class="tree-hint">클릭하거나 CLI에 명령어를 입력하세요.</p>
  `
}

function renderInspector(): void {
  const p = state.player
  const equipLines = SLOT_ORDER.map((slot) => {
    const id = p.equipment[slot]
    const item = id ? getItem(id) : undefined
    return `<div>${SLOT_LABELS[slot]}: ${
      item ? escapeHtml(item.name) : '<span class="empty">—</span>'
    }</div>`
  }).join('')

  let combatBlock = ''
  if (state.mode === 'combat' && state.combat) {
    const m = MONSTERS[state.combat.monsterId]
    const pct = (state.combat.monsterHp / state.combat.monsterMaxHp) * 100
    combatBlock = `
      <div class="insp-group">
        <h3>Combat Target</h3>
        <div class="insp-monster">
          <div><strong>${escapeHtml(m.name)}</strong> Lv.${m.level}</div>
          <div>HP ${state.combat.monsterHp}/${state.combat.monsterMaxHp}</div>
          <div class="insp-bar"><i style="width:${pct}%"></i></div>
          <div style="margin-top:6px;color:var(--fg-dim)">ATK ${m.atk} / DEF ${m.def}</div>
        </div>
      </div>`
  }

  const skillLines = p.skills
    .map((id) => {
      const s = SKILLS[id]
      return `<div class="insp-row"><span class="k">${escapeHtml(s.name)}</span><span class="v">MP ${s.mpCost}</span></div>`
    })
    .join('')

  document.querySelector('#inspector')!.innerHTML = `
    <div class="panel-header">Inspector</div>
    <div class="inspector-body">
      <div class="insp-group">
        <h3>Player</h3>
        <div class="insp-row"><span class="k">Name</span><span class="v">${escapeHtml(p.name)}</span></div>
        <div class="insp-row"><span class="k">Level</span><span class="v">${p.level}</span></div>
        <div class="insp-row"><span class="k">HP</span><span class="v">${p.hp}/${getEffectiveMaxHp(p)}</span></div>
        <div class="insp-row"><span class="k">MP</span><span class="v">${p.mp}/${getEffectiveMaxMp(p)}</span></div>
        <div class="insp-row"><span class="k">ATK</span><span class="v">${getTotalAtk(p)}</span></div>
        <div class="insp-row"><span class="k">DEF</span><span class="v">${getTotalDef(p)}</span></div>
        <div class="insp-row"><span class="k">Gold</span><span class="v">${p.gold}G</span></div>
      </div>
      ${combatBlock}
      <div class="insp-group">
        <h3>Equipment</h3>
        <div class="insp-equip">${equipLines}</div>
      </div>
      <div class="insp-group">
        <h3>Skills</h3>
        ${skillLines}
      </div>
      <div class="insp-group">
        <h3>Inventory</h3>
        ${
          p.inventory.length
            ? p.inventory
                .slice(0, 12)
                .map((e) => {
                  const item = getItem(e.itemId)
                  return `<div class="insp-row"><span class="k">${escapeHtml(item?.name ?? e.itemId)}</span><span class="v">x${e.qty}</span></div>`
                })
                .join('') +
              (p.inventory.length > 12
                ? `<div class="insp-row"><span class="k">…</span><span class="v">+${p.inventory.length - 12}</span></div>`
                : '')
            : '<div class="insp-row"><span class="k">(비어 있음)</span></div>'
        }
      </div>
    </div>
  `
}

function updatePrompt(): void {
  const h = getHud(state)
  const path =
    state.mode === 'combat'
      ? 'combat'
      : h.location === '마을'
        ? '~'
        : h.location === '상점'
          ? '~/shop'
          : `~/zones/${h.location}`
  const el = document.querySelector('#prompt')
  if (el) el.textContent = `player@${path}$`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

renderShell()
welcome(state)
refresh()
document.querySelector<HTMLInputElement>('#cli')?.focus()
