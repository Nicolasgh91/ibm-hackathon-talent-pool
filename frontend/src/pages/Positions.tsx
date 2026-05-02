import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Select } from '@/components/ui/Select'
import { LoadingPage } from '@/components/ui/Loading'
import { jobPositionService } from '@/services/jobPositionService'
import { organizationService } from '@/services/organizationService'
import type { JobPosition, Organization } from '@/types'
import { toast } from 'sonner'

export function Positions() {
  const [positions, setPositions] = useState<JobPosition[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrganizations()
  }, [])

  useEffect(() => {
    loadPositions()
  }, [selectedOrgId])

  const loadOrganizations = async () => {
    try {
      const data = await organizationService.getAll()
      setOrganizations(data)
    } catch (error) {
      toast.error('Failed to load organizations')
      console.error(error)
    }
  }

  const loadPositions = async () => {
    try {
      setLoading(true)
      const data = await jobPositionService.getAll(selectedOrgId || undefined)
      setPositions(data)
    } catch (error) {
      toast.error('Failed to load positions')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return

    try {
      await jobPositionService.delete(id)
      toast.success('Position deleted successfully')
      loadPositions()
    } catch (error) {
      toast.error('Failed to delete position')
      console.error(error)
    }
  }

  const handleToggleStatus = async (position: JobPosition) => {
    try {
      if (position.estado === 'ACTIVO') {
        await jobPositionService.deactivate(position.id)
        toast.success('Position deactivated')
      } else {
        await jobPositionService.activate(position.id)
        toast.success('Position activated')
      }
      loadPositions()
    } catch (error) {
      toast.error('Failed to update position status')
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const isActive = status === 'ACTIVO'
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    )
  }

  if (loading) return <LoadingPage />

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Positions</h1>
            <p className="mt-2 text-gray-600">Manage job positions and generate challenges</p>
          </div>
          <Link to="/positions/new">
            <Button variant="primary">
              + Create Position
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Select
                  label="Filter by Organization"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  options={[
                    { value: '', label: 'All Organizations' },
                    ...organizations.map(org => ({
                      value: org.id,
                      label: org.nombre
                    }))
                  ]}
                />
              </div>
              {selectedOrgId && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedOrgId('')}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {positions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">
                {selectedOrgId ? 'No positions found for this organization' : 'No positions yet'}
              </p>
              <Link to="/positions/new">
                <Button variant="primary">Create your first position</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Positions ({positions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Technology</TableHead>
                    <TableHead>Seniority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.titulo}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {position.tecnologia}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {position.seniority.replace('_', ' ')}
                      </TableCell>
                      <TableCell>{getStatusBadge(position.estado)}</TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(position.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/challenges/generate?positionId=${position.id}`}>
                          <Button variant="primary" size="sm">
                            Generate Challenge
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(position)}
                        >
                          {position.estado === 'ACTIVO' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Link to={`/positions/${position.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(position.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

// Made with Bob