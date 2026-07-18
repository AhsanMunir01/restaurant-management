import { Refine, Authenticated, usePermissions } from "@refinedev/core"
import routerBindings, { CatchAllNavigate } from "@refinedev/react-router-v6"
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom"
import { authProvider } from "./providers/authProvider"
import { dataProvider } from "./providers/dataProvider"
import { LoginPage } from "./pages/login"
import { BaseLayout } from "./components/layout"
import { DashboardPage } from "./pages/dashboard"
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute"
import { TablesPage } from "./pages/tables"
import { MenuPage } from "./pages/menu"
import { OrdersPage } from "./pages/orders"
import { KitchenPage } from "./pages/kitchen"
import { PaymentsPage } from "./pages/payments"
import { InventoryPage } from "./pages/inventory"
import { StaffPage } from "./pages/staff"
import { ThemeProvider } from "./components/theme/ThemeProvider"
import { UnauthorizedPage } from "./pages/unauthorized"
import "./App.css"

// Helper redirect component to forward different roles to their correct starting pages
const DashboardRedirect = () => {
  const { data: role, isLoading } = usePermissions<string>({})

  if (isLoading || role === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary border-r-2"></div>
          <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">Loading...</span>
        </div>
      </div>
    )
  }

  if (role === "chef") {
    return <Navigate to="/kitchen" replace />
  }
  if (role === "waiter") {
    return <Navigate to="/tables" replace />
  }
  if (role === "cashier") {
    return <Navigate to="/orders" replace />
  }
  return <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Refine
          authProvider={authProvider}
          dataProvider={dataProvider}
          routerProvider={routerBindings}
          resources={[
            {
              name: "dashboard",
              list: "/dashboard",
            },
            {
              name: "tables",
              list: "/tables",
            },
            {
              name: "menu",
              list: "/menu",
            },
            {
              name: "orders",
              list: "/orders",
            },
            {
              name: "kitchen",
              list: "/kitchen",
            },
            {
              name: "payments",
              list: "/payments",
            },
            {
              name: "inventory",
              list: "/inventory",
            },
            {
              name: "staff",
              list: "/staff",
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
        <Routes>
          {/* Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <Authenticated key="protected-layout" fallback={<CatchAllNavigate to="/login" />}>
                <BaseLayout>
                  <Outlet />
                </BaseLayout>
              </Authenticated>
            }
          >
            {/* Route Catch All / Fallback -> redirects users dynamically based on role */}
            <Route index element={<DashboardRedirect />} />

            {/* Dashboard Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "manager"]} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Tables Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "manager", "waiter"]} />}>
              <Route path="/tables" element={<TablesPage />} />
            </Route>

            {/* Menu Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "manager", "waiter"]} />}>
              <Route path="/menu" element={<MenuPage />} />
            </Route>

            {/* Orders Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "manager", "waiter", "cashier"]} />}>
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

            {/* Kitchen Queue Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "chef", "waiter"]} />}>
              <Route path="/kitchen" element={<KitchenPage />} />
            </Route>

            {/* Payments Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "manager", "cashier"]} />}>
              <Route path="/payments" element={<PaymentsPage />} />
            </Route>

            {/* Inventory Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "manager"]} />}>
              <Route path="/inventory" element={<InventoryPage />} />
            </Route>

            {/* Staff Protected */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/staff" element={<StaffPage />} />
            </Route>

            {/* Unauthorized page wrapper */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Catch All Not Found */}
          <Route path="*" element={<CatchAllNavigate to="/" />} />
        </Routes>
      </Refine>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
