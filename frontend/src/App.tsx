import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
import { ForgotPasswordPage } from './pages/ForgotPassword'
import { ResetPasswordPage } from './pages/ResetPassword'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardPage } from './pages/Dashboard'
import { QuizWorkspacePage } from './pages/QuizWorkspace'
import { CreateQuizPage } from './pages/CreateQuiz'
import { ProtectedRoute } from './core/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quiz-workspace" element={<QuizWorkspacePage />} />
              <Route path="/create-quiz" element={<CreateQuizPage />} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
