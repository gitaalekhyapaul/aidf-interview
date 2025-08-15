"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import { quizApi, analyticsApi } from "@/lib/mock-api"

interface Question {
  id: string
  topic: string
  difficulty: string
  question: string
  choices: string[]
  correct_answer: string
  explanation: string
  subtopic: string
  formula_used: string
  keywords: string[]
  LOS_reference: string
  image: string | null
  options: string[]
}

interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  selectedAnswer: string | null
  showExplanation: boolean
  showFeedback: boolean
  score: number
  answeredQuestions: number
  isQuizComplete: boolean
  userAnswers: { questionId: string; answer: string; isCorrect: boolean }[]
  quizStarted: boolean
  isLoading: boolean
  error: string | null
}

type QuizAction =
  | { type: "START_QUIZ" }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_QUESTIONS"; questions: Question[] }
  | { type: "SELECT_ANSWER"; answer: string }
  | { type: "SHOW_FEEDBACK" }
  | { type: "SHOW_EXPLANATION" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_QUIZ" }
  | { type: "REQUEST_SIMILAR_QUESTION" }

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  showExplanation: false,
  showFeedback: false,
  score: 0,
  answeredQuestions: 0,
  isQuizComplete: false,
  userAnswers: [],
  quizStarted: false,
  isLoading: false,
  error: null,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START_QUIZ":
      return {
        ...initialState,
        quizStarted: true,
        isLoading: true,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.loading,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isLoading: false,
      }

    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.questions,
        isLoading: false,
        error: null,
      }

    case "SELECT_ANSWER":
      return {
        ...state,
        selectedAnswer: action.answer,
      }

    case "SHOW_FEEDBACK":
      const currentQuestion = state.questions[state.currentQuestionIndex]
      const isCorrect = state.selectedAnswer === currentQuestion.correct_answer
      const newScore = isCorrect ? state.score + 1 : state.score

      return {
        ...state,
        showFeedback: true,
        score: newScore,
        answeredQuestions: state.answeredQuestions + 1,
        userAnswers: [
          ...state.userAnswers,
          {
            questionId: currentQuestion.id,
            answer: state.selectedAnswer || "",
            isCorrect,
          },
        ],
      }

    case "SHOW_EXPLANATION":
      return {
        ...state,
        showExplanation: true,
      }

    case "NEXT_QUESTION":
      const nextIndex = state.currentQuestionIndex + 1
      const isComplete = nextIndex >= state.questions.length

      return {
        ...state,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        showExplanation: false,
        showFeedback: false,
        isQuizComplete: isComplete,
      }

    case "RESET_QUIZ":
      return {
        ...initialState,
      }

    case "REQUEST_SIMILAR_QUESTION":
      return {
        ...state,
        isLoading: true,
      }

    default:
      return state
  }
}

const QuizContext = createContext<{
  state: QuizState
  dispatch: React.Dispatch<QuizAction>
  startQuiz: () => Promise<void>
  submitQuizResults: () => Promise<void>
  requestSimilarQuestion: (questionId: string) => Promise<void>
} | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = async () => {
    dispatch({ type: "START_QUIZ" })

    try {
      await analyticsApi.trackInteraction("quiz_started", { timestamp: new Date() })
      const response = await quizApi.getQuizQuestions(10)

      if (response.success) {
        dispatch({ type: "SET_QUESTIONS", questions: response.data })
      } else {
        dispatch({ type: "SET_ERROR", error: response.message || "Failed to load questions" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Network error occurred" })
    }
  }

  const submitQuizResults = async () => {
    if (!state.isQuizComplete) return

    try {
      const quizSession = {
        questions: state.questions,
        score: state.score,
        userAnswers: state.userAnswers,
        startTime: new Date(),
      }

      const response = await quizApi.submitQuizResults(quizSession)

      if (response.success) {
        await analyticsApi.trackInteraction("quiz_completed", {
          score: state.score,
          totalQuestions: state.questions.length,
          percentage: Math.round((state.score / state.questions.length) * 100),
        })
      }
    } catch (error) {
      console.error("Failed to submit quiz results:", error)
    }
  }

  const requestSimilarQuestion = async (questionId: string) => {
    dispatch({ type: "REQUEST_SIMILAR_QUESTION" })

    try {
      const response = await quizApi.getSimilarQuestions(questionId, 1)

      if (response.success && response.data.length > 0) {
        const newQuestions = [...state.questions]
        newQuestions[state.currentQuestionIndex] = response.data[0]
        dispatch({ type: "SET_QUESTIONS", questions: newQuestions })

        await analyticsApi.trackInteraction("similar_question_requested", { questionId })
      } else {
        dispatch({ type: "SET_ERROR", error: "No similar questions available" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to load similar question" })
    }
  }

  React.useEffect(() => {
    if (state.isQuizComplete && state.userAnswers.length > 0) {
      submitQuizResults()
    }
  }, [state.isQuizComplete])

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        startQuiz,
        submitQuizResults,
        requestSimilarQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
