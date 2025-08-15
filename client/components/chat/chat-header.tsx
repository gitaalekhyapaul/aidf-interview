"use client"

import { Button } from "@/components/ui/button"
import { Minimize2, Bot } from "lucide-react"

interface ChatHeaderProps {
  onMinimize: () => void
}

export function ChatHeader({ onMinimize }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">CFA Study Assistant</h3>
          <p className="text-xs text-muted-foreground">Online • Ready to help</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMinimize}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <Minimize2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
