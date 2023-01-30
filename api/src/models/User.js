const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose



const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  img: { type: String }
},
  {
    timestamps: true,
  })

UserSchema.pre('save', async function () {
  const salts = await bcrypt.genSalt(10)
  const password_hash = await bcrypt.hash(this.password, salts)
  this.password = password_hash
})

module.exports = mongoose.model("User", UserSchema)
