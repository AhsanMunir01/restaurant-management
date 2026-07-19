import React from "react"
import { Link } from "react-router-dom"
import { useList } from "@refinedev/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, ShoppingBag, DollarSign, Clock, ArrowUpRight, Boxes } from "lucide-react"

interface Table {
  status: string
}

interface InventoryItem {
  quantity: number
  reorderLevel: number
}

interface OrderItem {
  menuItemId: number
  quantity: number
  menuItem?: {
    name: string
    price: number
  }
}

interface Order {
  id: number
  status: string
  totalAmount: number
  createdAt: string
  orderItems: OrderItem[]
}

interface Payment {
  id: number
  amount: number
  paymentMethod: string
  paidAt: string
  order?: {
    table?: {
      tableNumber: string
    }
  }
}

export const DashboardPage: React.FC = () => {
  const { data: tablesData } = useList<Table>({ resource: "tables" })
  const { data: ordersData } = useList<Order>({ resource: "orders" })
  const { data: inventoryData } = useList<InventoryItem>({ resource: "inventory" })
  const { data: paymentsData } = useList<Payment>({ resource: "payments" })

  const tables = tablesData?.data || []
  const orders = ordersData?.data || []
  const inventory = inventoryData?.data || []
  const payments = paymentsData?.data || []

  // Calculates stats
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0)
  const activeOrders = orders.filter(o => o.status !== "paid" && o.status !== "completed")
  const occupiedTablesCount = tables.filter(t => t.status === "occupied").length
  const criticalStockCount = inventory.filter(item => item.quantity <= item.reorderLevel).length

  // Build Recent Payments Log
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .slice(0, 4)

  // Build Real Popular Dishes based on ordered items frequency
  const dishCounts: Record<string, { count: number; revenue: number }> = {}
  orders.forEach(o => {
    o.orderItems?.forEach(oi => {
      if (oi.menuItem) {
        const name = oi.menuItem.name
        if (!dishCounts[name]) {
          dishCounts[name] = { count: 0, revenue: 0 }
        }
        dishCounts[name].count += oi.quantity
        dishCounts[name].revenue += oi.menuItem.price * oi.quantity
      }
    })
  })

  const popularDishes = Object.entries(dishCounts)
    .map(([name, stat]) => ({ name, orders: stat.count, revenue: stat.revenue }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 4)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back to Aethera Bistro management console.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>Live database billing total</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Active Orders
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{activeOrders.length} Orders</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>Awaiting food prep/checkout</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Table Occupancy
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {occupiedTablesCount} / {tables.length}
            </div>
            <p className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1 mt-1 font-medium">
              <span>
                {tables.length > 0 ? Math.round((occupiedTablesCount / tables.length) * 100) : 0}% occupancy rate
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Critical Stock
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <Boxes className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{criticalStockCount} Items</div>
            <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1 font-medium">
              <span>Below reorder warning level</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="border-border bg-card text-foreground lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Sales Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time feed of billing checkouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No recent sales transactions found.</p>
            ) : (
              recentPayments.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/60">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">TX-100{tx.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Table {tx.order?.table?.tableNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">${tx.amount.toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">{tx.paymentMethod}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] py-0 px-2 font-bold uppercase">
                      Paid
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-foreground lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Popular Dishes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Top items ordered today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularDishes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No order logs found to compute popular dishes.</p>
            ) : (
              popularDishes.map((dish, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[180px]">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">{dish.orders} portions ordered</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${dish.revenue.toFixed(2)}</p>
                    <Link to="/menu" className="text-[10px] text-primary flex items-center justify-end hover:underline">
                      View Menu <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
