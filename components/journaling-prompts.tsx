"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Shuffle, Save, Lightbulb, Calendar, Trash2 } from "lucide-react"
import { usePractice } from "@/contexts/PracticeContext"
import { useAuth } from "@/contexts/AuthContext"
import { addJournalEntry, getJournalEntries, deleteJournalEntry, JournalEntry } from "@/lib/firestore"

const journalPrompts = [
  {
    category: "Self-Reflection",
    prompts: [
      "What am I grateful for today, and why does it matter to me?",
      "What emotion am I avoiding right now, and what is it trying to tell me?",
      "If my best friend was feeling what I'm feeling, what would I tell them?",
      "What's one thing I learned about myself this week?",
      "What would I do if I knew I couldn't fail?",
    ],
  },
  {
    category: "Emotional Processing",
    prompts: [
      "What's the story I'm telling myself about this situation? Is it helping or hurting me?",
      "When did I feel most like myself today?",
      "What's underneath this feeling I'm having?",
      "How has this challenge helped me grow?",
      "What do I need to forgive myself for?",
    ],
  },
  {
    category: "Growth & Goals",
    prompts: [
      "What small step can I take today toward something I care about?",
      "What pattern in my life am I ready to change?",
      "What would my future self thank me for doing today?",
      "What's one way I can be kinder to myself this week?",
      "What does success mean to me right now?",
    ],
  },
  {
    category: "Relationships",
    prompts: [
      "How did I show up in my relationships today?",
      "What do I need more of in my relationships?",
      "Who in my life makes me feel most understood?",
      "What boundary do I need to set or maintain?",
      "How can I better communicate what I need?",
    ],
  },
]

export default function JournalingPrompts() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [journalEntry, setJournalEntry] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Self-Reflection")
  const [wordCount, setWordCount] = useState(0)
  const [showPastEntries, setShowPastEntries] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addSession } = usePractice()
  const { user } = useAuth()

  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        setLoading(true)
        try {
          const userEntries = await getJournalEntries(user)
          setEntries(userEntries)
        } catch (error) {
          console.error('Error loading journal entries:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setEntries([])
      }
    }

    loadEntries()
  }, [user])

  const getRandomPrompt = () => {
    const allPrompts = journalPrompts.flatMap((category) => category.prompts)
    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)]
    setSelectedPrompt(randomPrompt)
  }

  const handleEntryChange = (value: string) => {
    setJournalEntry(value)
    setWordCount(
      value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
  }

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save your journal entry.")
      return
    }

    try {
      const newEntry: Omit<JournalEntry, 'id'> = {
        date: new Date().toISOString().split('T')[0],
        prompt: selectedPrompt,
        category: selectedCategory,
        entry: journalEntry,
        wordCount,
        timestamp: new Date(),
      }

      // Save to Firestore
      await addJournalEntry(user, newEntry)
      
      // Update local state
      const entryWithId: JournalEntry = {
        id: Date.now().toString(), // Temporary ID
        ...newEntry
      }
      setEntries(prev => [entryWithId, ...prev])

      // Add to practice context
      await addSession('journal', 'Guided Journaling', 5) // 5 minutes for journaling

      // Reset form
      setJournalEntry("")
      setWordCount(0)
      setSelectedPrompt("")

      alert("Journal entry saved! Thank you for taking time to reflect.")
    } catch (error) {
      console.error('Error saving journal entry:', error)
      if (error instanceof Error && error.message.includes('Firebase')) {
        alert("❌ Firebase is not configured. Please check your .env.local file and see FIREBASE_SETUP.md for instructions.")
      } else {
        alert("Failed to save journal entry. Please try again.")
      }
    }
  }

  const deleteEntry = async (id: string) => {
    if (!user) {
      alert("Please log in to delete entries.")
      return
    }

    if (confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteJournalEntry(user, id)
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } catch (error) {
        console.error('Error deleting journal entry:', error)
        alert("Failed to delete journal entry. Please try again.")
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const currentCategoryPrompts = journalPrompts.find((cat) => cat.category === selectedCategory)?.prompts || []

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Guided Journaling
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Let AI guide your reflection with thoughtful prompts designed to help you explore your inner world.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Choose a prompt category</h3>
              <Button variant="outline" size="sm" onClick={getRandomPrompt} className="gap-2 bg-transparent">
                <Shuffle className="h-4 w-4" />
                Surprise me
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {journalPrompts.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(category.category)}
                  className={`p-3 text-sm rounded-lg transition-all duration-300 border-2 text-left ${
                    selectedCategory === category.category
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-background hover:bg-primary/5"
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt List */}
          {!selectedPrompt && (
            <div className="space-y-3">
              <h4 className="font-medium">{selectedCategory} Prompts</h4>
              <div className="space-y-2">
                {currentCategoryPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPrompt(prompt)}
                    className="w-full p-4 text-left rounded-lg border border-border/50 bg-background hover:bg-primary/5 transition-colors"
                  >
                    <p className="text-sm">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Prompt & Writing Area */}
          {selectedPrompt && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-primary font-medium">{selectedPrompt}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Your reflection</label>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{wordCount} words</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPrompt("")} className="text-xs">
                      Change prompt
                    </Button>
                  </div>
                </div>

                <textarea
                  value={journalEntry}
                  onChange={(e) => handleEntryChange(e.target.value)}
                  placeholder="Take your time... there's no right or wrong answer. Just write what comes to mind."
                  className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[300px]"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={!journalEntry.trim()} className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Save Entry
                </Button>
                <Button variant="outline" onClick={getRandomPrompt} className="gap-2 bg-transparent">
                  <Shuffle className="h-4 w-4" />
                  New prompt
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Entries */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Journal Journey
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPastEntries(!showPastEntries)}
                className="ml-auto"
              >
                {showPastEntries ? "Hide" : "Show"} Past Entries
              </Button>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Reflect on your past journal entries and see how your thoughts have evolved.
            </p>
          </CardHeader>
          {showPastEntries && (
            <CardContent className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-background rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        {entry.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {entry.wordCount} words
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-primary font-medium mb-1">Prompt:</p>
                      <p className="text-sm text-primary">{entry.prompt}</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/30">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Your reflection:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.entry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
