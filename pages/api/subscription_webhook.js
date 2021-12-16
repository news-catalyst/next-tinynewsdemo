const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  let data;
  let eventType;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      console.log(signature, webhookSecret);
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log('Webhook signature verification failed');
      return res.status(400).send('Webhook signature verification failed');
    }

    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

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

  res.status(200).send('Webhook processed');
}
