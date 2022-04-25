export default async function Handler(req, res) {
  return res.status(200).json({
    'X-Hasura-Role': 'organization',
    'X-Hasura-Organization-Id': '772',
  });
}
