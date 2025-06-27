"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dice6, Home, LogOut, Menu, Settings, User, Library } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { signInWithGoogle, signOutUser } from "@/lib/firebase"

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Catalog", href: "/catalog", icon: Library },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

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
    return <nav className="bg-white shadow-sm border-b h-16" />
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Dice6 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">GameNight</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 transition-colors ${
                  isActive(item.href) ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            {user?.email?.endsWith('@admin.com') && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1 transition-colors ${
                  isActive("/admin") ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                  <AvatarFallback>
                    {user.displayName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin}>
                Login with Google
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 ${
                      isActive(item.href) ? "text-indigo-600 font-medium" : "text-gray-600"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                {user?.email?.endsWith('@admin.com') && (
                  <Link
                    href="/admin"
                    className={`flex items-center space-x-2 ${
                      isActive("/admin") ? "text-indigo-600 font-medium" : "text-gray-600"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                {user ? (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                        <AvatarFallback>
                          {user.displayName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleLogin}>
                    Login with Google
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
