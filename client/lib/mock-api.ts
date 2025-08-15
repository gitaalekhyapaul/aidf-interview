import questionsData from "@/data/questions.json"

// Mock API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface QuizSession {
  id: string
  userId: string
  questions: any[]
  startTime: Date
  endTime?: Date
  score?: number
  completed: boolean
}

export interface UserProgress {
  userId: string
  totalQuizzes: number
  averageScore: number
  topicScores: Record<string, { correct: number; total: number }>
  lastActivity: Date
}

export interface ChatSession {
  id: string
  userId: string
  messages: Array<{
    id: string
    content: string
    sender: "user" | "ai"
    timestamp: Date
  }>
  createdAt: Date
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock user ID for demo
const MOCK_USER_ID = "demo-user-123"

// Local storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: "cfa-user-progress",
  QUIZ_SESSIONS: "cfa-quiz-sessions",
  CHAT_SESSIONS: "cfa-chat-sessions",
}

const getCFAResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  // CAPM related responses
  if (lowerMessage.includes("capm") || lowerMessage.includes("capital asset pricing")) {
    return `The Capital Asset Pricing Model (CAPM) is fundamental to CFA Level I. The formula is:

**E(Ri) = Rf + βi[E(Rm) - Rf]**

Where:
• E(Ri) = Expected return of investment
• Rf = Risk-free rate
• βi = Beta of the investment
• E(Rm) = Expected return of market

Key points for the exam:
- Beta measures systematic risk
- CAPM assumes efficient markets
- Used for cost of equity calculations
- Remember the Security Market Line (SML)

This appears in Portfolio Management and Equity Investments sections.`
  }

  // Duration related responses
  if (lowerMessage.includes("duration") || lowerMessage.includes("modified duration")) {
    return `Duration is crucial for Fixed Income analysis in CFA Level I:

**Modified Duration = Macaulay Duration / (1 + YTM/n)**

Key concepts:
• **Macaulay Duration**: Weighted average time to receive cash flows
• **Modified Duration**: Price sensitivity to yield changes
• **Effective Duration**: For bonds with embedded options

Exam tips:
- Duration ≈ % price change for 1% yield change
- Higher duration = higher interest rate risk
- Convexity adjusts for duration's linear approximation

This is heavily tested in Fixed Income section!`
  }

  // Ethics related responses
  if (lowerMessage.includes("ethics") || lowerMessage.includes("professional standards")) {
    return `Ethics & Professional Standards is 15-20% of CFA Level I:

**Seven Standards of Professional Conduct:**
I. Professionalism
II. Integrity of Capital Markets
III. Duties to Clients
IV. Duties to Employers
V. Investment Analysis & Recommendations
VI. Conflicts of Interest
VII. Responsibilities as CFA Institute Member

Key exam strategies:
- Always choose the MOST ethical option
- Client interests come first
- Disclosure is usually the answer
- Know the difference between Standards and Laws

This section has the highest pass rate correlation!`
  }

  // Portfolio theory responses
  if (
    lowerMessage.includes("portfolio theory") ||
    lowerMessage.includes("markowitz") ||
    lowerMessage.includes("efficient frontier")
  ) {
    return `Modern Portfolio Theory (Markowitz) is core to CFA curriculum:

**Key Concepts:**
• **Efficient Frontier**: Optimal risk-return combinations
• **Diversification**: Reduces unsystematic risk
• **Correlation**: Key to portfolio risk reduction

**Important Formulas:**
- Portfolio Return: E(Rp) = Σ wi × E(Ri)
- Portfolio Risk: σp = √[Σ wi²σi² + Σ Σ wiwjσiσjρij]

**Exam Focus:**
- Two-asset portfolio calculations
- Minimum variance portfolio
- Capital Allocation Line (CAL)
- Separation theorem

Practice correlation coefficient problems - they're common!`
  }

  // Study tips
  if (
    lowerMessage.includes("study tips") ||
    lowerMessage.includes("how to study") ||
    lowerMessage.includes("exam strategy")
  ) {
    return `**CFA Level I Study Strategy:**

**Time Management:**
• 300+ hours recommended
• Start 4-6 months before exam
• Focus on high-weight topics first

**Topic Weights (approximate):**
• Ethics: 15-20%
• Financial Reporting: 13-17%
• Quantitative Methods: 8-12%
• Economics: 8-12%
• Portfolio Management: 5-8%
• Equity Investments: 10-12%
• Fixed Income: 10-12%
• Derivatives: 5-8%
• Alternative Investments: 5-8%
• Corporate Issuers: 8-12%

**Exam Day Tips:**
- Read questions carefully
- Eliminate obviously wrong answers
- Don't spend too much time on one question
- Ethics questions: choose most ethical option`
  }

  // Quiz strategies
  if (
    lowerMessage.includes("quiz") ||
    lowerMessage.includes("practice questions") ||
    lowerMessage.includes("test strategy")
  ) {
    return `**CFA Practice Question Strategy:**

**During Practice:**
• Time yourself: 1.5 minutes per question
• Review explanations for ALL questions (right and wrong)
• Keep an error log by topic
• Focus on understanding, not memorization

**Common Question Types:**
• **Calculation**: Know formulas cold
• **Conceptual**: Understand relationships
• **Application**: Apply concepts to scenarios

**Red Flags to Watch:**
- "Always" or "Never" statements (usually wrong)
- Extreme values in calculations
- Ethics questions with multiple "correct" answers

**This Quiz Platform:**
- Covers all major CFA topics
- Detailed explanations provided
- Similar questions for wrong answers
- Track your progress by topic

Keep practicing - consistency is key!`
  }

  // Default responses for other topics
  const defaultResponses = [
    `Great question! This concept is fundamental to CFA Level I success. Let me break it down:

The key principle here involves understanding the relationship between risk and return in financial markets. This topic typically appears in multiple sections of the exam.

**Key Learning Objectives:**
• Understand the underlying theory
• Apply formulas accurately
• Recognize real-world applications

Would you like me to explain any specific aspect in more detail?`,

    `This is an excellent CFA topic to master! Based on the curriculum:

**Core Concepts:**
• Definition and key characteristics
• Calculation methods and formulas
• Practical applications in finance

**Exam Strategy:**
- Practice calculations until automatic
- Understand the economic intuition
- Know when to apply different methods

**Common Mistakes:**
- Confusing similar concepts
- Calculation errors under time pressure
- Missing key assumptions

What specific aspect would you like me to clarify?`,

    `Perfect question for CFA preparation! This concept is crucial for:

**Portfolio Management Applications:**
• Risk assessment and measurement
• Return calculations and analysis
• Asset allocation decisions

**Key Formulas to Remember:**
- Basic calculation methods
- Adjustments for different scenarios
- Relationship to other metrics

**Study Tips:**
• Create formula sheets
• Practice with different scenarios
• Understand the economic reasoning

Need help with any specific calculations or applications?`,
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// Quiz API
export const quizApi = {
  // Get random quiz questions
  async getQuizQuestions(count = 10, topics?: string[]): Promise<ApiResponse<any[]>> {
    await delay(800) // Simulate API call

    try {
      let questions = [...questionsData.questions]

      // Filter by topics if specified
      if (topics && topics.length > 0) {
        questions = questions.filter((q) => topics.includes(q.topic))
      }

      // Shuffle and take requested count
      const shuffled = questions.sort(() => Math.random() - 0.5)
      const selectedQuestions = shuffled.slice(0, count)

      return {
        data: selectedQuestions,
        success: true,
        message: `Retrieved ${selectedQuestions.length} questions`,
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: "Failed to fetch quiz questions",
      }
    }
  },

  // Submit quiz results
  async submitQuizResults(quizSession: Partial<QuizSession>): Promise<ApiResponse<QuizSession>> {
    await delay(600)

    try {
      const session: QuizSession = {
        id: `quiz-${Date.now()}`,
        userId: MOCK_USER_ID,
        startTime: new Date(),
        completed: true,
        ...quizSession,
        endTime: new Date(),
      }

      // Save to localStorage
      const existingSessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_SESSIONS) || "[]")
      existingSessions.push(session)
      localStorage.setItem(STORAGE_KEYS.QUIZ_SESSIONS, JSON.stringify(existingSessions))

      // Update user progress
      await this.updateUserProgress(session)

      return {
        data: session,
        success: true,
        message: "Quiz results submitted successfully",
      }
    } catch (error) {
      return {
        data: {} as QuizSession,
        success: false,
        message: "Failed to submit quiz results",
      }
    }
  },

  // Get similar questions for wrong answers
  async getSimilarQuestions(questionId: string, count = 3): Promise<ApiResponse<any[]>> {
    await delay(500)

    try {
      const originalQuestion = questionsData.questions.find((q) => q.id === questionId)
      if (!originalQuestion) {
        throw new Error("Original question not found")
      }

      // Find questions with same topic and difficulty
      const similarQuestions = questionsData.questions
        .filter(
          (q) =>
            q.id !== questionId && q.topic === originalQuestion.topic && q.difficulty === originalQuestion.difficulty,
        )
        .slice(0, count)

      return {
        data: similarQuestions,
        success: true,
        message: `Found ${similarQuestions.length} similar questions`,
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: "Failed to fetch similar questions",
      }
    }
  },

  // Update user progress
  async updateUserProgress(quizSession: QuizSession): Promise<void> {
    const existingProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS) || "null")

    const progress: UserProgress = existingProgress || {
      userId: MOCK_USER_ID,
      totalQuizzes: 0,
      averageScore: 0,
      topicScores: {},
      lastActivity: new Date(),
    }

    progress.totalQuizzes += 1
    progress.lastActivity = new Date()

    if (quizSession.score !== undefined && quizSession.questions) {
      // Update average score
      const totalScore = progress.averageScore * (progress.totalQuizzes - 1) + quizSession.score
      progress.averageScore = totalScore / progress.totalQuizzes

      // Update topic scores (mock calculation)
      quizSession.questions.forEach((question) => {
        if (!progress.topicScores[question.topic]) {
          progress.topicScores[question.topic] = { correct: 0, total: 0 }
        }
        progress.topicScores[question.topic].total += 1
        // Mock correct answers based on overall score
        if (Math.random() < quizSession.score / quizSession.questions.length) {
          progress.topicScores[question.topic].correct += 1
        }
      })
    }

    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
  },
}

// Chat API
export const chatApi = {
  // Send message to AI
  async sendMessage(
    message: string,
    sessionId?: string,
  ): Promise<
    ApiResponse<{
      response: string
      sessionId: string
    }>
  > {
    await delay(1200 + Math.random() * 800) // Variable response time

    try {
      const response = getCFAResponse(message)
      const currentSessionId = sessionId || `chat-${Date.now()}`

      return {
        data: {
          response,
          sessionId: currentSessionId,
        },
        success: true,
        message: "Message sent successfully",
      }
    } catch (error) {
      return {
        data: {
          response: "I apologize, but I'm having trouble processing your request right now. Please try again.",
          sessionId: sessionId || `chat-${Date.now()}`,
        },
        success: false,
        message: "Failed to send message",
      }
    }
  },

  // Get chat history
  async getChatHistory(sessionId: string): Promise<ApiResponse<ChatSession>> {
    await delay(300)

    try {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS) || "[]")
      const session = sessions.find((s: ChatSession) => s.id === sessionId)

      if (!session) {
        throw new Error("Chat session not found")
      }

      return {
        data: session,
        success: true,
        message: "Chat history retrieved",
      }
    } catch (error) {
      return {
        data: {} as ChatSession,
        success: false,
        message: "Failed to retrieve chat history",
      }
    }
  },
}

// User API
export const userApi = {
  // Get user progress
  async getUserProgress(): Promise<ApiResponse<UserProgress>> {
    await delay(400)

    try {
      const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS) || "null")

      if (!progress) {
        // Return default progress for new user
        const defaultProgress: UserProgress = {
          userId: MOCK_USER_ID,
          totalQuizzes: 0,
          averageScore: 0,
          topicScores: {},
          lastActivity: new Date(),
        }

        return {
          data: defaultProgress,
          success: true,
          message: "New user progress initialized",
        }
      }

      return {
        data: progress,
        success: true,
        message: "User progress retrieved",
      }
    } catch (error) {
      return {
        data: {} as UserProgress,
        success: false,
        message: "Failed to retrieve user progress",
      }
    }
  },

  // Get quiz history
  async getQuizHistory(): Promise<ApiResponse<QuizSession[]>> {
    await delay(500)

    try {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_SESSIONS) || "[]")

      return {
        data: sessions,
        success: true,
        message: `Retrieved ${sessions.length} quiz sessions`,
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: "Failed to retrieve quiz history",
      }
    }
  },
}

// Analytics API
export const analyticsApi = {
  // Track user interaction
  async trackInteraction(event: string, data: any): Promise<ApiResponse<void>> {
    await delay(100)

    try {
      // In a real app, this would send to analytics service
      console.log("Analytics Event:", event, data)

      return {
        data: undefined,
        success: true,
        message: "Event tracked successfully",
      }
    } catch (error) {
      return {
        data: undefined,
        success: false,
        message: "Failed to track event",
      }
    }
  },
}
