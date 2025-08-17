"use client"

import { Card } from "@/components/ui/card"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import type { ChatMessage } from "@/@types"

interface ChatWindowProps {
  messages: ChatMessage[]
  isTyping: boolean
  onSendMessage: (message: string) => void
  onMinimize: () => void
}

export function ChatWindow({ messages, isTyping, onSendMessage, onMinimize }: ChatWindowProps) {
  return (
    <Card className="fixed bottom-20 right-4 w-80 sm:w-96 h-150 bg-card border-border shadow-2xl shadow-black/50 z-40 flex flex-col backdrop-blur-sm">
      <ChatHeader onMinimize={onMinimize} />
      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={onSendMessage} />
    </Card>
  )
}
