import React from "react"
import { useGetIdentity, useLogout, usePermissions } from "@refinedev/core"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Grid3X3,
  BookOpen,
  ShoppingBag,
  Boxes,
  CreditCard,
  Users,
  ChefHat,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react"
import type { User } from "@/providers/authProvider"
import { useTheme } from "@/components/theme/ThemeProvider"

interface LayoutProps {
  children: React.ReactNode
}

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

export const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
  const { data: user } = useGetIdentity<User>()
  const { data: role } = usePermissions<string>({})
  const { mutate: logout } = useLogout()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["admin", "manager"],
    },
    {
      label: "Tables Layout",
      href: "/tables",
      icon: <Grid3X3 className="h-5 w-5" />,
      roles: ["admin", "manager", "waiter"],
    },
    {
      label: "Menu Items",
      href: "/menu",
      icon: <BookOpen className="h-5 w-5" />,
      roles: ["admin", "manager", "waiter"],
    },
    {
      label: "Orders List",
      href: "/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      roles: ["admin", "manager", "waiter", "cashier"],
    },
    {
      label: "Kitchen Queue",
      href: "/kitchen",
      icon: <ChefHat className="h-5 w-5" />,
      roles: ["admin", "chef", "waiter"],
    },
    {
      label: "Payments",
      href: "/payments",
      icon: <CreditCard className="h-5 w-5" />,
      roles: ["admin", "manager", "cashier"],
    },
    {
      label: "Inventory",
      href: "/inventory",
      icon: <Boxes className="h-5 w-5" />,
      roles: ["admin", "manager"],
    },
    {
      label: "Staff Management",
      href: "/staff",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
    },
  ]

  const activeItems = sidebarItems.filter(item => {
    if (!role) return false
    return item.roles.includes(role)
  })

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card/95 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <ChefHat className="h-6 w-6 text-foreground" />
            <span className="tracking-wider">AETHERA BISTRO</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {activeItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.fullName || "User Name"}
              </p>
              <p className="text-xs text-foreground font-medium uppercase tracking-wider">
                {role || "Role"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-muted-foreground bg-transparent h-9 text-xs"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-55 flex w-64 flex-col bg-card/95 border-r border-border transition-transform duration-300 ease-in-out md:hidden backdrop-blur-md",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <ChefHat className="h-6 w-6 text-foreground" />
            <span>AETHERA</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {activeItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.fullName || "User Name"}
              </p>
              <p className="text-xs text-foreground font-medium uppercase tracking-wider">
                {role || "Role"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-muted-foreground bg-transparent h-9 text-xs"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-sm font-bold text-foreground tracking-widest uppercase">
              {sidebarItems.find(item => item.href === location.pathname)?.label || "Bistro App"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Switch */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground rounded-full bg-background border-border h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Welcome,</span>
              <span className="text-sm font-bold text-foreground">{user?.fullName}</span>
            </div>
            <Badge className="bg-muted text-foreground border-border uppercase tracking-widest text-[9px] font-bold">
              {role}
            </Badge>
          </div>
        </header>

        {/* Inner Route Contents */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
