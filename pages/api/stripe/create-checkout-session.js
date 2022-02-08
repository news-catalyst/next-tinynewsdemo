import { stripeCreateCheckoutSession } from '../../../lib/utils';

export default async function CheckoutSessionHandler(req, res) {
  const paymentType =
    req.body.paymentType === 'monthly' ? 'subscription' : 'payment';

  if (req.method === 'POST') {
    try {
      const result = await stripeCreateCheckoutSession({
        stripeId: req.body.stripeId,
        origin: req.headers.origin,
        paymentType: paymentType,
      });

      if (result.status === 'error') {
        console.error(
          'An error occurred creating the Stripe checkout session:',
          result
        );
        return res.status(500).json({
          message: result.message,
          status: result.status,
          data: result.data,
        });
      }
      res.redirect(303, result.redirectURL);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
