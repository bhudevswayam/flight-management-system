const router = require("express")()
const { FlightModel } = require("../models/flights")
const { UserModel } = require("../models/user")

const omitPassword = (user) => {
  const { password, ...rest } = user
  return rest
}

router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    return res.status(200).json({ users: users.map((user) => omitPassword(user.toJSON())) })
  } catch (err) {
    next(err)
  }
})

router.post("/borrow", async (req, res, next) => {
  try {
    const flight = await FlightModel.findOne({ flightNo: req.body.flightNo })
    if (flight == null) {
      return res.status(404).json({ error: "Flight not found" })
    }
    if (flight.borrowedBy.length === flight.quantity) {
      return res.status(400).json({ error: "Flight is not available" })
    }
    const user = await UserModel.findById(req.body.userId)
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (flight.borrowedBy.includes(user.id)) {
      return res.status(400).json({ error: "You've already borrowed this flight" })
    }
    await flight.update({ borrowedBy: [...flight.borrowedBy, user.id] })
    const updatedFlight = await FlightModel.findById(flight.id)
    return res.status(200).json({
      flight: {
        ...updatedFlight.toJSON(),
        availableQuantity: updatedFlight.quantity - updatedFlight.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/return", async (req, res, next) => {
  try {
    const flight = await FlightModel.findOne({ isbn: req.body.isbn })
    if (flight == null) {
      return res.status(404).json({ error: "Flight not found" })
    }
    const user = await UserModel.findById(req.body.userId)
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (!flight.borrowedBy.includes(user.id)) {
      return res.status(400).json({ error: "You need to borrow this flight first!" })
    }
    console.log("user.id", user.id)
    console.log("flight.borrowedBy", flight.borrowedBy)
    console.log(
      "filtered",
      flight.borrowedBy.filter((borrowedBy) => !borrowedBy.equals(user.id))
    )
    await flight.update({
      borrowedBy: flight.borrowedBy.filter((borrowedBy) => !borrowedBy.equals(user.id)),
    })
    const updatedFlight = await FlightModel.findById(flight.id)
    return res.status(200).json({
      flight: {
        ...updatedFlight.toJSON(),
        availableQuantity: updatedFlight.quantity - updatedFlight.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get("/borrowed-flights", async (req, res, next) => {
  try {
    const result = await FlightModel.find({ "borrowedBy": { "$in": req.session.userId } })
    return res.status(200).json({ flights: result })
  } catch (err) {
    next(err)
  }
})

router.get("/profile", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    return res.status(200).json({ user: omitPassword(user.toJSON()) })
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username })
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "Invalid password" })
    }
    console.log("user.id", user.id)
    req.session.userId = user.id
    return res.status(200).json({ user: omitPassword(user.toJSON()) })
  } catch (err) {
    next(err)
  }
})

router.get("/logout", (req, res) => {
  req.session.destroy()
  return res.status(200).json({ success: true })
})

module.exports = { router }
