import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { LoadingPage } from '@/components/ui/Loading'
import { jobPositionService } from '@/services/jobPositionService'
import { organizationService } from '@/services/organizationService'
import type { CreateJobPositionRequest, Organization, Seniority } from '@/types'
import { toast } from 'sonner'

const SENIORITY_OPTIONS = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'SEMI_SENIOR', label: 'Semi Senior' },
  { value: 'SENIOR', label: 'Senior' },
]

const TECHNOLOGY_OPTIONS = [
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'C#',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'React',
  'Angular',
  'Vue',
  'Node.js',
  'Spring Boot',
  'Django',
  'Flask',
  '.NET',
]

export function PositionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [formData, setFormData] = useState<CreateJobPositionRequest>({
    organizacionId: '',
    titulo: '',
    descripcion: '',
    tecnologia: '',
    seniority: 'JUNIOR' as Seniority,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadOrganizations()
    if (isEdit && id) {
      loadPosition(id)
    }
  }, [id, isEdit])

  const loadOrganizations = async () => {
    try {
      const data = await organizationService.getAll()
      setOrganizations(data)
      if (data.length > 0 && !formData.organizacionId) {
        setFormData(prev => ({ ...prev, organizacionId: data[0].id }))
      }
    } catch (error) {
      toast.error('Failed to load organizations')
      console.error(error)
    }
  }

  const loadPosition = async (positionId: string) => {
    try {
      setLoading(true)
      const position = await jobPositionService.getById(positionId)
      setFormData({
        organizacionId: position.organizacionId,
        titulo: position.titulo,
        descripcion: position.descripcion,
        tecnologia: position.tecnologia,
        seniority: position.seniority,
      })
    } catch (error) {
      toast.error('Failed to load position')
      console.error(error)
      navigate('/positions')
    } finally {
      setLoading(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.organizacionId) {
      newErrors.organizacionId = 'Organization is required'
    }
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Title is required'
    } else if (formData.titulo.length < 3) {
      newErrors.titulo = 'Title must be at least 3 characters'
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Description is required'
    }
    if (!formData.tecnologia) {
      newErrors.tecnologia = 'Technology is required'
    }
    if (!formData.seniority) {
      newErrors.seniority = 'Seniority is required'
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
        await jobPositionService.update(id, formData)
        toast.success('Position updated successfully')
      } else {
        await jobPositionService.create(formData)
        toast.success('Position created successfully')
      }
      navigate('/positions')
    } catch (error) {
      toast.error(isEdit ? 'Failed to update position' : 'Failed to create position')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateJobPositionRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading && isEdit) return <LoadingPage />

  if (organizations.length === 0 && !loading) {
    return (
      <Layout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">You need to create an organization first</p>
            <Button variant="primary" onClick={() => navigate('/organizations/new')}>
              Create Organization
            </Button>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Position' : 'Create Position'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update position details' : 'Define a new job position'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Organization"
                value={formData.organizacionId}
                onChange={(e) => handleChange('organizacionId', e.target.value)}
                error={errors.organizacionId}
                options={organizations.map(org => ({
                  value: org.id,
                  label: org.nombre
                }))}
                required
              />

              <Input
                label="Position Title"
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                error={errors.titulo}
                placeholder="e.g., Senior Backend Developer"
                required
              />

              <Textarea
                label="Description"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                error={errors.descripcion}
                placeholder="Describe the position requirements and responsibilities"
                rows={4}
                required
              />

              <Select
                label="Technology"
                value={formData.tecnologia}
                onChange={(e) => handleChange('tecnologia', e.target.value)}
                error={errors.tecnologia}
                options={[
                  { value: '', label: 'Select a technology' },
                  ...TECHNOLOGY_OPTIONS.map(tech => ({
                    value: tech,
                    label: tech
                  }))
                ]}
                required
              />

              <Select
                label="Seniority Level"
                value={formData.seniority}
                onChange={(e) => handleChange('seniority', e.target.value as Seniority)}
                error={errors.seniority}
                options={SENIORITY_OPTIONS}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Position' : 'Create Position'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/positions')}
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