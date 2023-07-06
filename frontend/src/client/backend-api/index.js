const { FlightApi } = require("./flight")
const { UserApi } = require("./user")

const BackendApi = {
  flight: FlightApi,
  user: UserApi,
}

module.exports = { BackendApi }
