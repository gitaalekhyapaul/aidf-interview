"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, CheckCircle } from "lucide-react"

interface ActionButtonsProps {
  selectedAnswer: string | null
  showFeedback: boolean
  isCorrect: boolean
  isLastQuestion: boolean
  onSubmit: () => void
  onNext: () => void
  onSimilarQuestion: () => void
  onFinish: () => void
}

export function ActionButtons({
  selectedAnswer,
  showFeedback,
  isCorrect,
  isLastQuestion,
  onSubmit,
  onNext,
  onSimilarQuestion,
  onFinish,
}: ActionButtonsProps) {
  if (!showFeedback) {
    return (
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!selectedAnswer}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2"
        >
          Submit Answer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between">
      {!isCorrect && (
        <Button
          variant="outline"
          onClick={onSimilarQuestion}
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 order-2 sm:order-1 bg-transparent"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Similar Question
        </Button>
      )}

      <div className="flex gap-3 order-1 sm:order-2">
        {isLastQuestion ? (
          <Button onClick={onFinish} className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none">
            <CheckCircle className="mr-2 h-4 w-4" />
            Finish Quiz
          </Button>
        ) : (
          <Button onClick={onNext} className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1 sm:flex-none">
            Next Question
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
