export default async function StripeReauthHandler(req, res) {
  return res
    .status(200)
    .json({ message: 'reauth handler', body: JSON.stringify(req.body) });
}
