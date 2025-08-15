"use client"

import { useQuiz } from "@/contexts/quiz-context"
import { QuizInterface } from "@/components/quiz-interface"
import { QuizResults } from "@/components/quiz-results"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AIChatBar } from "@/components/ai-chat-bar"

export default function QuizPage() {
  const { state } = useQuiz()

  if (!state.quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Quiz Not Started</h1>
          <p className="text-muted-foreground mb-6">Please start the quiz from the home page.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <AIChatBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {state.isQuizComplete ? <QuizResults /> : <QuizInterface />}
      <AIChatBar />
    </div>
  )
}
