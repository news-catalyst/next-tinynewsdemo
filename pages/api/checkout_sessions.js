const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log(req.body);
  const paymentType =
    req.body.paymentType === 'monthly' ? 'subscription' : 'payment';
  console.log(paymentType);
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: req.body.stripeId,
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        mode: paymentType,
        success_url: `${req.headers.origin}/join/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/join/?canceled=true`,
      });

      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
