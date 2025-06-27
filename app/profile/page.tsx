"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Trophy, Calendar, Dice6, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getOrCreateUserProfile, setFavoriteGame } from "@/lib/users"
import { getGames, getUserOwnedGames, addGameOwner, removeGameOwner } from "@/lib/games"
import type { Game, UserProfile } from "@/lib/types"
import { toast } from "sonner"
import { signOutUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function UserProfile() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [allGames, setAllGames] = useState<Game[]>([])
  const [ownedGames, setOwnedGames] = useState<Game[]>([])
  const [favoriteGame, setFavoriteGame] = useState<Game | null>(null)

  // Fetch profile and games data
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const [userProfile, games, userOwnedGames] = await Promise.all([
          getOrCreateUserProfile(user),
          getGames(),
          getUserOwnedGames(user.uid),
        ])

        setProfile(userProfile)
        setAllGames(games)
        setOwnedGames(userOwnedGames)
        
        if (userProfile.favoriteGameId) {
          const favorite = games.find(g => g.id === userProfile.favoriteGameId)
          setFavoriteGame(favorite || null)
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  const handleFavoriteGameChange = async (gameId: string) => {
    if (!user) return

    try {
      // First make sure we own the game
      await addGameOwner(gameId, user.uid)
      // Then set it as favorite
      await setFavoriteGame(user.uid, gameId)
      const game = allGames.find(g => g.id === gameId)
      setFavoriteGame(game || null)
      toast.success('Favorite game updated')
    } catch (error) {
      console.error('Error updating favorite game:', error)
      toast.error('Failed to update favorite game')
    }
  }

  const handleRemoveGame = async (gameId: string) => {
    if (!user || !profile) return

    try {
      await removeGameOwner(gameId, user.uid)
      setOwnedGames(prev => prev.filter(game => game.id !== gameId))
      toast.success('Game removed from your collection')

      // If it was the favorite game, clear that too
      if (favoriteGame?.id === gameId) {
        await setFavoriteGame(user.uid, null)
        setFavoriteGame(null)
      }
    } catch (error) {
      console.error('Error removing game:', error)
      toast.error('Failed to remove game')
    }
  }

  const handleAddGame = async (gameId: string) => {
    if (!user || !profile) return

    try {
      await addGameOwner(gameId, user.uid)
      const game = allGames.find(g => g.id === gameId)
      if (game) {
        setOwnedGames(prev => [...prev, game])
        toast.success(`${game.name} added to your collection`)
      }
    } catch (error) {
      console.error('Error adding game:', error)
      toast.error('Failed to add game')
    }
  }

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const availableGames = allGames.filter(game => !ownedGames.find(owned => owned.id === game.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.photoURL || undefined} alt={profile.displayName || 'User'} />
                <AvatarFallback className="text-xl">
                  {profile.displayName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
                <Badge variant="secondary" className="mt-2">
                  Game Night Enthusiast
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Stats */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>My Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Favorite Game</label>
                <Select
                  value={favoriteGame?.id || ""}
                  onValueChange={handleFavoriteGameChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a favorite game" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownedGames.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Game Nights Attended</div>
                    <div className="text-2xl font-bold text-gray-900">{profile.gameNightsAttended}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Dice6 className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Games Owned</div>
                    <div className="text-2xl font-bold text-gray-900">{ownedGames.length}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Games I Own */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dice6 className="h-5 w-5 text-indigo-600" />
                <span>Games I Own</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Game Section */}
              <div className="flex space-x-2">
                <Select onValueChange={handleAddGame}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a game to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGames.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Owned Games List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {ownedGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{game.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveGame(game.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {ownedGames.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Dice6 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No games added yet</p>
                  <p className="text-sm">Add some games from the dropdown above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Logout Section */}
        <Card className="shadow-lg mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                <p className="text-gray-600">Manage your account preferences</p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
