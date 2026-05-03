/** Mock curso + repositorio colaborativo (Phase 5 / demo sin backend). */

export const DEMO_COURSE_SLUG = 'co400'

export interface CourseUnit {
  id: string
  label: string
  queryCount: number
  activa: boolean
}

export interface RepoQuerySummary {
  id: string
  unitId: string
  title: string
  excerpt: string
  votos: number
  destacadaDocente: boolean
  fechaISO: string
}

export interface RepoComment {
  id: string
  author: string
  role: 'estudiante' | 'docente'
  body: string
  pinned?: boolean
}

export interface RepoQueryDetail extends RepoQuerySummary {
  question: string
  aiAnswer: string
  comments: RepoComment[]
}

export const mockCourseTitle = 'Algoritmos II 2026 1Q'

export const mockUnits: CourseUnit[] = [
  { id: 'u1', label: 'U1 · Intro y complejidad', queryCount: 6, activa: false },
  { id: 'u2', label: 'U2 · Estructuras lineales', queryCount: 11, activa: false },
  { id: 'u3', label: 'U3 · Tablas hash y árboles', queryCount: 18, activa: true },
  { id: 'u4', label: 'U4 · Grafos', queryCount: 7, activa: false },
  { id: 'u5', label: 'U5 · DP y greedy', queryCount: 5, activa: false },
]

export const mockRepoQueries: RepoQuerySummary[] = [
  {
    id: 'q-hash-1',
    unitId: 'u3',
    title: '¿Cuándo usar HashMap vs TreeMap?',
    excerpt: 'Tengo dudas sobre orden vs acceso O(1)...',
    votos: 42,
    destacadaDocente: true,
    fechaISO: '2026-04-28T14:00:00Z',
  },
  {
    id: 'q-colision',
    unitId: 'u3',
    title: 'Resolución de colisiones encadenamiento',
    excerpt: 'En la práctica de PD6 no entiendo cuándo...',
    votos: 38,
    destacadaDocente: false,
    fechaISO: '2026-04-29T09:30:00Z',
  },
  {
    id: 'q-list',
    unitId: 'u2',
    title: 'Lista enlazada vs ArrayList en Java',
    excerpt: 'Complejidad de inserción al inicio...',
    votos: 31,
    destacadaDocente: false,
    fechaISO: '2026-04-27T11:00:00Z',
  },
  {
    id: 'q-graph-bfs',
    unitId: 'u4',
    title: 'BFS con pesos — ¿siempre sirve?',
    excerpt: 'El enunciado del lab dice...',
    votos: 27,
    destacadaDocente: true,
    fechaISO: '2026-04-30T16:20:00Z',
  },
  {
    id: 'q-dp',
    unitId: 'u5',
    title: 'Subproblemas superpuestos en PD',
    excerpt: 'Cómo sé si memo ayuda...',
    votos: 19,
    destacadaDocente: false,
    fechaISO: '2026-04-26T08:00:00Z',
  },
  {
    id: 'q-big-o',
    unitId: 'u1',
    title: 'Notación Θ vs O',
    excerpt: 'En el parcial anterior marqué mal...',
    votos: 15,
    destacadaDocente: false,
    fechaISO: '2026-04-25T12:00:00Z',
  },
]

const detailBody = `Ambas estructuras implementan \`Map\` en Java. **HashMap** ofrece inserción/búsqueda **promedio O(1)** sin orden. **TreeMap** mantiene **orden total** con coste **O(log n)** por operación.

\`\`\`java
Map<String, Integer> freq = new HashMap<>();
// claves sin orden estable

Map<String, Integer> ordenado = new TreeMap<>();
// recorrer entrySet() → orden por clave
\`\`\`

Elegí HashMap cuando solo necesitás contar/filtrar; TreeMap cuando el orden importa (rangos, ceilingKey, etc.).`

export const mockQueryDetails: Record<string, RepoQueryDetail> = {
  'q-hash-1': {
    id: 'q-hash-1',
    unitId: 'u3',
    title: '¿Cuándo usar HashMap vs TreeMap?',
    excerpt: 'Tengo dudas sobre orden vs acceso O(1)...',
    votos: 42,
    destacadaDocente: true,
    fechaISO: '2026-04-28T14:00:00Z',
    question:
      'En la práctica de árboles y tablas hash me quedó la duda: si necesito ordenar claves frecuentemente, ¿conviene pagar el log n de TreeMap o meter todo en HashMap y ordenar después?',
    aiAnswer: detailBody,
    comments: [
      {
        id: 'c1',
        author: 'Prof. Rodríguez',
        role: 'docente',
        body: 'Para el parcial: si el enunciado pide **recorrer en orden** muchas veces, TreeMap suele ser la respuesta esperada.',
        pinned: true,
      },
      {
        id: 'c2',
        author: 'Tomás',
        role: 'estudiante',
        body: 'Yo medí con el profiler del IDE y para 50k inserciones HashMap ganó por lejos.',
        pinned: false,
      },
      {
        id: 'c3',
        author: 'Sofía',
        role: 'estudiante',
        body: 'Ojo que TreeMap no admite null en claves.',
        pinned: false,
      },
    ],
  },
}

export function getQueryDetail(id: string): RepoQueryDetail | undefined {
  return mockQueryDetails[id] ?? buildFallbackDetail(id)
}

function buildFallbackDetail(id: string): RepoQueryDetail {
  const base = mockRepoQueries.find((q) => q.id === id)
  const summary = base ?? mockRepoQueries[0]
  return {
    ...summary,
    question: summary.excerpt,
    aiAnswer:
      '_(Respuesta demo)_ Esta consulta aún no tiene cuerpo en el mock; conectá el backend `consultas_llm` para contenido real.',
    comments: [],
  }
}

/** Similitud demo: HashMap / TreeMap disparan matches tipo hackathon. */
export interface SimilarMatch {
  id: string
  title: string
  similarityPct: number
}

export function computeSimilarMatches(text: string): SimilarMatch[] {
  const t = text.trim().toLowerCase()
  if (t.length < 20) return []
  const out: SimilarMatch[] = []
  if (/\bhash\s*map\b|hashmap|\btree\s*map\b|treemap/.test(t)) {
    out.push({ id: 'q-hash-1', title: '¿Cuándo usar HashMap vs TreeMap?', similarityPct: 95 })
    out.push({ id: 'q-colision', title: 'Resolución de colisiones encadenamiento', similarityPct: 72 })
  } else if (t.length >= 24) {
    out.push({ id: 'q-list', title: 'Lista enlazada vs ArrayList en Java', similarityPct: 48 })
  }
  return out
}

export const mockPendingPractices = [
  { id: 'p1', title: 'PD7 · Grafos bipartitos', dueLabel: 'Vence en 2 días', courseSlug: DEMO_COURSE_SLUG },
  { id: 'p2', title: 'PD6 · Tablas hash', dueLabel: 'Entregada', courseSlug: DEMO_COURSE_SLUG },
]

export const mockActivity = [
  { id: 'a1', text: 'Votaste una consulta en U3 · Tablas hash', time: 'Hace 2 h' },
  { id: 'a2', text: 'Nueva consulta destacada por docente en Repositorio', time: 'Ayer' },
]
