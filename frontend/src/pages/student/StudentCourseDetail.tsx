import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StudentDemoBanner } from '@/components/student/StudentDemoBanner'
import {
  DEMO_COURSE_SLUG,
  mockCourseTitle,
  mockPendingPractices,
  mockRepoQueries,
  mockUnits,
} from '@/mocks/studentCourseMock'

type TabKey = 'practicas' | 'repo' | 'progreso'

export function StudentCourseDetail() {
  const { courseId } = useParams()
  const [tab, setTab] = useState<TabKey>('practicas')
  const slug = courseId ?? DEMO_COURSE_SLUG

  const tabs: { id: TabKey; label: string }[] = [
    { id: 'practicas', label: 'Prácticas' },
    { id: 'repo', label: 'Repositorio' },
    { id: 'progreso', label: 'Mi progreso' },
  ]

  return (
    <Layout>
      <StudentDemoBanner />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Curso · {slug}</p>
          <h1 className="text-2xl font-bold text-slate-900">{mockCourseTitle}</h1>
        </div>
        <Link to={`/student/courses/${slug}/repository`}>
          <Button className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
            Ir al repositorio completo
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'border border-b-0 border-slate-200 bg-white text-teal-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'practicas' && (
        <Card>
          <CardHeader>
            <CardTitle>Prácticas del cuatrimestre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPendingPractices.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2"
              >
                <span className="font-medium text-slate-900">{p.title}</span>
                <span className="text-sm text-slate-500">{p.dueLabel}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === 'repo' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista embebida — Repositorio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Unidades del cronograma y extracto de consultas (mock). Abrí el repositorio para filtrar por unidad y votar.
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {mockUnits.map((u) => (
                  <div
                    key={u.id}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      u.activa ? 'border-teal-300 bg-teal-50' : 'border-slate-200'
                    }`}
                  >
                    <span className="font-medium">{u.label}</span>
                    <span className="ml-2 text-slate-500">{u.queryCount} consultas</span>
                    {u.activa && (
                      <span className="ml-2 rounded bg-teal-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                        ACTIVA
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Destacadas (preview)
                </p>
                <ul className="space-y-2">
                  {mockRepoQueries.slice(0, 3).map((q) => (
                    <li key={q.id}>
                      <Link
                        to={`/student/courses/${slug}/repository/q/${q.id}`}
                        className="text-teal-700 hover:underline"
                      >
                        {q.title}
                      </Link>
                      <span className="text-slate-400"> · {q.votos} votos</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={`/student/courses/${slug}/repository`}>
                <Button fullWidth variant="secondary">
                  Abrir repositorio en pantalla completa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'progreso' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-700">8.4</p>
              <p className="text-sm text-slate-500">Promedio global (mock)</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['HashMap', 'Grafos', 'DP', 'Complejidad', 'Ordenamiento'].map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Comparación anónima con el curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p>
                Estás <strong>por encima</strong> del mediano en el mock de participación en el repositorio (+12%).
              </p>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[72%] rounded-full bg-teal-500" />
              </div>
              <p className="text-xs text-slate-500">Tu percentil estimado: top 28% (demo)</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  )
}
