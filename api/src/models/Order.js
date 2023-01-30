const mongoose = require('mongoose')
const { Schema } = mongoose

const OrderSchema = new Schema({
  userId: { type: String, required: true, },
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    }
  ],
  amount: { type: Number, reuired: true },
  address: { type: Object, required: true },
  status: { type: String, default: "pedding " }

},
  {
    timestamps: true,
  })



module.exports = mongoose.model("Order", OrderSchema)
