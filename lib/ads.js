export function getArticleAds(params) {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  today = `${yyyy}-${mm}-${dd}`;

  return fetch(`${params['url']}promotions/?date=2022-06-02&api=true`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params['apiKey']}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error(error));
}
