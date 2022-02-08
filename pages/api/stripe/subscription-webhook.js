import { buffer } from 'micro';
import Stripe from 'stripe';
import {
  tagLetterheadSubscriber,
  untagLetterheadSubscriber,
} from '../../../lib/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  stripeAccount: process.env.CONNECTED_STRIPE_ACCOUNT_ID,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function StripeWebhookHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let data;
  let eventType;
  let event;
  let customer;

  const buf = await buffer(req);
  const accountId = req.headers['stripe-account'];
  console.log('stripe-account header:', accountId);
  const sig = req.headers['stripe-signature'];

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  data = event.data;
  eventType = event.type;

  const subscription = data.object;
  const status = subscription.status;
  let customerId = subscription.customer;

  switch (eventType) {
    case 'checkout.session.completed':
      if (subscription.payment_status === 'paid') {
        console.log(eventType, 'payment status:', subscription.payment_status);
      }
      break;

    case 'checkout.session.async_payment_succeeded':
    case 'invoice.payment_succeeded':
    case 'payment_intent.succeeded':
      if (!customerId) {
        console.error(
          'Error the ' +
            eventType +
            ' response from Stripe was missing a customerId:',
          subscription
        );
        return res
          .status(400)
          .send(
            'Our handling of the payment_intent.succeeded event failed due to missing customerId'
          );
      }

      // look up customer details in Stripe
      customer = await stripe.customers.retrieve(customerId);
      if (customer && customer.email) {
        // attempt to tag the customer in letterhead as a donor
        try {
          let letterheadResult = await tagLetterheadSubscriber(
            customer.email,
            'donor'
          );
          if (
            letterheadResult &&
            letterheadResult.status &&
            letterheadResult.status === 'success'
          ) {
            console.log('Tagged the customer in letterhead as a donor');
          } else {
            console.error(
              'Error tagging subscriber as a donor in Letterhead:',
              letterheadResult
            );
          }
        } catch (e) {
          console.error(
            'Error tagging subscriber as a donor in Letterhead:',
            e
          );
        }
      } else {
        console.error(
          `Error retrieving customer details from stripe for customer_id ${customerId}`,
          customer
        );
      }
      break;

    // https://stripe.com/docs/billing/subscriptions/webhooks#payment-failures
    case 'checkout.session.async_payment_failed':
    case 'invoice.payment_failed':
    case 'payment_intent.payment_failed':
      console.error(
        `${eventType} payment failed, subscription status is ${status}.`
      );

      if (!customerId) {
        console.error(
          'Error the response from Stripe was missing a customerId:',
          subscription
        );
        return res
          .status(400)
          .send(
            'Our handling of the payment_intent.payment_failed event failed due to missing customerId'
          );
      }

      // look up customer details in Stripe
      customer = await stripe.customers.retrieve(customerId);

      if (customer && customer.email) {
        // attempt to untag the customer in letterhead as a donor
        try {
          let letterheadResult = await untagLetterheadSubscriber(
            customer.email,
            'donor'
          );
          console.log(
            'Result from letterhead remove tag request:',
            letterheadResult
          );
        } catch (e) {
          console.error(
            "Error removing 'donor' tag from the Letterhead subscriber record:",
            e
          );
        }
      } else {
        console.error(
          `Error retrieving customer details from stripe for customer_id ${customerId}`,
          customer
        );
      }
      break;
    default:
      // Unexpected event type
      console.error(`Unhandled event type ${eventType}.`);
  }

  res.json({ received: true });
}
