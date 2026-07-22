import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ChefHat, CreditCard, Boxes, Users, Info } from "lucide-react"

// Layout of page info helper
const PageSkeleton: React.FC<{
  title: string
  description: string
  roles: string[]
  icon: React.ReactNode
}> = ({ title, description, roles, icon }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </div>

      <Card className="border-dashed border-border bg-muted/10">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted text-foreground flex items-center justify-center mb-4 border border-border">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Module Ready for Implementation</h3>
          <p className="text-muted-foreground max-w-md text-sm mb-6">
            This module has been fully planned. The frontend skeleton and routing permissions are in place. You can select this module to begin the actual database and API integration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mr-2">Authorized Roles:</span>
            {roles.map((role) => (
              <Badge key={role} className="bg-muted border border-border text-foreground uppercase tracking-widest text-[9px] py-1 px-2.5">
                {role}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



export const OrdersPage: React.FC = () => (
  <PageSkeleton
    title="Order Logs"
    description="Track all historical orders, active bills, split-check requests, and table assignments."
    roles={["admin", "manager", "waiter", "cashier"]}
    icon={<ShoppingBag className="h-5 w-5" />}
  />
)

export const KitchenPage: React.FC = () => (
  <PageSkeleton
    title="Kitchen Queue"
    description="Chef display queue showing pending orders, time elapsed, and item preparation details."
    roles={["admin", "chef", "waiter"]}
    icon={<ChefHat className="h-5 w-5" />}
  />
)

export const PaymentsPage: React.FC = () => (
  <PageSkeleton
    title="Payments & Billing Checkout"
    description="Settle pending bills, handle credit/cash splits, and view revenue summaries."
    roles={["admin", "manager", "cashier"]}
    icon={<CreditCard className="h-5 w-5" />}
  />
)

export const InventoryPage: React.FC = () => (
  <PageSkeleton
    title="Inventory & Stock Check"
    description="Manage raw materials, supplier lists, and monitor low-stock items with threshold alarms."
    roles={["admin", "manager"]}
    icon={<Boxes className="h-5 w-5" />}
  />
)

export const StaffPage: React.FC = () => (
  <PageSkeleton
    title="Staff & User Roles"
    description="Configure new staff accounts, manage credentials, and audit action histories."
    roles={["admin"]}
    icon={<Users className="h-5 w-5" />}
  />
)
