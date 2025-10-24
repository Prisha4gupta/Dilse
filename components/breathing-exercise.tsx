"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"
import { usePractice } from "@/contexts/PracticeContext"

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const { addSession } = usePractice()

  const phases = {
    inhale: { duration: 4, next: "hold", instruction: "Breathe in slowly" },
    hold: { duration: 4, next: "exhale", instruction: "Hold your breath" },
    exhale: { duration: 6, next: "inhale", instruction: "Breathe out gently" },
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phases[phase]
      const nextPhase = currentPhase.next as keyof typeof phases

      setPhase(nextPhase)
      setTimeLeft(phases[nextPhase].duration)

      if (nextPhase === "inhale") {
        setCycle((prev) => prev + 1)
      }
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft, phase])

  const toggleExercise = () => {
    if (!isActive) {
      // Starting the session
      setSessionStartTime(new Date())
    } else {
      // Ending the session - save it
      if (sessionStartTime && cycle > 0) {
        const duration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60)) // in minutes
        addSession('breathing', 'Breathing Exercise', duration)
      }
      setSessionStartTime(null)
    }
    setIsActive(!isActive)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimeLeft(4)
    setCycle(0)
    setSessionStartTime(null)
  }

  const getCircleScale = () => {
    const progress = (phases[phase].duration - timeLeft) / phases[phase].duration

    switch (phase) {
      case "inhale":
        return 0.5 + progress * 0.5 // Scale from 0.5 to 1
      case "hold":
        return 1 // Stay at full size
      case "exhale":
        return 1 - progress * 0.5 // Scale from 1 to 0.5
      default:
        return 0.5
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Breathing Exercise</h3>
          <p className="text-sm text-muted-foreground">Follow the circle and breathe mindfully</p>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `scale(${getCircleScale()})`,
            }}
          />
          <div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `scale(${getCircleScale()})`,
            }}
          />
          <div className="relative z-10 text-center space-y-2">
            <div className="text-2xl font-bold text-primary">{timeLeft}</div>
            <div className="text-sm text-muted-foreground capitalize">{phases[phase].instruction}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <p className="text-sm font-medium capitalize">{phases[phase].instruction}</p>
          <p className="text-xs text-muted-foreground">
            Cycle {cycle} • {phase.charAt(0).toUpperCase() + phase.slice(1)} phase
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button onClick={toggleExercise} size="sm" className="rounded-full">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetExercise} variant="outline" size="sm" className="rounded-full bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">4 seconds in • 4 seconds hold • 6 seconds out</div>
      </CardContent>
    </Card>
  )
}
