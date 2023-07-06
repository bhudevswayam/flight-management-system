const apiV1 = require("express")()
const { router: flightRouter } = require("./flights")
const { router: userRouter } = require("./users")

apiV1.use("/flight", flightRouter)
apiV1.use("/user", userRouter)

module.exports = { apiV1 }
