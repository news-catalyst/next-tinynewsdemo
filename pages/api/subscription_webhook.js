import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let data;
  let eventType;
  let event;

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.log('Webhook signature verification failed', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  data = event.data;
  eventType = event.type;

  let customer = data.object.customer_details;
  let amountSubtotal = data.object.amount_subtotal;
  let amountTotal = data.object.amount_total;
  let subscription = data.object;
  let status = subscription.status;

  switch (eventType) {
    case 'checkout.session.completed':
      // handle these with a spreadsheet?
      break;

    case 'invoice.paid':
      console.log(data);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;

    case 'invoice.payment_failed':
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${eventType}.`);
  }

  res.json({ received: true });
  // res.status(200).send('Webhook processed');
}
