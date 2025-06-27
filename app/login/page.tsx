"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dice6 } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const handleGoogleLogin = () => {
    // Google login logic would go here
    console.log("Google login initiated")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Dice6 className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Game Night Organizer</CardTitle>
            <CardDescription className="text-lg text-gray-600">Plan, vote, and play together.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
            asChild
          >
            <Link href="/">
              <div className="flex items-center justify-center space-x-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </div>
            </Link>
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Floating Game Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 opacity-10">
          <Dice6 className="h-8 w-8 text-indigo-600 animate-bounce" style={{ animationDelay: "0s" }} />
        </div>
        <div className="absolute top-32 right-32 opacity-10">
          <Dice6 className="h-6 w-6 text-purple-600 animate-bounce" style={{ animationDelay: "1s" }} />
        </div>
        <div className="absolute bottom-32 left-32 opacity-10">
          <Dice6 className="h-10 w-10 text-blue-600 animate-bounce" style={{ animationDelay: "2s" }} />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <Dice6 className="h-7 w-7 text-indigo-600 animate-bounce" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>
    </div>
  )
}
