"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Wind, BookOpen, Target, Brain, Lightbulb, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { useAuth } from "@/contexts/AuthContext"
import BreathingExercise from "@/components/breathing-exercise"
import MoodTracker from "@/components/mood-tracker"
import JournalingPrompts from "@/components/journaling-prompts"
import GroundingExercise from "@/components/grounding-exercise"
import Meditation from "@/components/meditation"
import GratitudeLog from "@/components/gratitude-log"
import SupportCircle from "@/components/support-circle"

type Tool = "breathing" | "mood" | "journal" | "grounding" | "meditation" | "gratitude" | "support" | null

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const toolParam = searchParams.get('tool')
    if (toolParam && ['breathing', 'mood', 'journal', 'grounding', 'meditation', 'gratitude', 'support'].includes(toolParam)) {
      setActiveTool(toolParam as Tool)
    }
  }, [searchParams])

  const handleBackClick = () => {
    // If we came from dashboard (has tool param), go back to dashboard
    if (searchParams.get('tool')) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } else {
      // Otherwise, just close the tool
      setActiveTool(null)
    }
  }

  const tools = [
    {
      id: "breathing" as Tool,
      title: "Breathing Exercise",
      description: "Calm your mind with guided breathing patterns",
      icon: Wind,
      color: "primary",
      duration: "3-5 min",
    },
    {
      id: "meditation" as Tool,
      title: "Meditation",
      description: "Find peace with guided meditation practices",
      icon: Brain,
      color: "blue",
      duration: "5-10 min",
    },
    {
      id: "mood" as Tool,
      title: "Mood Check-in",
      description: "Track and understand your emotional patterns",
      icon: Heart,
      color: "secondary",
      duration: "2-3 min",
    },
    {
      id: "gratitude" as Tool,
      title: "Gratitude Log",
      description: "Cultivate positivity through daily gratitude practice",
      icon: Heart,
      color: "red",
      duration: "3-5 min",
    },
    {
      id: "journal" as Tool,
      title: "Guided Journaling",
      description: "Explore your thoughts with AI-suggested prompts",
      icon: BookOpen,
      color: "accent",
      duration: "5-10 min",
    },
    {
      id: "grounding" as Tool,
      title: "5-4-3-2-1 Grounding",
      description: "Ground yourself in the present moment",
      icon: Target,
      color: "primary",
      duration: "3-5 min",
    },
    {
      id: "support" as Tool,
      title: "Support Circle",
      description: "Connect with resources and people who care",
      icon: Heart,
      color: "purple",
      duration: "Ongoing",
    },
  ]

  const renderTool = () => {
    switch (activeTool) {
      case "breathing":
        return <BreathingExercise />
      case "meditation":
        return <Meditation />
      case "mood":
        return <MoodTracker />
      case "gratitude":
        return <GratitudeLog />
      case "journal":
        return <JournalingPrompts />
      case "grounding":
        return <GroundingExercise />
      case "support":
        return <SupportCircle />
      default:
        return null
    }
  }

  const renderInstructions = () => {
    switch (activeTool) {
      case "breathing":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Wind className="h-5 w-5 text-blue-400 animate-pulse" />
                Breathing Exercise Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">How to Practice</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    Follow the circle's rhythm: 4 seconds in, 4 seconds hold, 6 seconds out. 
                    Let the visual guide your breathing naturally.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Reduces stress and anxiety</li>
                    <li>• Improves focus and concentration</li>
                    <li>• Activates the parasympathetic nervous system</li>
                    <li>• Helps with sleep quality</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Find a quiet, comfortable space</li>
                    <li>• Sit with your back straight</li>
                    <li>• Close your eyes if it helps you focus</li>
                    <li>• Don't force the breath - let it flow naturally</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "meditation":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
                Meditation Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Getting Started</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    Choose a meditation type that resonates with you. Start with shorter sessions 
                    and gradually increase duration as you build your practice.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Reduces stress and anxiety</li>
                    <li>• Improves emotional regulation</li>
                    <li>• Enhances self-awareness</li>
                    <li>• Promotes better sleep</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Find a quiet space</li>
                    <li>• Sit comfortably</li>
                    <li>• Be patient with wandering thoughts</li>
                    <li>• Start with 5-10 minutes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "mood":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Heart className="h-5 w-5 text-red-400 animate-pulse" />
                Mood Check-in Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Why Track Mood?</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    Regular mood check-ins help you understand your emotional patterns, 
                    identify triggers, and recognize what supports your wellbeing.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Increased self-awareness</li>
                    <li>• Better emotional regulation</li>
                    <li>• Early recognition of patterns</li>
                    <li>• Improved mental health outcomes</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Be honest with yourself</li>
                    <li>• Check in at consistent times</li>
                    <li>• Note what influences your mood</li>
                    <li>• Celebrate positive patterns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "gratitude":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Heart className="h-5 w-5 text-pink-400 animate-pulse" />
                Gratitude Practice Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Gratitude Practice</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    Cultivate positivity by regularly noting things you're grateful for. 
                    This practice can shift your perspective and improve overall wellbeing.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Increases happiness and life satisfaction</li>
                    <li>• Reduces depression and anxiety</li>
                    <li>• Improves sleep quality</li>
                    <li>• Strengthens relationships</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Be specific in your entries</li>
                    <li>• Include small, everyday moments</li>
                    <li>• Notice challenges that taught you something</li>
                    <li>• Make it a daily habit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "journal":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <BookOpen className="h-5 w-5 text-green-400 animate-pulse" />
                Journaling Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Guided Journaling</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    Use AI-suggested prompts to explore your thoughts and feelings. 
                    This structured approach can help you gain insights and process emotions.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Enhanced self-awareness</li>
                    <li>• Better emotional processing</li>
                    <li>• Stress reduction</li>
                    <li>• Improved problem-solving</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Write honestly for yourself</li>
                    <li>• Don't edit while writing</li>
                    <li>• Stay curious about your thoughts</li>
                    <li>• Be patient with the process</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "grounding":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Target className="h-5 w-5 text-orange-400 animate-pulse" />
                Grounding Exercise Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">5-4-3-2-1 Technique</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    This grounding technique uses your five senses to anchor you in the present moment. 
                    It's especially helpful during anxiety or overwhelm.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Reduces anxiety and panic</li>
                    <li>• Brings you to the present moment</li>
                    <li>• Provides immediate relief</li>
                    <li>• Can be done anywhere</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Take your time with each step</li>
                    <li>• Be specific in your observations</li>
                    <li>• Focus on what you can actually sense</li>
                    <li>• Repeat if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "support":
        return (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Users className="h-5 w-5 text-cyan-400 animate-pulse" />
                Support Circle Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Building Support</h4>
                  <p className="text-sm text-white/80 text-shadow">
                    Connect with resources and people who care about your wellbeing. 
                    Building a support network is crucial for mental health.
                  </p>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Benefits</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Reduces feelings of isolation</li>
                    <li>• Provides emotional support</li>
                    <li>• Offers different perspectives</li>
                    <li>• Creates a sense of belonging</li>
                  </ul>
                </div>
                <div className="p-3 glass rounded-lg border border-primary/20">
                  <h4 className="font-medium text-white text-shadow mb-2">Tips</h4>
                  <ul className="text-sm text-white/80 text-shadow space-y-1">
                    <li>• Reach out to trusted friends/family</li>
                    <li>• Consider professional support</li>
                    <li>• Join support groups</li>
                    <li>• Be open to receiving help</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  if (activeTool) {
    return (
      <div className="min-h-screen relative dark">
        <AnimatedBackground />
        <header className="relative z-10 glass-dark border-b border-primary/20 p-6">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Self-Awareness Tools</span>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {renderTool()}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {renderInstructions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative dark">
      <AnimatedBackground />
      {/* Header */}
      <header className="relative z-10 glass-dark border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Self-Awareness Tools</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white text-shadow">Take a moment for yourself</h1>
          <p className="text-white/90 text-balance max-w-2xl mx-auto text-shadow">
            These tools are designed to help you pause, reflect, and reconnect with your inner self. Choose what feels
            right for you today.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card
                key={tool.id}
                className="cursor-pointer glass-dark border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1 hover:scale-105 group"
                onClick={() => setActiveTool(tool.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 bg-${tool.color}/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`h-6 w-6 text-${tool.color}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/70 text-shadow">
                      <Clock className="h-3 w-3" />
                      {tool.duration}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white text-shadow">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm leading-relaxed mb-4 text-shadow">{tool.description}</p>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors animate-pulse-glow hover:scale-105">Start Exercise</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Tips */}
        <Card className="max-w-4xl mx-auto glass-dark border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary text-shadow">
              <Lightbulb className="h-5 w-5 animate-pulse" />
              Today's Gentle Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/90 leading-relaxed text-shadow">
              Self-awareness isn't about perfection—it's about presence. Even spending 2-3 minutes with yourself can
              create meaningful shifts in how you feel. Your mental wellness journey is unique to you, and every small
              step counts.
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="max-w-4xl mx-auto glass-dark border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-shadow">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              Your Practice Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 glass rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary mb-1 text-shadow">7</div>
                <div className="text-sm text-white/80 text-shadow">Days practicing</div>
              </div>
              <div className="text-center p-4 glass rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-secondary mb-1 text-shadow">23</div>
                <div className="text-sm text-white/80 text-shadow">Total sessions</div>
              </div>
              <div className="text-center p-4 glass rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-accent mb-1 text-shadow">12</div>
                <div className="text-sm text-white/80 text-shadow">Minutes today</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-white text-shadow">Recent Sessions</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 glass rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-sm text-white text-shadow">Breathing Exercise</span>
                  </div>
                  <span className="text-xs text-white/70 text-shadow">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-white text-shadow">Mood Check-in</span>
                  </div>
                  <span className="text-xs text-white/70 text-shadow">Yesterday</span>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="text-sm text-white text-shadow">Grounding Exercise</span>
                  </div>
                  <span className="text-xs text-white/70 text-shadow">2 days ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
