import React from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { BookOpen, LayoutDashboard, Settings, User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="text-xl font-bold text-gray-900">StudyAI</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/quiz-workspace"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Quiz Workspace
          </NavLink>
          <NavLink
            to="/create-quiz"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Quiz
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-1.5">
          <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center w-full justify-start px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-gray-800">Welcome Back</h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
