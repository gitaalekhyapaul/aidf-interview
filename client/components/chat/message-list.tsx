"use client"

import { useEffect, useRef } from "react"
import { Bot, User } from "lucide-react"
import type { Message } from "@/contexts/chat-context"

interface MessageListProps {
  messages: Message[]
  isTyping: boolean
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
          {message.sender === "ai" && (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-lg p-3 text-sm ${
              message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {message.sender === "user" && (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
              <User className="h-3 w-3 text-foreground" />
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-3 justify-start">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="h-3 w-3 text-primary-foreground" />
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
