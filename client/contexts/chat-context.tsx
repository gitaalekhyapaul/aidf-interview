"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { chatApi, analyticsApi } from "@/lib/mock-api"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isTyping: boolean
  isLoading: boolean
  error: string | null
  sessionId: string | null
}

interface ChatContextType {
  state: ChatState
  sendMessage: (content: string) => Promise<void>
  toggleChat: () => void
  closeChat: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: "1",
        content:
          "Hi! I'm your CFA study assistant. I can help you with:\n\n• Explaining complex financial concepts\n• Clarifying quiz questions\n• Providing study tips\n• Discussing CFA topics like CAPM, duration, ethics, etc.\n\nWhat would you like to know?",
        sender: "ai",
        timestamp: new Date(),
      },
    ],
    isOpen: false,
    isTyping: false,
    isLoading: false,
    error: null,
    sessionId: null,
  })

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      isLoading: true,
      error: null,
    }))

    try {
      await analyticsApi.trackInteraction("chat_message_sent", {
        messageLength: content.length,
        timestamp: new Date(),
      })

      const response = await chatApi.sendMessage(content, state.sessionId || undefined)

      if (response.success) {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          sender: "ai",
          timestamp: new Date(),
        }

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiResponse],
          isTyping: false,
          isLoading: false,
          sessionId: response.data.sessionId,
        }))

        await analyticsApi.trackInteraction("chat_response_received", {
          responseLength: response.data.response.length,
          sessionId: response.data.sessionId,
        })
      } else {
        throw new Error(response.message || "Failed to send message")
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }))
    }
  }

  const toggleChat = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }))

    analyticsApi.trackInteraction("chat_toggled", {
      isOpen: !state.isOpen,
      timestamp: new Date(),
    })
  }

  const closeChat = () => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }

  return <ChatContext.Provider value={{ state, sendMessage, toggleChat, closeChat }}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
