import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { StudentDemoBanner } from '@/components/student/StudentDemoBanner'
import {
  DEMO_COURSE_SLUG,
  mockActivity,
  mockCourseTitle,
  mockPendingPractices,
  mockRepoQueries,
} from '@/mocks/studentCourseMock'

export function StudentDashboard() {
  const { user } = useAuth()
  const repoCount = mockRepoQueries.length

  return (
    <Layout>
      <StudentDemoBanner />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hola, {user?.nombre}
          </h1>
          <p className="mt-2 text-slate-600">
            Tu panel de estudiante — prácticas, curso y repositorio colaborativo.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Consultas en el repo', value: String(repoCount + 35), hint: 'mock curso' },
            { label: 'Prácticas pendientes', value: '1', hint: 'PD7' },
            { label: 'Promedio (mock)', value: '8.4', hint: '/10' },
            { label: 'Racha', value: '5 días', hint: 'demo' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500">{s.label}</p>
                <p className="mt-2 text-3xl font-bold text-teal-700">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400">{s.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Prácticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPendingPractices.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{p.title}</p>
                    <p className="text-sm text-slate-500">{p.dueLabel}</p>
                  </div>
                  <Link to={`/student/courses/${p.courseSlug}`}>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
                      Ir al curso
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tu curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900">{mockCourseTitle}</p>
                <p className="text-sm text-slate-500">5 unidades · {repoCount + 35} consultas en repo (mock)</p>
              </div>
              <Link to={`/student/courses/${DEMO_COURSE_SLUG}`}>
                <Button fullWidth className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
                  Abrir curso
                </Button>
              </Link>
              <Link to={`/student/courses/${DEMO_COURSE_SLUG}/repository`}>
                <Button variant="secondary" fullWidth>
                  Ir al repositorio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActivity.map((a) => (
                <div key={a.id} className="border-b border-slate-100 pb-3 last:border-0">
                  <p className="text-slate-800">{a.text}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-teal-100 bg-teal-50/60">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-700">
                Completá tu perfil para recomendaciones y visibilidad futura en el pool de talento.
              </p>
              <Link to="/dashboard">
                <Button variant="secondary" size="sm">
                  Ver dashboard general
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
