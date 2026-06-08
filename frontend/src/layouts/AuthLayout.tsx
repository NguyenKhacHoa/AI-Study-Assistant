import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';
import authIllustration from '../assets/auth-illustration.png';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Left Side: Visual Experience (Desktop Only) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-900 p-12 lg:flex">
        {/* Background Grid Mesh */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" 
          aria-hidden="true"
        />

        {/* Decorative Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo / Brand Header */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <Sparkles className="h-5 w-5 text-indigo-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Study<span className="text-indigo-300">AI</span>
          </span>
        </div>

        {/* Centered 3D Illustration */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex w-full items-center justify-center"
          >
            <motion.img
              src={authIllustration}
              alt="AI and Education Illustration"
              className="w-4/5 max-w-[380px] object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)]"
              animate={{ 
                y: [0, -12, 0],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
          <div className="mt-8 text-center max-w-sm">
            <h2 className="text-2xl font-bold text-white tracking-tight">Supercharge Your Learning</h2>
            <p className="mt-2 text-sm text-indigo-200/80 leading-relaxed">
              Unlock personalized quizzes, interactive smart notes, and real-time AI mentoring tailored to your curriculum.
            </p>
          </div>
        </div>

        {/* Floating Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 mt-auto w-full max-w-[440px] rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"
        >
          <Quote className="absolute top-4 right-4 h-8 w-8 text-white/5" />
          <p className="text-sm italic leading-relaxed text-indigo-100">
            "StudyAI has completely transformed the way I study. The personalized mock exams adapt to my weak points, helping me improve my grades within weeks!"
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
              EL
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Emily Laurent</p>
              <p className="text-[10px] text-indigo-300">Med Student @ Sorbonne University</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Form (All screen sizes) */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[400px] flex flex-col"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
