require('dotenv').config({ path: '.env.local' });
import TinyStripe from '../../../lib/tiny_stripe';

const setupOaklyn = async () => {
  console.log('Setting up Stripe for Oaklyn...');

  const stripe = new TinyStripe(process.env.CONNECTED_STRIPE_ACCOUNT_ID);
  console.log('stripe:', stripe);
  stripe.listProducts.then((result) => console.log('result:', result));
  // const result = await stripe.listProducts();
  // console.log('result:', result);

  // const products = await stripe.products.list();
  // if (products && products.data && products.data[0]) {
  //   let product = products.data[0];
  //   console.log('Found an existing product: ', product);
  //   const prices = await stripe.prices.list({
  //     product: product.id,
  //   });
  //   if (prices && prices.data) {
  //     for (var p = 0; p < prices.data.length; p++) {
  //       let price = prices.data[p];
  //       console.log(
  //         `Price ID '${price.id}': ${price.unit_amount} ${price.active} (${
  //           price.currency
  //         }) - ${price.recurring ? price.recurring.interval : 'one-time'}`
  //       );
  //     }
  //   } else {
  //     console.log('No existing prices for product #' + product.id);
  //   }
  // } else {
  //   console.log('No existing products');

  //   try {
  //     const product = await stripe.products.create({
  //       name: 'Payment Options',
  //     });
  //     console.log('created product:', JSON.stringify(product));
  //     let options = [
  //       { amount: 500, paymentType: 'monthly' },
  //       { amount: 1000, paymentType: 'one-time' },
  //       { amount: 2000, paymentType: 'monthly' },
  //     ];
  //     for (var x = 0; x < options.length; x++) {
  //       let stripePriceInfo = {
  //         unit_amount: options[x].amount,
  //         currency: 'usd',
  //         product: product.id,
  //       };
  //       if (options[x].paymentType === 'monthly') {
  //         stripePriceInfo['recurring'] = { interval: 'month' };
  //       }
  //       const price = await stripe.prices.create(stripePriceInfo);
  //       console.log('created price:', JSON.stringify(price));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // await stripe.accounts.del('acct_1KPYtXPj8Ag7NP9K');

  // const account = await stripe.accounts.create({
  //   type: 'standard',
  //   country: 'US',
  //   email: 'jacqui@newscatalyst.org',
  //   business_type: 'non_profit',
  //   company: {
  //     name: 'The Oaklyn Observer',
  //   },
  // });

  // console.log('Created stripe account:', JSON.stringify(account));

  // const accountLink = await stripe.accountLinks.create({
  //   // account: account.id,
  //   account: CONNECTED_STRIPE_ACCOUNT_ID,
  //   refresh_url: 'https://2d24-64-145-79-136.ngrok.io/api/stripe/reauth',
  //   return_url: 'https://2d24-64-145-79-136.ngrok.io/api/stripe/return',
  //   type: 'account_onboarding',
  // });
  // console.log('Created stripe account link:', JSON.stringify(accountLink));

  // https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-accept-payment
  // const paymentIntent = await stripe.paymentIntents.create(
  //   {
  //     payment_method_types: ['card'],
  //     amount: 1000,
  //     currency: 'usd',
  //     application_fee_amount: 0,
  //   },
  //   {
  //     stripeAccount: CONNECTED_STRIPE_ACCOUNT_ID,
  //   }
  // );

  // console.log('Setup payment intent:', JSON.stringify(paymentIntent));
  // listAccounts();
};

// async function listAccounts(lastAccountId) {
//   let accounts = await stripe.accounts.list({ starting_after: lastAccountId });
//   console.log(`Found ${accounts.data.length} accounts...`);
//   let theNewLastAccountId = accounts.data[accounts.data.length - 1];
//   for (var i = 0; i < accounts.data.length; i++) {
//     let account = accounts.data[i];
//     if (account.id !== process.env.CONNECTED_STRIPE_ACCOUNT_ID) {
//       const deleted = await stripe.accounts.del(account.id);
//       console.log(
//         'Deleted stripe account #' + account.id,
//         JSON.stringify(deleted)
//       );
//     }
//   }
//   if (accounts.has_more) {
//     listAccounts(theNewLastAccountId);
//   }
// }

setupOaklyn();
