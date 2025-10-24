"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  TrendingUp,
  MessageCircle,
  BookOpen,
  Target,
  Globe,
  Sparkles,
  Moon,
  Activity,
  Brain,
  Shield,
  Users,
  LogOut,
  Wind,
  Lightbulb,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import { AnimatedBackground } from "@/components/animated-background"
import { useAuth } from "@/contexts/AuthContext"
import { usePractice } from "@/contexts/PracticeContext"
import { useRouter } from "next/navigation"

const moodData = [
  { day: "Mon", mood: 3, energy: 4 },
  { day: "Tue", mood: 4, energy: 3 },
  { day: "Wed", mood: 2, energy: 2 },
  { day: "Thu", mood: 4, energy: 4 },
  { day: "Fri", mood: 5, energy: 5 },
  { day: "Sat", mood: 4, energy: 3 },
  { day: "Sun", mood: 3, energy: 4 },
]

const emotionData = [
  { name: "Calm", value: 35, color: "oklch(0.55 0.12 264)" },
  { name: "Happy", value: 25, color: "oklch(0.65 0.08 220)" },
  { name: "Anxious", value: 20, color: "oklch(0.75 0.06 280)" },
  { name: "Sad", value: 12, color: "oklch(0.7 0.05 200)" },
  { name: "Excited", value: 8, color: "oklch(0.6 0.1 240)" },
]

const journalEntries = [
  {
    id: 1,
    date: "Today",
    preview: "Had a really productive day at work. Feeling grateful for the support from my team...",
    mood: 4,
    tags: ["work", "gratitude"],
  },
  {
    id: 2,
    date: "Yesterday",
    preview: "Struggled with anxiety before the presentation, but it went better than expected...",
    mood: 3,
    tags: ["anxiety", "growth"],
  },
  {
    id: 3,
    date: "2 days ago",
    preview: "Spent time with family today. These moments remind me what truly matters...",
    mood: 5,
    tags: ["family", "joy"],
  },
]

const burnoutData = [
  { name: "Mental Load", value: 28, fill: "oklch(0.55 0.12 264)" },
  { name: "Physical Fatigue", value: 35, fill: "oklch(0.65 0.08 220)" },
  { name: "Emotional Drain", value: 22, fill: "oklch(0.75 0.06 280)" },
]

const dailyQuotes = [
  {
    text: "आपकी मानसिक शांति आपकी सबसे बड़ी संपत्ति है।",
    translation: "Your mental peace is your greatest wealth.",
    author: "Ancient Wisdom",
  },
  {
    text: "Progress, not perfection, is the goal.",
    author: "Self-Care Reminder",
  },
  {
    text: "हर दिन एक नई शुरुआत है।",
    translation: "Every day is a new beginning.",
    author: "Hope",
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress.",
    author: "Mindfulness",
  },
]

const sleepData = [
  { day: "Mon", hours: 7.5, quality: 4 },
  { day: "Tue", hours: 6.8, quality: 3 },
  { day: "Wed", hours: 8.2, quality: 5 },
  { day: "Thu", hours: 7.1, quality: 4 },
  { day: "Fri", hours: 6.5, quality: 2 },
  { day: "Sat", hours: 9.1, quality: 5 },
  { day: "Sun", hours: 8.5, quality: 4 },
]

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [journalEntry, setJournalEntry] = useState("")
  const [currentQuote, setCurrentQuote] = useState(dailyQuotes[0])
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [aiSummary, setAiSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedEntries, setSavedEntries] = useState(journalEntries)
  const { user, loading, logout } = useAuth()
  const { stats, getRecentSessions } = usePractice()
  const router = useRouter()

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Set random quote on component mount
  useEffect(() => {
    const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]
    setCurrentQuote(randomQuote)
  }, [])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen relative dark flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error)
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Logout issue: ${errorMessage}`)
      
      // Even if logout failed, redirect to home page
      // The user state will be cleared by the AuthContext
      router.push("/")
    }
  }

  const generateAISummary = async () => {
    if (journalEntry.length < 50) {
      alert("Please write at least 50 characters for a meaningful AI summary.")
      return
    }

    setIsGeneratingSummary(true)
    setAiSummary("")

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please analyze this journal entry and provide a compassionate, supportive summary focusing on emotional themes, growth opportunities, and gentle insights. Keep it encouraging and helpful. Journal entry: "${journalEntry}"`,
          type: 'chat'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('API Error:', data.error)
        setAiSummary("I'm having trouble generating a summary right now. Please try again.")
      } else if (data.response) {
        setAiSummary(data.response)
      } else {
        setAiSummary("I received an unexpected response. Please try again.")
      }
    } catch (error) {
      console.error('Error generating summary:', error)
      setAiSummary("I'm having trouble connecting right now. Please try again later.")
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const saveJournalEntry = async () => {
    if (!journalEntry.trim()) {
      alert("Please write something before saving.")
      return
    }

    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newEntry = {
        id: Date.now(),
        date: "Today",
        preview: journalEntry.length > 100 ? journalEntry.substring(0, 100) + "..." : journalEntry,
        mood: selectedMood || 3,
        tags: ["personal", "reflection"],
        fullEntry: journalEntry,
        aiSummary: aiSummary,
        timestamp: new Date().toISOString()
      }

      setSavedEntries(prev => [newEntry, ...prev])
      setJournalEntry("")
      setAiSummary("")
      setSelectedMood(null)
      
      alert("Journal entry saved successfully!")
    } catch (error) {
      console.error('Error saving entry:', error)
      alert("Failed to save entry. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const moodEmojis = ["😢", "😟", "😐", "😊", "😄"]
  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"]

  return (
    <div className="min-h-screen relative dark">
      <AnimatedBackground />

      <header className="relative z-10 glass-dark border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Heart className="h-8 w-8 text-primary animate-pulse-glow" />
                  <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
                </div>
                <span className="text-2xl font-bold text-white text-shadow">DilSe AI</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="glass-dark hover:bg-primary/10 transition-all duration-300 hover:scale-105 bg-transparent text-white border-white/20"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>
            <Link href="/chat">
              <Button
                variant="outline"
                size="sm"
                className="glass-dark hover:bg-primary/10 transition-all duration-300 hover:scale-105 bg-transparent text-white border-white/20"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI
              </Button>
            </Link>
            <Button 
              size="sm" 
              className="animate-pulse-glow hover:scale-105 transition-all duration-300"
              onClick={() => {
                const journalSection = document.getElementById('journal-section');
                journalSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Journal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="glass-dark hover:bg-red-500/10 transition-all duration-300 hover:scale-105 bg-transparent text-white border-red-400/20 hover:border-red-400/40"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white text-shadow animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome back!
          </h1>
          <Card className="max-w-2xl mx-auto glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse-glow" />
                <h3 className="text-lg font-semibold text-white text-shadow">Daily Inspiration</h3>
              </div>
              <blockquote className="text-white/90 text-lg italic mb-2 text-shadow">"{currentQuote.text}"</blockquote>
              {currentQuote.translation && (
                <p className="text-white/70 text-sm mb-2 text-shadow">"{currentQuote.translation}"</p>
              )}
              <p className="text-white/60 text-sm text-shadow">— {currentQuote.author}</p>
            </CardContent>
          </Card>
        </div>

        <Card id="journal-section" className="max-w-4xl mx-auto glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
          <CardHeader>
            <CardTitle className="text-center text-white text-shadow flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-primary animate-pulse-glow" />
              What's on your mind today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-4">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleMoodSelect(index + 1)}
                  className={`w-16 h-16 text-3xl rounded-full transition-all duration-300 hover:scale-125 border-2 glass ${
                    selectedMood === index + 1
                      ? "border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/25 animate-pulse-glow"
                      : "border-primary/20 hover:bg-primary/10"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-center">
              {selectedMood && (
                <p className="text-sm text-white/70 text-shadow animate-in fade-in duration-500">
                  You're feeling {moodLabels[selectedMood - 1]} today
                </p>
              )}
            </div>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder={language === "hi" ? "आज आप कैसा महसूस कर रहे हैं..." : "Tell me more about how you're feeling..."}
              className="w-full glass-dark border border-primary/20 rounded-xl px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] transition-all duration-300"
            />
            {aiSummary && (
              <div className="p-4 glass border border-primary/20 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary text-shadow">AI Journal Summary</span>
                </div>
                <p className="text-white/80 text-sm text-shadow">{aiSummary}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={generateAISummary}
                variant="outline"
                className="glass-dark hover:bg-primary/10 transition-all duration-300 hover:scale-105 bg-transparent text-white border-white/20"
                disabled={isGeneratingSummary || journalEntry.length < 50}
              >
                <Brain className="h-4 w-4 mr-2" />
                {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
              </Button>
              <Button 
                className="flex-1 animate-pulse-glow hover:scale-105 transition-all duration-300"
                onClick={saveJournalEntry}
                disabled={isSaving || !journalEntry.trim()}
              >
                {isSaving ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-dark border-primary/20 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70 text-shadow">Burnout Radar</p>
                  <p className="text-2xl font-bold text-red-400 text-shadow">28%</p>
                  <p className="text-xs text-white/60 text-shadow">Low & Positive</p>
                </div>
                <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center glass animate-pulse-glow">
                  <Target className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-primary/20 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70 text-shadow">Sleep Quality</p>
                  <p className="text-2xl font-bold text-blue-400 text-shadow">7.8h</p>
                  <p className="text-xs text-white/60 text-shadow">Good quality</p>
                </div>
                <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center glass animate-pulse-glow">
                  <Moon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-primary/20 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70 text-shadow">Mindfulness Streak</p>
                  <p className="text-2xl font-bold text-green-400 text-shadow">12 days</p>
                  <p className="text-xs text-white/60 text-shadow">Keep it up!</p>
                </div>
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center glass animate-pulse-glow">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-primary/20 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70 text-shadow">Support Network</p>
                  <p className="text-2xl font-bold text-purple-400 text-shadow">Active</p>
                  <p className="text-xs text-white/60 text-shadow">3 check-ins today</p>
                </div>
                <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center glass animate-pulse-glow">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-shadow">
              <Shield className="h-6 w-6 text-green-400 animate-pulse" />
              Wellness & Self-Awareness Tools
            </CardTitle>
            <p className="text-white/70 text-sm text-shadow">
              Discover tools to support your mental wellness journey
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=breathing">
                  <Wind className="h-8 w-8 mb-3 text-blue-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">Breathing Exercise</span>
                  <span className="text-xs text-white/60">3-5 min</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=meditation">
                  <Brain className="h-8 w-8 mb-3 text-purple-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">Meditation</span>
                  <span className="text-xs text-white/60">5-10 min</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=mood">
                  <Heart className="h-8 w-8 mb-3 text-red-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">Mood Check-in</span>
                  <span className="text-xs text-white/60">2-3 min</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=gratitude">
                  <Heart className="h-8 w-8 mb-3 text-pink-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">Gratitude Log</span>
                  <span className="text-xs text-white/60">3-5 min</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=journal">
                  <BookOpen className="h-8 w-8 mb-3 text-green-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">Guided Journaling</span>
                  <span className="text-xs text-white/60">5-10 min</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=grounding">
                  <Target className="h-8 w-8 mb-3 text-orange-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">5-4-3-2-1 Grounding</span>
                  <span className="text-xs text-white/60">3-5 min</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 h-32 flex-col transition-all duration-300 hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/tools?tool=support">
                  <Users className="h-8 w-8 mb-3 text-cyan-400 animate-pulse" />
                  <span className="text-sm text-shadow font-medium">Support Circle</span>
                  <span className="text-xs text-white/60">Ongoing</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <BookOpen className="h-5 w-5 text-primary animate-pulse" />
                Recent Reflections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 glass rounded-lg border border-primary/20 hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-white/70 text-shadow">{entry.date}</span>
                    <div className="text-lg animate-pulse">{moodEmojis[entry.mood - 1]}</div>
                  </div>
                  <p className="text-sm text-white/90 mb-3 line-clamp-2 text-shadow">{entry.preview}</p>
                  <div className="flex gap-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full glass">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full glass-dark border-primary/20 text-white hover:bg-primary/10 transition-all duration-300 hover:scale-105 bg-transparent"
              >
                View All Entries
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-shadow">
                <Brain className="h-5 w-5 text-primary animate-pulse" />
                Your Practice Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 glass rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary mb-1 text-shadow">{stats.daysPracticing}</div>
                  <div className="text-sm text-white/80 text-shadow">Days practicing</div>
                </div>
                <div className="text-center p-4 glass rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-secondary mb-1 text-shadow">{stats.totalSessions}</div>
                  <div className="text-sm text-white/80 text-shadow">Total sessions</div>
                </div>
                <div className="text-center p-4 glass rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-accent mb-1 text-shadow">{stats.minutesToday}</div>
                  <div className="text-sm text-white/80 text-shadow">Minutes today</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white text-shadow">Recent Sessions</h4>
                <div className="space-y-2">
                  {getRecentSessions().length > 0 ? (
                    getRecentSessions().map((session) => {
                      const getIcon = (tool: string) => {
                        switch (tool) {
                          case 'breathing': return <Wind className="h-4 w-4 text-primary" />
                          case 'mood': return <Heart className="h-4 w-4 text-secondary" />
                          case 'grounding': return <Target className="h-4 w-4 text-accent" />
                          case 'meditation': return <Brain className="h-4 w-4 text-purple-400" />
                          case 'gratitude': return <Heart className="h-4 w-4 text-pink-400" />
                          case 'journal': return <BookOpen className="h-4 w-4 text-green-400" />
                          case 'support': return <Users className="h-4 w-4 text-cyan-400" />
                          default: return <Activity className="h-4 w-4 text-primary" />
                        }
                      }
                      
                      const getTimeAgo = (timestamp: Date) => {
                        const now = new Date()
                        const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60))
                        
                        if (diffInHours < 1) return 'Just now'
                        if (diffInHours < 24) return `${diffInHours} hours ago`
                        const diffInDays = Math.floor(diffInHours / 24)
                        if (diffInDays === 1) return 'Yesterday'
                        return `${diffInDays} days ago`
                      }

                      return (
                        <div key={session.id} className="flex items-center justify-between p-3 glass rounded-lg border border-primary/20">
                          <div className="flex items-center gap-3">
                            {getIcon(session.tool)}
                            <span className="text-sm text-white text-shadow">{session.toolName}</span>
                          </div>
                          <span className="text-xs text-white/70 text-shadow">{getTimeAgo(session.timestamp)}</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center p-4 text-white/60 text-shadow">
                      <p className="text-sm">No practice sessions yet</p>
                      <p className="text-xs">Start your wellness journey today!</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
