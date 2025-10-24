"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Plus, Save, Calendar, Star, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { usePractice } from "@/contexts/PracticeContext"
import { addGratitudeEntry, getGratitudeEntries, updateGratitudeEntry, deleteGratitudeEntry, GratitudeEntry } from "@/lib/firestore"

const gratitudePrompts = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What small moment brought you joy?",
  "What challenge helped you grow?",
  "What beauty did you notice around you?",
  "What kindness did you receive or give?",
  "What are you proud of accomplishing?",
  "What made you feel loved today?",
]

export default function GratitudeLog() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<GratitudeEntry>({
    id: "",
    date: new Date().toISOString().split('T')[0],
    items: [""],
    mood: 5,
    reflection: "",
    timestamp: new Date(),
  })
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addSession } = usePractice()

  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        setLoading(true)
        try {
          const userEntries = await getGratitudeEntries(user)
          setEntries(userEntries)
        } catch (error) {
          console.error('Error loading gratitude entries:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setEntries([])
      }
    }

    loadEntries()
  }, [user])

  const addGratitudeItem = () => {
    setCurrentEntry(prev => ({
      ...prev,
      items: [...prev.items, ""]
    }))
  }

  const updateGratitudeItem = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }))
  }

  const removeGratitudeItem = (index: number) => {
    if (currentEntry.items.length > 1) {
      setCurrentEntry(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const saveEntry = async () => {
    if (!user) {
      alert("Please log in to save your gratitude entry.")
      return
    }

    const filteredItems = currentEntry.items.filter(item => item.trim() !== "")
    if (filteredItems.length === 0) {
      alert("Please add at least one thing you're grateful for.")
      return
    }

    try {
      const entryData = {
        ...currentEntry,
        items: filteredItems,
        timestamp: new Date(),
      }

      if (isEditing && currentEntry.id) {
        // Update existing entry
        await updateGratitudeEntry(user, currentEntry.id, entryData)
        setEntries(prev => prev.map(entry => 
          entry.id === currentEntry.id ? { ...entry, ...entryData } : entry
        ))
      } else {
        // Add new entry
        const newEntry: Omit<GratitudeEntry, 'id'> = {
          ...entryData,
        }
        await addGratitudeEntry(user, newEntry)
        
        // Update local state
        const entryWithId: GratitudeEntry = {
          id: Date.now().toString(), // Temporary ID
          ...newEntry
        }
        setEntries(prev => [entryWithId, ...prev])

        // Add to practice context
        await addSession('gratitude', 'Gratitude Practice', 3) // 3 minutes for gratitude practice
      }

      // Reset form
      setCurrentEntry({
        id: "",
        date: new Date().toISOString().split('T')[0],
        items: [""],
        mood: 5,
        reflection: "",
        timestamp: new Date(),
      })
      setIsEditing(false)
      setSelectedPrompt("")
    } catch (error) {
      console.error('Error saving gratitude entry:', error)
      if (error instanceof Error && error.message.includes('Firebase')) {
        alert("❌ Firebase is not configured. Please check your .env.local file and see FIREBASE_SETUP.md for instructions.")
      } else {
        alert("Failed to save gratitude entry. Please try again.")
      }
    }
  }

  const editEntry = (entry: GratitudeEntry) => {
    setCurrentEntry(entry)
    setIsEditing(true)
  }

  const deleteEntry = async (id: string) => {
    if (!user) {
      alert("Please log in to delete entries.")
      return
    }

    if (confirm("Are you sure you want to delete this gratitude entry?")) {
      try {
        await deleteGratitudeEntry(user, id)
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } catch (error) {
        console.error('Error deleting gratitude entry:', error)
        alert("Failed to delete gratitude entry. Please try again.")
      }
    }
  }

  const getRandomPrompt = () => {
    const randomPrompt = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]
    setSelectedPrompt(randomPrompt)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Current Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {isEditing ? "Edit Gratitude Entry" : "Today's Gratitude"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update your gratitude entry" : "Take a moment to reflect on what you're grateful for today."}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Need inspiration?</h3>
              <Button variant="outline" size="sm" onClick={getRandomPrompt} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Get a prompt
              </Button>
            </div>
            {selectedPrompt && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium">{selectedPrompt}</p>
              </div>
            )}
          </div>

          {/* Gratitude Items */}
          <div className="space-y-3">
            <h3 className="font-medium">What are you grateful for today?</h3>
            {currentEntry.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateGratitudeItem(index, e.target.value)}
                    placeholder={`Gratitude ${index + 1}...`}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                {currentEntry.items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGratitudeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addGratitudeItem}
              className="w-full gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add another item
            </Button>
          </div>

          {/* Mood Rating */}
          <div className="space-y-3">
            <h3 className="font-medium">How are you feeling overall?</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setCurrentEntry(prev => ({ ...prev, mood: rating }))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                    currentEntry.mood >= rating
                      ? "bg-yellow-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-yellow-500/20"
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentEntry.mood === 1 && "Not great"}
              {currentEntry.mood === 2 && "Okay"}
              {currentEntry.mood === 3 && "Good"}
              {currentEntry.mood === 4 && "Great"}
              {currentEntry.mood === 5 && "Amazing"}
            </p>
          </div>

          {/* Reflection */}
          <div className="space-y-2">
            <h3 className="font-medium">Any additional thoughts? (Optional)</h3>
            <textarea
              value={currentEntry.reflection}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="How did practicing gratitude make you feel? Any insights or realizations?"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={saveEntry} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {isEditing ? "Update Entry" : "Save Entry"}
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentEntry({
                    id: "",
                    date: new Date().toISOString().split('T')[0],
                    items: [""],
                    mood: 5,
                    reflection: "",
                    timestamp: new Date(),
                  })
                  setIsEditing(false)
                }}
                className="bg-transparent"
              >
                Cancel
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
              Your Gratitude Journey
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Look back at your gratitude practice and see how it's helping you grow.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-background rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < entry.mood ? "text-yellow-500" : "text-muted-foreground"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editEntry(entry)}
                      className="text-primary hover:text-primary/80"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    {entry.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  {entry.reflection && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-primary font-medium mb-1">Reflection:</p>
                      <p className="text-sm text-muted-foreground">{entry.reflection}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
