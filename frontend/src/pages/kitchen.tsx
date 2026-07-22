import React, { useEffect } from "react"
import { useList, useUpdate, usePermissions } from "@refinedev/core"
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
  const { data: role } = usePermissions<string>({})

  const { mutate: updateStatus } = useUpdate()

  // Poll for new orders every 10 seconds to keep kitchen display live
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 10000)
    return () => clearInterval(interval)
  }, [refetch])

  const orders = kitchenData?.data || []
  const isChef = role === "chef"
  const isWaiter = role === "waiter"

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
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Kitchen Display System (KDS)</h2>
            <p className="text-muted-foreground text-sm">Real-time order routing, preparation status, and timing logs.</p>
          </div>
        </div>
        {!isChef && !isWaiter && (
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            View-only access. Order movement is restricted to kitchen and delivery roles.
          </div>
        )}
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-sm text-foreground hover:bg-muted transition-all font-medium cursor-pointer"
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
      ) : isWaiter ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border">
            <span className="font-bold text-foreground text-sm tracking-wider uppercase">Ready for Delivery</span>
            <Badge className="bg-muted text-foreground border border-border font-bold">
              {readyOrders.length} Tickets
            </Badge>
          </div>

          {readyOrders.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/20">
              No plates ready for delivery.
            </div>
          ) : (
            <div className="space-y-4">
              {readyOrders.map(order => (
                <Card key={order.id} className="border-border bg-card text-foreground hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                    <div>
                      <span className="font-extrabold text-sm">Order #{order.id}</span>
                      <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                    </div>
                    <Badge className="bg-muted text-foreground border border-border text-[9px] animate-pulse">
                      Ready
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-3">
                    <div className="space-y-1.5">
                      {order.orderItems.map((oi, idx) => (
                        <div key={oi.id || idx} className="text-sm">
                          <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                          {oi.notes && <p className="text-xs text-muted-foreground italic font-medium ml-4">*{oi.notes}</p>}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAdvance(order.id, "served")}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all mt-2 cursor-pointer"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>Deliver Order</span>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          {/* COLUMN 1: PENDING ORDERS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border">
              <span className="font-bold text-foreground text-sm tracking-wider uppercase">Pending Queue</span>
              <Badge className="bg-muted text-foreground border border-border font-bold">
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
                  <Card key={order.id} className="border-border bg-card text-foreground hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                      <div>
                        <span className="font-extrabold text-sm">Order #{order.id}</span>
                        <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <Badge className="bg-muted text-foreground border border-border text-[9px] animate-pulse">
                        {getElapsedTime(order.createdAt)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="space-y-1.5">
                        {order.orderItems.map((oi, idx) => (
                          <div key={oi.id || idx} className="text-sm">
                            <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                            {oi.notes && <p className="text-xs text-muted-foreground italic font-medium ml-4">*{oi.notes}</p>}
                          </div>
                        ))}
                      </div>
                      {isChef && (
                        <button
                          onClick={() => handleAdvance(order.id, "cooking")}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all mt-2 cursor-pointer"
                        >
                          <Play className="h-3 w-3" />
                          <span>Start Cooking</span>
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 2: COOKING ORDERS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border">
              <span className="font-bold text-foreground text-sm tracking-wider uppercase">In Progress</span>
              <Badge className="bg-muted text-foreground border border-border font-bold">
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
                  <Card key={order.id} className="border-border bg-card text-foreground hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                      <div>
                        <span className="font-extrabold text-sm">Order #{order.id}</span>
                        <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <Badge className="bg-muted text-foreground border border-border text-[9px]">
                        Active: {getElapsedTime(order.createdAt)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="space-y-1.5">
                        {order.orderItems.map((oi, idx) => (
                          <div key={oi.id || idx} className="text-sm">
                            <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                            {oi.notes && <p className="text-xs text-muted-foreground italic font-medium ml-4">*{oi.notes}</p>}
                          </div>
                        ))}
                      </div>
                      {isChef && (
                        <button
                          onClick={() => handleAdvance(order.id, "ready")}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all mt-2 cursor-pointer"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Mark Ready</span>
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 3: READY FOR DEPARTURE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border">
              <span className="font-bold text-foreground text-sm tracking-wider uppercase">Ready to Serve</span>
              <Badge className="bg-muted text-foreground border border-border font-bold">
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
                  <Card key={order.id} className="border-border bg-card text-foreground hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-border/50">
                      <div>
                        <span className="font-extrabold text-sm">Order #{order.id}</span>
                        <p className="text-[11px] text-muted-foreground">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <Badge className="bg-muted text-foreground border border-border text-[9px] animate-pulse">
                        Ready
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="space-y-1.5">
                        {order.orderItems.map((oi, idx) => (
                          <div key={oi.id || idx} className="text-sm">
                            <span className="font-bold text-primary">x{oi.quantity}</span> {oi.menuItem?.name}
                            {oi.notes && <p className="text-xs text-muted-foreground italic font-medium ml-4">*{oi.notes}</p>}
                          </div>
                        ))}
                      </div>
                      {isChef ? (
                        <div className="flex items-center justify-center p-2 rounded-lg bg-muted/40 border border-border text-[11px] text-foreground font-bold uppercase tracking-wider text-center">
                          Waiting for Waiter Delivery
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdvance(order.id, "served")}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all mt-2 cursor-pointer"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Deliver Order</span>
                        </button>
                      )}
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
