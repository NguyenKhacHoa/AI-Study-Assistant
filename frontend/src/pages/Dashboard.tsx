import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight, 
  Lightbulb, 
  Flame, 
  Calendar,
  BookOpenCheck,
  Plus
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Quiz {
  id: string
  title: string
  description: string
  created_at: string
}

interface DashboardStats {
  totalQuizzes: number
  totalQuestions: number
  streak: number
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    totalQuestions: 0,
    streak: 0
  })
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // 1. Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error("User auth error:", userError)
        setLoading(false)
        return
      }

      // 2. Fetch quizzes created by the user
      const { data: quizzes, error: quizzesError } = await supabase
        .from("quizzes")
        .select("id, title, description, created_at")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })

      if (quizzesError) {
        console.error("Error fetching quizzes:", quizzesError)
        throw quizzesError
      }

      const userQuizzes = quizzes || []
      setRecentQuizzes(userQuizzes.slice(0, 4)) // Take top 4 recent quizzes

      // 3. Fetch questions count across those quizzes
      let questionCount = 0
      if (userQuizzes.length > 0) {
        const quizIds = userQuizzes.map(q => q.id)
        const { count, error: questionsError } = await supabase
          .from("questions")
          .select("id", { count: "exact", head: true })
          .in("quiz_id", quizIds)

        if (questionsError) {
          console.error("Error fetching questions count:", questionsError)
        } else {
          questionCount = count || 0
        }
      }

      // 4. Calculate Streak
      const streak = calculateStreak(userQuizzes)

      setStats({
        totalQuizzes: userQuizzes.length,
        totalQuestions: questionCount,
        streak
      })

    } catch (err) {
      console.error("Error loading dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate streak based on quiz creation dates
  const calculateStreak = (quizzes: Quiz[]): number => {
    if (!quizzes || quizzes.length === 0) return 0

    // Extract unique dates of quiz creation formatted as YYYY-MM-DD
    const dates = Array.from(new Set(
      quizzes.map(q => new Date(q.created_at).toISOString().split('T')[0])
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // sort descending (latest first)

    const todayStr = new Date().toISOString().split('T')[0]
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // If the latest activity wasn't today or yesterday, streak is broken
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
      return 0
    }

    let streak = 1
    let currentDate = new Date(dates[0])

    for (let i = 1; i < dates.length; i++) {
      const nextDate = new Date(dates[i])
      const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
        currentDate = nextDate
      } else if (diffDays > 1) {
        break
      }
    }

    return streak
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-medium">Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your AI Workspace</h1>
          <p className="text-slate-500 mt-1">Review your active study stats and generated quizzes.</p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tile 1: Stats Card (spans 2 cols) */}
        <Card className="md:col-span-2 border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Learning Statistics
            </CardTitle>
            <CardDescription className="text-xs">Your cumulative study progress on StudyAI.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    <div className="h-4 w-24 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6 divide-x divide-slate-100">
                {/* Stats 1 */}
                <div className="flex flex-col items-start pl-2">
                  <div className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
                    {stats.totalQuizzes}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                    <BookOpenCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    Quizzes Created
                  </span>
                </div>

                {/* Stats 2 */}
                <div className="flex flex-col items-start pl-6">
                  <div className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
                    {stats.totalQuestions}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    Questions Solved
                  </span>
                </div>

                {/* Stats 3 */}
                <div className="flex flex-col items-start pl-6">
                  <div className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight flex items-center gap-1">
                    {stats.streak}
                    {stats.streak > 0 && <span className="text-lg">🔥</span>}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Study Streak
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tile 2: Quick Action (spans 1 col) */}
        <Card className="md:col-span-1 border-0 shadow-md rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 text-white flex flex-col justify-between p-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Need a study break?</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Convert your lecture recordings, PDFs, or slides into custom quizzes in a single click using advanced AI models.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/create-quiz")} 
            className="w-full mt-6 bg-white hover:bg-slate-50 text-indigo-700 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Create New Quiz <Plus className="ml-1.5 w-4 h-4 shrink-0" />
          </Button>
        </Card>

        {/* Tile 3: Recent Quizzes (spans 2 cols) */}
        <Card className="md:col-span-2 border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-indigo-500" />
                Recent Quizzes
              </CardTitle>
              <CardDescription className="text-xs">Continue studying where you left off.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg animate-pulse">
                    <div className="space-y-2 flex-1 mr-4">
                      <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                      <div className="h-3 w-2/3 bg-slate-100 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentQuizzes.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3.5">
                  <BookOpen className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">No Quizzes Created Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">
                  Click 'Create New Quiz' to upload your study files and generate your first workspace.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/30 rounded-xl transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">{quiz.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{quiz.description}</p>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(quiz.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <Link 
                      to={`/dashboard/quiz/${quiz.id}`}
                      className="inline-flex items-center justify-center text-xs font-semibold h-8 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors shrink-0"
                    >
                      Start Quiz <ArrowRight className="ml-1 w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tile 4: AI Recommendations (spans 1 col) */}
        <Card className="md:col-span-1 border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              AI Recommendations
            </CardTitle>
            <CardDescription className="text-xs">Smart study insights from Gemini.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-amber-800 block mb-1">💡 Spaced Repetition Tip</span>
                {recentQuizzes.length > 0 ? (
                  <>Try reviewing your last quiz on <strong>"{recentQuizzes[0].title}"</strong> to boost your retention rate by 20% today!</>
                ) : (
                  <>Create your first quiz to unlock personalized recommendations and study habits analysis!</>
                )}
              </div>

              <div className="p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-lg text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-indigo-800 block mb-1">⚡ Focus Recommendation</span>
                Spend 15 minutes reviewing incorrect items from this week's active recall sessions.
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
              <span>View study roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
