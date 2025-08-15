"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

const quickSuggestions = ["Explain CAPM", "Duration formula", "Ethics standards", "Study tips"]

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion)
  }

  return (
    <div className="p-4 border-t border-border">
      <div className="flex flex-wrap gap-1 mb-3">
        {quickSuggestions.map((suggestion) => (
          <Badge
            key={suggestion}
            variant="outline"
            className="cursor-pointer text-xs border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about CFA topics..."
          className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground text-sm"
        />
        <Button type="submit" size="icon" disabled={!input.trim()} className="bg-primary hover:bg-primary/90 h-9 w-9">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
