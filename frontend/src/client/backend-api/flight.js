import axios from 'axios';

export const FlightApi = {
  getAllFlights: async () => {
    const res = await fetch("https://devrev-fms.onrender.com/v1/flight", { method: "GET" })
    return res.json()
  },
  getFlightByNo: async (flightNo) => {
    const res = await fetch(`https://devrev-fms.onrender.com/v1/flight/${flightNo}`, { method: "GET" })
    return res.json()
  },
  addFlight: async (data) => {
    console.log(data);
    const res = await fetch("https://devrev-fms.onrender.com/v1/flight", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    return res.json()
  },
  patchFlightByNo: async (flightNo, data) => {
    const res = await fetch(`https://devrev-fms.onrender.com/v1/flight/${flightNo}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    return res.json()
  },
  deleteFlight: async (flightNo) => {
    const res = await fetch(`https://devrev-fms.onrender.com/v1/flight/${flightNo}`, { method: "DELETE" })
    return res.json()
  },
}

// module.exports = { FlightApi }
