# DemoModeBanner

Sticky amber banner shown when **demo mode** is active (sessionStorage-driven).

## Props

Ninguno (componente autocontenido).

## Comportamiento

- Suscripción a `demoMode` via `useSyncExternalStore`.
- Muestra razón (`getDemoReason`) cuando existe (fallback por red/5xx o `VITE_FORCE_DEMO`).
- **Conteo de transporte axios**: chip `demo:X · real:Y` desde `apiTransportStats` (incrementa en el interceptor de request según `isDemoMode()`).
- Botón **Reintentar backend**: limpia demo mode y hace hard reload.

## Deuda / mejoras

- Los contadores son por sesión de página (no persisten); reset opcional si se expone `resetApiTransportStats` en UI de desarrollo.
