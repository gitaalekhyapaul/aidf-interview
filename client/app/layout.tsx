import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QuizProvider } from "@/contexts/quiz-context"
import { ChatProvider } from "@/contexts/chat-context"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "CFA Exam Prep - Master Your Finance Knowledge",
  description: "Professional CFA exam preparation platform with comprehensive questions and AI-powered learning"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} dark`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <QuizProvider>
            <ChatProvider>{children}</ChatProvider>
          </QuizProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
