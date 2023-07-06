const router = require("express")()
const { FlightModel } = require("../models/flights")

router.get("/", async (req, res, next) => {
  try {
    const flights = await FlightModel.find({})
    return res.status(200).json({
      flights: flights.map((flight) => ({
        ...flight.toJSON(),
        availableQuantity: flight.quantity - flight.borrowedBy.length,
      })),
    })
  } catch (err) {
    next(err)
  }
})

router.get("/:flightNo", async (req, res, next) => {
  try {
    const flight = await FlightModel.findOne({ No: req.params.flightNo })
    if (flight == null) {
      return res.status(404).json({ error: "flight not found" })
    }
    return res.status(200).json({
      flight: {
        ...flight.toJSON(),
        availableQuantity: flight.quantity - flight.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const flight = await FlightModel.findOne({ No: req.body.No })
    if (flight != null) {
      return res.status(400).json({ error: "flight with same No already found" })
    }
    const newflight = await FlightModel.create(req.body)
    return res.status(200).json({ flight: newflight })
  } catch (err) {
    next(err)
  }
})

router.patch("/:flightNo", async (req, res, next) => {
  try {
    const flight = await FlightModel.findOne({ No: req.params.flightNo })
    if (flight == null) {
      return res.status(404).json({ error: "flight not found" })
    }
    const { _id, No, ...rest } = req.body
    const updatedflight = await flight.update(rest)
    return res.status(200).json({ flight: updatedflight })
  } catch (err) {
    next(err)
  }
})

router.delete("/:flightNo", async (req, res, next) => {
  try {
    const flight = await FlightModel.findOne({ No: req.params.flightNo })
    if (flight == null) {
      return res.status(404).json({ error: "flight not found" })
    }
    await flight.delete()
    return res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = { router }
