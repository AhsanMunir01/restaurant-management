import React from "react"
import { useList, useUpdate } from "@refinedev/core"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, Users, RefreshCw } from "lucide-react"

interface Table {
  id: number
  tableNumber: string
  capacity: number
  status: "idle" | "occupied" | "dirty" | "reserved"
}

export const TablesPage: React.FC = () => {
  const { data, isLoading, refetch } = useList<Table>({
    resource: "tables",
  })

  const { mutate: updateTable } = useUpdate()

  const tables = data?.data || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
      case "occupied":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
      case "dirty":
        return "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
      case "reserved":
        return "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/20"
      default:
        return "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/20"
    }
  }

  const handleStatusChange = (id: number, status: string) => {
    updateTable({
      resource: "tables",
      id,
      values: { status },
      successNotification: () => ({
        message: `Table status updated to ${status}`,
        type: "success",
      }),
    }, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary">
              <Grid3X3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Tables & Seating Plan</h2>
              <p className="text-muted-foreground text-sm">Real-time room layout tracking and table occupation status.</p>
            </div>
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
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => (
            <Card key={table.id} className="border-border bg-card text-foreground hover:border-primary/45 transition-all group duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {table.tableNumber}
                </CardTitle>
                <Badge className={`capitalize border text-[10px] tracking-wider px-2 py-0.5 font-semibold ${getStatusColor(table.status)}`}>
                  {table.status}
                </Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Capacity: {table.capacity} people</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-border flex flex-wrap gap-1.5 justify-end">
                {table.status !== "occupied" && (
                  <button
                    onClick={() => handleStatusChange(table.id, "occupied")}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-transparent hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                  >
                    Occupy
                  </button>
                )}
                {table.status !== "dirty" && (
                  <button
                    onClick={() => handleStatusChange(table.id, "dirty")}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-transparent hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    Dirty
                  </button>
                )}
                {table.status !== "idle" && (
                  <button
                    onClick={() => handleStatusChange(table.id, "idle")}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                  >
                    Clean
                  </button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
