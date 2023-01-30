const OrderModel = require('../models/Order')
const yup = require('yup')
const User = require('../models/User')

class OrderCrtl {
  // Story --------------------------------------------------------
  async story(req, res) {
    const schema = yup.object().shape({
      userId: yup.string().required(),
      products: yup.array().required(),
      amount: yup.number().required(),
      address: yup.string().required(),

    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Verifique os dados Informados!' })
    }
    try {
      const order = await OrderModel.create(req.body)

      return res.status(201).json(order)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }

  }
  // Find --------------------------------------------------------
  async find(req, res) {
    try {

      const order = await OrderModel.findById(req.userId)

      return res.status(200).json(order)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }

  }
  //Income ------------------------------------------------
  async income(req, res) {
    const productId = req.query.pid
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
    try {
      const income = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $lte: previousMonth }, ...(productId && {
              products: { $elemMatch: { productId } },
            })
          }
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" }
          }
        },
      ])

      return res.status(200).json(income)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }

  // FindAll ------------------------------------------------------
  async findAll(req, res) {
    try {
      const orders = await OrderModel.find()
      return res.status(200).json(orders)
    } catch (err) {
      return res.status(400).json({ message: err.message })
    }

  }
  // update ------------------------------------------------------
  async update(req, res) {

    try {
      const { orderId } = req.params

      const orderUpdate = await OrderModel.findByIdAndUpdate(orderId, {
        $set: req.body
      }, { new: true })

      return res.status(200).json(orderUpdate)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }
  // Delete ------------------------------------------------------
  async delete(req, res) {
    try {
      const { orderId } = req.params
      const id = req.userId
      const user = await User.findById(id)

      if (user.isAdmin !== true) {
        return res.status(400).json({ message: "User is not Admin" })
      }

      await OrderModel.findByIdAndDelete(orderId)

      return res.status(200).json()

    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: 'Error in delete order' })
    }

  }
  // state ------------------------------------------------------
}

module.exports = new OrderCrtl()
