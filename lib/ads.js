export function getArticleAds() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  return fetch(`${process.env.LETTERHEAD_API_URL}?date=${today}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LETTERHEAD_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error(error));
}
