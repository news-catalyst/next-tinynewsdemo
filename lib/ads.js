export function getArticleAds() {
  return fetch(process.env.LETTERHEAD_API_URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LETTERHEAD_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const imageAds = data.filter((d) => d.adTypeId === 164);
      return imageAds;
    });
}
