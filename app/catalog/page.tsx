"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Users, Plus, Heart, HeartOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createGame, getGames, getUserOwnedGames, addGameOwner, removeGameOwner } from "@/lib/games"
import type { Game } from "@/lib/types"
import { toast } from "sonner"

export default function GameCatalog() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [games, setGames] = useState<Game[]>([])
  const [ownedGameIds, setOwnedGameIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)
  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
    minPlayers: 1,
    maxPlayers: 4,
  })

  // Fetch games and owned games on mount
  useEffect(() => {
    async function fetchGames() {
      try {
        const [allGames, userOwnedGames] = await Promise.all([
          getGames(),
          user ? getUserOwnedGames(user.uid) : Promise.resolve([]),
        ])
        setGames(allGames)
        setOwnedGameIds(userOwnedGames.map(game => game.id))
      } catch (error) {
        console.error('Error fetching games:', error)
        toast.error('Failed to load games')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
  }, [user])

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchTerm.includes("player") &&
        searchTerm.match(/\d+/) &&
        Number.parseInt(searchTerm.match(/\d+/)![0]) >= game.minPlayers &&
        Number.parseInt(searchTerm.match(/\d+/)![0]) <= game.maxPlayers),
  )

  const toggleGameOwnership = async (game: Game) => {
    if (!user) {
      toast.error('You must be logged in to manage your games')
      return
    }

    try {
      if (ownedGameIds.includes(game.id)) {
        await removeGameOwner(game.id, user.uid)
        setOwnedGameIds(prev => prev.filter(id => id !== game.id))
        toast.success(`Removed ${game.name} from your games`)
      } else {
        await addGameOwner(game.id, user.uid)
        setOwnedGameIds(prev => [...prev, game.id])
        toast.success(`Added ${game.name} to your games`)
      }
    } catch (error) {
      console.error('Error toggling game ownership:', error)
      toast.error('Failed to update game ownership')
    }
  }

  const handleAddGame = async () => {
    if (!user) {
      toast.error('You must be logged in to add games')
      return
    }

    if (!newGame.name || !newGame.description) {
      toast.error('Please fill in all required fields')
      return
    }

    if (newGame.minPlayers > newGame.maxPlayers) {
      toast.error('Minimum players cannot be greater than maximum players')
      return
    }

    try {
      const gameId = await createGame(newGame, user)
      const createdGame: Game = {
        id: gameId,
        ...newGame,
        createdAt: new Date() as any, // Timestamp will be handled by Firebase
        createdBy: {
          uid: user.uid,
          displayName: user.displayName,
        },
        ownedBy: [user.uid],
      }
      
      setGames(prev => [...prev, createdGame])
      setOwnedGameIds(prev => [...prev, gameId])
      setNewGame({ name: "", description: "", minPlayers: 1, maxPlayers: 4 })
      setIsAddGameOpen(false)
      toast.success('Game added successfully')
    } catch (error) {
      console.error('Error adding game:', error)
      toast.error('Failed to add game')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Catalog</h1>
          <p className="text-gray-600">Discover and manage your board game collection</p>
        </div>

        {/* Search and Add Game */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search games by name or number of players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={!user}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Game
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Game Name *</Label>
                  <Input
                    id="name"
                    value={newGame.name}
                    onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                    placeholder="Enter game name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newGame.description}
                    onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                    placeholder="Enter game description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPlayers">Min Players *</Label>
                    <Input
                      id="minPlayers"
                      type="number"
                      min="1"
                      value={newGame.minPlayers}
                      onChange={(e) => setNewGame({ ...newGame, minPlayers: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Max Players *</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      min="1"
                      value={newGame.maxPlayers}
                      onChange={(e) => setNewGame({ ...newGame, maxPlayers: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddGame} className="w-full">
                  Add Game
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              {game.imageUrl && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{game.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {game.minPlayers === game.maxPlayers
                          ? `${game.minPlayers} players`
                          : `${game.minPlayers}-${game.maxPlayers} players`}
                      </span>
                    </div>
                  </div>
                  {ownedGameIds.includes(game.id) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Owned
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 line-clamp-3">{game.description}</CardDescription>
                <Button
                  variant={ownedGameIds.includes(game.id) ? "outline" : "default"}
                  className="w-full"
                  onClick={() => toggleGameOwnership(game)}
                  disabled={!user}
                >
                  {ownedGameIds.includes(game.id) ? (
                    <>
                      <HeartOff className="h-4 w-4 mr-2" />
                      Remove from My Games
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Add to My Games
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No games found</div>
            <div className="text-gray-400">Try adjusting your search terms</div>
          </div>
        )}
      </div>
    </div>
  )
}
