import React, { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/layouts/AuthLayout"
import { ShieldCheck, ArrowLeft, MailOpen } from "lucide-react"

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error(error.message)
    } else {
      setSubmitted(true)
      toast.success("Password reset link sent to your email!")
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Reset link resent successfully!")
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center">
          {/* Envelope Icon Container */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/50 shadow-sm animate-bounce">
            <MailOpen className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Check your inbox
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-sm">
            We've sent a secure password reset link to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>. Please click the link to reset your password.
          </p>

          <div className="w-full space-y-3">
            <a 
              href="https://mail.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center h-10 px-4 rounded-[12px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/10 transition-all text-sm"
            >
              Open Gmail
            </a>

            <Button
              variant="outline"
              onClick={handleResend}
              disabled={loading}
              className="w-full border-slate-200 dark:border-slate-800 h-10 rounded-[12px] font-medium text-slate-700 dark:text-slate-300 transition-all text-sm"
            >
              {loading ? "Resending..." : "Resend email link"}
            </Button>
          </div>

          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 mt-8 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        {/* Shield Icon Container for Trust and Security */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/30">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-8">
          No worries! Enter the email address associated with your account, and we'll send you a secure link to reset it.
        </p>
      </div>

      <form onSubmit={handleResetRequest} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
          <Input 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={loading}
            className="focus-visible:ring-indigo-500 h-10 rounded-[12px] border-slate-200 dark:border-slate-800"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-[12px] font-medium shadow-md shadow-indigo-600/10 transition-all" 
          disabled={loading}
        >
          {loading ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  )
}
