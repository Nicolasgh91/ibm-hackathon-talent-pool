/**
 * Demo / Phase 5 UI flags. Student repository uses mock data until REST exists.
 * Set VITE_ENABLE_STUDENT_DEMO=false to hide routes + banner (CI/prod without UX debt).
 */
export function studentDemoEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_STUDENT_DEMO !== 'false'
}

/**
 * Reveals the seed credentials helper card on /login. Double-gated:
 * - import.meta.env.DEV is statically false in `vite build`, so the card
 *   (and its imported component) gets tree-shaken out of production bundles.
 * - VITE_SHOW_DEV_LOGIN_HINTS=false lets devs opt out locally (e.g. for clean
 *   screenshots or when manually testing the empty-form UX).
 */
export function devLoginHintsEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_SHOW_DEV_LOGIN_HINTS !== 'false'
}
