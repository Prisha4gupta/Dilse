"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Eye, EyeOff, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  })

  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!")
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      setError("Please agree to the terms and privacy policy!")
      setIsLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.name)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/invalid-email':
        return 'Invalid email address.'
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.'
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative dark flex items-center justify-center p-6">
      <AnimatedBackground />

      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105 text-shadow"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <Card className="glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <Heart className="h-8 w-8 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
              </div>
              <span className="text-2xl font-bold text-white text-shadow">DilSe AI</span>
            </div>
            <CardTitle className="text-2xl text-white text-shadow">Start Your Journey</CardTitle>
            <p className="text-white/80 text-shadow">Create your safe space for mental wellness</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white text-shadow">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="glass-dark border-primary/20 text-white placeholder-white/60 focus:border-primary/50 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-shadow">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="glass-dark border-primary/20 text-white placeholder-white/60 focus:border-primary/50 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-shadow">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="glass-dark border-primary/20 text-white placeholder-white/60 focus:border-primary/50 focus:ring-primary/50 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white text-shadow">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="glass-dark border-primary/20 text-white placeholder-white/60 focus:border-primary/50 focus:ring-primary/50 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-white/80 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <div
                      className={`w-4 h-4 border border-primary/20 rounded glass-dark flex items-center justify-center transition-all duration-200 ${formData.agreeToTerms ? "bg-primary border-primary" : ""}`}
                    >
                      {formData.agreeToTerms && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-shadow">
                    I agree to the{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm text-white/80 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.agreeToPrivacy}
                      onChange={(e) => handleInputChange("agreeToPrivacy", e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <div
                      className={`w-4 h-4 border border-primary/20 rounded glass-dark flex items-center justify-center transition-all duration-200 ${formData.agreeToPrivacy ? "bg-primary border-primary" : ""}`}
                    >
                      {formData.agreeToPrivacy && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-shadow">
                    I understand the{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full animate-pulse-glow hover:scale-105 transition-all duration-300"
                size="lg"
                disabled={!formData.agreeToTerms || !formData.agreeToPrivacy || isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card/50 px-2 text-white/60 text-shadow">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="glass-dark border-primary/20 text-white hover:bg-primary/10 bg-transparent px-8"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="text-center text-sm text-white/80 text-shadow">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-white/60 text-shadow space-y-1">
          <p>🔒 Your data is encrypted and stored securely</p>
          <p>💙 Anonymous conversations, always</p>
        </div>
      </div>
    </div>
  )
}
