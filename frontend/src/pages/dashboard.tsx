import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, ShoppingBag, DollarSign, Clock, ArrowUpRight, Boxes } from "lucide-react"

export const DashboardPage: React.FC = () => {
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
              Total Revenue Today
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">$1,248.50</div>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% from yesterday</span>
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
            <div className="text-2xl font-extrabold text-foreground">12 Orders</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>Average wait: 14 mins</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Table Occupancy
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">8 / 15</div>
            <p className="text-xs text-indigo-500 dark:text-indigo-450 flex items-center gap-1 mt-1 font-medium">
              <span>53% occupancy rate</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Critical Stock
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-405 flex items-center justify-center">
              <Boxes className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">3 Items</div>
            <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1 font-medium">
              <span>Requires ordering soon</span>
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
              Real-time feed of billing activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "TX-1009", time: "2 mins ago", amt: "$84.00", table: "T-04", status: "Paid", method: "Card" },
              { id: "TX-1008", time: "12 mins ago", amt: "$45.50", table: "T-12", status: "Paid", method: "Cash" },
              { id: "TX-1007", time: "25 mins ago", amt: "$112.00", table: "T-01", status: "Paid", method: "Wallet" },
              { id: "TX-1006", time: "40 mins ago", amt: "$24.50", table: "T-07", status: "Paid", method: "Card" },
            ].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/60">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{tx.id}</p>
                  <p className="text-xs text-muted-foreground">{tx.time} • Table {tx.table}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{tx.amt}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">{tx.method}</p>
                  </div>
                  <Badge variant="success" className="text-[10px] py-0 px-2 font-bold uppercase">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
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
            {[
              { name: "Ribeye Steak with Garlic Butter", orders: 28, revenue: "$896.00" },
              { name: "Truffle Mushroom Risotto", orders: 22, revenue: "$484.00" },
              { name: "Signature Bistro Burger", orders: 19, revenue: "$342.00" },
              { name: "Lava Cake with Vanilla Gelato", orders: 15, revenue: "$150.00" },
            ].map((dish, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground truncate max-w-[180px]">{dish.name}</p>
                  <p className="text-xs text-muted-foreground">{dish.orders} orders placed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{dish.revenue}</p>
                  <Link to="/menu" className="text-[10px] text-primary flex items-center justify-end hover:underline">
                    View Menu <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
