import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StudentDemoBanner } from '@/components/student/StudentDemoBanner'
import {
  DEMO_COURSE_SLUG,
  getQueryDetail,
  type RepoComment,
} from '@/mocks/studentCourseMock'

function splitAnswerBlocks(body: string): { type: 'text' | 'code'; lang?: string; content: string }[] {
  const out: { type: 'text' | 'code'; lang?: string; content: string }[] = []
  const re = /```(\w*)\n([\s\S]*?)```/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    if (m.index > last) {
      out.push({ type: 'text', content: body.slice(last, m.index) })
    }
    out.push({ type: 'code', lang: m[1] || 'text', content: m[2].trimEnd() })
    last = m.index + m[0].length
  }
  if (last < body.length) {
    out.push({ type: 'text', content: body.slice(last) })
  }
  return out.length ? out : [{ type: 'text', content: body }]
}

export function StudentQueryDetail() {
  const { courseId, queryId } = useParams()
  const slug = courseId ?? DEMO_COURSE_SLUG
  const qid = queryId ?? 'q-hash-1'
  const detail = getQueryDetail(qid)
  const [votes, setVotes] = useState(detail?.votos ?? 0)
  const [votePulse, setVotePulse] = useState<'up' | 'down' | null>(null)
  const [commentText, setCommentText] = useState('')

  const sortedComments = useMemo(() => {
    const list = detail?.comments ?? []
    return [...list].sort((a, b) => {
      if (a.role === 'docente' && a.pinned) return -1
      if (b.role === 'docente' && b.pinned) return 1
      return 0
    })
  }, [detail?.comments])

  if (!detail) {
    return (
      <Layout>
        <p className="text-slate-600">Consulta no encontrada.</p>
      </Layout>
    )
  }

  const bump = (delta: number, dir: 'up' | 'down') => {
    setVotes((v) => v + delta)
    setVotePulse(dir)
    window.setTimeout(() => setVotePulse(null), 450)
  }

  const blocks = splitAnswerBlocks(detail.aiAnswer)

  return (
    <Layout>
      <StudentDemoBanner />

      <div className="mb-6">
        <Link
          to={`/student/courses/${slug}/repository`}
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← Repositorio
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <CardTitle className="text-xl">{detail.title}</CardTitle>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Votar positivo"
                  onClick={() => bump(1, 'up')}
                  className={`rounded-lg border border-slate-200 px-3 py-1 text-lg transition-transform hover:bg-teal-50 ${
                    votePulse === 'up' ? 'scale-110 bg-teal-100' : ''
                  }`}
                >
                  ▲
                </button>
                <span
                  className={`min-w-[2rem] text-center text-lg font-bold text-teal-800 transition-all ${
                    votePulse ? 'scale-110' : ''
                  }`}
                >
                  {votes}
                </span>
                <button
                  type="button"
                  aria-label="Votar negativo"
                  onClick={() => bump(-1, 'down')}
                  className={`rounded-lg border border-slate-200 px-3 py-1 text-lg transition-transform hover:bg-slate-50 ${
                    votePulse === 'down' ? 'scale-110 bg-slate-100' : ''
                  }`}
                >
                  ▼
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-slate-800">{detail.question}</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-100">Respuesta (IA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.map((b, idx) =>
              b.type === 'code' ? (
                <pre
                  key={idx}
                  className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-sm text-teal-100"
                >
                  <code>{b.content}</code>
                </pre>
              ) : (
                <div key={idx} className="max-w-none whitespace-pre-wrap text-slate-200">
                  {b.content}
                </div>
              ),
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comentarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {sortedComments.map((c: RepoComment) => (
                <li
                  key={c.id}
                  className={`rounded-lg border p-3 ${
                    c.role === 'docente'
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{c.author}</span>
                    {c.role === 'docente' && (
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                        Docente
                      </span>
                    )}
                    {c.pinned && <span className="text-xs text-emerald-700">Anclado</span>}
                  </div>
                  <p className="text-sm text-slate-700">{c.body}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-100 pt-4">
              <Input
                label="Agregar comentario (demo local)"
                placeholder="Escribí una respuesta breve…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                className="mt-3 bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
                size="sm"
                type="button"
                onClick={() => {
                  if (!commentText.trim()) return
                  toast.message('Comentario guardado solo en sesión (demo)')
                  setCommentText('')
                }}
              >
                Publicar (mock)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
