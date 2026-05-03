import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { toast } from 'sonner'
import type { ApiError } from '@/types'
import { authService } from '@/services/authService'
import { getHomePathForRole } from '@/utils/authRedirects'
import { devLoginHintsEnabled } from '@/config/demoFlags'
import { DevLoginCredentialsCard } from '@/components/dev/DevLoginCredentialsCard'

export function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    try {
      await login(formData)
      toast.success('Login successful!')
      const u = authService.getUser()
      const redirectTo = searchParams.get('redirect')
      const next =
        redirectTo && redirectTo.startsWith('/') ? redirectTo : u ? getHomePathForRole(u.rol) : '/dashboard'
      navigate(next)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">Talent Pool</h1>
          <p className="text-gray-600">AI-powered technical challenges</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-teal-600 hover:text-teal-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {devLoginHintsEnabled() && (
          <DevLoginCredentialsCard
            onPick={({ email, password, rol }) => {
              authService.saveRoleForEmail(email, rol)
              setFormData({ email, password })
              setErrors({})
            }}
          />
        )}
      </div>
    </div>
  )
}

// Made with Bob