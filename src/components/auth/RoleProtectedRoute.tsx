import React from "react"
import { usePermissions } from "@refinedev/core"
import { Navigate, Outlet } from "react-router-dom"

interface RoleProtectedRouteProps {
  allowedRoles: string[]
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { data: role, isLoading } = usePermissions<string>({})

  if (isLoading || role === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary border-r-2"></div>
          <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">Loading Permissions...</span>
        </div>
      </div>
    )
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
