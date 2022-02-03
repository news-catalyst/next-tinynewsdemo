import { subscribeLetterhead } from '../../lib/utils';

export default async function Handler(req, res) {
  // values from https://github.com/news-catalyst/next-tinynewsdemo/issues/718

  const { email, name } = JSON.parse(req.body);

  try {
    let data = await subscribeLetterhead(email, name);
    return res.status(200).json({ message: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
