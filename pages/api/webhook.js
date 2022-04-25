import { getTestOrg } from '../../lib/settings';

export default async function Handler(req, res) {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(500).json({ message: 'Invalid request' });
  }

  const apiUrl = process.env.HASURA_API_URL;
  const { data, errors } = await getTestOrg({
    url: apiUrl,
  });
  if (errors) {
    return res
      .status(500)
      .json({ message: 'Error finding test org data', errors: errors });
  }

  if (!data.organizations[0]) {
    return res
      .status(500)
      .json({ message: 'Error finding test org data', data: data });
  }

  let testOrgID = data.organizations[0].id;

  return res.status(200).json({
    'X-Hasura-Role': 'organization',
    'X-Hasura-Organization-Id': testOrgID,
  });
}
