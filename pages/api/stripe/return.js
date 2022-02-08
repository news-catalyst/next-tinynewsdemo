export default async function StripeReturnHandler(req, res) {
  console.log('Stripe return request body:', JSON.stringify(req.body));
  return res
    .status(200)
    .json({ message: 'return handler', body: JSON.stringify(req.body) });
}
