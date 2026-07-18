import type { DataProvider } from "@refinedev/core"

const API_URL = "http://localhost:5054/api"

const getHeaders = () => {
  const userString = localStorage.getItem("rms_user")
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (userString) {
    try {
      const user = JSON.parse(userString)
      if (user.token) {
        headers["Authorization"] = `Bearer ${user.token}`
      }
    } catch (e) {
      // ignore
    }
  }
  return headers
}

export const dataProvider: DataProvider = {
  getList: async ({ resource }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      headers: getHeaders(),
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data, total: data.length }
  },

  getOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      headers: getHeaders(),
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  },

  create: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(variables),
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  },

  update: async ({ resource, id, variables }) => {
    let url = `${API_URL}/${resource}/${id}`
    let body = JSON.stringify(variables)

    // Handle special case for table status update in TablesController
    if (resource === "tables" && typeof variables === "object" && variables !== null && "status" in variables) {
      url = `${API_URL}/${resource}/${id}/status`
      body = JSON.stringify((variables as any).status)
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body,
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  },

  deleteOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  },

  getApiUrl: () => API_URL,
}
