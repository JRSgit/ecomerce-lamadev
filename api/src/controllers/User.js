const UserModel = require('../models/User')
const yup = require('yup')
const bcrypt = require('bcrypt')
const generateToken = require('../config/auth')

class UserCtrl {
  // CREATE USER -----------------------------------------------------------
  async story(req, res) {
    const schema = yup.object().shape({
      username: yup.string().required().min(4),
      email: yup.string().email().required(),
      password: yup.string().required().min(6)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Verifique os dados Informados!' })
    }
    try {

      const user = await UserModel.create(req.body)

      if (!user) {
        return res.status(400).json({ message: 'Error in create new user!' })
      }
      const { _id, username, email, isAdmin } = user
      return res.status(201).json({
        _id,
        username,
        email,
        isAdmin
      })
    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: 'Error na criação do User' })
    }

  }
  // LOGIN--------------------------------------------------------------
  async login(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required()
    })
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Verifique os dados Informados!' })
    }

    const { email, password } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(400).json({ menssage: 'Email not found' })
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Password is Invalid' })
    }

    try {
      const token = await generateToken(user._id)

      return res.status(200).json({ user, token })

    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ message: 'Error in login' })
    }

  }
  // INDEXALL ---------------------------------------------------------------
  async indexAll(req, res) {
    try {
      const isAdmin = await UserModel.findById(req.userId)
      if (isAdmin.isAdmin !== true) {
        return res.status(400).json({ message: "You're not Admin, router is for Admin" })
      }
      const query = req.query.new
      const users = query
        ? await UserModel.find().sort({ _id: -1 }).limit(5)
        : await UserModel.find();

      return res.status(200).json(users)

    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ message: 'Users not found' })
    }
  }
  // indexOne ----------------------------------------------------
  async indexOne(req, res) {
    try {
      const query = req.query.user
      const user = query ? await UserModel.findById(query) : await UserModel.findById(req.userId)
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      return res.status(200).json(user)
    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: "Error in find user!" })
    }
  }

  // Stats ---------------------------------------------------------
  async stats(req, res) {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
      const data = await UserModel.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" }
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          }
        }
      ])

      return res.status(200).json(data)
    } catch (err) {

    }
  }
  // Update --------------------------------------------------------
  async update(req, res) {
    const schema = yup.object().shape({
      username: yup.string().min(4).required(),
      email: yup.string().email().required(),
      password: yup.string().min(6)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Verifique os dados Informados!' })
    }

    try {
      const id = req.userId
      const userUpdate = await UserModel.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true })

      return res.status(400).json(userUpdate)

    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: 'Update error' })
    }
  }
  // Delete --------------------------------------------------------
  async delete(req, res) {
    try {
      const { userId } = req.params
      const id = req.userId
      const userIsAdmin = await UserModel.findById(id)
      if (userIsAdmin.isAdmin !== true) {
        return res.status(401).json({ message: 'User is not Admin' })
      }

      await UserModel.findByIdAndDelete(userId)
      return res.status(200).json()
    } catch (err) {
      console.log(err.message)
      return res.status(400).json({ message: 'Error in delete user' })
    }
  }

  // -----------------------------//--------------------------------
}


module.exports = new UserCtrl()
