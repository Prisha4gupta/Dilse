import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase configuration is complete
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is incomplete! Please check your .env.local file.')
  console.error('Required environment variables:')
  console.error('- NEXT_PUBLIC_FIREBASE_API_KEY')
  console.error('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
  console.error('- NEXT_PUBLIC_FIREBASE_PROJECT_ID')
  console.error('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
  console.error('- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
  console.error('- NEXT_PUBLIC_FIREBASE_APP_ID')
  console.error('See FIREBASE_SETUP.md for instructions.')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app)

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing Firebase connection...')
    console.log('Firebase config:', {
      apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
      authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
      projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
      storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
      messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
      appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing',
    })
    
    // Test if we can access Firestore
    const { collection, getDocs } = await import('firebase/firestore')
    const testCollection = collection(db, 'test')
    console.log('✅ Firebase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Firebase connection failed:', error)
    return false
  }
}

export default app
