import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  BookOpenCheck,
  Lightbulb
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Question {
  id: string
  question_text: string
  options: string[] // Options format in PostgreSQL is JSONB containing ["A", "B", "C", "D"]
  correct_answer: string
  explanation: string
}

interface Quiz {
  id: string
  title: string
  description: string
  creator_id: string
  created_at: string
}

export const QuizWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  
  // Quiz taking state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Fallback state if no ID was provided (list all quizzes)
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    if (id) {
      fetchQuizDetails(id)
    } else {
      fetchAllUserQuizzes()
    }
  }, [id])

  const fetchQuizDetails = async (quizId: string) => {
    setLoading(true)
    setAccessDenied(false)
    setSubmitted(false)
    setSelectedAnswers({})
    
    try {
      // 1. Fetch the quiz
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .maybeSingle()

      if (quizError || !quizData) {
        console.error("Quiz not found or unauthorized:", quizError)
        setAccessDenied(true)
        setLoading(false)
        return
      }

      setQuiz(quizData)

      // 2. Fetch associated questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quizId)

      if (questionsError || !questionsData) {
        console.error("Error loading questions:", questionsError)
        toast.error("Failed to load quiz questions.")
      } else {
        setQuestions(questionsData)
      }

    } catch (err) {
      console.error("Error fetching workspace details:", err)
      setAccessDenied(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUserQuizzes = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user quizzes:", error)
      } else {
        setUserQuizzes(data || [])
      }
    } catch (err) {
      console.error("Error loading quizzes list:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = (questionId: string, option: string) => {
    if (submitted) return
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }))
  }

  const handleSubmitQuiz = () => {
    // Verify all questions have been answered
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length
    if (unansweredCount > 0) {
      toast.error(`Please answer all questions before submitting. (${unansweredCount} remaining)`)
      return
    }

    // Calculate score
    let correctCount = 0
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)
    toast.success("Quiz submitted! Scroll down to review answers.")
  }

  const handleRetakeQuiz = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setScore(0)
    toast.info("Quiz reset. Good luck!")
  }

  // Access Denied Screen
  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white border border-slate-200/80 rounded-xl shadow-sm max-w-lg mx-auto mt-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 animate-bounce">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Access Denied</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          You do not have permission to view this quiz, or it does not exist. Please check that you are logged in to the correct account.
        </p>
        <Button onClick={() => navigate("/dashboard")} className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4 shadow-md shadow-indigo-600/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    )
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-slate-800">Loading Workspace...</h3>
        <p className="text-sm text-slate-500 mt-1">Retrieving questions and sync logs.</p>
      </div>
    )
  }

  // Fallback: Show quiz list if no ID is selected in the URL
  if (!id) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quiz Workspace</h1>
            <p className="text-slate-500 mt-1.5">Select a generated study quiz below to begin practicing.</p>
          </div>
          <Button onClick={() => navigate("/create-quiz")} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Generate New Quiz
          </Button>
        </div>

        {userQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/85 min-h-[350px] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Quizzes Found</h3>
            <p className="text-slate-500 max-w-xs mt-1 leading-relaxed">
              Create a quiz first by pasting your lecture notes, slides, or course outlines.
            </p>
            <Button onClick={() => navigate("/create-quiz")} className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white">
              Create First Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userQuizzes.map((quizItem) => (
              <Card key={quizItem.id} className="border border-slate-200/80 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between">
                <CardHeader className="bg-slate-50/40 pb-4">
                  <CardTitle className="text-base font-bold text-slate-800 line-clamp-1">{quizItem.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">{quizItem.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {new Date(quizItem.created_at).toLocaleDateString()}
                  </span>
                  <Button onClick={() => navigate(`/dashboard/quiz/${quizItem.id}`)} size="sm" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold shadow-none border-0">
                    Open Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Active Quiz Taker Workspace
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full border border-slate-200/50">
          Mode: AI Practice
        </span>
      </div>

      {/* Quiz Header Information */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{quiz?.title}</h1>
          <p className="text-slate-500 mt-1 text-sm leading-relaxed">{quiz?.description}</p>
        </div>
        {submitted && (
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Score Achieved</span>
              <span className="text-lg font-extrabold text-indigo-700">
                {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const selectedOption = selectedAnswers[question.id]
          const isCorrect = selectedOption === question.correct_answer
          
          return (
            <Card 
              key={question.id} 
              className={`border-slate-200/80 shadow-sm rounded-xl overflow-hidden transition-all duration-300 ${
                submitted 
                  ? isCorrect 
                    ? "border-emerald-200/80 shadow-emerald-50/50" 
                    : "border-rose-200/80 shadow-rose-50/50"
                  : "hover:border-indigo-100/80"
              }`}
            >
              {/* Question Text Title */}
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4">
                <CardTitle className="text-base font-bold text-slate-800 flex gap-3.5 items-start">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    submitted
                      ? isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{question.question_text}</span>
                </CardTitle>
              </CardHeader>

              {/* Multiple Choice Options */}
              <CardContent className="pt-6">
                <RadioGroup 
                  value={selectedOption}
                  onValueChange={(val) => handleSelectOption(question.id, val)}
                  className="space-y-3"
                  disabled={submitted}
                >
                  {question.options.map((option, oIdx) => {
                    const isOptionSelected = selectedOption === option
                    const isOptionCorrect = option === question.correct_answer
                    
                    let optionStyle = "border-slate-200 hover:bg-slate-50/50"
                    
                    if (submitted) {
                      if (isOptionCorrect) {
                        optionStyle = "border-emerald-300 bg-emerald-50/30 text-emerald-950 font-medium"
                      } else if (isOptionSelected && !isCorrect) {
                        optionStyle = "border-rose-300 bg-rose-50/30 text-rose-950"
                      } else {
                        optionStyle = "border-slate-100 text-slate-400 opacity-60"
                      }
                    } else if (isOptionSelected) {
                      optionStyle = "border-indigo-300 bg-indigo-50/30"
                    }

                    return (
                      <div 
                        key={oIdx} 
                        onClick={() => handleSelectOption(question.id, option)}
                        className={`flex items-center space-x-3 space-y-0 border rounded-xl p-4 transition-all duration-200 cursor-pointer ${optionStyle}`}
                      >
                        <RadioGroupItem 
                          value={option} 
                          id={`opt-${oIdx}-${question.id}`}
                          className={submitted ? "pointer-events-none" : "text-indigo-600"}
                          disabled={submitted}
                        />
                        <Label 
                          htmlFor={`opt-${oIdx}-${question.id}`}
                          className="font-normal text-sm cursor-pointer w-full leading-relaxed block"
                        >
                          {option}
                        </Label>
                        
                        {submitted && isOptionCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isOptionSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </RadioGroup>

                {/* Explanation Card Rendered after Submission */}
                {submitted && question.explanation && (
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0" />
                      AI Explanation
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action CTA Buttons */}
      <div className="flex justify-between items-center pt-4">
        {submitted ? (
          <>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="border-slate-200 hover:bg-slate-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Exit to Dashboard
            </Button>
            <Button onClick={handleRetakeQuiz} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitQuiz} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/10"
            >
              Submit Quiz <BookOpenCheck className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

    </div>
  )
}
