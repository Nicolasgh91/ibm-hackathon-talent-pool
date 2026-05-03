# Cliente API y modo demo

## Archivos

- `frontend/src/services/api.ts` — instancia axios, interceptores.
- `frontend/src/mocks/demoMode.ts` — bandera en `sessionStorage`; si `VITE_FORCE_DEMO=true` arranca en demo al cargar el bundle.
- `frontend/src/mocks/mockAdapter.ts` — adaptador axios in-memory.
- `frontend/src/mocks/mockHandlers.ts` — rutas demo alineadas con backend donde aplica.
- `frontend/src/mocks/apiTransportStats.ts` — contadores demo vs red para telemetría visual en el banner.

## Flujo

1. Primera petición intenta red real (`baseURL` `/api/v1`).
2. Si hay error de red o **5xx**, se activa demo mode y se reintenta una vez con `mockAdapter`.
3. Si ya estaba en demo, todas las peticiones van al mock.

## Variables

| Variable | Efecto |
|----------|--------|
| `VITE_FORCE_DEMO=true` | Demo sin pegar al backend (hackathon). |
| `VITE_API_BASE_URL` | Override del prefijo API (proxy Vite / gateway). |
