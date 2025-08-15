"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface QuizProgressProps {
  currentQuestion: number
  totalQuestions: number
  score: number
}

export function QuizProgress({ currentQuestion, totalQuestions, score }: QuizProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100
  const scorePercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

  return (
    <Card className="border-slate-700 bg-slate-800/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-300">
              Progress: {currentQuestion}/{totalQuestions}
            </span>
            <span className="text-sm font-medium text-cyan-400">
              Score: {score}/{currentQuestion} ({Math.round(scorePercentage)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-slate-700" />
        </div>
      </CardContent>
    </Card>
  )
}
