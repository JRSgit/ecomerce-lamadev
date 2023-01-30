const express = require("express")
const cors = require('cors')

const UserCtrl = require('../controllers/User')
const CartCtrl = require('../controllers/CartCtrl')
const OrderCtrl = require('../controllers/Order')
const ProductCtrl = require('../controllers/Product')
const StripeCtrl = require('../controllers/Stripe')

const router = express.Router()

const authAutenticate = require('../middleware/auth')

router.get("/products", cors({ origin: '*' }), ProductCtrl.findAll)
router.get("/income", OrderCtrl.income)
router.get("/orders", OrderCtrl.findAll)
router.get("/categories", ProductCtrl.findCategory)
router.get("/cart", CartCtrl.findAll)
router.get("/products/:productId", ProductCtrl.findOne)

router.get("/use", authAutenticate, UserCtrl.indexAll)
router.get("/stats", authAutenticate, UserCtrl.stats)
router.get("/auth", authAutenticate, UserCtrl.indexOne)

router.get("cart/:cartId", CartCtrl.find)
// CART ===============================
// ORDER ==================================
router.get("order/:orderId", OrderCtrl.find)
// PRODUCTS ===============================



// AUTH ===============================
router.post("/register", UserCtrl.story)
router.post("/auth/login", UserCtrl.login)








// STRIPE =======================================
router.post("/stripe", StripeCtrl.story)
router.post("/pay", StripeCtrl.indexPay)

// AUTH REQUIRED ===============================
//  order
router.use(authAutenticate)
router.post("/order", OrderCtrl.story)
router.put("order/:orderId", OrderCtrl.update)
router.delete("order/:orderId", OrderCtrl.delete)
//  product
router.post("/product", ProductCtrl.story)
router.put("product/:productId", ProductCtrl.update)
router.delete("product/:productId", ProductCtrl.delete)
// cart 
router.post("/cart", CartCtrl.story)
router.put("cart/:cartId", CartCtrl.update)
router.delete("cart/:cartId", CartCtrl.delete)
// user

router.put("/update", UserCtrl.update)
router.delete("/delete/:userId", UserCtrl.delete)


module.exports = router