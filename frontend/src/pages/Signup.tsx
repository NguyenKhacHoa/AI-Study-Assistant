import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/layouts/AuthLayout"
import { Eye, EyeOff } from "lucide-react"

export const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState<"none" | "weak" | "medium" | "strong">("none")
  const [strengthPercentage, setStrengthPercentage] = useState(0)

  useEffect(() => {
    if (!password) {
      setPasswordStrength("none")
      setStrengthPercentage(0)
      return
    }

    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 10) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) {
      setPasswordStrength("weak")
      setStrengthPercentage(33)
    } else if (score <= 4) {
      setPasswordStrength("medium")
      setStrengthPercentage(66)
    } else {
      setPasswordStrength("strong")
      setStrengthPercentage(100)
    }
  }, [password])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      // If Supabase is configured with email confirmation, inform the user
      if (data.user && data.session === null) {
        toast.success("Registration successful! Please check your email for confirmation link.")
      } else {
        toast.success("Account created successfully!")
        navigate("/dashboard")
      }
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) {
      toast.error(error.message)
    }
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-rose-500"
      case "medium": return "bg-amber-500"
      case "strong": return "bg-emerald-500"
      default: return "bg-slate-200 dark:bg-slate-800"
    }
  }

  const getStrengthText = () => {
    switch (passwordStrength) {
      case "weak": return "Weak"
      case "medium": return "Medium"
      case "strong": return "Strong"
      default: return ""
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Start your AI-powered learning journey today.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            disabled={loading}
            className="focus-visible:ring-indigo-500 h-10 rounded-[12px] border-slate-200 dark:border-slate-800"
          />
        </div>

        {/* Email Address */}
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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
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
          
          {/* Password Strength Indicator */}
          {passwordStrength !== "none" && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Password strength</span>
                <span className={`font-semibold ${
                  passwordStrength === "weak" ? "text-rose-500" :
                  passwordStrength === "medium" ? "text-amber-500" : "text-emerald-500"
                }`}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${strengthPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-[12px] font-medium shadow-md shadow-indigo-600/10 transition-all mt-2" 
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
      
      <div className="mt-6 flex items-center justify-center">
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
        <span className="px-3 text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">or</span>
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
      </div>

      {/* Google Signup */}
      <Button 
        variant="outline" 
        className="mt-6 w-full flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 rounded-[12px] font-medium transition-all"
        onClick={handleGoogleSignup}
        disabled={loading}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </Button>

      {/* Already have an account link */}
      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link 
          to="/login" 
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
