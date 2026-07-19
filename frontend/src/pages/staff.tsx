import React, { useState } from "react"
import { useList, useCreate, useDelete } from "@refinedev/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Users, Plus, Trash2, ShieldAlert, RefreshCw } from "lucide-react"

interface StaffUser {
  id: number
  username: string
  email: string
  role: string
  fullName: string
}

export const StaffPage: React.FC = () => {
  const { data: staffData, isLoading, refetch } = useList<StaffUser>({
    resource: "staff",
  })

  const { mutate: createStaff } = useCreate()
  const { mutate: deleteStaff } = useDelete()

  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("waiter")

  const staff = staffData?.data || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !fullName) return

    createStaff({
      resource: "staff",
      values: {
        username,
        email,
        fullName,
        role,
        passwordHash: "" // Backend sets default password123 automatically
      },
      successNotification: () => ({
        message: `Account created for ${fullName}`,
        type: "success"
      })
    }, {
      onSuccess: () => {
        setIsOpen(false)
        setUsername("")
        setEmail("")
        setFullName("")
        setRole("waiter")
        refetch()
      }
    })
  }

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    deleteStaff({
      resource: "staff",
      id,
      successNotification: () => ({
        message: "Staff member deleted successfully",
        type: "success"
      })
    }, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const getRoleBadge = (r: string) => {
    switch (r) {
      case "admin":
        return "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
      case "manager":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
      case "chef":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
      case "waiter":
        return "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20"
      case "cashier":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
      default:
        return "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Staff & User Directory</h2>
            <p className="text-muted-foreground text-sm">Configure system credentials, set security roles, and monitor active profiles.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-sm text-foreground hover:bg-muted transition-all font-medium cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/10">
          No staff records.
        </div>
      ) : (
        <Card className="border-border bg-card text-foreground">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/85 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role Badge</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {staff.map(member => (
                    <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-900 border border-border flex items-center justify-center text-xs font-black text-primary">
                            {member.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span>{member.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">@{member.username}</td>
                      <td className="p-4 text-muted-foreground">{member.email}</td>
                      <td className="p-4">
                        <Badge className={`capitalize text-[9px] tracking-wider px-2.5 py-0.5 font-bold ${getRoleBadge(member.role)}`}>
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(member.id, member.fullName)}
                          disabled={member.role === "admin" && staff.filter(s => s.role === "admin").length <= 1}
                          className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={member.role === "admin" ? "Cannot delete the sole admin account" : "Delete Account"}
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add User Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <span>Add Staff Profile</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              This creates a profile with password default credentials: <code className="bg-muted px-1 py-0.5 rounded text-primary">password123</code>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-background border border-input rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe"
                className="w-full bg-background border border-input rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@rms.com"
                className="w-full bg-background border border-input rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Security Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-background border border-input rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="waiter">Waiter / Runner</option>
                <option value="chef">Kitchen Chef</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Restaurant Manager</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <DialogFooter className="border-t border-border/60 pt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-all font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-primary/95 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
