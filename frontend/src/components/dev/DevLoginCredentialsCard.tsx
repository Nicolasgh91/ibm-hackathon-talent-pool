import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { UserRole } from '@/types'

export interface DevCredential {
  email: string
  password: string
  rol: UserRole
  label: string
}

interface DevLoginCredentialsCardProps {
  onPick: (cred: { email: string; password: string; rol: UserRole }) => void
}

const DEV_CREDENTIALS: DevCredential[] = [
  { email: 'recruiter@acme.com', password: 'Demo123!', rol: UserRole.RECLUTADOR, label: 'Recruiter' },
  { email: 'ana@example.com', password: 'Demo123!', rol: UserRole.CANDIDATO, label: 'Candidate' },
  { email: 'pedro@example.com', password: 'Demo123!', rol: UserRole.CANDIDATO, label: 'Candidate' },
  { email: 'lucia@example.com', password: 'Demo123!', rol: UserRole.CANDIDATO, label: 'Candidate' },
  { email: 'estudiante@example.com', password: 'Demo123!', rol: UserRole.ESTUDIANTE, label: 'Student' },
]

const ROLE_VARIANT: Record<UserRole, 'success' | 'info' | 'warning' | 'default'> = {
  RECLUTADOR: 'success',
  CANDIDATO: 'info',
  DOCENTE: 'warning',
  ESTUDIANTE: 'warning',
}

export function DevLoginCredentialsCard({ onPick }: DevLoginCredentialsCardProps) {
  return (
    <Card className="mt-6 border-dashed border-amber-300 bg-amber-50/40" padding="md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Demo credentials</CardTitle>
          <Badge variant="warning" size="sm">Dev only</Badge>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Click <strong>Use</strong> to fill the form and pre-set the persona for that email.
          Hidden in production builds.
        </p>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {DEV_CREDENTIALS.map((cred) => (
            <li
              key={cred.email}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-xs text-gray-800">{cred.email}</span>
                  <Badge variant={ROLE_VARIANT[cred.rol]} size="sm">
                    {cred.label}
                  </Badge>
                </div>
                <div className="mt-0.5 font-mono text-xs text-gray-500">
                  password: {cred.password}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPick({ email: cred.email, password: cred.password, rol: cred.rol })}
                className="shrink-0 rounded-md border border-primary-300 bg-white px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Use
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Made with Bob
