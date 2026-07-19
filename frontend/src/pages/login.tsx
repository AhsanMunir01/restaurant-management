import React, { useState } from "react"
import { useLogin } from "@refinedev/core"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Lock, Mail, Terminal, UtensilsCrossed } from "lucide-react"

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { mutate: login } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    login(
      { email, password },
      {
        onError: (err) => {
          setErrorMsg(err.message || "Invalid credentials. Please try again.")
          setLoading(false)
        },
        onSuccess: () => {
          setLoading(false)
        },
      }
    )
  }

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail)
    setPassword(rolePass)
    setLoading(true)
    setErrorMsg(null)

    login(
      { email: roleEmail, password: rolePass },
      {
        onError: (err) => {
          setErrorMsg(err.message || "Invalid credentials.")
          setLoading(false)
        },
        onSuccess: () => {
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 to-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary mb-4 ring-2 ring-primary/30">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            AETHERA
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Bistro & Restaurant Management System
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl text-slate-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Sign in</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your credential to access the workspace
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 flex items-center gap-2">
                  <Terminal className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    type="email"
                    required
                    placeholder="name@restaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-950/50 border-slate-800 focus-visible:ring-primary text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-950/50 border-slate-800 focus-visible:ring-primary text-slate-100"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Fast Login Selector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 justify-center">
            <ChefHat className="h-3.5 w-3.5" />
            Developer Testing / Quick Login
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("admin@rms.com", "admin123")}
              className="border-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-300"
            >
              Admin <Badge variant="secondary" className="ml-1 px-1 py-0 text-[9px] bg-slate-800 text-slate-300 border-0">A</Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("manager@rms.com", "manager123")}
              className="border-slate-800 hover:bg-sky-500/10 hover:text-sky-400 transition-all text-slate-300"
            >
              Manager <Badge variant="secondary" className="ml-1 px-1 py-0 text-[9px] bg-slate-800 text-slate-300 border-0">M</Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("chef@rms.com", "chef123")}
              className="border-slate-800 hover:bg-amber-500/10 hover:text-amber-400 transition-all text-slate-300"
            >
              Chef <Badge variant="secondary" className="ml-1 px-1 py-0 text-[9px] bg-slate-800 text-slate-300 border-0">C</Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("waiter@rms.com", "waiter123")}
              className="border-slate-800 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all text-slate-300 col-span-1 sm:col-span-1"
            >
              Waiter <Badge variant="secondary" className="ml-1 px-1 py-0 text-[9px] bg-slate-800 text-slate-300 border-0">W</Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("cashier@rms.com", "cashier123")}
              className="border-slate-800 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-slate-300 col-span-2 sm:col-span-2"
            >
              Cashier <Badge variant="secondary" className="ml-1 px-1 py-0 text-[9px] bg-slate-800 text-slate-300 border-0">Cash</Badge>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
