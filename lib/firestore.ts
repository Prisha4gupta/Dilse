import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'

// Types
export interface PracticeSession {
  id: string
  tool: string
  toolName: string
  duration: number // in minutes
  timestamp: Date
  completed: boolean
}

export interface MoodEntry {
  id: string
  date: string
  mood: number
  energy: number
  factors: string[]
  notes: string
  timestamp: Date
}

export interface JournalEntry {
  id: string
  date: string
  prompt: string
  category: string
  entry: string
  wordCount: number
  timestamp: Date
}

export interface GratitudeEntry {
  id: string
  date: string
  items: string[]
  mood: number
  reflection: string
  timestamp: Date
}

// Practice Sessions
export const addPracticeSession = async (user: User, session: Omit<PracticeSession, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users', user.uid, 'practiceSessions'), {
      ...session,
      timestamp: Timestamp.fromDate(session.timestamp)
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding practice session:', error)
    throw error
  }
}

export const getPracticeSessions = async (user: User): Promise<PracticeSession[]> => {
  try {
    const q = query(
      collection(db, 'users', user.uid, 'practiceSessions'),
      orderBy('timestamp', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as PracticeSession[]
  } catch (error) {
    console.error('Error getting practice sessions:', error)
    return []
  }
}

// Mood Entries
export const addMoodEntry = async (user: User, entry: Omit<MoodEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users', user.uid, 'moodEntries'), {
      ...entry,
      timestamp: Timestamp.fromDate(entry.timestamp)
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding mood entry:', error)
    if (error instanceof Error && error.message.includes('Firebase')) {
      console.error('❌ Firebase is not properly configured. Please check your .env.local file.')
    }
    throw error
  }
}

export const getMoodEntries = async (user: User): Promise<MoodEntry[]> => {
  try {
    const q = query(
      collection(db, 'users', user.uid, 'moodEntries'),
      orderBy('timestamp', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as MoodEntry[]
  } catch (error) {
    console.error('Error getting mood entries:', error)
    return []
  }
}

export const deleteMoodEntry = async (user: User, entryId: string) => {
  try {
    await deleteDoc(doc(db, 'users', user.uid, 'moodEntries', entryId))
  } catch (error) {
    console.error('Error deleting mood entry:', error)
    throw error
  }
}

// Journal Entries
export const addJournalEntry = async (user: User, entry: Omit<JournalEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users', user.uid, 'journalEntries'), {
      ...entry,
      timestamp: Timestamp.fromDate(entry.timestamp)
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding journal entry:', error)
    throw error
  }
}

export const getJournalEntries = async (user: User): Promise<JournalEntry[]> => {
  try {
    const q = query(
      collection(db, 'users', user.uid, 'journalEntries'),
      orderBy('timestamp', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as JournalEntry[]
  } catch (error) {
    console.error('Error getting journal entries:', error)
    return []
  }
}

export const deleteJournalEntry = async (user: User, entryId: string) => {
  try {
    await deleteDoc(doc(db, 'users', user.uid, 'journalEntries', entryId))
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    throw error
  }
}

// Gratitude Entries
export const addGratitudeEntry = async (user: User, entry: Omit<GratitudeEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users', user.uid, 'gratitudeEntries'), {
      ...entry,
      timestamp: Timestamp.fromDate(entry.timestamp)
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding gratitude entry:', error)
    throw error
  }
}

export const getGratitudeEntries = async (user: User): Promise<GratitudeEntry[]> => {
  try {
    const q = query(
      collection(db, 'users', user.uid, 'gratitudeEntries'),
      orderBy('timestamp', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as GratitudeEntry[]
  } catch (error) {
    console.error('Error getting gratitude entries:', error)
    return []
  }
}

export const updateGratitudeEntry = async (user: User, entryId: string, entry: Partial<GratitudeEntry>) => {
  try {
    const docRef = doc(db, 'users', user.uid, 'gratitudeEntries', entryId)
    await updateDoc(docRef, {
      ...entry,
      timestamp: entry.timestamp ? Timestamp.fromDate(entry.timestamp) : undefined
    })
  } catch (error) {
    console.error('Error updating gratitude entry:', error)
    throw error
  }
}

export const deleteGratitudeEntry = async (user: User, entryId: string) => {
  try {
    await deleteDoc(doc(db, 'users', user.uid, 'gratitudeEntries', entryId))
  } catch (error) {
    console.error('Error deleting gratitude entry:', error)
    throw error
  }
}
