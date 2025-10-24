"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Calendar, Edit, Trash2 } from "lucide-react"
import { usePractice } from "@/contexts/PracticeContext"
import { useAuth } from "@/contexts/AuthContext"
import { addMoodEntry, getMoodEntries, deleteMoodEntry, MoodEntry } from "@/lib/firestore"
import { testFirebaseConnection } from "@/lib/firebase"

const moodOptions = [
  { emoji: "😢", label: "Very Low", value: 1, color: "text-red-500" },
  { emoji: "😟", label: "Low", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "text-yellow-500" },
  { emoji: "😊", label: "Good", value: 4, color: "text-green-500" },
  { emoji: "😄", label: "Great", value: 5, color: "text-blue-500" },
]

const energyOptions = [
  { label: "Exhausted", value: 1 },
  { label: "Tired", value: 2 },
  { label: "Okay", value: 3 },
  { label: "Energetic", value: 4 },
  { label: "Vibrant", value: 5 },
]

const factors = [
  "Work/Study",
  "Relationships",
  "Health",
  "Sleep",
  "Exercise",
  "Social Media",
  "Weather",
  "Family",
  "Finances",
  "Other",
]

export default function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null)
  const [selectedFactors, setSelectedFactors] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [step, setStep] = useState(1)
  const [showPastEntries, setShowPastEntries] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addSession } = usePractice()
  const { user } = useAuth()

  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        setLoading(true)
        try {
          const userEntries = await getMoodEntries(user)
          setEntries(userEntries)
        } catch (error) {
          console.error('Error loading mood entries:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setEntries([])
      }
    }

    loadEntries()
  }, [user])

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors((prev) => (prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]))
  }

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save your mood entry.")
      return
    }

    const newEntry: Omit<MoodEntry, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood!,
      energy: selectedEnergy!,
      factors: selectedFactors,
      notes,
      timestamp: new Date(),
    }

    try {
      // Save to Firestore
      await addMoodEntry(user, newEntry)
      
      // Update local state
      const entryWithId: MoodEntry = {
        id: Date.now().toString(), // Temporary ID
        ...newEntry
      }
      setEntries(prev => [entryWithId, ...prev])

      // Add to practice context
      await addSession('mood', 'Mood Check-in', 2) // 2 minutes for mood check-in

      // Reset form
      setSelectedMood(null)
      setSelectedEnergy(null)
      setSelectedFactors([])
      setNotes("")
      setStep(1)

      // Show success message
      alert("Mood entry saved! Thank you for checking in with yourself.")
    } catch (error) {
      console.error('Error saving mood entry:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        user: user ? { uid: user.uid, email: user.email } : 'No user',
        entry: newEntry
      })
      
      if (error instanceof Error && error.message.includes('Firebase')) {
        alert("❌ Firebase is not configured. Please check your .env.local file and see FIREBASE_SETUP.md for instructions.")
      } else if (error instanceof Error && error.message.includes('permission')) {
        alert("❌ Permission denied. Please make sure you're logged in and try again.")
      } else if (error instanceof Error && error.message.includes('network')) {
        alert("❌ Network error. Please check your internet connection and try again.")
      } else {
        alert(`Failed to save mood entry: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
      }
    }
  }

  const deleteEntry = async (id: string) => {
    if (!user) {
      alert("Please log in to delete entries.")
      return
    }

    if (confirm("Are you sure you want to delete this mood entry?")) {
      try {
        await deleteMoodEntry(user, id)
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } catch (error) {
        console.error('Error deleting mood entry:', error)
        alert("Failed to delete mood entry. Please try again.")
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

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedMood !== null
      case 2:
        return selectedEnergy !== null
      case 3:
        return true // Factors are optional
      default:
        return false
    }
  }

  const testConnection = async () => {
    console.log('🧪 Testing Firebase connection...')
    const isConnected = await testFirebaseConnection()
    if (isConnected) {
      alert('✅ Firebase connection successful!')
    } else {
      alert('❌ Firebase connection failed. Check console for details.')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Mood Check-in
          </CardTitle>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className={`h-2 flex-1 rounded-full ${stepNum <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">How are you feeling right now?</h3>
              <p className="text-sm text-muted-foreground">Choose the emoji that best represents your mood</p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border/50 bg-background hover:bg-primary/5"
                  }`}
                >
                  <span className="text-3xl mb-2">{mood.emoji}</span>
                  <span className="text-xs text-center font-medium">{mood.label}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-primary">
                  You're feeling {moodOptions.find((m) => m.value === selectedMood)?.label.toLowerCase()} today
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">What's your energy level?</h3>
              <p className="text-sm text-muted-foreground">How much energy do you have right now?</p>
            </div>

            <div className="space-y-3">
              {energyOptions.map((energy) => (
                <button
                  key={energy.value}
                  onClick={() => setSelectedEnergy(energy.value)}
                  className={`w-full p-4 text-left rounded-xl transition-all duration-300 border-2 ${
                    selectedEnergy === energy.value
                      ? "border-secondary bg-secondary/10"
                      : "border-border/50 bg-background hover:bg-secondary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{energy.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`w-2 h-2 rounded-full ${dot <= energy.value ? "bg-secondary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">What's influencing your mood?</h3>
              <p className="text-sm text-muted-foreground">
                Select any factors that might be affecting how you feel (optional)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {factors.map((factor) => (
                <button
                  key={factor}
                  onClick={() => handleFactorToggle(factor)}
                  className={`p-3 text-sm rounded-lg transition-all duration-300 border-2 ${
                    selectedFactors.includes(factor)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/50 bg-background hover:bg-accent/5"
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>

            {selectedFactors.length > 0 && (
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-accent mb-2">Selected factors:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFactors.map((factor) => (
                    <span key={factor} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Anything else on your mind?</h3>
              <p className="text-sm text-muted-foreground">Share any additional thoughts or feelings (optional)</p>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's been on your mind today? How are you really feeling?"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
            />

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium text-primary mb-2">Your Check-in Summary</h4>
              <div className="space-y-1 text-sm">
                <p>
                  Mood: {moodOptions.find((m) => m.value === selectedMood)?.emoji}{" "}
                  {moodOptions.find((m) => m.value === selectedMood)?.label}
                </p>
                <p>Energy: {energyOptions.find((e) => e.value === selectedEnergy)?.label}</p>
                {selectedFactors.length > 0 && <p>Influences: {selectedFactors.join(", ")}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}

          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex-1">
              Next
            </Button>
          ) : (
            <Button onClick={handleSave} className="flex-1">
              Save Check-in
            </Button>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Past Entries */}
    {entries.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Your Mood Journey
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
            Track your emotional patterns and see how your mood changes over time.
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
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{moodOptions.find(m => m.value === entry.mood)?.emoji}</span>
                      <span className="text-sm text-muted-foreground">
                        {moodOptions.find(m => m.value === entry.mood)?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Energy:</span>
                      <span className="text-sm font-medium">
                        {energyOptions.find(e => e.value === entry.energy)?.label}
                      </span>
                    </div>
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
                <div className="space-y-2">
                  {entry.factors.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.factors.map((factor) => (
                        <span key={factor} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                          {factor}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.notes && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-primary font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    </div>
                  )}
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
