import React, { useEffect } from "react"
import { useList, useUpdate } from "@refinedev/core"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Play, CheckCircle, RefreshCw } from "lucide-react"

interface MenuItem {
  id: number
  name: string
}

interface OrderItem {
  id: number
  menuItemId: number
  quantity: number
  notes: string
  menuItem?: MenuItem
}

interface Table {
  tableNumber: string
}

interface Order {
  id: number
  status: string
  createdAt: string
  table?: Table
  orderItems: OrderItem[]
}

export const KitchenPage: React.FC = () => {
  const { data: kitchenData, isLoading, refetch } = useList<Order>({
    resource: "kitchen",
  })

  const { mutate: updateStatus } = useUpdate()

  // Poll for new orders every 10 seconds to keep kitchen display live
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 10000)
    return () => clearInterval(interval)
  }, [refetch])

  const orders = kitchenData?.data || []

  // Filter orders by column
  const pendingOrders = orders.filter(o => o.status === "pending")
  const cookingOrders = orders.filter(o => o.status === "cooking")
  const readyOrders = orders.filter(o => o.status === "ready")

  const handleAdvance = (orderId: number, nextStatus: string) => {
    updateStatus({
      resource: "orders",
      id: orderId,
      values: { status: nextStatus },
      successNotification: () => ({
        message: `Order #${orderId} moved to ${nextStatus}`,
        type: "success"
      })
    }, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const getElapsedTime = (createdTime: string) => {
    const start = new Date(createdTime).getTime()
    const diff = Math.floor((Date.now() - start) / 60000)
    if (diff < 1) return "Just now"
    return `${diff}m ago`
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Kitchen Display System (KDS)</h2>
            <p className="text-muted-foreground text-sm">Real-time order routing, preparation status, and timing logs.</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-sm text-foreground hover:bg-slate-900 transition-all font-medium cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          {/* COLUMN 1: PENDING ORDERS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              <span className="font-bold text-amber-500 text-sm tracking-wider uppercase">Pending Queue</span>
              <Badge className="bg-amber-500/20 text-amber-500 border-none font-bold">
                {pendingOrders.length} Tickets
              </Badge>
            </div>
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/20">
                  No pending orders.
                </div>
              ) : (
                pendingOrders.map(order => (
                  <Card key={order.id} className="border-border bg-card text-foreground hover:border-amber-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                      <div>
                        <span className="font-extrabold text-sm">Order #{order.id}</span>
                        <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <Badge className="bg-red-500/10 text-red-500 border border-red-550/20 text-[9px] animate-pulse">
                        {getElapsedTime(order.createdAt)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="space-y-1.5">
                        {order.orderItems.map((oi, idx) => (
                          <div key={oi.id || idx} className="text-sm">
                            <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                            {oi.notes && <p className="text-xs text-rose-455 italic font-medium ml-4">*{oi.notes}</p>}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAdvance(order.id, "cooking")}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-550 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all mt-2 cursor-pointer"
                      >
                        <Play className="h-3 w-3" />
                        <span>Start Cooking</span>
                      </button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 2: COOKING ORDERS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <span className="font-bold text-blue-500 text-sm tracking-wider uppercase">In Progress</span>
              <Badge className="bg-blue-500/20 text-blue-500 border-none font-bold">
                {cookingOrders.length} Tickets
              </Badge>
            </div>
            <div className="space-y-4">
              {cookingOrders.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/20">
                  No items cooking.
                </div>
              ) : (
                cookingOrders.map(order => (
                  <Card key={order.id} className="border-border bg-card text-foreground hover:border-blue-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                      <div>
                        <span className="font-extrabold text-sm">Order #{order.id}</span>
                        <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-550 border border-blue-500/20 text-[9px]">
                        Active: {getElapsedTime(order.createdAt)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="space-y-1.5">
                        {order.orderItems.map((oi, idx) => (
                          <div key={oi.id || idx} className="text-sm">
                            <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                            {oi.notes && <p className="text-xs text-rose-455 italic font-medium ml-4">*{oi.notes}</p>}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAdvance(order.id, "ready")}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-slate-950 text-xs font-bold transition-all mt-2 cursor-pointer"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Mark Ready</span>
                      </button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 3: READY FOR DEPARTURE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
              <span className="font-bold text-indigo-400 text-sm tracking-wider uppercase">Ready to Serve</span>
              <Badge className="bg-indigo-500/20 text-indigo-400 border-none font-bold">
                {readyOrders.length} Tickets
              </Badge>
            </div>
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/20">
                  No plates ready.
                </div>
              ) : (
                readyOrders.map(order => (
                  <Card key={order.id} className="border-border bg-card text-foreground hover:border-indigo-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                      <div>
                        <span className="font-extrabold text-sm">Order #{order.id}</span>
                        <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <Badge className="bg-indigo-500/20 text-indigo-400 border border-none text-[9px] animate-pulse">
                        Ready
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="space-y-1.5">
                        {order.orderItems.map((oi, idx) => (
                          <div key={oi.id || idx} className="text-sm">
                            <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                            {oi.notes && <p className="text-xs text-rose-455 italic font-medium ml-4">*{oi.notes}</p>}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center p-2 rounded-lg bg-indigo-500/10 border border-indigo-550/20 text-[11px] text-indigo-300 font-bold uppercase tracking-wider text-center">
                        Waiting for Waiter Delivery
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
