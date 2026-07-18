import type { AuthProvider } from "@refinedev/core"

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "manager" | "chef" | "waiter" | "cashier"
  fullName: string
}

export const MOCK_USERS: Record<string, User & { passwordHash: string }> = {
  "admin@rms.com": {
    id: "1",
    username: "admin",
    email: "admin@rms.com",
    role: "admin",
    fullName: "System Admin",
    passwordHash: "admin123",
  },
  "manager@rms.com": {
    id: "2",
    username: "manager",
    email: "manager@rms.com",
    role: "manager",
    fullName: "Sarah Connor (Manager)",
    passwordHash: "manager123",
  },
  "chef@rms.com": {
    id: "3",
    username: "chef",
    email: "chef@rms.com",
    role: "chef",
    fullName: "Chef Gordon (Kitchen Head)",
    passwordHash: "chef123",
  },
  "waiter@rms.com": {
    id: "4",
    username: "waiter",
    email: "waiter@rms.com",
    role: "waiter",
    fullName: "John Doe (Waiter)",
    passwordHash: "waiter123",
  },
  "cashier@rms.com": {
    id: "5",
    username: "cashier",
    email: "cashier@rms.com",
    role: "cashier",
    fullName: "Jane Smith (Cashier)",
    passwordHash: "cashier123",
  },
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:5054/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: {
            name: "Login Error",
            message: errorData.message || "Invalid email or password",
          },
        }
      }

      const userData = await response.json()
      localStorage.setItem("rms_user", JSON.stringify(userData))
      window.location.href = "/"
      return {
        success: true,
        redirectTo: "/",
      }
    } catch (err: any) {
      return {
        success: false,
        error: {
          name: "Connection Error",
          message: "Unable to reach the backend API server. Make sure it is running on port 5054.",
        },
      }
    }
  },

  logout: async () => {
    localStorage.removeItem("rms_user")
    window.location.href = "/login"
    return {
      success: true,
      redirectTo: "/login",
    }
  },

  check: async () => {
    const userString = localStorage.getItem("rms_user")
    if (userString) {
      try {
        const user = JSON.parse(userString)
        if (user && user.token) {
          return {
            authenticated: true,
          }
        }
      } catch (e) {
        // ignore
      }
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    }
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
      }
    }
    return { error }
  },

  getPermissions: async () => {
    const userString = localStorage.getItem("rms_user")
    if (userString) {
      try {
        const user = JSON.parse(userString) as User
        return user.role
      } catch (e) {
        // ignore
      }
    }
    return null
  },

  getIdentity: async () => {
    const userString = localStorage.getItem("rms_user")
    if (userString) {
      try {
        const user = JSON.parse(userString) as User
        return user
      } catch (e) {
        // ignore
      }
    }
    return null
  },
}
