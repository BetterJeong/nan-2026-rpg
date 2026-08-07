import './style.css'
import { ZONES, MONSTERS, SKILLS } from './game/data/content'
import { getItem } from './game/data/items'
import { handleCommand, welcome, getHud } from './game/commands'
import { getSuggestChips } from './game/suggest'
import {
  createInitialState,
  saveGame,
  pushMessage,
  startAutosave,
  restartAutosaveTimer,
  MIN_AUTOSAVE_MIN,
  MAX_AUTOSAVE_MIN,
} from './game/save'
import {
  applySettingsToDom,
  closeSettings,
  getSettings,
  getSettingsCategory,
  getUiView,
  openSettings,
  patchSettings,
  resetSettings,
  setSettingsCategory,
  subscribeSettings,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type SettingsCategory,
} from './game/settings'
import { getTotalAtk, getTotalDef, getEffectiveMaxHp, getEffectiveMaxMp } from './game/player'
import {
  itemLabel,
  monsterLabel,
  skillLabel,
  slotLabel,
  t,
  zoneDesc,
  zoneLabel,
} from './game/i18n'
import { SLOT_ORDER } from './game/types'
import type { GameState } from './game/types'

let state: GameState = createInitialState()
let historyIndex = -1
let draft = ''
let settingsQuery = ''
let explorerOpen = false
let inspectorOpen = false

const app = document.querySelector<HTMLDivElement>('#app')!

function autoSave(): void {
  const msg = saveGame(state)
  pushMessage(state, 'system', `autosave: ${msg}`)
  refresh()
}

function renderShell(): void {
  app.innerHTML = `
    <div class="titlebar">
      <div class="titlebar-left">
        <div class="titlebar-dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
        <button type="button" class="titlebar-btn mobile-only" id="btn-explorer" title="Explorer" aria-label="Explorer">☰</button>
      </div>
      <div class="titlebar-title" id="titlebar-title">DevQuest — nan-2026-rpg — terminal.rpg</div>
      <div class="titlebar-right mobile-only">
        <button type="button" class="titlebar-btn" id="btn-inspector" title="Inspector" aria-label="Inspector">ℹ</button>
      </div>
    </div>
    <div class="mobile-backdrop" id="mobile-backdrop" hidden></div>
    <div class="workspace">
      <nav class="activity" aria-label="Activity Bar" id="activity">
        <button type="button" class="activity-btn active" data-view="game" title="Explorer">📁</button>
        <button type="button" class="activity-btn" data-view="settings" title="Settings">⚙️</button>
        <div class="activity-spacer"></div>
      </nav>
      <aside class="explorer" id="explorer"></aside>
      <main class="editor">
        <div class="tabbar" id="tabbar"></div>
        <div class="game-view" id="game-view">
          <div class="cli-hud" id="hud"></div>
          <div class="terminal" id="terminal"></div>
        </div>
        <div class="settings-view" id="settings-view"></div>
        <div class="cli-dock" id="cli-dock">
          <div class="cli-suggest" id="cli-suggest" role="list" aria-label="Suggested commands"></div>
          <div class="cli-input-row">
            <span class="cli-prompt" id="prompt">player@town:~$</span>
            <input class="cli-input" id="cli" type="text" enterkeyhint="send"
              autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false"
              placeholder="" />
          </div>
        </div>
      </main>
      <aside class="inspector" id="inspector"></aside>
    </div>
    <footer class="statusbar">
      <div class="statusbar-left">
        <span>⎇ main*</span>
        <span id="sb-loc">town</span>
        <span id="sb-theme">theme: dark</span>
        <span id="sb-lang">lang: en</span>
      </div>
      <div class="statusbar-right">
        <span>UTF-8</span>
        <span>TypeScript RPG</span>
        <span id="sb-view">Terminal</span>
      </div>
    </footer>
  `

  const cli = document.querySelector<HTMLInputElement>('#cli')!
  cli.addEventListener('keydown', onKeyDown)
  cli.addEventListener('focus', () => {
    closeMobileDrawers()
    document.body.classList.add('keyboard-open')
    window.scrollTo(0, 0)
    syncVisualViewport()
    const bump = () => {
      window.scrollTo(0, 0)
      syncVisualViewport()
      scrollTerminalToEnd()
    }
    requestAnimationFrame(bump)
    setTimeout(bump, 50)
    setTimeout(bump, 250)
    setTimeout(bump, 450)
  })
  cli.addEventListener('blur', () => {
    document.body.classList.remove('keyboard-open')
    syncVisualViewport()
  })

  document.querySelector('#btn-explorer')?.addEventListener('click', () => toggleExplorerDrawer())
  document.querySelector('#btn-inspector')?.addEventListener('click', () => toggleInspectorDrawer())
  document.querySelector('#mobile-backdrop')?.addEventListener('click', () => closeMobileDrawers())

  document.querySelector('#cli-suggest')?.addEventListener('pointerdown', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-cmd]')
    if (btn) e.preventDefault() // keep keyboard open on mobile
  })
  document.querySelector('#cli-suggest')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-cmd]') as HTMLElement | null
    if (!btn?.dataset.cmd) return
    e.preventDefault()
    runCommand(btn.dataset.cmd)
    document.querySelector<HTMLInputElement>('#cli')?.focus({ preventScroll: true })
  })

  document.querySelector('#explorer')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('.tree-item') as HTMLElement | null
    if (!t || t.classList.contains('locked')) return
    const settingsCat = t.getAttribute('data-settings-cat')
    if (settingsCat === 'appearance' || settingsCat === 'game' || settingsCat === 'terminal') {
      e.preventDefault()
      e.stopPropagation()
      setSettingsCategory(settingsCat)
      closeMobileDrawers()
      return
    }
    const cmd = t.getAttribute('data-cmd') || t.dataset.cmd
    if (cmd) {
      runCommand(cmd)
      closeMobileDrawers()
    }
  })

  document.querySelector('#activity')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.activity-btn') as HTMLElement | null
    if (!btn?.dataset.view) return
    if (btn.dataset.view === 'settings') openSettings()
    else closeSettings()
  })

  document.querySelector('#tabbar')!.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest('.tab') as HTMLElement | null
    if (!tab?.dataset.view) return
    if (tab.dataset.view === 'settings') openSettings()
    else closeSettings()
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

function syncMobileDrawers(): void {
  document.body.classList.toggle('drawer-explorer', explorerOpen)
  document.body.classList.toggle('drawer-inspector', inspectorOpen)
  const backdrop = document.querySelector<HTMLElement>('#mobile-backdrop')
  if (backdrop) {
    const show = explorerOpen || inspectorOpen
    backdrop.hidden = !show
    backdrop.classList.toggle('show', show)
  }
  document.querySelector('#btn-explorer')?.classList.toggle('active', explorerOpen)
  document.querySelector('#btn-inspector')?.classList.toggle('active', inspectorOpen)
}

function closeMobileDrawers(): void {
  explorerOpen = false
  inspectorOpen = false
  syncMobileDrawers()
}

function toggleExplorerDrawer(): void {
  explorerOpen = !explorerOpen
  if (explorerOpen) inspectorOpen = false
  syncMobileDrawers()
}

function toggleInspectorDrawer(): void {
  inspectorOpen = !inspectorOpen
  if (inspectorOpen) explorerOpen = false
  syncMobileDrawers()
}

function refresh(): void {
  const view = getUiView()
  document.body.classList.toggle('view-settings', view === 'settings')
  renderActivity()
  renderTabs()
  renderExplorer()
  if (view === 'settings') {
    renderSettings()
  } else {
    renderHud()
    renderTerminal()
    updatePrompt()
  }
  renderSuggest()
  renderInspector()
  syncMobileDrawers()
  const sb = document.querySelector('#sb-loc')
  if (sb) sb.textContent = getHud(state).location
  const themeEl = document.querySelector('#sb-theme')
  if (themeEl) themeEl.textContent = `theme: ${getSettings().theme}`
  const langEl = document.querySelector('#sb-lang')
  if (langEl) langEl.textContent = `lang: ${getSettings().locale}`
  const viewEl = document.querySelector('#sb-view')
  if (viewEl) viewEl.textContent = view === 'settings' ? t('ui.settings') : 'Terminal'
  const title = document.querySelector('#titlebar-title')
  if (title) {
    title.textContent =
      view === 'settings'
        ? 'DevQuest — settings.json'
        : 'DevQuest — nan-2026-rpg — terminal.rpg'
  }
  const cli = document.querySelector<HTMLInputElement>('#cli')
  if (cli) cli.placeholder = t('ui.placeholder')
}

function renderActivity(): void {
  const view = getUiView()
  document.querySelectorAll<HTMLElement>('.activity-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === view)
  })
}

function renderTabs(): void {
  const view = getUiView()
  const tabbar = document.querySelector('#tabbar')!
  tabbar.innerHTML = `
    <button type="button" class="tab ${view === 'game' ? 'active' : ''}" data-view="game">
      <span class="dot"></span> terminal.rpg
    </button>
    <button type="button" class="tab ${view === 'settings' ? 'active' : ''}" data-view="settings">
      settings.json
    </button>
  `
}

function renderHud(): void {
  const h = getHud(state)
  const hpPct = Math.max(0, Math.min(100, (h.hp / h.maxHp) * 100))
  const mpPct = Math.max(0, Math.min(100, (h.mp / h.maxMp) * 100))
  const expPct = Math.max(0, Math.min(100, (h.exp / h.expMax) * 100))
  const el = document.querySelector('#hud')
  if (!el) return
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
  const term = document.querySelector('#terminal')
  if (!term) return
  term.innerHTML = state.messages
    .map((m) => `<div class="term-line ${m.kind}">${escapeHtml(m.text)}</div>`)
    .join('')
  term.scrollTop = term.scrollHeight
}

function renderSuggest(): void {
  const el = document.querySelector('#cli-suggest')
  if (!el) return
  const chips = getSuggestChips(state)
  el.innerHTML = chips
    .map(
      (c) =>
        `<button type="button" class="cli-chip" role="listitem" data-cmd="${escapeAttr(c.cmd)}" title="${escapeAttr(c.cmd)}">${escapeHtml(c.label)}</button>`,
    )
    .join('')
}

function renderExplorer(): void {
  const explorer = document.querySelector('#explorer')!
  if (getUiView() === 'settings') {
    const cat = getSettingsCategory()
    explorer.innerHTML = `
      <div class="panel-header">${t('ui.settings')}</div>
      <div class="explorer-section">
        <div class="explorer-section-title">${t('ui.categories')}</div>
        <div class="tree-item ${cat === 'appearance' ? 'active' : ''}" data-settings-cat="appearance">
          <span class="icon">🎨</span>${t('ui.appearance')}
        </div>
        <div class="tree-item ${cat === 'game' ? 'active' : ''}" data-settings-cat="game">
          <span class="icon">🎮</span>${t('ui.game')}
        </div>
        <div class="tree-item ${cat === 'terminal' ? 'active' : ''}" data-settings-cat="terminal">
          <span class="icon">⌨️</span>${t('ui.terminal')}
        </div>
      </div>
      <div class="explorer-section">
        <div class="explorer-section-title">${t('ui.actions')}</div>
        <div class="tree-item" data-cmd="settings close"><span class="icon">↩️</span>${t('ui.backTerminal')}</div>
        <div class="tree-item" data-cmd="settings reset"><span class="icon">↺</span>${t('ui.resetDefaults')}</div>
      </div>
      <p class="tree-hint">${t('ui.hintSettings')}</p>
    `
    return
  }

  const p = state.player
  const loc = p.location
  const zonesHtml = Object.values(ZONES)
    .map((z) => {
      const locked = p.level < z.minLevel
      const active = loc === z.id
      const name = zoneLabel(z.id)
      return `<div class="tree-item ${locked ? 'locked' : ''} ${active ? 'active' : ''}"
        data-cmd="${locked ? '' : `go ${z.id}`}" title="${escapeAttr(zoneDesc(z.id))}">
        <span class="icon">🌲</span>${escapeHtml(name)}
        ${locked ? `<span style="margin-left:auto;font-size:10px;color:#888">Lv.${z.minLevel}</span>` : ''}
      </div>`
    })
    .join('')

  explorer.innerHTML = `
    <div class="panel-header">${t('ui.explorer')}</div>
    <div class="explorer-section">
      <div class="explorer-section-title">${t('ui.world')}</div>
      <div class="tree-item ${loc === 'town' || loc === 'shop' ? 'active' : ''}" data-cmd="town">
        <span class="icon">🏠</span>${t('ui.town')}
      </div>
      <div class="tree-item ${loc === 'shop' ? 'active' : ''}" data-cmd="shop">
        <span class="icon">🛒</span>${t('ui.shop')}
      </div>
      ${zonesHtml}
    </div>
    <div class="explorer-section">
      <div class="explorer-section-title">${t('ui.quick')}</div>
      <div class="tree-item" data-cmd="status"><span class="icon">📊</span>status</div>
      <div class="tree-item" data-cmd="inv"><span class="icon">🎒</span>inventory</div>
      <div class="tree-item" data-cmd="hunt"><span class="icon">⚔️</span>hunt</div>
      <div class="tree-item" data-cmd="help"><span class="icon">❓</span>help</div>
      <div class="tree-item" data-cmd="save"><span class="icon">💾</span>save</div>
      <div class="tree-item" data-cmd="settings"><span class="icon">⚙️</span>settings</div>
    </div>
    <p class="tree-hint">${t('ui.hintExplorer')}</p>
  `
}

function renderSettings(): void {
  const s = getSettings()
  const cat = getSettingsCategory()
  const q = settingsQuery.trim().toLowerCase()
  const root = document.querySelector('#settings-view')!
  const showAll = q.length > 0
  root.innerHTML = `
    <div class="settings-toolbar">
      <input class="settings-search" id="settings-search" type="search"
        placeholder="${escapeAttr(t('ui.searchSettings'))}" value="${escapeAttr(settingsQuery)}" />
      <button type="button" class="tab" id="settings-close-btn" style="height:28px;border-top:none">${t('ui.close')}</button>
    </div>
    <div class="settings-cats" id="settings-cats">
      <button type="button" class="settings-cat ${cat === 'appearance' ? 'active' : ''}" data-settings-cat="appearance">${t('ui.appearance')}</button>
      <button type="button" class="settings-cat ${cat === 'game' ? 'active' : ''}" data-settings-cat="game">${t('ui.game')}</button>
      <button type="button" class="settings-cat ${cat === 'terminal' ? 'active' : ''}" data-settings-cat="terminal">${t('ui.terminal')}</button>
    </div>
    <div class="settings-body" id="settings-body">
      ${renderSettingsSection(
        'appearance',
        t('ui.appearance'),
        t('ui.appearanceDesc'),
        cat,
        showAll,
        [
          settingSelect(
            t('ui.colorTheme'),
            t('ui.colorThemeDesc'),
            'theme',
            'theme',
            s.theme,
            [
              ['dark', t('ui.dark')],
              ['light', t('ui.light')],
            ],
          ),
          settingSelect(
            t('ui.language'),
            t('ui.languageDesc'),
            'lang',
            'locale',
            s.locale,
            [
              ['en', t('ui.langEn')],
              ['ko', t('ui.langKo')],
            ],
          ),
          settingToggle(
            t('ui.showInspector'),
            t('ui.showInspectorDesc'),
            'inspector on|off',
            'showInspector',
            s.showInspector,
          ),
          settingToggle(
            t('ui.compactExplorer'),
            t('ui.compactExplorerDesc'),
            'explorer compact|normal',
            'compactExplorer',
            s.compactExplorer,
          ),
        ],
      )}
      ${renderSettingsSection(
        'game',
        t('ui.game'),
        t('ui.gameDesc'),
        cat,
        showAll,
        [
          settingNumber(
            t('ui.autosave'),
            t('ui.autosaveDesc'),
            'autosave',
            'autosaveMinutes',
            s.autosaveMinutes,
            MIN_AUTOSAVE_MIN,
            MAX_AUTOSAVE_MIN,
          ),
          settingToggle(
            t('ui.showHud'),
            t('ui.showHudDesc'),
            'hud on|off',
            'showHud',
            s.showHud,
          ),
          settingToggle(
            t('ui.combatHints'),
            t('ui.combatHintsDesc'),
            'hints on|off',
            'combatHints',
            s.combatHints,
          ),
        ],
      )}
      ${renderSettingsSection(
        'terminal',
        t('ui.terminal'),
        t('ui.terminalDesc'),
        cat,
        showAll,
        [
          settingNumber(
            t('ui.fontSize'),
            t('ui.fontSizeDesc'),
            'fontsize',
            'fontSize',
            s.fontSize,
            FONT_SIZE_MIN,
            FONT_SIZE_MAX,
          ),
        ],
      )}
      <div class="settings-actions">
        <button type="button" class="primary" id="btn-settings-close">${t('ui.backTerminal')}</button>
        <button type="button" id="btn-settings-reset">${t('ui.resetDefaults')}</button>
      </div>
    </div>
  `

  const search = document.querySelector<HTMLInputElement>('#settings-search')!
  search.addEventListener('input', () => {
    settingsQuery = search.value
    refresh()
    document.querySelector<HTMLInputElement>('#settings-search')?.focus()
  })

  root.querySelector('#settings-cats')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-settings-cat]') as HTMLElement | null
    const settingsCat = btn?.getAttribute('data-settings-cat')
    if (settingsCat === 'appearance' || settingsCat === 'game' || settingsCat === 'terminal') {
      settingsQuery = ''
      setSettingsCategory(settingsCat)
    }
  })

  root.querySelector('#settings-close-btn')?.addEventListener('click', () => closeSettings())
  root.querySelector('#btn-settings-close')?.addEventListener('click', () => closeSettings())
  root.querySelector('#btn-settings-reset')?.addEventListener('click', () => {
    resetSettings()
    restartAutosaveTimer()
    pushMessage(state, 'system', t('ok.settingsReset'))
    refresh()
  })

  root.querySelectorAll<HTMLSelectElement>('select[data-key]').forEach((el) => {
    el.addEventListener('change', () => {
      if (el.dataset.key === 'theme') {
        applyPatch({ theme: el.value === 'light' ? 'light' : 'dark' })
      } else if (el.dataset.key === 'locale') {
        applyPatch({ locale: el.value === 'ko' ? 'ko' : 'en' })
      }
    })
  })
  root.querySelectorAll<HTMLInputElement>('input[type="number"][data-key]').forEach((el) => {
    el.addEventListener('change', () => {
      const key = el.dataset.key
      const n = parseInt(el.value, 10)
      if (key === 'autosaveMinutes') applyPatch({ autosaveMinutes: n })
      else if (key === 'fontSize') applyPatch({ fontSize: n })
    })
  })
  root.querySelectorAll<HTMLButtonElement>('button.toggle[data-key]').forEach((el) => {
    el.addEventListener('click', () => {
      const key = el.dataset.key
      const next = el.dataset.value !== 'true'
      if (key === 'showInspector') applyPatch({ showInspector: next })
      else if (key === 'showHud') applyPatch({ showHud: next })
      else if (key === 'compactExplorer') applyPatch({ compactExplorer: next })
      else if (key === 'combatHints') applyPatch({ combatHints: next })
    })
  })
}

function applyPatch(partial: Parameters<typeof patchSettings>[0]): void {
  const res = patchSettings(partial)
  if (!res.ok) {
    pushMessage(state, 'error', res.error)
    refresh()
    return
  }
  if (res.autosaveChanged) restartAutosaveTimer()
  refresh()
}

function renderSettingsSection(
  id: SettingsCategory,
  title: string,
  desc: string,
  active: SettingsCategory,
  showAll: boolean,
  rows: string[],
): string {
  const visible = showAll || active === id
  if (!visible) return ''

  const filteredRows = showAll
    ? rows.filter((row) => row.toLowerCase().includes(settingsQuery.trim().toLowerCase()))
    : rows
  if (showAll && filteredRows.length === 0) return ''

  return `
    <section class="settings-section" data-section="${id}" id="settings-section-${id}">
      <h2>${title}</h2>
      <p class="section-desc">${desc}</p>
      ${filteredRows.join('')}
    </section>
  `
}

function settingSelect(
  title: string,
  desc: string,
  cmd: string,
  key: string,
  value: string,
  options: [string, string][],
): string {
  return `
    <div class="setting-row" data-keys="${key} ${title.toLowerCase()}">
      <div class="setting-meta">
        <div class="setting-title">${title}</div>
        <div class="setting-desc">${desc}</div>
        <span class="setting-key">${cmd}</span>
      </div>
      <div class="setting-control">
        <select data-key="${key}">
          ${options
            .map(
              ([v, label]) =>
                `<option value="${v}" ${v === value ? 'selected' : ''}>${label}</option>`,
            )
            .join('')}
        </select>
      </div>
    </div>
  `
}

function settingNumber(
  title: string,
  desc: string,
  cmd: string,
  key: string,
  value: number,
  min: number,
  max: number,
): string {
  return `
    <div class="setting-row" data-keys="${key} ${title.toLowerCase()}">
      <div class="setting-meta">
        <div class="setting-title">${title}</div>
        <div class="setting-desc">${desc}</div>
        <span class="setting-key">${cmd}</span>
      </div>
      <div class="setting-control">
        <input type="number" data-key="${key}" value="${value}" min="${min}" max="${max}" />
      </div>
    </div>
  `
}

function settingToggle(
  title: string,
  desc: string,
  cmd: string,
  key: string,
  value: boolean,
): string {
  return `
    <div class="setting-row" data-keys="${key} ${title.toLowerCase()}">
      <div class="setting-meta">
        <div class="setting-title">${title}</div>
        <div class="setting-desc">${desc}</div>
        <span class="setting-key">${cmd}</span>
      </div>
      <div class="setting-control">
        <button type="button" class="toggle ${value ? 'on' : ''}" data-key="${key}" data-value="${value}">
          <i></i>
        </button>
      </div>
    </div>
  `
}

function renderInspector(): void {
  const p = state.player
  const equipLines = SLOT_ORDER.map((slot) => {
    const id = p.equipment[slot]
    const item = id ? getItem(id) : undefined
    return `<div>${slotLabel(slot)}: ${
      item ? escapeHtml(itemLabel(item)) : '<span class="empty">—</span>'
    }</div>`
  }).join('')

  let combatBlock = ''
  if (state.mode === 'combat' && state.combat) {
    const m = MONSTERS[state.combat.monsterId]
    const pct = (state.combat.monsterHp / state.combat.monsterMaxHp) * 100
    combatBlock = `
      <div class="insp-group">
        <h3>${t('ui.combatTarget')}</h3>
        <div class="insp-monster">
          <div><strong>${escapeHtml(monsterLabel(state.combat.monsterId))}</strong> Lv.${m.level}</div>
          <div>HP ${state.combat.monsterHp}/${state.combat.monsterMaxHp}</div>
          <div class="insp-bar"><i style="width:${pct}%"></i></div>
          <div style="margin-top:6px;color:var(--fg-dim)">ATK ${m.atk} / DEF ${m.def}</div>
        </div>
      </div>`
  }

  const skillLines = p.skills
    .map((id) => {
      const sk = SKILLS[id]
      return `<div class="insp-row"><span class="k">${escapeHtml(skillLabel(id))}</span><span class="v">MP ${sk.mpCost}</span></div>`
    })
    .join('')

  const s = getSettings()
  document.querySelector('#inspector')!.innerHTML = `
    <div class="panel-header">${t('ui.inspector')}</div>
    <div class="inspector-body">
      <div class="insp-group">
        <h3>${t('ui.player')}</h3>
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
        <h3>${t('ui.environment')}</h3>
        <div class="insp-row"><span class="k">Theme</span><span class="v">${s.theme}</span></div>
        <div class="insp-row"><span class="k">Lang</span><span class="v">${s.locale}</span></div>
        <div class="insp-row"><span class="k">Autosave</span><span class="v">${s.autosaveMinutes}m</span></div>
        <div class="insp-row"><span class="k">Font</span><span class="v">${s.fontSize}px</span></div>
      </div>
      <div class="insp-group">
        <h3>${t('ui.equipment')}</h3>
        <div class="insp-equip">${equipLines}</div>
      </div>
      <div class="insp-group">
        <h3>${t('ui.skills')}</h3>
        ${skillLines}
      </div>
      <div class="insp-group">
        <h3>${t('ui.inventory')}</h3>
        ${
          p.inventory.length
            ? p.inventory
                .slice(0, 12)
                .map((e) => {
                  return `<div class="insp-row"><span class="k">${escapeHtml(itemLabel(e.itemId))}</span><span class="v">x${e.qty}</span></div>`
                })
                .join('') +
              (p.inventory.length > 12
                ? `<div class="insp-row"><span class="k">…</span><span class="v">+${p.inventory.length - 12}</span></div>`
                : '')
            : `<div class="insp-row"><span class="k">${t('ui.empty')}</span></div>`
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
      : h.location === 'town'
        ? '~'
        : h.location === 'shop'
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

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;')
}

function scrollTerminalToEnd(): void {
  const term = document.querySelector('#terminal')
  if (term) term.scrollTop = term.scrollHeight
}

function syncVisualViewport(): void {
  const vv = window.visualViewport
  const height = Math.round(vv?.height ?? window.innerHeight)
  const offsetTop = Math.round(vv?.offsetTop ?? 0)
  const offsetLeft = Math.round(vv?.offsetLeft ?? 0)

  // Pin #app exactly to the visual viewport (no black gap above keyboard)
  document.documentElement.style.setProperty('--app-height', `${height}px`)
  document.documentElement.style.setProperty('--app-top', `${offsetTop}px`)
  document.documentElement.style.setProperty('--app-left', `${offsetLeft}px`)

  const keyboardLikely = !!vv && vv.height < window.innerHeight * 0.8
  const inputFocused = document.activeElement?.id === 'cli'
  document.body.classList.toggle('keyboard-open', keyboardLikely || inputFocused)

  // Kill iOS scroll offset that creates the black strip
  if (keyboardLikely || inputFocused) {
    window.scrollTo(0, 0)
  }
}

function setupMobileLayout(): void {
  syncVisualViewport()
  const onViewportChange = () => {
    syncVisualViewport()
    scrollTerminalToEnd()
  }
  const vv = window.visualViewport
  if (vv) {
    vv.addEventListener('resize', onViewportChange)
    vv.addEventListener('scroll', onViewportChange)
  }
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('orientationchange', () => {
    setTimeout(onViewportChange, 50)
    setTimeout(onViewportChange, 250)
  })
}

function isCoarsePointerMobile(): boolean {
  return window.matchMedia('(max-width: 720px), (hover: none) and (pointer: coarse)').matches
}

function showFatal(err: unknown): void {
  const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  app.innerHTML = `<pre style="padding:24px;color:#f14c4c;white-space:pre-wrap">
boot failed

${escapeHtml(detail)}

Check the browser console (F12).
If the save is corrupt, clear localStorage and reload.</pre>`
}

try {
  applySettingsToDom()
  setupMobileLayout()
  renderShell()
  subscribeSettings(() => refresh())
  welcome(state)
  refresh()
  // Don't autofocus on mobile — opening keyboard on load covers the UI
  if (!isCoarsePointerMobile()) {
    document.querySelector<HTMLInputElement>('#cli')?.focus()
  }
  startAutosave(autoSave)
} catch (err) {
  showFatal(err)
  throw err
}
