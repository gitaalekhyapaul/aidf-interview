"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

interface ChatToggleButtonProps {
  isOpen: boolean
  onClick: () => void
  hasUnreadMessages?: boolean
}

export function ChatToggleButton({ isOpen, onClick, hasUnreadMessages }: ChatToggleButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300
        ${
          isOpen
            ? "bg-slate-700 hover:bg-slate-600 border border-slate-600"
            : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/25"
        }
        ${hasUnreadMessages && !isOpen ? "animate-pulse" : ""}
      `}
      size="icon"
    >
      {isOpen ? <X className="h-5 w-5 text-slate-300" /> : <MessageCircle className="h-5 w-5 text-white" />}
      {hasUnreadMessages && !isOpen && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full animate-ping" />
      )}
    </Button>
  )
}
