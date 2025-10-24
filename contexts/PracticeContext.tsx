"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { addPracticeSession, getPracticeSessions, PracticeSession } from '@/lib/firestore'

// Remove duplicate interface - using the one from firestore.ts

interface PracticeStats {
  daysPracticing: number
  totalSessions: number
  minutesToday: number
}

interface PracticeContextType {
  sessions: PracticeSession[]
  stats: PracticeStats
  addSession: (tool: string, toolName: string, duration: number) => void
  getRecentSessions: () => PracticeSession[]
  loading: boolean
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined)

export function PracticeProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Load sessions from Firestore when user changes
  useEffect(() => {
    const loadSessions = async () => {
      if (user) {
        setLoading(true)
        try {
          const userSessions = await getPracticeSessions(user)
          setSessions(userSessions)
        } catch (error) {
          console.error('Error loading practice sessions:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setSessions([])
      }
    }

    loadSessions()
  }, [user])

  // Listen for auth state changes
  useEffect(() => {
    const { onAuthStateChanged } = require('firebase/auth')
    const { auth } = require('@/lib/firebase')
    
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const addSession = async (tool: string, toolName: string, duration: number) => {
    if (!user) {
      console.error('No user logged in')
      return
    }

    try {
      const newSession: Omit<PracticeSession, 'id'> = {
        tool,
        toolName,
        duration,
        timestamp: new Date(),
        completed: true
      }
      
      await addPracticeSession(user, newSession)
      
      // Update local state
      const sessionWithId: PracticeSession = {
        id: Date.now().toString(), // Temporary ID, will be updated on next load
        ...newSession
      }
      setSessions(prev => [sessionWithId, ...prev])
    } catch (error) {
      console.error('Error adding practice session:', error)
    }
  }

  const getRecentSessions = () => {
    return sessions.slice(0, 3) // Get last 3 sessions
  }

  const calculateStats = (): PracticeStats => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaySessions = sessions.filter(session => {
      const sessionDate = new Date(session.timestamp)
      sessionDate.setHours(0, 0, 0, 0)
      return sessionDate.getTime() === today.getTime()
    })

    const minutesToday = todaySessions.reduce((total, session) => total + session.duration, 0)

    // Calculate unique days practicing
    const uniqueDays = new Set(
      sessions.map(session => {
        const date = new Date(session.timestamp)
        return date.toDateString()
      })
    ).size

    return {
      daysPracticing: uniqueDays,
      totalSessions: sessions.length,
      minutesToday
    }
  }

  const stats = calculateStats()

  const value = {
    sessions,
    stats,
    addSession,
    getRecentSessions,
    loading
  }

  return (
    <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>
  )
}

export function usePractice() {
  const context = useContext(PracticeContext)
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider')
  }
  return context
}
