const CartModel = require('../models/Cart')
const yup = require('yup')

class CartCrtl {
  // Story --------------------------------------------------------
  async story(req, res) {
    const schema = yup.object().shape({
      userId: yup.string().required(),
      productId: yup.string().required(),
      quantity: yup.number().required(),

    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Verifique os dados Informados!' })
    }
    // const isAdmin = await UserModel.findById(req.userId)
    // if (isAdmin.isAdmin !== true) {
    //   return res.status(400).json({ message: 'Required is Admin' })
    // }
    try {
      const cart = await CartModel.create(req.body)

      return res.status(201).json(cart)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }

  }
  // Find --------------------------------------------------------
  async find(req, res) {
    try {

      const cart = await CartModel.findById(req.userId)

      return res.status(200).json(cart)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }

  }
  // findCategory ------------------------------------------------
  // async findCategory(req, res) {
  //   try {
  //     const qNew = req.query.new
  //     const qCategory = req.query.category

  //     let carts;

  //     if (qNew) {
  //       carts = await CartModel.find().sort({ createAt: -1 }).limit(5)
  //     } else if (qCategory) {
  //       carts = await CartModel.find({
  //         categories: {
  //           $in: [qCategory]
  //         }
  //       })
  //     } else {
  //       carts = await CartModel.find()
  //     }

  //     return res.status(200).json(carts)

  //   } catch (err) {
  //     return res.status(400).json({ message: err.message })
  //   }
  // }

  // FindAll ------------------------------------------------------
  async findAll(req, res) {
    try {
      const carts = await CartModel.find()
      return res.status(200).json(carts)
    } catch (err) {
      return res.status(400).json({ message: err.message })
    }

  }
  // update ------------------------------------------------------
  async update(req, res) {

    try {
      const { cartId } = req.params

      const cartUpdate = await CartModel.findByIdAndUpdate(cartId, {
        $set: req.body
      }, { new: true })

      return res.status(200).json(cartUpdate)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }
  // Delete ------------------------------------------------------
  async delete(req, res) {
    try {
      const { cartId } = req.params
      const id = req.userId

      await CartModel.findByIdAndDelete(cartId)

      return res.status(200).json()

    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: 'Error in delete cart' })
    }

  }
  // state ------------------------------------------------------
}

module.exports = new CartCrtl()
