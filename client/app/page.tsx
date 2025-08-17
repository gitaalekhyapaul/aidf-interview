"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  BookOpen,
  Award,
  Users,
  BarChart3,
  Brain,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { AIChatBar } from "@/components/ai-chat-bar";

export default function HomePage() {
  const router = useRouter();

  const handleStartQuiz = async () => {
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cfa-gradient opacity-10" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Professional CFA Exam Preparation
            </Badge>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Elevate Your{" "}
              <span className="text-primary">Finance Knowledge</span>
              <br />
              Master the CFA Exam
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful candidates with our expert-led
              courses, comprehensive question banks, and AI-powered learning
              assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-semibold"
                onClick={handleStartQuiz}
              >
                Start Quiz Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>95% Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our CFA Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive preparation tools designed by CFA charterholders and
              industry experts to ensure your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="finance-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">
                  Expert Insights
                </CardTitle>
                <CardDescription>
                  Learn from CFA charterholders with real-world experience in
                  investment management and financial analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="finance-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-serif text-xl">
                  Comprehensive Question Banks
                </CardTitle>
                <CardDescription>
                  Access thousands of practice questions covering all CFA topics
                  with detailed explanations and formulas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="finance-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-xl">
                  AI-Powered Learning
                </CardTitle>
                <CardDescription>
                  Get personalized study recommendations and instant answers to
                  your questions with our AI assistant.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="finance-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">
                  Tailored Learning Paths
                </CardTitle>
                <CardDescription>
                  Adaptive study plans that adjust to your progress and focus on
                  areas that need improvement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="finance-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-serif text-xl">
                  Proven Results
                </CardTitle>
                <CardDescription>
                  Join thousands of successful CFA candidates who achieved their
                  goals with our platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="finance-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-xl">
                  Complete Coverage
                </CardTitle>
                <CardDescription>
                  All CFA Level I topics covered: Ethics, Quantitative Methods,
                  Economics, Financial Reporting, and more.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quiz CTA Section */}
      <section className="py-20 lg:py-32 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Test Your Knowledge: Take Our CFA Quiz!
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Challenge yourself with real CFA exam-style questions covering
              Ethics, Quantitative Methods, Fixed Income, Equity Investments,
              and more.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10</div>
                <div className="text-sm text-muted-foreground">
                  Practice Questions
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">6</div>
                <div className="text-sm text-muted-foreground">
                  CFA Topics Covered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">15</div>
                <div className="text-sm text-muted-foreground">
                  Minutes to Complete
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="text-lg px-12 py-6 font-semibold"
              onClick={handleStartQuiz}
            >
              Start Quiz Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              No registration required • Instant feedback • Detailed
              explanations
            </p>
          </div>
        </div>
      </section>

      {/* Topics Covered */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              CFA Level I Topics Covered
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage of all essential CFA Level I study areas
              with practice questions and detailed explanations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Ethical & Professional Standards",
              "Quantitative Methods",
              "Economics",
              "Financial Reporting & Analysis",
              "Corporate Issuers",
              "Equity Investments",
              "Fixed Income",
              "Derivatives",
              "Alternative Investments",
              "Portfolio Management",
            ].map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="p-3 text-center justify-center border-border/50 hover:border-primary/50 transition-colors"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">
              CFA Exam Prep
            </h3>
            <p className="text-muted-foreground mb-6">
              Professional financial education platform for CFA candidates
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <span>© 2025 CFA Exam Prep</span>
              <span>•</span>
              <span>Built with ☕️ and ❤️</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Persistent AI chat bar component */}
      <AIChatBar />
    </div>
  );
}
