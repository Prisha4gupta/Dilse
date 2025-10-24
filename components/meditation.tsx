"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { usePractice } from "@/contexts/PracticeContext"

const meditationTypes = [
  {
    id: "breathing",
    title: "Breathing Meditation",
    description: "Focus on your breath to calm the mind",
    duration: 5,
    instruction: "Breathe naturally and count each breath. When you reach 10, start over.",
  },
  {
    id: "body-scan",
    title: "Body Scan",
    description: "Progressive relaxation through body awareness",
    duration: 10,
    instruction: "Slowly scan your body from head to toe, noticing any tension and releasing it.",
  },
  {
    id: "loving-kindness",
    title: "Loving-Kindness",
    description: "Cultivate compassion for yourself and others",
    duration: 8,
    instruction: "Repeat: 'May I be happy, may I be healthy, may I be safe, may I live with ease.'",
  },
  {
    id: "mindfulness",
    title: "Mindfulness",
    description: "Present moment awareness without judgment",
    duration: 7,
    instruction: "Notice thoughts, feelings, and sensations as they arise without getting caught up in them.",
  },
]

export default function Meditation() {
  const [selectedType, setSelectedType] = useState<string>("")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [currentInstruction, setCurrentInstruction] = useState("")
  const { addSession } = usePractice()

  const selectedMeditation = meditationTypes.find((type) => type.id === selectedType)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      setCurrentInstruction("Meditation complete. Take a moment to notice how you feel.")
      
      // Add to practice context
      const meditation = meditationTypes.find((m) => m.id === selectedType)
      if (meditation) {
        addSession('meditation', meditation.title, meditation.duration)
      }
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const startMeditation = (type: string) => {
    const meditation = meditationTypes.find((m) => m.id === type)
    if (meditation) {
      setSelectedType(type)
      setTimeLeft(meditation.duration * 60) // Convert minutes to seconds
      setCurrentInstruction(meditation.instruction)
      setIsActive(true)
    }
  }

  const toggleMeditation = () => {
    setIsActive(!isActive)
  }

  const resetMeditation = () => {
    setIsActive(false)
    setTimeLeft(0)
    setCurrentInstruction("")
    setSelectedType("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!selectedType) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Meditation Practice
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose a meditation practice that resonates with you today. All practices are designed to help you find calm and clarity.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {meditationTypes.map((type) => (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
                  onClick={() => startMeditation(type.id)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{type.title}</h3>
                        <span className="text-sm text-muted-foreground">{type.duration} min</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-xs text-primary font-medium">Practice:</p>
                        <p className="text-xs text-muted-foreground mt-1">{type.instruction}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            {selectedMeditation?.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="gap-2"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-muted-foreground">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <div className="text-4xl font-bold text-primary">{formatTime(timeLeft)}</div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{selectedMeditation?.title}</h3>
            <p className="text-sm text-muted-foreground">{selectedMeditation?.description}</p>
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-medium mb-2">Current Practice:</p>
          <p className="text-sm text-muted-foreground">{currentInstruction}</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={toggleMeditation} className="flex-1 gap-2">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetMeditation} variant="outline" className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {!isMuted && (
          <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
            <p className="text-xs text-secondary">
              💡 <strong>Audio tip:</strong> You can play gentle background music or nature sounds to enhance your meditation experience.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
