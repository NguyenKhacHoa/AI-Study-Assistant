import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/layouts/AuthLayout"
import { KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react"

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast.error(error.message)
    } else {
      setSuccess(true)
      toast.success("Password updated successfully!")
    }
    setLoading(false)
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-100 dark:border-emerald-900/50 shadow-sm animate-pulse">
            <CheckCircle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Password updated
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-sm">
            Your password has been successfully updated. You can now use your new password to sign in to your account.
          </p>

          <Button 
            onClick={() => navigate("/login")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-[12px] font-medium shadow-md shadow-indigo-600/10 transition-all text-sm"
          >
            Go to login
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/30">
          <KeyRound className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-8">
          Please enter your new password below. Make sure it's at least 6 characters.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={loading}
              className="focus-visible:ring-indigo-500 h-10 rounded-[12px] border-slate-200 dark:border-slate-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm new password</label>
          <Input 
            type="password" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="focus-visible:ring-indigo-500 h-10 rounded-[12px] border-slate-200 dark:border-slate-800"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-[12px] font-medium shadow-md shadow-indigo-600/10 transition-all mt-2" 
          disabled={loading}
        >
          {loading ? "Updating password..." : "Update password"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          to="/login" 
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Cancel and go back
        </Link>
      </div>
    </AuthLayout>
  )
}
