"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Clock, BookOpen, MessageCircle, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { TypingIndicator } from "@/components/typing-indicator"
import { useState } from "react"

export default function HomePage() {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: "Let's skip the small talk. How are you really feeling today?",
      timestamp: new Date()
    },
    {
      id: 2,
      sender: 'user',
      message: "I'm feeling a bit overwhelmed",
      timestamp: new Date()
    },
    {
      id: 3,
      sender: 'ai',
      message: "That sounds really tough. Thanks for being honest with me. What's making you feel most overwhelmed right now?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [emojiResponse, setEmojiResponse] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      sender: 'user' as const,
      message: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);
    setDebugInfo('Sending message to API...');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          type: 'chat'
        }),
      });

      setDebugInfo(`API Response Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDebugInfo(`API Response: ${JSON.stringify(data, null, 2)}`);
      
      if (data.error) {
        console.error('API Error:', data.error);
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'ai' as const,
          message: data.error === 'Gemini API key not configured' 
            ? "I'm not properly configured yet. Please check the API settings."
            : "I'm having trouble processing your message right now. Please try again.",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      } else if (data.response) {
        const newAiMessage = {
          id: Date.now() + 1,
          sender: 'ai' as const,
          message: data.response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, newAiMessage]);
        setDebugInfo('Message sent successfully!');
      } else {
        console.error('Unexpected response format:', data);
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'ai' as const,
          message: "I received an unexpected response. Please try again.",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai' as const,
        message: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEmojiClick = async (emoji: string) => {
    setSelectedEmoji(emoji);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: emoji,
          type: 'emoji'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        setEmojiResponse("Thank you for sharing how you feel. We're here to listen and support you.");
      } else if (data.response) {
        setEmojiResponse(data.response);
      } else {
        console.error('Unexpected response format:', data);
        setEmojiResponse("Thank you for sharing how you feel. We're here to listen and support you.");
      }
    } catch (error) {
      console.error('Error getting emoji response:', error);
      setEmojiResponse("Thank you for sharing how you feel. We're here to listen and support you.");
    }
  };

  return (
    <div className="min-h-screen relative dark">
      <AnimatedBackground />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Heart className="h-8 w-8 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
          </div>
          <span className="text-2xl font-bold text-white text-shadow">DilSe AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 text-shadow"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 text-shadow"
          >
            Features
          </Link>
          <Link
            href="#resources"
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 text-shadow"
          >
            Resources
          </Link>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="glass-dark hover:bg-primary/10 transition-all duration-300 hover:scale-105 bg-transparent text-white border-white/20"
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild className="animate-pulse-glow hover:scale-105 transition-all duration-300">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      <section className="relative z-10 text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 text-white text-shadow">
            From the heart, <br />
            <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient text-glow">
              For your mind
            </span>
          </h1>
          <p className="text-xl text-white/90 text-balance max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-shadow">
            A safe, anonymous, and stigma-free space for students and young adults to explore their mental wellness
            journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 animate-pulse-glow hover:scale-105 transition-all duration-300"
            >
              <Link href="/chat">Try a Glimpse</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8 py-6 glass-dark hover:bg-primary/10 hover:scale-105 transition-all duration-300 bg-transparent text-white border-white/20"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-4xl font-bold mb-4 text-white text-shadow">A Moment of Clarity</h2>
          <p className="text-xl text-white/90 text-shadow">
            Talk to DilSe AI for a moment. No judgment. No limits asked.
          </p>
        </div>

        <Card className="p-8 glass-dark border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <CardContent className="space-y-6 p-0">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  } animate-in fade-in slide-in-from-${msg.sender === 'user' ? 'right' : 'left'}-4 duration-800`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {msg.sender === 'ai' && (
                    <p className="text-white/70 text-sm mb-2 text-shadow">DilSe AI</p>
                  )}
                  <div
                    className={`${
                      msg.sender === 'user'
                        ? 'bg-secondary/20 rounded-2xl rounded-tr-md p-4 max-w-xs ml-auto glass'
                        : 'bg-primary/20 rounded-2xl rounded-tl-md p-4 max-w-md glass'
                    }`}
                  >
                    <p className="text-sm text-white text-shadow">{msg.message}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="text-left animate-in fade-in slide-in-from-left-4 duration-800">
                  <div className="bg-primary/10 rounded-2xl rounded-tl-md max-w-xs glass">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-800 delay-1000">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Share a thought..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full glass-dark border border-primary/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-white/60"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isTyping}
                className="rounded-full animate-pulse-glow hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto">
        <div className="p-8 glass-dark rounded-3xl border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
          <p className="text-lg text-white/90 mb-6 text-center text-shadow">How are you feeling right now?</p>
          <div className="flex justify-center gap-4 mb-6">
            {[
              { emoji: "😊", delay: "0ms" },
              { emoji: "😐", delay: "100ms" },
              { emoji: "😟", delay: "200ms" },
              { emoji: "😢", delay: "300ms" },
              { emoji: "😡", delay: "400ms" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(item.emoji)}
                className={`w-16 h-16 text-3xl rounded-full glass hover:bg-primary/20 transition-all duration-300 hover:scale-125 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 ${
                  selectedEmoji === item.emoji ? 'bg-primary/30 scale-110 border-primary/50' : ''
                }`}
                style={{ animationDelay: item.delay }}
              >
                {item.emoji}
              </button>
            ))}
          </div>
          
          {emojiResponse && (
            <div className="mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-800">
              <p className="text-white/90 text-center text-shadow">{emojiResponse}</p>
            </div>
          )}
          
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center animate-breathe">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center animate-pulse-glow">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="text-sm text-white/70 mt-4 animate-pulse text-center text-shadow">
            Sync your breath with the visual
          </p>
        </div>
      </section>

      <section id="features" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-4xl font-bold mb-4 text-white text-shadow">More Than an App, It's a Mirror</h2>
          <p className="text-xl text-white/90 text-balance max-w-2xl mx-auto text-shadow">
            DilSe AI is built as a thoughtful companion designed for your well-being
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Private & Encrypted",
              description:
                "Your conversations are protected with end-to-end encryption and stored locally on your device.",
              color: "primary",
              delay: "0ms",
            },
            {
              icon: TrendingUp,
              title: "Personal Growth Tracking",
              description: "AI-powered insights help you understand patterns and celebrate progress over time.",
              color: "secondary",
              delay: "200ms",
            },
            {
              icon: Clock,
              title: "Always Available",
              description: "24/7 support whenever you need it, without waiting for appointments or office hours.",
              color: "accent",
              delay: "400ms",
            },
            {
              icon: BookOpen,
              title: "Friend & Journal",
              description: "Talk like to a friend, but saved like a journal with the structure of a growth companion.",
              color: "primary",
              delay: "600ms",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className={`p-6 text-center glass-dark hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2 hover:scale-105 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 group`}
              style={{ animationDelay: feature.delay }}
            >
              <CardContent className="space-y-4 p-0">
                <div
                  className={`w-16 h-16 mx-auto bg-${feature.color}/10 rounded-2xl flex items-center justify-center group-hover:animate-pulse-glow transition-all duration-300`}
                >
                  <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white text-shadow">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed text-shadow">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 text-center max-w-4xl mx-auto">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-4xl md:text-5xl font-bold text-balance text-white text-shadow">
            An AI that understands <br />
            <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient text-glow">
              what you don't say
            </span>
          </h2>
          <p className="text-xl text-white/90 text-balance max-w-2xl mx-auto leading-relaxed text-shadow">
            DilSe AI listens to your digital rhythm to help you understand your emotional patterns. Don't believe us?
            Try it yourself below.
          </p>
          <Button
            size="lg"
            asChild
            className="text-lg px-8 py-6 mt-8 animate-pulse-glow hover:scale-105 transition-all duration-300"
          >
            <Link href="/chat">Try a Glimpse</Link>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-4xl font-bold mb-4 text-white text-shadow">How DilSe AI Becomes Your Digital Mirror</h2>
          <p className="text-xl text-white/90 text-balance max-w-2xl mx-auto text-shadow">
            Your journey to self-awareness is a private, continuous conversation. Here's how DilSe AI facilitates it,
            step by step.
          </p>
        </div>

        <div className="space-y-12">
          {[
            {
              number: 1,
              title: "It Starts by Listening to Your Rhythm",
              description:
                "DilSe AI doesn't read your words, it learns your unique emotional rhythm - your typing speed, how often you pause, your word patterns. These are the whispers of your inner state.",
              delay: "0ms",
            },
            {
              number: 2,
              title: "Gentle Nudges, Not Notifications",
              description:
                "When it senses you might be feeling overwhelmed or anxious, it offers a gentle nudge - a soft prompt to check in with yourself, never intrusive notifications.",
              delay: "300ms",
            },
            {
              number: 3,
              title: "Reflecting What You Didn't Say",
              description:
                "DilSe AI helps you understand the emotions behind your words, offering insights about patterns you might not have noticed yourself.",
              delay: "600ms",
            },
          ].map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000`}
              style={{ animationDelay: step.delay }}
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold animate-pulse-glow">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-white text-shadow">{step.title}</h3>
                </div>
                <p className="text-white/80 leading-relaxed text-shadow">{step.description}</p>
              </div>
              <div className="flex-1">
                <div className="glass-dark rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-500 group">
                  {step.number === 1 && (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-primary animate-pulse" />
                        <span className="text-sm text-white/70 text-shadow">Analyzing rhythm...</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-3/4 animate-pulse group-hover:animate-pulse-glow"></div>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full w-1/2 animate-pulse group-hover:animate-pulse-glow"></div>
                        </div>
                      </div>
                    </>
                  )}
                  {step.number === 2 && (
                    <div className="space-y-3">
                      <div className="bg-primary/20 rounded-lg p-3 glass animate-in fade-in slide-in-from-left-2 duration-800">
                        <p className="text-sm text-white text-shadow">
                          💙 Hey, noticed you've been typing fast today. Want to take a breath?
                        </p>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3 glass animate-in fade-in slide-in-from-left-2 duration-800 delay-200">
                        <p className="text-sm text-white text-shadow">
                          🌸 It's been a while since we checked in. How's your heart feeling?
                        </p>
                      </div>
                    </div>
                  )}
                  {step.number === 3 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-2 animate-breathe">
                          <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm text-white/80 text-shadow">
                          "I notice you often mention feeling 'fine' when discussing stressful topics. Your heart might
                          be protecting itself."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="resources" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-4xl font-bold mb-4 text-white text-shadow">Mental Health Resources</h2>
          <p className="text-xl text-white/90 text-balance max-w-2xl mx-auto text-shadow">
            Additional support when you need it most
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Crisis Helplines",
              description: "24/7 support for immediate help",
              items: ["AASRA: 91-22-27546669", "Snehi: 91-22-27546669", "Vandrevala: 1860-2662-345"],
              delay: "0ms",
            },
            {
              title: "Self-Care Tools",
              description: "Guided exercises and techniques",
              items: ["Breathing exercises", "Mindfulness practices", "Journaling prompts"],
              delay: "200ms",
            },
            {
              title: "Professional Help",
              description: "When you need more support",
              items: ["Find therapists", "Mental health clinics", "Support groups"],
              delay: "400ms",
            },
          ].map((resource, index) => (
            <Card
              key={index}
              className="p-6 glass-dark hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000"
              style={{ animationDelay: resource.delay }}
            >
              <CardContent className="space-y-4 p-0">
                <h3 className="text-xl font-semibold text-white text-shadow">{resource.title}</h3>
                <p className="text-white/80 text-sm text-shadow">{resource.description}</p>
                <ul className="space-y-2">
                  {resource.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-white/70 text-sm text-shadow">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/30 border-t border-border/50 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white text-shadow">DilSe AI</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed text-shadow">
                From the heart, for your mind. A safe space for mental wellness.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-shadow">Crisis Resources</h4>
              <div className="space-y-2 text-sm text-white/80 text-shadow">
                <p>AASRA: 91-22-27546669</p>
                <p>Snehi: 91-22-27546669</p>
                <p>Vandrevala Foundation: 1860-2662-345</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-shadow">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-white/80 hover:text-white transition-colors text-shadow">
                  Help Center
                </Link>
                <Link href="#" className="block text-white/80 hover:text-white transition-colors text-shadow">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-white/80 hover:text-white transition-colors text-shadow">
                  Terms of Service
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-shadow">Connect</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-white/80 hover:text-white transition-colors text-shadow">
                  Community
                </Link>
                <Link href="#" className="block text-white/80 hover:text-white transition-colors text-shadow">
                  Blog
                </Link>
                <Link href="#" className="block text-white/80 hover:text-white transition-colors text-shadow">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-sm text-white/80 text-shadow">
              <strong>Disclaimer:</strong> This platform is not a substitute for professional therapy. If you're
              experiencing a mental health crisis, please contact emergency services or a mental health professional.
            </p>
            <p className="text-sm text-white/80 mt-4 text-shadow">© 2025 DilSe AI. Made with ❤️ for Indian youth.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
