"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Lightbulb, Pi } from "lucide-react";

interface FeedbackSectionProps {
  isCorrect: boolean;
  explanation: string;
  formulaUsed: string;
  showFeedback: boolean;
}

export function FeedbackSection({
  isCorrect,
  explanation,
  formulaUsed,
  showFeedback,
}: FeedbackSectionProps) {
  if (!showFeedback) return null;

  return (
    <Card
      className={`border-2 ${
        isCorrect
          ? "border-green-500/30 bg-green-500/5"
          : "border-red-500/30 bg-red-500/5"
      }`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h3
              className={`font-semibold text-base sm:text-lg mb-2 ${
                isCorrect ? "text-green-400" : "text-red-400"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </h3>
            <div className="flex items-start gap-2 text-slate-300">
              <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm sm:text-base leading-relaxed">
                {explanation}
              </p>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <Pi className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm sm:text-base leading-relaxed">
                {formulaUsed}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
