"use client";

import { useChat } from "@/contexts/chat-context";
import { ChatToggleButton } from "./chat/chat-toggle-button";
import { ChatWindow } from "./chat/chat-window";
import { useEffect, useRef } from "react";

export function AIChatBar() {
  const {
    state: chatState,
    sendMessage,
    toggleChat,
    fetchMessages,
  } = useChat();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatState.isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        toggleChat();
      }
    }

    if (chatState.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatState.isOpen, toggleChat]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={chatRef}>
      {!chatState.isOpen && (
        <ChatToggleButton
          isOpen={chatState.isOpen}
          onClick={toggleChat}
          hasUnreadMessages={false}
        />
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
  );
}
