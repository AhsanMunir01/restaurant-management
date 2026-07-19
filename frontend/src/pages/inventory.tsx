import React, { useState } from "react"
import { useList, useUpdate } from "@refinedev/core"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Boxes, Edit3, AlertTriangle, RefreshCw } from "lucide-react"

interface InventoryItem {
  id: number
  itemName: string
  quantity: number
  unit: string
  reorderLevel: number
}

export const InventoryPage: React.FC = () => {
  const { data: inventoryData, isLoading, refetch } = useList<InventoryItem>({
    resource: "inventory",
  })

  const { mutate: updateStock } = useUpdate()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [newQuantity, setNewQuantity] = useState<string>("")

  const items = inventoryData?.data || []

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setNewQuantity(item.quantity.toString())
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem || newQuantity === "") return

    updateStock({
      resource: "inventory",
      id: selectedItem.id,
      values: {
        quantity: parseFloat(newQuantity)
      },
      successNotification: () => ({
        message: `${selectedItem.itemName} stock updated successfully`,
        type: "success"
      })
    }, {
      onSuccess: () => {
        setIsOpen(false)
        setSelectedItem(null)
        refetch()
      }
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Inventory & Ingredients</h2>
            <p className="text-muted-foreground text-sm">Monitor food ingredient stocks and update quantity levels.</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-sm text-foreground hover:bg-muted transition-all font-medium cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => {
            const isLow = item.quantity <= item.reorderLevel
            const ratio = item.quantity > 0 ? (item.quantity / (item.reorderLevel * 3)) * 100 : 0
            const percentage = Math.min(100, Math.max(0, ratio))

            return (
              <Card key={item.id} className={`border-border bg-card text-foreground hover:border-primary/40 transition-all duration-300 ${
                isLow ? "border-rose-500/20 bg-rose-500/[0.01]" : ""
              }`}>
                <CardHeader className="pb-3 flex flex-row items-start justify-between border-b border-border/50">
                  <div className="space-y-1">
                    <span className="font-extrabold text-md">{item.itemName}</span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      Unit: {item.unit}
                    </p>
                  </div>
                  {isLow && (
                    <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      <span>Low Stock</span>
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-muted-foreground">Current Level</span>
                      <p className={`text-2xl font-black ${isLow ? "text-rose-500" : "text-foreground"}`}>
                        {Number(item.quantity).toFixed(2)} <span className="text-sm font-semibold text-muted-foreground">{item.unit}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stock level bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                      <span>Safety Reorder Level: {item.reorderLevel} {item.unit}</span>
                    </div>
                    <div className="w-full h-2 rounded bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded transition-all duration-500 ${
                          isLow ? "bg-rose-500" : "bg-primary"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Inventory Level Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Ingredient Level</DialogTitle>
            <CardDescription className="text-muted-foreground">
              Adjust current stock quantity for {selectedItem?.itemName}
            </CardDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Quantity ({selectedItem?.unit})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                required
              />
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
                Update Stock
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
