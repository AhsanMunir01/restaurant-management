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
    const user = MOCK_USERS[email]
    if (user && user.passwordHash === password) {
      const { passwordHash, ...userData } = user
      localStorage.setItem("rms_user", JSON.stringify(userData))
      window.location.href = "/"
      return {
        success: true,
        redirectTo: "/",
      }
    }

    return {
      success: false,
      error: {
        name: "Login Error",
        message: "Invalid email or password",
      },
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
      return {
        authenticated: true,
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
      const user = JSON.parse(userString) as User
      return user.role
    }
    return null
  },

  getIdentity: async () => {
    const userString = localStorage.getItem("rms_user")
    if (userString) {
      const user = JSON.parse(userString) as User
      return user
    }
    return null
  },
}
