import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, FileText } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate()
  const [materialText, setMaterialText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateQuiz = async () => {
    if (!materialText.trim()) {
      toast.error("Please enter some study material first.")
      return
    }

    setIsGenerating(true)

    try {
      // Get the current Supabase session and JWT
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        toast.error("You must be logged in to generate a quiz.")
        setIsGenerating(false)
        return
      }

      const token = session.access_token

      // Call the backend endpoint
      const response = await fetch("http://localhost:8000/api/v1/quizzes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Quiz - ${new Date().toLocaleDateString("en-US")}`,
          description: "Quiz generated automatically from your study material.",
          source_material: materialText
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || "Failed to generate quiz from backend.")
      }

      const responseData = await response.json()
      const newQuizId = responseData.quiz?.id

      if (!newQuizId) {
        throw new Error("Quiz created, but no ID returned from backend.")
      }

      toast.success("Quiz generated successfully! Redirecting...")
      
      setTimeout(() => {
        navigate(`/dashboard/quiz/${newQuizId}`)
      }, 800)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "An unexpected error occurred during quiz generation.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a New Quiz</h1>
        <p className="text-gray-500 mt-2 text-lg">Paste your study material below and let our AI generate a comprehensive quiz for you.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
          <CardTitle className="text-lg flex items-center text-gray-800">
            <FileText className="w-5 h-5 mr-2 text-indigo-500" />
            Study Material
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Textarea 
            placeholder="Paste your notes, PDF text, or article content here... (e.g. Mitochondria is the powerhouse of the cell.)"
            className="min-h-[250px] resize-y text-base p-4 focus-visible:ring-indigo-500"
            value={materialText}
            onChange={(e) => setMaterialText(e.target.value)}
            disabled={isGenerating}
          />
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleGenerateQuiz} 
              disabled={isGenerating || !materialText.trim()}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
