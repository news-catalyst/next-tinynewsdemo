import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Join() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      console.log('Success!');
    }

    if (query.get('canceled')) {
      console.log('Canceled :(');
    }
  }, []);

  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
    </form>
  );
}
