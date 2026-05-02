import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Organizations } from '@/pages/Organizations'
import { OrganizationForm } from '@/pages/OrganizationForm'
import { Positions } from '@/pages/Positions'
import { PositionForm } from '@/pages/PositionForm'
import { Challenges } from '@/pages/Challenges'
import { GenerateChallenge } from '@/pages/GenerateChallenge'
import { ChallengeReview } from '@/pages/ChallengeReview'
import { Rankings } from '@/pages/Rankings'
import { Invitations } from '@/pages/Invitations'
import { MyChallenges } from '@/pages/MyChallenges'
import { SolveChallenge } from '@/pages/SolveChallenge'
import { EvaluationFeedback } from '@/pages/EvaluationFeedback'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Organizations */}
          <Route
            path="/organizations"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <Organizations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/new"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <OrganizationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <OrganizationForm />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Positions */}
          <Route
            path="/positions"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <Positions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/positions/new"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <PositionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/positions/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <PositionForm />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Challenges */}
          <Route
            path="/challenges"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <Challenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/generate"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <GenerateChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:id/review"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <ChallengeReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:id/solve"
            element={
              <ProtectedRoute allowedRoles={['CANDIDATO']}>
                <SolveChallenge />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Rankings */}
          <Route
            path="/rankings"
            element={
              <ProtectedRoute allowedRoles={['RECLUTADOR']}>
                <Rankings />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Candidate */}
          <Route
            path="/invitations"
            element={
              <ProtectedRoute allowedRoles={['CANDIDATO']}>
                <Invitations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-challenges"
            element={
              <ProtectedRoute allowedRoles={['CANDIDATO']}>
                <MyChallenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/:id/feedback"
            element={
              <ProtectedRoute allowedRoles={['CANDIDATO']}>
                <EvaluationFeedback />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

// Made with Bob
