"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Check, Edit, ExternalLink, MapPin, Plus, ThumbsUp, Users, X, Clock, Star } from "lucide-react"

// Mock data
const mockGameNight = {
  id: "1",
  date: "Wednesday, 5 June",
  time: "19:30",
  location: {
    name: "Alex's Place",
    address: "123 Game Street, Board City",
    maxCapacity: 8,
  },
  attendees: [
    { id: 1, name: "Alex Chen", avatar: "/placeholder.svg?height=40&width=40", initials: "AC", isGoing: true },
    { id: 2, name: "Sarah Kim", avatar: "/placeholder.svg?height=40&width=40", initials: "SK", isGoing: true },
    { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40", initials: "MJ", isGoing: true },
    { id: 4, name: "Emma Davis", avatar: "/placeholder.svg?height=40&width=40", initials: "ED", isGoing: true },
    { id: 5, name: "Tom Wilson", avatar: "/placeholder.svg?height=40&width=40", initials: "TW", isGoing: false },
  ],
  suggestedGames: [
    {
      id: 1,
      name: "Wingspan",
      votes: 8,
      owners: [{ name: "Sarah Kim", initials: "SK", avatar: "/placeholder.svg?height=32&width=32" }],
      hasVoted: false,
    },
    {
      id: 2,
      name: "Azul",
      votes: 6,
      owners: [{ name: "Alex Chen", initials: "AC", avatar: "/placeholder.svg?height=32&width=32" }],
      hasVoted: true,
    },
    {
      id: 3,
      name: "Ticket to Ride",
      votes: 4,
      owners: [{ name: "Mike Johnson", initials: "MJ", avatar: "/placeholder.svg?height=32&width=32" }],
      hasVoted: false,
    },
    {
      id: 4,
      name: "Splendor",
      votes: 3,
      owners: [{ name: "Emma Davis", initials: "ED", avatar: "/placeholder.svg?height=32&width=32" }],
      hasVoted: true,
    },
  ],
  selectedGames: [
    { name: "Wingspan", reason: "Most voted" },
    { name: "Azul", reason: "Quick backup game" },
  ],
  notes: "Please bring drinks! We'll start with Wingspan at 19:45 sharp. Sarah will bring snacks.",
}

const availableGames = [
  "7 Wonders",
  "Pandemic",
  "King of Tokyo",
  "Dominion",
  "Scythe",
  "Terraforming Mars",
  "Catan",
  "Splendor",
]

export default function GameNightDetail() {
  const [userRSVP, setUserRSVP] = useState<"going" | "not-going" | null>("going")
  const [notes, setNotes] = useState(mockGameNight.notes)
  const [suggestedGames, setSuggestedGames] = useState(mockGameNight.suggestedGames)
  const [userVotes, setUserVotes] = useState<number[]>([2, 4]) // IDs of games user has voted for
  const [isSuggestGameOpen, setIsSuggestGameOpen] = useState(false)
  const [selectedGameToSuggest, setSelectedGameToSuggest] = useState("")
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false)

  const goingAttendees = mockGameNight.attendees.filter((attendee) => attendee.isGoing)
  const notGoingAttendees = mockGameNight.attendees.filter((attendee) => !attendee.isGoing)

  const handleVote = (gameId: number) => {
    if (userVotes.includes(gameId)) {
      // Remove vote
      setUserVotes(userVotes.filter((id) => id !== gameId))
      setSuggestedGames(
        suggestedGames.map((game) => (game.id === gameId ? { ...game, votes: game.votes - 1, hasVoted: false } : game)),
      )
    } else if (userVotes.length < 3) {
      // Add vote (max 3)
      setUserVotes([...userVotes, gameId])
      setSuggestedGames(
        suggestedGames.map((game) => (game.id === gameId ? { ...game, votes: game.votes + 1, hasVoted: true } : game)),
      )
    }
  }

  const handleSuggestGame = () => {
    if (selectedGameToSuggest) {
      const newGame = {
        id: Math.max(...suggestedGames.map((g) => g.id)) + 1,
        name: selectedGameToSuggest,
        votes: 1,
        owners: [{ name: "You", initials: "YU", avatar: "/placeholder.svg?height=32&width=32" }],
        hasVoted: true,
      }
      setSuggestedGames([...suggestedGames, newGame])
      setUserVotes([...userVotes, newGame.id])
      setSelectedGameToSuggest("")
      setIsSuggestGameOpen(false)
    }
  }

  const handleAddToCalendar = () => {
    const startDate = new Date("2024-06-05T19:30:00")
    const endDate = new Date("2024-06-05T23:00:00")
    const title = encodeURIComponent("Game Night")
    const details = encodeURIComponent(
      `Location: ${mockGameNight.location.name}\n\nGames: ${mockGameNight.selectedGames.map((g) => g.name).join(", ")}\n\nNotes: ${notes}`,
    )
    const location = encodeURIComponent(mockGameNight.location.address)

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${details}&location=${location}`

    window.open(googleCalendarUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mockGameNight.date} – {mockGameNight.time}
          </h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Game Night Details</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <span>Location</span>
                  </CardTitle>
                  <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Location</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Location Name</Label>
                          <Input defaultValue={mockGameNight.location.name} />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input defaultValue={mockGameNight.location.address} />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Capacity</Label>
                          <Input type="number" defaultValue={mockGameNight.location.maxCapacity} />
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">{mockGameNight.location.name}</div>
                  <div className="text-gray-600">{mockGameNight.location.address}</div>
                  <div className="text-sm text-gray-500">Max capacity: {mockGameNight.location.maxCapacity} people</div>
                </div>
              </CardContent>
            </Card>

            {/* Game Suggestions */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Suggested Games</span>
                  </CardTitle>
                  <Dialog open={isSuggestGameOpen} onOpenChange={setIsSuggestGameOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Suggest a Game
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Suggest a Game</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Select Game</Label>
                          <Select value={selectedGameToSuggest} onValueChange={setSelectedGameToSuggest}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a game to suggest" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableGames
                                .filter((game) => !suggestedGames.find((sg) => sg.name === game))
                                .map((game) => (
                                  <SelectItem key={game} value={game}>
                                    {game}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleSuggestGame} className="w-full" disabled={!selectedGameToSuggest}>
                          Suggest Game
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4">
                    You can vote for up to 3 games ({3 - userVotes.length} votes remaining)
                  </div>
                  {suggestedGames
                    .sort((a, b) => b.votes - a.votes)
                    .map((game) => (
                      <div
                        key={game.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{game.votes}</div>
                            <div className="text-xs text-gray-500">votes</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{game.name}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500">Owned by:</span>
                              {game.owners.map((owner, index) => (
                                <Avatar key={index} className="h-6 w-6">
                                  <AvatarImage src={owner.avatar || "/placeholder.svg"} alt={owner.name} />
                                  <AvatarFallback className="text-xs">{owner.initials}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={userVotes.includes(game.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(game.id)}
                          disabled={!userVotes.includes(game.id) && userVotes.length >= 3}
                          className={userVotes.includes(game.id) ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {userVotes.includes(game.id) ? "Voted" : "Vote"}
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Games */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Selected Games</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockGameNight.selectedGames.map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{game.name}</div>
                        <div className="text-sm text-green-700">{game.reason}</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Selected
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this game night..."
                  rows={4}
                  className="resize-none"
                />
                <Button className="mt-3" size="sm">
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>RSVP</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    Not Going
                  </Button>
                </div>

                {/* Going Attendees */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Going ({goingAttendees.length})</div>
                  <div className="space-y-2">
                    {goingAttendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                          <AvatarFallback className="text-xs">{attendee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">{attendee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Not Going Attendees */}
                {notGoingAttendees.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Can't Make It ({notGoingAttendees.length})</div>
                    <div className="space-y-2">
                      {notGoingAttendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center space-x-3 opacity-60">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                            <AvatarFallback className="text-xs">{attendee.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{attendee.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar Integration */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAddToCalendar} className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Add to Google Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
