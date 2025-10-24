"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // You can update the user profile here if needed
      // await updateProfile(result.user, { displayName: name })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('🔄 Attempting to logout...')
      
      // Check if user is authenticated before attempting logout
      if (!auth.currentUser) {
        console.log('⚠️ No user to logout, clearing local state')
        setUser(null)
        return
      }
      
      await signOut(auth)
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error)
      
      // Even if logout fails, clear the local user state
      setUser(null)
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          throw new Error('Network error during logout. You have been logged out locally.')
        } else if (error.message.includes('permission')) {
          throw new Error('Permission error during logout. You have been logged out locally.')
        } else {
          throw new Error(`Logout failed: ${error.message}`)
        }
      } else {
        throw new Error('Unknown error during logout. You have been logged out locally.')
      }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
