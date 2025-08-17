"use client";

import { useQuiz } from "@/contexts/quiz-context";
import { QuizInterface } from "@/components/quiz-interface";
import { QuizResults } from "@/components/quiz-results";
import { AIChatBar } from "@/components/ai-chat-bar";
import { useEffect } from "react";

export default function QuizPage() {
  const { state, startQuiz } = useQuiz();

  useEffect(() => {
    console.log("QuizPage useEffect");
    console.log(JSON.stringify(state, null, 2));
    if (state.questions.length === 0) {
      console.log("No questions loaded, calling startQuiz");
      startQuiz();
    } else {
      console.log("Questions already loaded:", state.questions.length);
    }
  }, []);
  if (state.isLoading || state.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {state.error}</p>
          <button
            onClick={() => startQuiz()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {state.isQuizComplete ? <QuizResults /> : <QuizInterface />}
      <AIChatBar />
    </div>
  );
}
