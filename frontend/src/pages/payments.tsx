import React, { useState } from "react"
import { useList, useCreate } from "@refinedev/core"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CreditCard, DollarSign, RefreshCw, Landmark, BookOpen } from "lucide-react"

interface Table {
  tableNumber: string
}

interface Order {
  id: number
  status: string
  totalAmount: number
  table?: Table
}

interface CashierUser {
  fullName: string
}

interface Payment {
  id: number
  orderId: number
  amount: number
  paymentMethod: string
  paidAt: string
  cashier?: CashierUser
}

export const PaymentsPage: React.FC = () => {
  const { data: ordersData, isLoading: isOrdersLoading, refetch: refetchOrders } = useList<Order>({
    resource: "orders",
  })

  const { data: paymentsData, isLoading: isPaymentsLoading, refetch: refetchPayments } = useList<Payment>({
    resource: "payments",
  })

  const { mutate: createPayment } = useCreate()

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [activeTab, setActiveTab] = useState<"checkout" | "history">("checkout")

  const orders = ordersData?.data || []
  // Pending checkout are orders that are "ready" or "cooking" or "pending" but NOT "paid"
  const pendingCheckoutOrders = orders.filter(o => o.status !== "paid" && o.status !== "completed")

  const payments = paymentsData?.data || []

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder || isSubmitting) return

    setIsSubmitting(true)
    createPayment({
      resource: "payments",
      values: {
        orderId: selectedOrder.id,
        paymentMethod
      },
      successNotification: () => ({
        message: `Order #${selectedOrder.id} checked out successfully`,
        type: "success"
      })
    }, {
      onSuccess: () => {
        setIsOpen(false)
        setSelectedOrder(null)
        refetchOrders()
        refetchPayments()
        setIsSubmitting(false)
      },
      onError: () => {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Billing & Cashier Terminal</h2>
            <p className="text-muted-foreground text-sm">Settle orders, select payment channels, and review historical revenues.</p>
          </div>
        </div>
        <button
          onClick={() => {
            refetchOrders()
            refetchPayments()
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-sm text-foreground hover:bg-muted transition-all font-medium cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("checkout")}
          className={`pb-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "checkout"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Checkouts ({pendingCheckoutOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Transaction History ({payments.length})
        </button>
      </div>

      {activeTab === "checkout" ? (
        isOrdersLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-card/50 border border-border animate-pulse" />
            ))}
          </div>
        ) : pendingCheckoutOrders.length === 0 ? (
          <div className="text-center py-20 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/10">
            No active orders waiting for checkout.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingCheckoutOrders.map(order => (
              <Card key={order.id} className="border-border bg-card text-foreground hover:border-primary/45 transition-all group duration-300 flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-md group-hover:text-primary transition-colors">
                        Order #{order.id}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Table {order.table?.tableNumber || "N/A"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-foreground uppercase px-2 py-0.5 rounded bg-muted border border-border">
                      {order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Amount</p>
                    <p className="text-2xl font-black text-foreground">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setIsOpen(true)
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-black text-xs font-black hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Checkout</span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : isPaymentsLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-card/10">
          No historical payments found in local registers.
        </div>
      ) : (
        <Card className="border-border bg-card text-foreground">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/80 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Processed By</th>
                    <th className="p-4">Method</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground">TX-100{payment.id}</td>
                      <td className="p-4 text-muted-foreground">#{payment.orderId}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(payment.paidAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="p-4 text-foreground font-semibold">
                        {payment.cashier?.fullName || "System cashier"}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold border bg-muted text-foreground border-border">
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-right font-extrabold text-primary">${payment.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settle Checkout Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Settle Dining Bill</DialogTitle>
            <CardDescription className="text-muted-foreground">
              Confirm settlement for Order #{selectedOrder?.id}
            </CardDescription>
          </DialogHeader>
          <form onSubmit={handleCheckoutSubmit} className="space-y-6 pt-3">
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Charge</span>
              <p className="text-3xl font-black text-primary mt-1">
                ${selectedOrder?.totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-sm transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Landmark className="h-5 w-5" />
                  <span className="font-bold">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-sm transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="font-bold">Hard Cash</span>
                </button>
              </div>
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
                Settle Payment
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
