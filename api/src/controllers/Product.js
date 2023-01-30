const ProductModel = require('../models/Product')
const UserModel = require('../models/User')
const yup = require('yup')

class ProductCtrl {
  // Story --------------------------------------------------------
  async story(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      desc: yup.string().required(),
      img: yup.string().required(),
      categories: yup.array().required(),
      size: yup.array().required(),
      color: yup.array().required(),
      price: yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Verifique os dados Informados!' })
    }
    const isAdmin = await UserModel.findById(req.userId)
    if (isAdmin.isAdmin !== true) {
      return res.status(400).json({ message: 'Required is Admin' })
    }
    try {
      const product = await ProductModel.create(req.body)

      return res.status(201).json(product)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }

  }
  // Find --------------------------------------------------------
  async findOne(req, res) {
    try {
      const { productId } = req.params
      const product = await ProductModel.findById(productId)

      return res.status(200).json(product)
    } catch (err) {
      return res.status(400).json({ message: err.message })
    }

  }
  // findCategory ------------------------------------------------
  async findCategory(req, res) {
    console.log(req.query)
    try {
      const qNew = req.query.new
      const qCategory = req.query.category

      let products;

      if (qNew) {
        products = await ProductModel.find().sort({ createAt: -1 }).limit(5)
      } else if (qCategory) {
        products = await ProductModel.find({
          categories: {
            $in: [qCategory]
          }
        })
      } else {
        products = await ProductModel.find()
      }

      return res.status(200).json(products)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }

  // FindAll ------------------------------------------------------
  async findAll(req, res) {
    try {
      const products = await ProductModel.find()
      return res.status(200).json(products)
    } catch (err) {
      return res.status(400).json({ message: err.message })
    }

  }
  // update ------------------------------------------------------
  async update(req, res) {

    try {
      const { productId } = req.params

      const productUpdate = await ProductModel.findByIdAndUpdate(productId, {
        $set: req.body
      }, { new: true })

      return res.status(200).json(productUpdate)

    } catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }
  // Delete ------------------------------------------------------
  async delete(req, res) {
    try {
      const { productId } = req.params
      const id = req.userId
      const userIsAdmin = await UserModel.findById(id)
      if (userIsAdmin.isAdmin !== true) {
        return res.status(401).json({ message: 'User is not Admin' })
      }

      await ProductModel.findByIdAndDelete(productId)
      return res.status(200).json()
    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: 'Error in delete Product' })
    }

  }
  // state ------------------------------------------------------
}


module.exports = new ProductCtrl()
