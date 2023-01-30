const jwt = require('jsonwebtoken')

const generateToken = async (id) => {
  const token = await jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: '3d'
  })

  return token
}

module.exports = generateToken
