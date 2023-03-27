export async function getArticleAds(params) {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayQueryParam = `${yyyy}-${mm}-${dd}`;

  const letterheadApiKey = params['apiKey'];
  if (!letterheadApiKey) {
    console.log('Valid letterhead API key not provided. Cannot fetch ads.');
    return;
  }

  try {
    const response = await fetch(
      `${params['url']}promotions/?date=${todayQueryParam}&api=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${letterheadApiKey}`,
        },
      }
    );
    if (response.status !== 200) {
      console.error(
        `Failed to retrieve ads from letterhead for ${todayQueryParam}`
      );
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
