import React, { useState } from "react"
import { useList, useCreate, useDelete } from "@refinedev/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const getRoleBadge = (_r: string) => {
    return "bg-muted text-foreground border border-border"
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
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
                          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-black text-foreground">
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
                          className="text-muted-foreground hover:text-foreground p-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiter">Waiter / Runner</SelectItem>
                  <SelectItem value="chef">Kitchen Chef</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="manager">Restaurant Manager</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
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
