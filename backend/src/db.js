const { default: mongoose } = require("mongoose")

const connectDb = async () => {
  return mongoose.connect('mongodb://127.0.0.1:27017/flightDevrev')
  .then(()=>console.log(`Connected Sucessfully with DB`))
  .catch((err)=>console.log(err));
}

module.exports = { connectDb }
