const { default: mongoose } = require("mongoose")

const connectDb = async () => {
  return mongoose.connect('mongodb+srv://swayampandya1236:Wq7c47uREF2MrAku@cluster0.czjdqsx.mongodb.net/?retryWrites=true&w=majority')
  .then(()=>console.log(`Connected Sucessfully with DB`))
  .catch((err)=>console.log(err));
}
module.exports = { connectDb }
