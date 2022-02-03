import { buffer } from 'micro';
import Stripe from 'stripe';
import {
  tagLetterheadSubscriber,
  untagLetterheadSubscriber,
} from '../../lib/utils';

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
  let customer;

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

  const subscription = data.object;
  const status = subscription.status;
  let customerId = subscription.customer;

  console.log(eventType, status);

  switch (eventType) {
    case 'payment_intent.succeeded':
      if (!customerId) {
        console.error(
          'Error the response from Stripe was missing a customerId:',
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
        console.log(eventType, 'customer:', customer);

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
        console.log('customer:', customer);

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
  // res.status(200).send('Webhook processed');
}

/* Triggering a successful subscription event using the stripe cli results in the following events received on this webhook:
  >> $ stripe trigger invoice.payment_succeeded
payment_method.attached
customer.source.created
customer.created
customer.updated
invoiceitem.created 
invoice.created draft
invoiceitem.updated
charge.succeeded succeeded
invoice.updated paid 
invoice.paid paid 
invoice.payment_succeeded paid 
*/

/* Triggering a payment failed event:

Unhandled event type payment_method.attached.
Unhandled event type customer.source.created.
Unhandled event type customer.created.
Unhandled event type invoiceitem.created.
Unhandled event type customer.updated.
Unhandled event type invoice.created.
Unhandled event type charge.failed.
Unhandled event type invoice.updated.
Payment failed, subscription status is open.
Unhandled event type customer.updated.
invoice.payment_failed (?)
*/
