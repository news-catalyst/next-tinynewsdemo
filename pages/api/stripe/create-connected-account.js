import { stripeCreateConnectedAccount } from '../../../lib/utils';

export default async function CreateConnectedAccount(req, res) {
  if (req.method === 'POST') {
    try {
      const result = await stripeCreateConnectedAccount({
        name: req.body.name,
        origin: req.headers.origin,
      });

      if (result.status === 'error') {
        console.error(
          'An error occurred creating the Stripe Connected Account:',
          result
        );
        return res.status(500).json({
          message: result.message,
          status: result.status,
          account: result.account,
          accountLink: result.accountLink,
        });
      }

      // update org's stripe ID in Hasura?
      res.json({
        status: 'success',
        message: 'Successfully created a connected account in Stripe!',
        redirectURL: result.redirectURL,
        account: result.account,
        accountLink: result.accountLink,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
