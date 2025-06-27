"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Dice6,
  ExternalLink,
  MapPin,
  ThumbsUp,
  Users,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { signInWithGoogle, signOutUser } from "@/lib/firebase"

// Mock data
const mockNextGameNight = {
  date: "Saturday, Dec 14",
  time: "7:00 PM",
  location: "Alex's Place",
  attendees: [
    { name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "AC" },
    { name: "Sarah Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "SK" },
    { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
    { name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "ED" },
    { name: "Tom Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "TW" },
  ],
  suggestedGames: [
    { name: "Wingspan", votes: 8, owner: "SK" },
    { name: "Azul", votes: 6, owner: "AC" },
    { name: "Ticket to Ride", votes: 4, owner: "MJ" },
  ],
  userRSVP: null,
}

const mockCalendarEvents: Record<string, { count: number; title: string }> = {
  "2024-12-14": { count: 5, title: "Game Night at Alex's" },
  "2024-12-21": { count: 3, title: "Holiday Game Night" },
  "2024-12-28": { count: 7, title: "New Year Prep Games" },
  "2025-01-04": { count: 4, title: "New Year Game Night" },
  "2025-01-11": { count: 6, title: "Winter Game Night" },
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [userRSVP, setUserRSVP] = useState<"going" | "not-going" | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11)) // December 2024
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Test login/logout functions
  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  // Show loading state
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Next Game Night */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <CalendarDays className="h-5 w-5 text-indigo-600" />
                    <span>Next Game Night</span>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <div className="h-4 w-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-medium">
                      i
                    </div>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date & Time */}
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">{mockNextGameNight.date}</div>
                  <div className="text-sm text-gray-600">{mockNextGameNight.time}</div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{mockNextGameNight.location}</span>
                  </div>
                </div>

                {/* RSVP Buttons */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Will you be there?</div>
                  <div className="flex space-x-2">
                    <Button
                      variant={userRSVP === "going" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserRSVP("going")}
                      className={`flex-1 ${
                        userRSVP === "going"
                          ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                          : "hover:bg-green-50 hover:border-green-300"
                      }`}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Going
                    </Button>
                    <Button
                      variant={userRSVP === "not-going" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserRSVP("not-going")}
                      className={`flex-1 ${
                        userRSVP === "not-going"
                          ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                          : "hover:bg-red-50 hover:border-red-300"
                      }`}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Can't Make It
                    </Button>
                  </div>
                </div>

                {/* Attendees */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {mockNextGameNight.attendees.length} people going
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {mockNextGameNight.attendees.map((attendee, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                        <AvatarFallback className="text-xs">{attendee.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                {/* Suggested Games */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Dice6 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Top Game Suggestions</span>
                  </div>
                  <div className="space-y-2">
                    {mockNextGameNight.suggestedGames.map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{game.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-gray-600">{game.votes}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {game.owner}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      + Add Event
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="p-2 h-20"></div>
                    }

                    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const event = mockCalendarEvents[dateKey]
                    const isToday =
                      new Date().toDateString() ===
                      new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                    return (
                      <div
                        key={index}
                        className={`p-2 h-20 border rounded-lg cursor-pointer transition-all duration-200 relative ${
                          event
                            ? "bg-purple-600 border-purple-700 text-white hover:bg-purple-700"
                            : isToday
                              ? "bg-blue-100 border-blue-400 border hover:bg-blue-200"
                              : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        onMouseEnter={() => event && setHoveredDate(dateKey)}
                        onMouseLeave={() => setHoveredDate(null)}
                      >
                        <div
                          className={`text-sm font-medium ${
                            event ? "text-white" : isToday ? "text-blue-600 font-bold" : "text-gray-900"
                          }`}
                        >
                          {day}
                        </div>
                        {event && (
                          <div className="mt-1 flex items-center space-x-1">
                            <Users className="h-3 w-3 text-white" />
                            <span className="text-xs text-white font-medium">{event.count}</span>
                          </div>
                        )}

                        {/* Hover tooltip */}
                        {hoveredDate === dateKey && event && (
                          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-gray-300">{event.count} people going</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
