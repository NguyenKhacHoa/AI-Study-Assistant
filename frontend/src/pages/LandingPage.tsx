import React, { useRef } from "react"
import { Link } from "react-router-dom"
import { 
  Brain, 
  Sparkles, 
  Upload, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  Check, 
  Lightbulb,
  Award,
  BookOpenCheck,
  Zap,
  Users
} from "lucide-react"
import { Card } from "@/components/ui/card"

export const LandingPage: React.FC = () => {
  const demoRef = useRef<HTMLDivElement>(null)

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Soft Indigo Mesh Blobs */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-200/40 to-violet-200/40 blur-[130px] animate-pulse duration-10000" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-100/30 to-purple-200/40 blur-[120px]" />
        <div className="absolute top-[60%] -left-40 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-100/40 to-indigo-100/50 blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-indigo-600 tracking-tight">StudyAI</span>
            </Link>

            {/* CTA / Auth Links */}
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100/60"
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center text-sm font-semibold h-9 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100/80 text-indigo-700 shadow-sm backdrop-blur-sm animate-fade-in mb-8 select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            ✨ AI-Powered Study Assistant
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] max-w-4xl mx-auto">
            Supercharge Your <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Learning</span> with <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your notes, PDFs, and textbooks into personalized quizzes and flashcards in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
            >
              Start Learning for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={scrollToDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
            >
              View Demo
            </button>
          </div>

          {/* Hero Visual - Dashboard Mockup */}
          <div ref={demoRef} className="mt-20 relative select-none">
            {/* Glowing background highlights behind the card */}
            <div className="absolute inset-0 -z-10 bg-indigo-500/10 blur-[100px] rounded-3xl scale-95" />
            
            <Card className="rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden bg-slate-900 text-white max-w-5xl mx-auto">
              {/* Mockup Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 block"></span>
                  </div>
                  <div className="h-4 w-px bg-slate-800 mx-2"></div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Workspace / Cellular_Biology_Quiz</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-md">
                    <span>Model:</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Gemini 3.5
                    </span>
                  </div>
                </div>
              </div>

              {/* Mockup App Workspace Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                {/* Left Sidebar Mockup */}
                <div className="hidden md:block md:col-span-3 border-r border-slate-800 bg-slate-950/40 p-4 space-y-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">Main Menu</div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-600/10 text-indigo-400 text-xs font-semibold">
                      <Brain className="w-4 h-4" />
                      <span>Quiz Generator</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 text-xs font-medium transition-colors">
                      <BookOpenCheck className="w-4 h-4" />
                      <span>My Quizzes</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 text-xs font-medium transition-colors">
                      <Lightbulb className="w-4 h-4" />
                      <span>Flashcards</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-1">Recent Uploads</div>
                    <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                      <span className="truncate flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        biology-ch2.pdf
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0">1.2 MB</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                      <span className="truncate flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        history-notes.txt
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0">45 KB</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Pane */}
                <div className="col-span-1 md:col-span-9 p-6 flex flex-col gap-6 bg-slate-900/60">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Source Documents Panel */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Study Sources</h3>
                        <p className="text-xs text-slate-400">Upload notes, PDFs, or slides to extract content.</p>
                      </div>

                      {/* Dashed Drag/Drop Mockup */}
                      <div className="border border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-950/20 hover:border-indigo-500/50 transition-colors">
                        <Upload className="w-8 h-8 text-indigo-400 mb-2.5 animate-bounce duration-[2000ms]" />
                        <span className="text-xs font-semibold text-slate-200">Drag & Drop Study Files</span>
                        <span className="text-[10px] text-slate-500 mt-1">Supports PDF, DOCX, TXT (Max 20MB)</span>
                      </div>

                      {/* Active Analysis Progress */}
                      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin duration-[4000ms]" />
                            Analyzing: photosynthesis.pdf
                          </span>
                          <span className="text-indigo-400 font-mono font-bold">84%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300" style={{ width: "84%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Generated AI Quiz */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">AI Generated Preview</h3>
                        <p className="text-xs text-slate-400">Instantly quiz yourself on key concepts.</p>
                      </div>

                      {/* Mock Question Card */}
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3.5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-2 py-0.5 rounded-bl-lg">
                          <span className="text-[9px] text-indigo-400 font-bold tracking-wider uppercase">Question 1</span>
                        </div>

                        <p className="text-xs font-semibold text-slate-200 pr-12 leading-relaxed">
                          Which molecule acts as the primary electron carrier during the light-dependent reactions of photosynthesis?
                        </p>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/50 text-xs text-slate-400">
                            <span className="font-semibold">A</span>
                            <span>NADH</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 font-medium">
                            <div className="flex items-center gap-2.5">
                              <span className="font-semibold text-emerald-400">B</span>
                              <span>NADPH</span>
                            </div>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/50 text-xs text-slate-400">
                            <span className="font-semibold">C</span>
                            <span>FADH2</span>
                          </div>
                        </div>

                        {/* Explanation Box */}
                        <div className="bg-slate-900/80 border border-slate-800/60 rounded-lg p-3 text-[11px] leading-relaxed text-indigo-300">
                          <span className="font-semibold text-slate-200 block mb-0.5">✨ AI Explanation:</span>
                          NADPH is generated during non-cyclic photophosphorylation and acts as a key reducing agent in the Calvin cycle.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Stats / Widgets Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                    <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Quizzes Created</div>
                        <div className="text-sm font-bold text-slate-200">24</div>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Flashcards</div>
                        <div className="text-sm font-bold text-slate-200">182</div>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avg. Accuracy</div>
                        <div className="text-sm font-bold text-slate-200">92.4%</div>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Questions Solved</div>
                        <div className="text-sm font-bold text-slate-200">450+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Decorative Floating Badges/Cards */}
            <div className="absolute top-10 -right-6 lg:-right-12 hidden lg:flex items-center gap-2 bg-white text-slate-900 border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</div>
                <div className="text-[11px] font-bold text-slate-800">Quiz Generated Successfully!</div>
              </div>
            </div>

            <div className="absolute bottom-12 -left-6 lg:-left-12 hidden lg:flex items-center gap-2.5 bg-white text-slate-900 border border-slate-200/80 px-4 py-2.5 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Accuracy</div>
                <div className="text-xs font-black text-indigo-600">99.8% Precision</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section className="py-24 bg-white border-y border-slate-200/50 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Why choose StudyAI?
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Experience the future of studying with our advanced AI tools designed to maximize retention and efficiency.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group border border-slate-200/80 bg-slate-50/50 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 mb-6 shadow-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Instant Quiz Generation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload any material and get highly accurate multiple-choice questions instantly.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                Learn more <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group border border-slate-200/80 bg-slate-50/50 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 mb-6 shadow-sm">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Semantic Grading</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  AI understands the meaning behind your short answers, not just exact keywords.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-purple-600 group-hover:text-purple-700">
                Learn more <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group border border-slate-200/80 bg-slate-50/50 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 mb-6 shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Collaborative Study</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Share your generated quizzes with friends with a single click.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                Learn more <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Three steps to mastery
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Accelerate your workflow and study smarter with our intuitive pipeline.
            </p>
          </div>

          {/* Steps Horizontal Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative isolate">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group relative">
              {/* Connector line (hidden on mobile, positioned absolute relative to grid) */}
              <div className="absolute top-10 left-1/2 -translate-y-1/2 w-full h-0.5 border-t border-dashed border-slate-300/80 -z-10 hidden lg:block" style={{ width: 'calc(100% - 6rem)', left: 'calc(50% + 3rem)' }} />
              
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-md group-hover:scale-105 group-hover:border-indigo-300 transition-all duration-300 mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Paste Text</h3>
              <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
                Copy-paste your notes or upload PDF textbooks and lecture slides.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group relative">
              {/* Connector line (hidden on mobile) */}
              <div className="absolute top-10 left-1/2 -translate-y-1/2 w-full h-0.5 border-t border-dashed border-slate-300/80 -z-10 hidden lg:block" style={{ width: 'calc(100% - 6rem)', left: 'calc(50% + 3rem)' }} />

              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 shadow-md group-hover:scale-105 group-hover:border-purple-300 transition-all duration-300 mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. AI Magic</h3>
              <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
                Gemini AI processes your material, extracting core concepts and definitions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group relative">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-md group-hover:scale-105 group-hover:border-emerald-300 transition-all duration-300 mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Start Quiz</h3>
              <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
                Practice immediately using interactive quizzes and study cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">StudyAI</span>
          </div>
          
          <p className="text-sm">
            &copy; 2024 StudyAI. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
