const { model, Schema } = require("mongoose")

const FlightModel = model(
  "Flights",
  new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    flightNo: { type: String, required: true, unique: true},
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    borrowedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    priceHistory: { type: Array, required: true, default: [] },
    quantityHistory: { type: Array, required: true, default: [] },
  })
)

module.exports = { FlightModel }
