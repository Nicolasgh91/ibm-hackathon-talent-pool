# Design tokens — Talent Pool re-theme

Referencia visual: prototipo en `temp/Talent Pool (1).html` (inspección manual; no embebido en la app).

## Paleta primaria (teal)

| Token | Hex | Uso |
|-------|-----|-----|
| primary-50 | `#f0fdfa` | Fondos suaves, item activo nav |
| primary-100 | `#ccfbf1` | Hover muy ligero |
| primary-200 | `#99f6e4` | Bordes sutiles |
| primary-300 | `#5eead4` | — |
| primary-400 | `#2dd4bf` | — |
| primary-500 | `#14b8a6` | Focus rings |
| **primary-600** | **`#0d9488`** | **Marca / botones primarios** |
| primary-700 | `#0f766e` | Hover primario, texto activo nav |
| primary-800 | `#115e59` | — |
| primary-900 | `#134e4a` | Texto sobre fondos claros teal |

## Tipografía

- **Sans UI**: Plus Jakarta Sans — 400, 500, 600, 700, 800 (Google Fonts).
- **Mono**: JetBrains Mono — 400, 500, 600 — `code`, `pre`, bloques de código.

## Radios y sombras

- Botones y campos: `rounded-lg` (8px).
- Cards y modales: `rounded-xl` (12px).
- Sombras: `shadow-sm` en cards; `shadow-xl` en modales; overlays sin sombra fuerte.

## Espaciado típico

- Cards: padding `p-6` (modo default del `Card`).
- Botones `md`: `px-4 py-2`; `sm`: `px-3 py-1.5`.
- Stack vertical en formularios: `gap-4` / `space-y-4`.

## Semántica (badges / estados)

- Success: paleta primary/teal sobre fondo claro.
- Warning: ámbar (Tailwind `amber-*`).
- Danger: rojo (`red-*`).
- Info: azul (`blue-*`).
- Neutral: gris (`gray-*`).
