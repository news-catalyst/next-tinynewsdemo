export default async function StripeReturnHandler(req, res) {
  return res
    .status(200)
    .json({ message: 'return handler', body: JSON.stringify(req.body) });
}
