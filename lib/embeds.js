import fetch from 'node-fetch';

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;

export async function getFacebookMarkup(link) {
  let fbApiUrl;
  if (/\/videos/.test(link)) {
    fbApiUrl =
      'https://graph.facebook.com/v12.0/oembed_video?omitscript=true&url=' +
      link;
  } else if (/\/posts/.test(link)) {
    fbApiUrl =
      'https://graph.facebook.com/v12.0/oembed_post?omitscript=true&url=' +
      link;
  } else {
    fbApiUrl =
      'https://graph.facebook.com/v12.0/oembed_page?omitscript=true&url=' +
      link;
  }

  const fbAccessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;

  const res = await fetch(fbApiUrl, {
    headers: {
      Authorization: `Bearer ${fbAccessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  // console.log('result from fetch:', res);

  const data = await res.json();
  // console.log('returning html:', data.html);
  return data.html;
}

export async function getInstagramReelMarkup(link) {
  let fbApiUrl = `https://graph.facebook.com/v13.0/instagram_oembed?omitscript=true&url=${link}`;
  const fbAccessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;

  const res = await fetch(fbApiUrl, {
    headers: {
      Authorization: `Bearer ${fbAccessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const data = await res.json();
  return data.html;
}
