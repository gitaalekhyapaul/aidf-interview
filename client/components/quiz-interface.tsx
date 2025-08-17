"use client";

import { useQuiz } from "@/contexts/quiz-context";
import { useChat } from "@/contexts/chat-context";
import { Button } from "@/components/ui/button";
import { HelpCircle, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QuestionCard } from "./quiz/question-card";
import { AnswerChoices } from "./quiz/answer-choices";
import { FeedbackSection } from "./quiz/feedback-section";
import { QuizProgress } from "./quiz/quiz-progress";
import { ActionButtons } from "./quiz/action-buttons";

export function QuizInterface() {
  const { state, dispatch, requestSimilarQuestion, getNextQuestion } =
    useQuiz();
  const { toggleChat } = useChat();
  const [, setShowExplanationRequest] = useState(false);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  console.log("QuizInterface currentQuestion:", currentQuestion);
  console.log("QuizInterface state:", JSON.stringify(state, null, 2));
  const isCorrect = state.selectedAnswer === currentQuestion.correct_answer;
  const handleAnswerSelect = (answer: string) => {
    if (state.showFeedback) return;
    dispatch({ type: "SELECT_ANSWER", answer });
  };

  const handleSubmitAnswer = () => {
    if (!state.selectedAnswer) return;
    dispatch({ type: "SHOW_FEEDBACK" });
  };

  const handleNextQuestion = async () => {
    dispatch({ type: "NEXT_QUESTION" });
    await getNextQuestion();
    setShowExplanationRequest(false);
  };

  const handleRequestSimilarQuestion = async () => {
    dispatch({ type: "REQUEST_SIMILAR_QUESTION" });
    await requestSimilarQuestion(currentQuestion.id, state.selectedAnswer!);
    dispatch({ type: "NEXT_QUESTION" });
    setShowExplanationRequest(false);
  };

  const handleFinishQuiz = () => {
    dispatch({ type: "FINISH_QUIZ" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground">
                Question {state.currentQuestionIndex + 1} of{" "}
                {state.questions.length}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Score: {state.score}/{state.answeredQuestions}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleChat}
                className="hidden md:flex bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-teal-200"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Quiz Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress */}
          <QuizProgress
            currentQuestion={state.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
            score={state.score}
          />

          {/* Question Card */}
          <QuestionCard
            question={{
              id: currentQuestion.id,
              question: currentQuestion.question,
              topic: currentQuestion.topic,
              difficulty: currentQuestion.difficulty as
                | "Easy"
                | "Medium"
                | "Hard",
              timeEstimate: "2-3 min",
              subtopic: currentQuestion.subtopic || "",
            }}
            currentQuestion={state.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
          />

          {/* Answer Choices */}
          <AnswerChoices
            options={currentQuestion.choices}
            selectedAnswer={state.selectedAnswer}
            correctAnswer={currentQuestion.correct_answer}
            showFeedback={state.showFeedback}
            onAnswerSelect={handleAnswerSelect}
          />

          {/* Feedback Section */}
          <FeedbackSection
            isCorrect={isCorrect}
            explanation={currentQuestion.explanation}
            showFeedback={state.showFeedback}
            formulaUsed={currentQuestion.formula_used || ""}
          />

          {/* Action Buttons */}
          {state.showFeedback ? (
            <ActionButtons
              selectedAnswer={state.selectedAnswer}
              showFeedback={state.showFeedback}
              isCorrect={isCorrect}
              isLastQuestion={state.currentQuestionIndex === 9}
              onSubmit={handleSubmitAnswer}
              onNext={handleNextQuestion}
              onSimilarQuestion={handleRequestSimilarQuestion}
              onFinish={handleFinishQuiz}
            />
          ) : (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!state.selectedAnswer}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-2"
                size="lg"
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
