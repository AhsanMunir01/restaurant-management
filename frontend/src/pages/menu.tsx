import React, { useState } from "react"
import { useList } from "@refinedev/core"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, RefreshCw } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  isAvailable: boolean
}

export const MenuPage: React.FC = () => {
  const { data, isLoading, refetch } = useList<MenuItem>({
    resource: "menu",
  })

  const [activeCategory, setActiveCategory] = useState<string>("All")

  const menuItems = data?.data || []
  const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))]

  const filteredItems = activeCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Menu Card</h2>
              <p className="text-muted-foreground text-sm">Browse the premium dining offerings, prices, and availability.</p>
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeCategory === category
                ? "bg-primary text-black font-extrabold shadow-lg shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-card/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-border bg-card text-foreground hover:border-primary/45 transition-all group duration-300 flex flex-col justify-between overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="text-right">
                    <span className="font-extrabold text-primary text-lg">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 min-h-[60px]">
                  {item.description}
                </p>
              </div>
              <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between">
                <Badge className="bg-background text-muted-foreground border border-border text-[9px] uppercase tracking-wider px-2 py-0.5">
                  {item.category}
                </Badge>
                <Badge className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                  item.isAvailable
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                    : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                }`}>
                  {item.isAvailable ? "In Stock" : "Sold Out"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
