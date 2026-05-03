# Talent Pool — Frontend

React (Vite) + TypeScript + Tailwind CSS v4. Flujo principal: reclutador (organizaciones, puestos, desafíos, rankings) y candidato (invitaciones, resolver desafío, feedback).

## Re-theme (demo hackathon)

Se aplicó un **re-theme visual** alineado al prototipo Talent Pool: paleta primaria teal (`#0d9488`), tipografía **Plus Jakarta Sans** y bloques de código en **JetBrains Mono**. Detalle de tokens: **[DESIGN_TOKENS.md](./DESIGN_TOKENS.md)**.

### Navegación MVP vs prototipo

El prototipo HTML incluía secciones académicas (cursos, repositorio LLM, etc.). En esta build:

- El flujo **corporate** (`/dashboard`, organizaciones, puestos, desafíos, rankings, invitaciones, mis desafíos) es el del demo end-to-end.
- Para rol **estudiante** (si el demo estudiante está activo en config), en el menú solo se muestra **Dashboard**; los enlaces a curso y repositorio están **ocultos** hasta tener backend (las rutas `/student/courses/*` siguen definidas en la app).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Tooling

ESLint, Prettier, Vitest, Playwright (e2e opcional).
