import {
  DEFAULT_AUTOSAVE_MIN,
  MIN_AUTOSAVE_MIN,
  MAX_AUTOSAVE_MIN,
} from './save'
import { getLang, setLang, t, type Lang } from './i18n'

const SETTINGS_KEY = 'nan-2026-rpg-settings'
/** Legacy key from before settings object */
const LEGACY_AUTOSAVE_KEY = 'nan-2026-rpg-autosave-min'

export type ThemeId = 'dark' | 'light'
export type SettingsCategory = 'appearance' | 'game' | 'terminal'

export type AppSettings = {
  theme: ThemeId
  locale: Lang
  autosaveMinutes: number
  fontSize: number
  showInspector: boolean
  showHud: boolean
  compactExplorer: boolean
  combatHints: boolean
  /** When true, use faster message pacing (previous default speed). */
  fastMode: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  locale: 'en',
  autosaveMinutes: DEFAULT_AUTOSAVE_MIN,
  fontSize: 13,
  showInspector: true,
  showHud: true,
  compactExplorer: false,
  combatHints: true,
  fastMode: false,
}

export const FONT_SIZE_MIN = 11
export const FONT_SIZE_MAX = 18

let settings: AppSettings = loadSettings()
let uiView: 'game' | 'settings' = 'game'
let settingsCategory: SettingsCategory = 'appearance'
let listeners: Array<() => void> = []

// sync i18n with persisted locale on boot
setLang(settings.locale)

export function subscribeSettings(fn: () => void): () => void {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}

function notify(): void {
  for (const fn of listeners) fn()
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>
      return normalizeSettings({ ...DEFAULT_SETTINGS, ...parsed })
    }
  } catch {
    /* ignore */
  }
  // migrate legacy autosave
  const legacy = localStorage.getItem(LEGACY_AUTOSAVE_KEY)
  if (legacy) {
    const n = parseInt(legacy, 10)
    if (Number.isInteger(n) && n >= MIN_AUTOSAVE_MIN && n <= MAX_AUTOSAVE_MIN) {
      return normalizeSettings({ ...DEFAULT_SETTINGS, autosaveMinutes: n })
    }
  }
  return { ...DEFAULT_SETTINGS }
}

function normalizeSettings(s: AppSettings): AppSettings {
  const theme: ThemeId = s.theme === 'light' ? 'light' : 'dark'
  const locale: Lang = s.locale === 'ko' ? 'ko' : 'en'
  let autosaveMinutes = Math.floor(Number(s.autosaveMinutes))
  if (!Number.isFinite(autosaveMinutes) || autosaveMinutes < MIN_AUTOSAVE_MIN) {
    autosaveMinutes = DEFAULT_AUTOSAVE_MIN
  }
  if (autosaveMinutes > MAX_AUTOSAVE_MIN) autosaveMinutes = MAX_AUTOSAVE_MIN

  let fontSize = Math.floor(Number(s.fontSize))
  if (!Number.isFinite(fontSize) || fontSize < FONT_SIZE_MIN) fontSize = DEFAULT_SETTINGS.fontSize
  if (fontSize > FONT_SIZE_MAX) fontSize = FONT_SIZE_MAX

  return {
    theme,
    locale,
    autosaveMinutes,
    fontSize,
    showInspector: s.showInspector !== false,
    showHud: s.showHud !== false,
    compactExplorer: !!s.compactExplorer,
    combatHints: s.combatHints !== false,
    fastMode: !!s.fastMode,
  }
}

function persist(): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  // keep legacy key in sync for older code paths
  localStorage.setItem(LEGACY_AUTOSAVE_KEY, String(settings.autosaveMinutes))
}

export function getSettings(): AppSettings {
  return { ...settings }
}

export type PatchResult =
  | { ok: true; autosaveChanged: boolean }
  | { ok: false; error: string }

export function patchSettings(partial: Partial<AppSettings>): PatchResult {
  if (partial.autosaveMinutes != null) {
    const n = Math.floor(Number(partial.autosaveMinutes))
    if (!Number.isInteger(n) || n < MIN_AUTOSAVE_MIN || n > MAX_AUTOSAVE_MIN) {
      return {
        ok: false,
        error: t('err.usage.autosave', { min: MIN_AUTOSAVE_MIN, max: MAX_AUTOSAVE_MIN }),
      }
    }
  }
  if (partial.fontSize != null) {
    const n = Math.floor(Number(partial.fontSize))
    if (!Number.isInteger(n) || n < FONT_SIZE_MIN || n > FONT_SIZE_MAX) {
      return {
        ok: false,
        error: t('err.usage.fontsize', { min: FONT_SIZE_MIN, max: FONT_SIZE_MAX }),
      }
    }
  }
  if (partial.theme != null && partial.theme !== 'dark' && partial.theme !== 'light') {
    return { ok: false, error: t('err.usage.theme') }
  }
  if (partial.locale != null && partial.locale !== 'en' && partial.locale !== 'ko') {
    return { ok: false, error: t('err.usage.lang') }
  }

  const next = normalizeSettings({ ...settings, ...partial })
  const autosaveChanged = next.autosaveMinutes !== settings.autosaveMinutes
  settings = next
  setLang(settings.locale)
  persist()
  applySettingsToDom()
  notify()
  return { ok: true, autosaveChanged }
}

export function resetSettings(): void {
  settings = { ...DEFAULT_SETTINGS }
  setLang(settings.locale)
  persist()
  applySettingsToDom()
  notify()
}

export function applySettingsToDom(): void {
  document.documentElement.dataset.theme = settings.theme
  document.documentElement.lang = settings.locale === 'ko' ? 'ko' : 'en'
  document.documentElement.style.setProperty('--term-font-size', `${settings.fontSize}px`)
  document.body.classList.toggle('hide-inspector', !settings.showInspector)
  document.body.classList.toggle('hide-hud', !settings.showHud)
  document.body.classList.toggle('compact-explorer', settings.compactExplorer)
}

export function getUiView(): 'game' | 'settings' {
  return uiView
}

export function openSettings(category?: SettingsCategory): void {
  uiView = 'settings'
  if (category) settingsCategory = category
  notify()
}

export function closeSettings(): void {
  uiView = 'game'
  notify()
}

export function getSettingsCategory(): SettingsCategory {
  return settingsCategory
}

export function setSettingsCategory(category: SettingsCategory): void {
  settingsCategory = category
  notify()
}

export function formatSettingsStatus(): string {
  const s = settings
  return [
    'settings',
    '--------',
    `theme:            ${s.theme}`,
    `lang:             ${s.locale}`,
    `autosave:         ${s.autosaveMinutes} min`,
    `fontSize:         ${s.fontSize}px`,
    `showInspector:    ${s.showInspector}`,
    `showHud:          ${s.showHud}`,
    `compactExplorer:  ${s.compactExplorer}`,
    `combatHints:      ${s.combatHints}`,
    `fastMode:         ${s.fastMode}`,
    '',
    'CLI (no UI needed):',
    '  theme dark|light',
    '  lang en|ko',
    `  autosave <${MIN_AUTOSAVE_MIN}-${MAX_AUTOSAVE_MIN}>`,
    `  fontsize <${FONT_SIZE_MIN}-${FONT_SIZE_MAX}>`,
    '  inspector on|off',
    '  hud on|off',
    '  explorer compact|normal',
    '  hints on|off',
    '  fast on|off',
    'optional UI: settings | settings close',
  ].join('\n')
}

export function shouldShowCombatHints(): boolean {
  return settings.combatHints
}

export { getLang }
