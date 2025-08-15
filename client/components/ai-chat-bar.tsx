"use client"

import { useChat } from "@/contexts/chat-context"
import { useQuiz } from "@/contexts/quiz-context"
import { ChatToggleButton } from "./chat/chat-toggle-button"
import { ChatWindow } from "./chat/chat-window"
import { useEffect, useRef } from "react"

export function AIChatBar() {
  const { state: chatState, sendMessage, toggleChat } = useChat()
  const { state: quizState } = useQuiz()
  const chatRef = useRef<HTMLDivElement>(null)

  const shouldHideChat = quizState.quizStarted && !quizState.showFeedback && !quizState.isQuizComplete

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatState.isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        toggleChat()
      }
    }

    if (chatState.isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [chatState.isOpen, toggleChat])

  if (shouldHideChat) {
    return null
  }

  return (
    <div ref={chatRef}>
      {!chatState.isOpen && (
        <ChatToggleButton isOpen={chatState.isOpen} onClick={toggleChat} hasUnreadMessages={false} />
      )}

      {chatState.isOpen && (
        <ChatWindow
          messages={chatState.messages}
          isTyping={chatState.isTyping}
          onSendMessage={sendMessage}
          onMinimize={toggleChat}
        />
      )}
    </div>
  )
}
