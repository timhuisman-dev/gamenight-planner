"use client"

import type React from "react"
import type { GameNightFormData } from "@/lib/types"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createGameNight } from "@/lib/game-nights"
import { toast } from "sonner"

export default function CreateGameNight() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<GameNightFormData>({
    date: "",
    time: "",
    location: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError("You must be logged in to create a game night")
      return
    }

    if (!formData.date || !formData.time) {
      setError("Date and time are required")
      return
    }

    setIsSubmitting(true)

    try {
      const gameNightId = await createGameNight(formData, user)
      toast.success("Game night created successfully!")
      router.push(`/game-night/${gameNightId}`)
    } catch (err) {
      console.error("Error creating game night:", err)
      setError("Failed to create game night. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof GameNightFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError(null)
  }

  const isFormValid = formData.date && formData.time

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Game Night</h1>
          <p className="text-gray-600">Set up a new game night for your group</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Plus className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-gray-900">Game Night Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center space-x-2 text-base font-medium">
                  <CalendarDays className="h-4 w-4 text-indigo-600" />
                  <span>Date *</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={today}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* Time Field */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center space-x-2 text-base font-medium">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span>Time *</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2 text-base font-medium">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <span>Location</span>
                  <span className="text-sm text-gray-500 font-normal">(optional)</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter location name or address"
                  className="h-12 text-base"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting || !user}
                  className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Game Night...</span>
                    </div>
                  ) : (
                    "Create Game Night"
                  )}
                </Button>
              </div>

              {/* Form Help Text */}
              <div className="text-center text-sm text-gray-500 pt-2">
                <p>* Required fields</p>
                <p className="mt-1">You can add more details after creating the game night</p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-3">Quick Tips:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Choose a date at least a few days in advance to give people time to RSVP</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Evening times (7:00 PM - 9:00 PM) work best for most people</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>You can edit location and add more details after creating the event</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
