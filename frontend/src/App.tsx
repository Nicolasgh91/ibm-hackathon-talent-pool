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
import { UserRole } from '@/types'
import { StudentDemoGate } from '@/components/student/StudentDemoGate'
import { StudentDashboard } from '@/pages/student/StudentDashboard'
import { StudentCourseDetail } from '@/pages/student/StudentCourseDetail'
import { StudentRepository } from '@/pages/student/StudentRepository'
import { StudentNewQuery } from '@/pages/student/StudentNewQuery'
import { StudentQueryDetail } from '@/pages/student/StudentQueryDetail'
import { DemoModeBanner } from '@/components/dev/DemoModeBanner'
import { AcceptInvitation } from '@/pages/AcceptInvitation'
import { Chat } from '@/pages/Chat'
import './App.css'

// Routing: corporate recruiter/candidate paths unchanged; academic student flows under /student/* (prototype IA).

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <DemoModeBanner />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          
          {/* Protected Routes - Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
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

          {/* Student (academic) — Phase 5 demo, mock-first */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ESTUDIANTE]}>
                <StudentDemoGate>
                  <StudentDashboard />
                </StudentDemoGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ESTUDIANTE]}>
                <StudentDemoGate>
                  <StudentCourseDetail />
                </StudentDemoGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:courseId/repository"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ESTUDIANTE]}>
                <StudentDemoGate>
                  <StudentRepository />
                </StudentDemoGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:courseId/repository/new"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ESTUDIANTE]}>
                <StudentDemoGate>
                  <StudentNewQuery />
                </StudentDemoGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:courseId/repository/q/:queryId"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ESTUDIANTE]}>
                <StudentDemoGate>
                  <StudentQueryDetail />
                </StudentDemoGate>
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
