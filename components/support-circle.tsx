"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageCircle, Phone, Mail, Heart, Shield, Clock, MapPin } from "lucide-react"

const supportResources = [
  {
    id: "crisis",
    title: "Crisis Support",
    description: "24/7 immediate help when you need it most",
    contacts: [
      {
        name: "National Crisis Helpline",
        number: "9152987821",
        available: "24/7",
        type: "crisis"
      },
      {
        name: "NIMHANS Emergency",
        number: "080-26995000",
        available: "24/7",
        type: "crisis"
      },
      {
        name: "iCall Helpline",
        number: "9152987821",
        available: "Mon-Sat 8AM-10PM",
        type: "crisis"
      }
    ]
  },
  {
    id: "professional",
    title: "Professional Support",
    description: "Connect with mental health professionals",
    contacts: [
      {
        name: "Dr. Priya Sharma",
        specialization: "Anxiety & Depression",
        contact: "priya.sharma@therapy.com",
        available: "Mon-Fri 9AM-6PM",
        type: "therapist"
      },
      {
        name: "Dr. Rajesh Kumar",
        specialization: "Trauma & PTSD",
        contact: "rajesh.kumar@wellness.com",
        available: "Tue-Sat 10AM-7PM",
        type: "therapist"
      },
      {
        name: "Dr. Ananya Singh",
        specialization: "Youth Mental Health",
        contact: "ananya.singh@youthcare.com",
        available: "Mon-Thu 2PM-8PM",
        type: "therapist"
      }
    ]
  },
  {
    id: "peer",
    title: "Peer Support",
    description: "Connect with others who understand your journey",
    contacts: [
      {
        name: "Student Support Group",
        description: "Weekly meetings for college students",
        contact: "students@dilseai.com",
        available: "Sundays 4PM-6PM",
        type: "group"
      },
      {
        name: "Anxiety Support Circle",
        description: "Safe space to share experiences",
        contact: "anxiety.support@dilseai.com",
        available: "Wednesdays 7PM-8PM",
        type: "group"
      },
      {
        name: "Mindfulness Community",
        description: "Meditation and mindfulness practice",
        contact: "mindfulness@dilseai.com",
        available: "Daily 6AM-7AM",
        type: "group"
      }
    ]
  },
  {
    id: "online",
    title: "Online Resources",
    description: "Digital tools and communities",
    contacts: [
      {
        name: "DilSe AI Community Forum",
        description: "Anonymous discussion board",
        contact: "community.dilseai.com",
        available: "24/7",
        type: "online"
      },
      {
        name: "Mental Health India",
        description: "Comprehensive resource directory",
        contact: "mentalhealthindia.org",
        available: "24/7",
        type: "online"
      },
      {
        name: "Headspace India",
        description: "Meditation and mindfulness app",
        contact: "headspace.com/in",
        available: "24/7",
        type: "online"
      }
    ]
  }
]

const selfCareTips = [
  "Practice deep breathing for 5 minutes when feeling overwhelmed",
  "Write down three things you're grateful for each day",
  "Take a 10-minute walk outside to clear your mind",
  "Listen to calming music or nature sounds",
  "Practice progressive muscle relaxation before bed",
  "Connect with a friend or family member you trust",
  "Engage in a creative activity like drawing or writing",
  "Limit social media and news consumption if it's causing stress"
]

export default function SupportCircle() {
  const [selectedCategory, setSelectedCategory] = useState<string>("crisis")
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    urgency: "low"
  })

  const selectedResource = supportResources.find(resource => resource.id === selectedCategory)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form to a backend
    console.log("Contact form submitted:", contactForm)
    alert("Your message has been sent. Someone from our support team will get back to you within 24 hours.")
    setContactForm({ name: "", email: "", message: "", urgency: "low" })
    setShowContactForm(false)
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case "crisis":
        return <Phone className="h-4 w-4 text-red-500" />
      case "therapist":
        return <Heart className="h-4 w-4 text-blue-500" />
      case "group":
        return <Users className="h-4 w-4 text-green-500" />
      case "online":
        return <MessageCircle className="h-4 w-4 text-purple-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Your Support Circle</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You're never alone in your mental health journey. Here are resources and people ready to support you whenever you need them.
          </p>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Support Type</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the type of support that feels right for you right now.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedCategory(resource.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  selectedCategory === resource.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-background hover:bg-primary/5"
                }`}
              >
                <div className="space-y-2">
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Resource Details */}
      {selectedResource && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getContactIcon(selectedResource.id)}
              {selectedResource.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{selectedResource.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {selectedResource.contacts.map((contact, index) => (
                <div
                  key={index}
                  className="p-4 bg-background rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-medium">{contact.name}</h4>
                      {'specialization' in contact && contact.specialization && (
                        <p className="text-sm text-muted-foreground">{contact.specialization}</p>
                      )}
                      {'description' in contact && contact.description && (
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {contact.available}
                        </div>
                        {'number' in contact && contact.number && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.number}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {'number' in contact && contact.number && (
                        <Button size="sm" className="gap-2">
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                      )}
                      {'contact' in contact && contact.contact && (
                        <Button size="sm" variant="outline" className="gap-2">
                          <Mail className="h-3 w-3" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button
                onClick={() => setShowContactForm(true)}
                className="w-full gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Request Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request Support</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fill out this form and our support team will get back to you.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Urgency Level</label>
                  <select
                    value={contactForm.urgency}
                    onChange={(e) => setContactForm(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="low">Low - I can wait a few days</option>
                    <option value="medium">Medium - I'd like to hear back soon</option>
                    <option value="high">High - I need support today</option>
                    <option value="crisis">Crisis - I need immediate help</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Send Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
