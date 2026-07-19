import React, { useState } from "react"
import { useList, useCreate } from "@refinedev/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ShoppingBag, Plus, RefreshCw, Trash2 } from "lucide-react"

interface Table {
  id: number
  tableNumber: string
  status: string
}

interface MenuItem {
  id: number
  name: string
  price: number
  isAvailable: boolean
}

interface OrderItem {
  id?: number
  menuItemId: number
  quantity: number
  notes?: string
  menuItem?: MenuItem
}

interface Order {
  id: number
  tableId: number
  status: string
  totalAmount: number
  createdAt: string
  table?: Table
  orderItems?: OrderItem[]
}

export const OrdersPage: React.FC = () => {
  const { data: ordersData, isLoading, refetch } = useList<Order>({
    resource: "orders",
  })

  const { data: tablesData } = useList<Table>({ resource: "tables" })
  const { data: menuData } = useList<MenuItem>({ resource: "menu" })

  const { mutate: createOrder } = useCreate()

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTable, setSelectedTable] = useState<number>(0)
  const [orderItems, setOrderItems] = useState<Array<{ menuItemId: number; quantity: number; notes: string }>>([])

  // Modal controls
  const tables = tablesData?.data || []
  const availableTables = tables.filter(t => t.status === "idle" || t.status === "dirty")
  const menuItems = (menuData?.data || []).filter(item => item.isAvailable)

  const handleAddItem = () => {
    setOrderItems([...orderItems, { menuItemId: menuItems[0]?.id || 0, quantity: 1, notes: "" }])
  }

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, key: string, value: any) => {
    const updated = [...orderItems]
    updated[index] = { ...updated[index], [key]: value }
    setOrderItems(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTable || orderItems.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    createOrder({
      resource: "orders",
      values: {
        tableId: selectedTable,
        items: orderItems.map(item => ({
          menuItemId: Number(item.menuItemId),
          quantity: Number(item.quantity),
          notes: item.notes
        }))
      },
      successNotification: () => ({
        message: "Order created successfully",
        type: "success"
      })
    }, {
      onSuccess: () => {
        setIsOpen(false)
        setSelectedTable(0)
        setOrderItems([])
        refetch()
        setIsSubmitting(false)
      },
      onError: () => {
        setIsSubmitting(false)
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
      case "cooking":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
      case "ready":
        return "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20"
      case "paid":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
      default:
        return "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Active Orders</h2>
              <p className="text-muted-foreground text-sm">Monitor daily ticket orders, notes, and totals.</p>
            </div>
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
            onClick={() => {
              setIsOpen(true)
              setSelectedTable(availableTables[0]?.id || 0)
              setOrderItems([{ menuItemId: menuItems[0]?.id || 0, quantity: 1, notes: "" }])
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(ordersData?.data || []).map((order) => (
            <Card key={order.id} className="border-border bg-card text-foreground hover:border-primary/45 transition-all group duration-300 flex flex-col justify-between overflow-hidden">
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
                  <div className="space-y-1">
                    <CardTitle className="text-md font-bold group-hover:text-primary transition-colors">
                      Order #{order.id}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Table {order.table?.tableNumber || `ID: ${order.tableId}`}
                    </p>
                  </div>
                  <Badge className={`capitalize text-[9px] tracking-wider px-2 py-0.5 font-semibold ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="space-y-2">
                    {order.orderItems?.map((oi, i) => (
                      <div key={oi.id || i} className="flex justify-between items-start text-sm">
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {oi.menuItem?.name || "Dish Item"} <span className="text-primary font-bold">x{oi.quantity}</span>
                          </p>
                          {oi.notes && <p className="text-xs text-rose-500 font-medium italic">*{oi.notes}</p>}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          ${((oi.menuItem?.price || 0) * oi.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
              <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-extrabold text-foreground text-md">
                  Total: <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Order Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Place New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Table Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Seating Table</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {availableTables.length === 0 ? (
                  <option value="">No tables currently idle (Clean them first!)</option>
                ) : (
                  availableTables.map(t => (
                    <option key={t.id} value={t.id}>Table {t.tableNumber} (Capacity: {t.status})</option>
                  ))
                )}
              </select>
            </div>

            {/* Order Items Add Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dishes & Portions</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center bg-muted/40 p-2.5 rounded-lg border border-border/50">
                    <select
                      value={item.menuItemId}
                      onChange={(e) => handleItemChange(index, "menuItemId", e.target.value)}
                      className="flex-1 bg-background border border-input rounded p-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      {menuItems.map(dish => (
                        <option key={dish.id} value={dish.id}>{dish.name} - ${dish.price.toFixed(2)}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className="w-16 bg-background border border-input rounded p-1.5 text-xs text-foreground text-center focus:outline-none focus:border-primary"
                    />

                    <input
                      type="text"
                      placeholder="Notes (e.g. no onions)"
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                      className="flex-1 bg-background border border-input rounded p-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-all font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedTable || orderItems.length === 0 || isSubmitting}
                className="px-5 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
