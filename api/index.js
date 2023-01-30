require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3333
const routes = require('./src/router/routes')
const app = express()



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", 'Content-Type', 'Authorization')
  // res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", 'GET', 'PUT', 'POST', 'DELETE')
  app.use(cors())
  console.log(req.method)
  next()
})

//middleawre
app.use(express.json())
app.use(morgan('dev'))
app.use(routes)
//app.get('/products', (req, res) => { res.send('hello') })


// Banco de Dados and Start app
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend Runing in ${PORT}`);
      console.log('Conectado ao mongoDB');
    })
  })
  .catch((err) => {
    console.log(err.message)
  })
