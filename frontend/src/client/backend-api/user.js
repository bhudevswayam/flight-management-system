export const UserApi = {
  borrowFlight: async (flightNo, userId) => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/user/borrow", {
      method: "POST",
      body: JSON.stringify({ flightNo, userId }),
      headers: { "Content-Type": "application/json" },
    })
    return res.json()
  },
  returnFlight: async (flightNo, userId) => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/user/return", {
      method: "POST",
      body: JSON.stringify({ flightNo, userId }),
      headers: { "Content-Type": "application/json" },
    })
    return res.json()
  },
  getBorrowFlight: async () => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/user/borrowed-flights", { method: "GET" })
    return res.json()
  },
  login: async (username, password) => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    })
    return res.json()
  },
  getProfile: async () => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/user/profile", { method: "GET" })
    return res.json()
  },
  logout: async () => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/user/logout", { method: "GET" })
    return res.json()
  },
}

// module.exports = { UserApi }
