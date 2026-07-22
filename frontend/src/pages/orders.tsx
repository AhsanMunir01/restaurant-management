import React, { useState } from "react"
import { useList, useCreate } from "@refinedev/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const getStatusBadge = (_status: string) => {
    return "bg-muted text-foreground border border-border"
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
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
                          {oi.notes && <p className="text-xs text-muted-foreground font-medium italic">*{oi.notes}</p>}
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
              <Select value={selectedTable ? String(selectedTable) : ""} onValueChange={(value) => setSelectedTable(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={availableTables.length === 0 ? "No idle tables available" : "Choose a table"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.length === 0 ? (
                    <SelectItem value="none" disabled>No tables currently idle (Clean them first!)</SelectItem>
                  ) : (
                    availableTables.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        Table {t.tableNumber} (Capacity: {t.status})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                    <Select
                      value={item.menuItemId ? String(item.menuItemId) : ""}
                      onValueChange={(value) => handleItemChange(index, "menuItemId", value)}
                    >
                      <SelectTrigger className="flex-1 text-xs h-9">
                        <SelectValue placeholder={menuItems.length === 0 ? "No available dishes" : "Choose dish"} />
                      </SelectTrigger>
                      <SelectContent>
                        {menuItems.length === 0 ? (
                          <SelectItem value="none" disabled>No available dishes</SelectItem>
                        ) : (
                          menuItems.map((dish) => (
                            <SelectItem key={dish.id} value={String(dish.id)}>
                              {dish.name} - ${dish.price.toFixed(2)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

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
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
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
