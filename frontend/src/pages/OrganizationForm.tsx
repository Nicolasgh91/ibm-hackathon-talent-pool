import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { LoadingPage } from '@/components/ui/Loading'
import { organizationService } from '@/services/organizationService'
import type { CreateOrganizationRequest } from '@/types'
import { toast } from 'sonner'

export function OrganizationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    nombre: '',
    descripcion: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit && id) {
      loadOrganization(id)
    }
  }, [id, isEdit])

  const loadOrganization = async (orgId: string) => {
    try {
      setLoading(true)
      const org = await organizationService.getById(orgId)
      setFormData({
        nombre: org.nombre,
        descripcion: org.descripcion || '',
      })
    } catch (error) {
      toast.error('Failed to load organization')
      console.error(error)
      navigate('/organizations')
    } finally {
      setLoading(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Name is required'
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'Name must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)
      if (isEdit && id) {
        await organizationService.update(id, formData)
        toast.success('Organization updated successfully')
      } else {
        await organizationService.create(formData)
        toast.success('Organization created successfully')
      }
      navigate('/organizations')
    } catch (error) {
      toast.error(isEdit ? 'Failed to update organization' : 'Failed to create organization')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateOrganizationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading && isEdit) return <LoadingPage />

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Organization' : 'Create Organization'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update organization details' : 'Add a new organization to manage positions'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Organization Name"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                error={errors.nombre}
                placeholder="e.g., Tech Corp"
                required
              />

              <Textarea
                label="Description"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                error={errors.descripcion}
                placeholder="Brief description of the organization (optional)"
                rows={4}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Organization' : 'Create Organization'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/organizations')}
                  disabled={loading}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

// Made with Bob