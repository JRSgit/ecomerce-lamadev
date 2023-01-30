const stripe = require('stripe')(process.env.STRIPE_KEY)


class Stripe {
  async story(req, res) {
    console.log(req.body)
    const { tokenId, amount, currency = 'BRL' } = req.body
    stripe.charges.create({
      source: tokenId,
      amount,
      currency
    }, (err, resp) => {
      if (err) {
        return res.status(400).json({ message: err.message })
      }
      return res.status(200).json(resp)
    })
  }
  // =============================================
  async indexPay(req, res) {
    const { createdS } = req.body
    console.log(createdS)
    try {
      // const paymentIntent = await stripe.charges.list(
      //   { limit: 3 }
      // )

      const charge = await stripe.charges.search({
        query: `created=${createdS}`,
      });
      console.log(charge)
      res.status(200).json(charge)

    } catch (err) {
      console.log(err.message);
    }

  }
}

module.exports = new Stripe()


// To create a requires_capture PaymentIntent, see our guide at: https://stripe.com/docs/payments/capture-later
