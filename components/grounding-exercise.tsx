"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Play, RotateCcw, CheckCircle } from "lucide-react"
import { usePractice } from "@/contexts/PracticeContext"

const steps = [
  {
    number: 5,
    sense: "See",
    instruction: "Look around and name 5 things you can see",
    examples: ["A blue pen on the desk", "Sunlight coming through the window", "A plant in the corner"],
  },
  {
    number: 4,
    sense: "Touch",
    instruction: "Notice 4 things you can touch or feel",
    examples: ["The texture of your clothes", "The temperature of the air", "Your feet on the ground"],
  },
  {
    number: 3,
    sense: "Hear",
    instruction: "Listen for 3 things you can hear",
    examples: ["Birds chirping outside", "The hum of air conditioning", "Your own breathing"],
  },
  {
    number: 2,
    sense: "Smell",
    instruction: "Identify 2 things you can smell",
    examples: ["Coffee in the air", "Fresh laundry", "A hint of perfume"],
  },
  {
    number: 1,
    sense: "Taste",
    instruction: "Notice 1 thing you can taste",
    examples: ["The lingering taste of tea", "The freshness in your mouth", "A subtle sweetness"],
  },
]

export default function GroundingExercise() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [userInputs, setUserInputs] = useState<string[]>(Array(5).fill(""))
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(5).fill(false))
  const [timeSpent, setTimeSpent] = useState(0)
  const { addSession } = usePractice()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const handleStart = () => {
    setIsActive(true)
    setCurrentStep(0)
    setTimeSpent(0)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => {
        const newCompleted = [...prev]
        newCompleted[currentStep] = true
        return newCompleted
      })
      setCurrentStep(currentStep + 1)
    } else {
      // Complete the exercise
      setCompletedSteps((prev) => {
        const newCompleted = [...prev]
        newCompleted[currentStep] = true
        return newCompleted
      })
      setIsActive(false)
      
      // Add to practice context
      const duration = Math.round(timeSpent / 60) // Convert seconds to minutes
      addSession('grounding', '5-4-3-2-1 Grounding', duration)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setIsActive(false)
    setCurrentStep(0)
    setUserInputs(Array(5).fill(""))
    setCompletedSteps(Array(5).fill(false))
    setTimeSpent(0)
  }

  const handleInputChange = (value: string) => {
    const newInputs = [...userInputs]
    newInputs[currentStep] = value
    setUserInputs(newInputs)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const allStepsCompleted = completedSteps.every((step) => step)

  if (!isActive && !allStepsCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            5-4-3-2-1 Grounding Exercise
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This technique helps you reconnect with the present moment using your five senses. It's especially helpful
            when feeling anxious or overwhelmed.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">How it works:</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.sense}</p>
                    <p className="text-sm text-muted-foreground">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-primary">
              <strong>Tip:</strong> Take your time with each step. There's no rush. The goal is to anchor yourself in
              the present moment.
            </p>
          </div>

          <Button onClick={handleStart} className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Grounding Exercise
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (allStepsCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            Exercise Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">Well done!</p>
              <p className="text-sm text-muted-foreground">
                You spent {formatTime(timeSpent)} grounding yourself in the present moment.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Your grounding observations:</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="p-3 bg-background rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                      {step.number}
                    </div>
                    <span className="font-medium text-sm">{step.sense}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">{userInputs[index] || "No observation recorded"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
            <p className="text-sm text-secondary">
              How do you feel now? Take a moment to notice any changes in your body, mind, or emotions.
            </p>
          </div>

          <Button onClick={handleReset} variant="outline" className="w-full gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Start New Session
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentStepData = steps[currentStep]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            5-4-3-2-1 Grounding
          </CardTitle>
          <div className="text-sm text-muted-foreground">{formatTime(timeSpent)}</div>
        </div>
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index < currentStep ? "bg-primary" : index === currentStep ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-primary">{currentStepData.number}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{currentStepData.sense}</h3>
            <p className="text-muted-foreground">{currentStepData.instruction}</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={userInputs[currentStep]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Describe what you ${currentStepData.sense.toLowerCase()}...`}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
          />

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {currentStepData.examples.map((example, index) => (
                <li key={index}>• {example}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1 bg-transparent">
              Previous
            </Button>
          )}

          <Button onClick={handleNext} className="flex-1">
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
