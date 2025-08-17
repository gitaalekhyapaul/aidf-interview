"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface AnswerChoicesProps {
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  showFeedback: boolean;
  onAnswerSelect: (answer: string) => void;
}

export function AnswerChoices({
  options,
  selectedAnswer,
  correctAnswer,
  showFeedback,
  onAnswerSelect,
}: AnswerChoicesProps) {
  const getAnswerStyle = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option
        ? "border-primary bg-primary/10 text-primary"
        : "border-border hover:border-muted-foreground text-foreground";
    }

    if (option === correctAnswer) {
      return "border-green-500 bg-green-500/10 text-green-400";
    }

    if (selectedAnswer === option && option !== correctAnswer) {
      return "border-red-500 bg-red-500/10 text-red-400";
    }

    return "border-border text-muted-foreground";
  };

  const getAnswerIcon = (option: string) => {
    if (!showFeedback) return null;

    if (option === correctAnswer) {
      return <Check className="h-4 w-4 text-green-400" />;
    }

    if (selectedAnswer === option && option !== correctAnswer) {
      return <X className="h-4 w-4 text-red-400" />;
    }

    return null;
  };

  return (
    <Card className="border-border bg-card/30">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start text-left h-auto p-4 text-sm sm:text-base ${getAnswerStyle(
                option
              )} hover:text-teal-200 break-words whitespace-normal`}
              onClick={() => !showFeedback && onAnswerSelect(option)}
              disabled={showFeedback}
            >
              <div className="flex items-start justify-between w-full">
                <span className="flex-1 leading-relaxed">{option}</span>
                {getAnswerIcon(option)}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
