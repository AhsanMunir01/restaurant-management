import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex h-[70svh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6 ring-4 ring-destructive/20 animate-pulse">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2 sm:text-4xl">
        Access Denied
      </h1>
      <p className="text-slate-400 max-w-md mb-8">
        You do not have the required permissions to view this page. Please contact your administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90 text-white">
          Back to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)} className="border-slate-800 text-slate-300">
          Go Back
        </Button>
      </div>
    </div>
  )
}
