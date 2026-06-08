import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/core/auth/useAuth"

export const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
