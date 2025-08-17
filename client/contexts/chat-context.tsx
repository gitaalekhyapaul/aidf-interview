"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Api } from "@/lib/api"
import {ChatMessage} from "@/@types"

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isTyping: boolean
  isLoading: boolean
  error: string | null
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
        data: {
          content:
          "Hi! I'm your CFA study assistant. I can help you with:\n\n• Explaining complex financial concepts\n• Clarifying quiz questions\n• Providing study tips\n• Discussing CFA topics like CAPM, duration, ethics, etc.\n\nWhat would you like to know?",
        },
        type: "ai",
      },
    ],
    isOpen: false,
    isTyping: false,
    isLoading: false,
    error: null,
  })

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      type: "human",
      data: { content },
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      isLoading: true,
      error: null,
    }))

    try {
      const chatApi = Api.getInstance();

      const response = await chatApi.postChat(content)

      if (response != null && response.response) {
        const aiResponse: ChatMessage = {
          type: "ai",
          data: { content: response.response },
        }

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiResponse],
          isTyping: false,
          isLoading: false,
        }))
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        data: {
          content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        },
        type: "ai",
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
