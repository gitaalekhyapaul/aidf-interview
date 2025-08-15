"use client"

import { useQuiz } from "@/contexts/quiz-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, RotateCcw, Home, TrendingUp, BookOpen, Target } from "lucide-react"
import Link from "next/link"

export function QuizResults() {
  const { state, dispatch } = useQuiz()

  const scorePercentage = Math.round((state.score / state.questions.length) * 100)
  const passThreshold = 70 // CFA-style passing threshold
  const hasPassed = scorePercentage >= passThreshold

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-500", bgColor: "bg-green-500/10" }
    if (percentage >= 80) return { level: "Very Good", color: "text-blue-500", bgColor: "bg-blue-500/10" }
    if (percentage >= 70) return { level: "Good", color: "text-yellow-500", bgColor: "bg-yellow-500/10" }
    if (percentage >= 60) return { level: "Fair", color: "text-orange-500", bgColor: "bg-orange-500/10" }
    return { level: "Needs Improvement", color: "text-red-500", bgColor: "bg-red-500/10" }
  }

  const performance = getPerformanceLevel(scorePercentage)

  const handleRetakeQuiz = () => {
    dispatch({ type: "RESET_QUIZ" })
    dispatch({ type: "START_QUIZ" })
  }

  // Calculate topic performance
  const topicPerformance = state.userAnswers.reduce(
    (acc, answer) => {
      const question = state.questions.find((q) => q.id === answer.questionId)
      if (question) {
        if (!acc[question.topic]) {
          acc[question.topic] = { correct: 0, total: 0 }
        }
        acc[question.topic].total++
        if (answer.isCorrect) {
          acc[question.topic].correct++
        }
      }
      return acc
    },
    {} as Record<string, { correct: number; total: number }>,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-xl font-bold">Quiz Results</h1>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Results Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Score Card */}
          <Card className="finance-card text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 rounded-full ${performance.bgColor} flex items-center justify-center`}>
                  <Trophy className={`h-10 w-10 ${performance.color}`} />
                </div>
              </div>
              <CardTitle className="font-serif text-3xl mb-2">
                {state.score} / {state.questions.length}
              </CardTitle>
              <CardDescription className="text-xl">{scorePercentage}% Score</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className={`${performance.bgColor} ${performance.color} border-current mb-4 text-base px-4 py-2`}
              >
                {performance.level}
              </Badge>

              <div className="mb-6">
                <Progress value={scorePercentage} className="h-3 mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span className="text-yellow-500">Pass: {passThreshold}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="text-lg mb-6">
                {hasPassed ? (
                  <span className="text-green-500 font-semibold">🎉 Congratulations! You passed the quiz!</span>
                ) : (
                  <span className="text-orange-500 font-semibold">Keep studying! You're on the right track.</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRetakeQuiz} size="lg">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Performance by Topic */}
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance by Topic
              </CardTitle>
              <CardDescription>See how you performed across different CFA topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(topicPerformance).map(([topic, stats]) => {
                  const topicPercentage = Math.round((stats.correct / stats.total) * 100)
                  const topicPerf = getPerformanceLevel(topicPercentage)

                  return (
                    <div key={topic} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{topic}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {stats.correct}/{stats.total}
                          </span>
                          <Badge variant="outline" className={`${topicPerf.bgColor} ${topicPerf.color} border-current`}>
                            {topicPercentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={topicPercentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Recommendations */}
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Recommendations
              </CardTitle>
              <CardDescription>Based on your performance, here are some areas to focus on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(topicPerformance)
                  .filter(([, stats]) => stats.correct / stats.total < 0.7)
                  .map(([topic, stats]) => (
                    <div key={topic} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <Target className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">{topic}</div>
                        <div className="text-sm text-muted-foreground">
                          You scored {Math.round((stats.correct / stats.total) * 100)}% in this topic. Consider
                          reviewing the key concepts and practicing more questions.
                        </div>
                      </div>
                    </div>
                  ))}

                {Object.entries(topicPerformance).every(([, stats]) => stats.correct / stats.total >= 0.7) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="text-lg font-medium mb-2">Excellent Performance!</p>
                    <p>You scored well across all topics. Keep up the great work!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="font-serif">Next Steps</CardTitle>
              <CardDescription>Continue your CFA exam preparation journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start bg-transparent"
                  onClick={handleRetakeQuiz}
                >
                  <div className="text-left">
                    <div className="font-semibold mb-1">Practice More Questions</div>
                    <div className="text-sm text-muted-foreground">Retake the quiz to reinforce your learning</div>
                  </div>
                </Button>

                <Link href="/">
                  <Button variant="outline" className="h-auto p-4 justify-start w-full bg-transparent">
                    <div className="text-left">
                      <div className="font-semibold mb-1">Explore More Topics</div>
                      <div className="text-sm text-muted-foreground">Return to the main page for more resources</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
