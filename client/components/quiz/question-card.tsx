"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, BookOpen, TrendingUp } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: string;
    question: string;
    topic: string;
    subtopic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    timeEstimate: string;
  };
  currentQuestion: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
}: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>
              Question {currentQuestion} of {totalQuestions}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-cyan-500/30 text-cyan-400"
            >
              {question.topic}
            </Badge>
            <Badge
              variant="outline"
              className="border-teal-500/30 text-teal-600"
            >
              {question.subtopic}
            </Badge>
            <Badge
              variant="outline"
              className={getDifficultyColor(question.difficulty)}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {question.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              {question.timeEstimate}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground text-base sm:text-lg leading-relaxed font-medium">
          {question.question}
        </p>
      </CardContent>
    </Card>
  );
}
