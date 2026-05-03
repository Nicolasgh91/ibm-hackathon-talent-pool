import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StudentDemoBanner } from '@/components/student/StudentDemoBanner'
import {
  DEMO_COURSE_SLUG,
  computeSimilarMatches,
  type SimilarMatch,
} from '@/mocks/studentCourseMock'

const DEBOUNCE_MS = 400
const MIN_CHARS_SIMILARITY = 20

export function StudentNewQuery() {
  const { courseId } = useParams()
  const slug = courseId ?? DEMO_COURSE_SLUG
  const [text, setText] = useState('')
  const [debounced, setDebounced] = useState('')
  const [publicClass, setPublicClass] = useState(true)
  const [resolvedChoice, setResolvedChoice] = useState<'pending' | 'resolved' | 'distinct'>('pending')
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState<string | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(text), DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [text])

  const matches: SimilarMatch[] = useMemo(() => {
    if (debounced.trim().length < MIN_CHARS_SIMILARITY) return []
    return computeSimilarMatches(debounced)
  }, [debounced])

  const showSimilarPanel = debounced.trim().length >= MIN_CHARS_SIMILARITY && matches.length > 0

  const handleResolved = useCallback(() => {
    setResolvedChoice('resolved')
    toast.success('¡Genial! Ahorraste una llamada al modelo — contabilizado como “ayudó a otro”.')
  }, [])

  const handleDistinct = useCallback(() => {
    setResolvedChoice('distinct')
    setIaAnswer(null)
  }, [])

  const runIa = useCallback(() => {
    setIaLoading(true)
    setIaAnswer(null)
    window.setTimeout(() => {
      setIaLoading(false)
      setIaAnswer(
        `Podés usar \`HashMap\` cuando no necesitás orden; si necesitás recorrer claves ordenadas, \`TreeMap\`.

\`\`\`java
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);
\`\`\`

Recordá revisar el costo esperado en el peor caso vs caso promedio.`,
      )
      toast.message('Respuesta generada (demo local)')
    }, 3000)
  }, [])

  const privacyHint = useMemo(
    () =>
      publicClass
        ? 'Visible para la clase (por defecto).'
        : 'Privada: solo vos la ves en tu lista; otros ven conteo agregado (demo).',
    [publicClass],
  )

  return (
    <Layout>
      <StudentDemoBanner />

      <div className="mb-6">
        <Link
          to={`/student/courses/${slug}/repository`}
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← Volver al repositorio
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Nueva consulta</h1>
        <p className="text-slate-600">
          Escribí al menos {MIN_CHARS_SIMILARITY} caracteres para activar el caché colaborativo (probá “HashMap”).
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tu pregunta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="min-h-[140px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              placeholder="Ej: ¿Cuándo conviene TreeMap frente a HashMap en Java?"
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setResolvedChoice('pending')
                setIaAnswer(null)
              }}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={publicClass}
                  onChange={() => setPublicClass((p) => !p)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Compartir con la clase
              </label>
              {!publicClass && (
                <span className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-white">
                  Privada
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{privacyHint}</p>
          </CardContent>
        </Card>

        {showSimilarPanel && resolvedChoice === 'pending' && (
          <Card className="border-teal-200 bg-teal-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Consultas similares encontradas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700">
                Encontramos respuestas previas antes de llamar al modelo — elegí si tu duda ya está cubierta.
              </p>
              <ul className="space-y-3">
                {matches.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg border border-teal-100 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900">{m.title}</span>
                      <span className="text-sm font-semibold text-teal-700">{m.similarityPct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-500 transition-all duration-500"
                        style={{ width: `${m.similarityPct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                  onClick={handleResolved}
                >
                  Mi duda está resuelta
                </Button>
                <Button variant="secondary" onClick={handleDistinct}>
                  Mi duda es distinta, continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {resolvedChoice === 'distinct' && (
          <Card>
            <CardHeader>
              <CardTitle>Generar con IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!iaAnswer && !iaLoading && (
                <Button className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500" onClick={runIa}>
                  Pedir respuesta (demo ~3s)
                </Button>
              )}
              {iaLoading && (
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                  Generando respuesta…
                </p>
              )}
              {iaAnswer && (
                <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-100 whitespace-pre-wrap">
                  {iaAnswer}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {resolvedChoice === 'resolved' && (
          <p className="text-center text-sm text-slate-600">
            Podés seguir explorando el{' '}
            <Link className="font-medium text-teal-700 underline" to={`/student/courses/${slug}/repository`}>
              repositorio
            </Link>
            .
          </p>
        )}
      </div>
    </Layout>
  )
}
