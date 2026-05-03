import { studentDemoEnabled } from '@/config/demoFlags'
import { UserRole } from '@/types'

/** Default landing path after login/register based on role and demo flags */
export function getHomePathForRole(rol: UserRole): string {
  if (rol === UserRole.ESTUDIANTE && studentDemoEnabled()) {
    return '/student/dashboard'
  }
  return '/dashboard'
}
