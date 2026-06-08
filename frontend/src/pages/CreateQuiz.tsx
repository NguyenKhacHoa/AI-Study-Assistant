import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, FileText } from "lucide-react"
import { toast } from "sonner"

type Question = {
  id: string
  text: string
  options: { id: string; text: string }[]
}

export const CreateQuizPage: React.FC = () => {
  const [materialText, setMaterialText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null)

  const handleGenerateQuiz = async () => {
    if (!materialText.trim()) {
      toast.error("Please enter some study material first.")
      return
    }

    setIsGenerating(true)
    setQuizQuestions(null)

    // Mock a 3-second API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock generated response
    const generated: Question[] = [
      {
        id: "q1",
        text: "What is the primary function of the Mitochondria?",
        options: [
          { id: "o1", text: "To synthesize proteins" },
          { id: "o2", text: "To generate most of the chemical energy needed to power the cell's biochemical reactions" },
          { id: "o3", text: "To store genetic information" },
          { id: "o4", text: "To control the cell cycle" },
        ]
      },
      {
        id: "q2",
        text: "Which process is responsible for cell division in somatic cells?",
        options: [
          { id: "o1", text: "Meiosis" },
          { id: "o2", text: "Mitosis" },
          { id: "o3", text: "Apoptosis" },
          { id: "o4", text: "Endocytosis" },
        ]
      }
    ]

    setQuizQuestions(generated)
    setIsGenerating(false)
    toast.success("Quiz generated successfully!")
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

      {quizQuestions && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Generated Quiz</h2>
          {quizQuestions.map((question, index) => (
            <Card key={question.id} className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl pb-4">
                <CardTitle className="text-lg font-medium text-gray-800 flex gap-3 items-start">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm">
                    {index + 1}
                  </span>
                  <span className="mt-1">{question.text}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup className="space-y-3">
                  {question.options.map((option) => (
                    <div 
                      key={option.id} 
                      className="flex items-center space-x-3 space-y-0 border border-gray-200 rounded-lg p-4 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={option.id} id={option.id} className="text-indigo-600" />
                      <Label htmlFor={option.id} className="font-normal text-gray-700 cursor-pointer w-full leading-relaxed">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end pt-4">
            <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
              Save to Workspace
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
