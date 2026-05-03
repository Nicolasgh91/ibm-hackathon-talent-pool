import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { StudentDemoBanner } from '@/components/student/StudentDemoBanner'
import {
  DEMO_COURSE_SLUG,
  mockRepoQueries,
  mockUnits,
  type RepoQuerySummary,
} from '@/mocks/studentCourseMock'

function sectionTitle(emoji: string, label: string) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>{emoji}</span> {label}
    </h3>
  )
}

function QueryCard({ q, courseSlug }: { q: RepoQuerySummary; courseSlug: string }) {
  return (
    <Link
      to={`/student/courses/${courseSlug}/repository/q/${q.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-slate-900">{q.title}</p>
        <div className="flex items-center gap-2">
          {q.destacadaDocente && (
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Docente
            </span>
          )}
          <span className="text-xs font-semibold text-teal-700">▲ {q.votos}</span>
        </div>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{q.excerpt}</p>
    </Link>
  )
}

export function StudentRepository() {
  const { courseId } = useParams()
  const slug = courseId ?? DEMO_COURSE_SLUG
  const [unitId, setUnitId] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = mockRepoQueries
    if (unitId !== 'all') list = list.filter((q) => q.unitId === unitId)
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          q.excerpt.toLowerCase().includes(s),
      )
    }
    return list
  }, [unitId, search])

  const masVotadas = useMemo(
    () => [...filtered].sort((a, b) => b.votos - a.votos).slice(0, 5),
    [filtered],
  )
  const recientes = useMemo(
    () => [...filtered].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO)).slice(0, 5),
    [filtered],
  )
  const destacadas = useMemo(() => filtered.filter((q) => q.destacadaDocente), [filtered])

  return (
    <Layout>
      <StudentDemoBanner />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Repositorio colaborativo</h1>
          <p className="text-slate-600">Organizado por unidades del cronograma · curso {slug}</p>
        </div>
        <Link
          to={`/student/courses/${slug}/repository/new`}
          className="inline-flex justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Hacer nueva consulta
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <Card className="sticky top-4">
            <CardContent className="pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Unidades
              </p>
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => setUnitId('all')}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                      unitId === 'all' ? 'bg-teal-100 font-medium text-teal-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    Todas
                  </button>
                </li>
                {mockUnits.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => setUnitId(u.id)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                        unitId === u.id
                          ? 'bg-teal-100 font-medium text-teal-900'
                          : 'hover:bg-slate-50'
                      } ${u.activa ? 'ring-1 ring-teal-400' : ''}`}
                    >
                      <span className="pr-2">{u.label}</span>
                      <span className="text-xs text-slate-500">{u.queryCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <Input
            label="Buscar en el repositorio"
            placeholder="Filtrar por título o extracto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <section>
            {sectionTitle('🔥', 'Más votadas')}
            <div className="grid gap-3 md:grid-cols-2">
              {masVotadas.map((q) => (
                <QueryCard key={q.id} q={q} courseSlug={slug} />
              ))}
              {masVotadas.length === 0 && (
                <p className="text-sm text-slate-500">Sin resultados en esta unidad/búsqueda.</p>
              )}
            </div>
          </section>

          <section>
            {sectionTitle('🆕', 'Recientes')}
            <div className="grid gap-3 md:grid-cols-2">
              {recientes.map((q) => (
                <QueryCard key={`r-${q.id}`} q={q} courseSlug={slug} />
              ))}
            </div>
          </section>

          <section>
            {sectionTitle('📌', 'Destacadas por docente')}
            <div className="grid gap-3 md:grid-cols-2">
              {destacadas.map((q) => (
                <QueryCard key={`d-${q.id}`} q={q} courseSlug={slug} />
              ))}
              {destacadas.length === 0 && (
                <p className="text-sm text-slate-500">No hay destacadas en el filtro actual.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
