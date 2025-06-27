"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, Calendar, Check, X, AlertTriangle } from "lucide-react"

// Mock data
const mockFlaggedItems = [
  {
    id: 1,
    type: "game",
    content: "Inappropriate Game Name",
    reporter: "User123",
    date: "2024-01-15",
  },
  {
    id: 2,
    type: "comment",
    content: "Offensive comment about game rules",
    reporter: "GameMaster",
    date: "2024-01-14",
  },
  {
    id: 3,
    type: "game",
    content: "Duplicate game entry",
    reporter: "ModeratorBot",
    date: "2024-01-13",
  },
]

export default function AdminPanel() {
  const [recurrenceRule, setRecurrenceRule] = useState("first-wednesday")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [reminderDays, setReminderDays] = useState("3")
  const [reminderType, setReminderType] = useState("rsvp")
  const [flaggedItems, setFlaggedItems] = useState(mockFlaggedItems)

  const handleSaveRecurrence = () => {
    // Save recurrence rule logic
    console.log("Saving recurrence rule:", recurrenceRule)
  }

  const handleSaveNotifications = () => {
    // Save notification settings logic
    console.log("Saving notifications:", { notificationsEnabled, reminderDays, reminderType })
  }

  const handleApprove = (itemId: number) => {
    setFlaggedItems(flaggedItems.filter((item) => item.id !== itemId))
  }

  const handleDelete = (itemId: number) => {
    setFlaggedItems(flaggedItems.filter((item) => item.id !== itemId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
          <p className="text-gray-600">Manage your game night organization settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Recurrence */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span>Event Recurrence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Rule</Label>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">First Wednesday of the month</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrence">Change Recurrence Rule</Label>
                <Select value={recurrenceRule} onValueChange={setRecurrenceRule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-wednesday">First Wednesday of the month</SelectItem>
                    <SelectItem value="second-friday">Second Friday of the month</SelectItem>
                    <SelectItem value="last-saturday">Last Saturday of the month</SelectItem>
                    <SelectItem value="every-two-weeks">Every two weeks</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveRecurrence} className="w-full">
                Save Recurrence Rule
              </Button>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-green-600" />
                <span>Push Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <div className="text-sm text-gray-600">Send reminders to participants</div>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              {notificationsEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reminderDays">Days Before Event</Label>
                    <Input
                      id="reminderDays"
                      type="number"
                      min="1"
                      max="14"
                      value={reminderDays}
                      onChange={(e) => setReminderDays(e.target.value)}
                      placeholder="Number of days"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderType">Reminder Type</Label>
                    <Select value={reminderType} onValueChange={setReminderType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsvp">RSVP Reminder</SelectItem>
                        <SelectItem value="game-voting">Game Voting Reminder</SelectItem>
                        <SelectItem value="both">Both RSVP and Game Voting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button onClick={handleSaveNotifications} className="w-full">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Section */}
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Moderation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flaggedItems.length > 0 ? (
              <div className="space-y-4">
                {flaggedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={item.type === "game" ? "default" : "secondary"}>{item.type}</Badge>
                          <span className="text-sm text-gray-500">
                            Reported by {item.reporter} on {item.date}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">{item.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged items</h3>
                <p className="text-gray-600">All content is currently approved</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
