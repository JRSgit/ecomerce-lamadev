const jwt = require('jsonwebtoken')


module.exports = async (req, res, next) => {
  const HeaderToken = req.headers.token || req.headers.authorization
  if (!HeaderToken) {
    return res.status(400).json({ message: 'Token is required' })
  }

  const [, token] = HeaderToken.split(' ')

  const decoded = jwt.verify(token, process.env.SECRET_TOKEN, (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return result
  })

  if (!decoded.id) {
    return
  }
  req.userId = decoded.id

  next()
}