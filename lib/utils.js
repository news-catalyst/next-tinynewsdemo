import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import { apdate, aptime } from 'journalize';
import BlockquoteNode from '../components/nodes/BlockquoteNode.js';
import EmbedNode from '../components/nodes/EmbedNode.js';
import ImageNode from '../components/nodes/ImageNode.js';
import ImageNodeWordPress from '../components/nodes/ImageNodeWordPress.js';
import ListNode from '../components/nodes/ListNode.js';
import TextNode from '../components/nodes/TextNode.js';
import ImageWithTextAd from '../components/ads/ImageWithTextAd.js';
import { format } from 'date-fns';
import { utcToZonedTime, format as tzFormat } from 'date-fns-tz';
import AdPromotion from '../components/ads/AdPromotion.js';
import HorizontalRuleNode from '../components/nodes/HorizontalRuleNode.js';

const ArticleAuthorLink = tw.a`font-bold cursor-pointer hover:underline`;
const ArticleAuthorSpan = tw.span`font-bold`;

export function generateArticleUrl(baseUrl, article) {
  let currentUrl = new URL(baseUrl);
  let relativeArticleUrl =
    '/articles/' + article.category.slug + '/' + article.slug;
  let canonicalUrl = new URL(relativeArticleUrl, currentUrl.origin);
  return canonicalUrl.toString();
}

export function generatePageUrl(baseUrl, page) {
  let currentUrl = new URL(baseUrl);
  let relativeUrl = '/static/' + page.slug;
  let canonicalUrl = new URL(relativeUrl, currentUrl.origin);
  return canonicalUrl.toString();
}

export function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

export const hasuraLocalizeText = (
  locale,
  translations,
  fieldName,
  fallback = true
) => {
  try {
    // console.log('translations: ', translations);
    // let text = 'NEEDS TRANSLATION'; // for now, default to this so it's obvious what's missing
    let matchingTranslation = translations.find(
      (t) => t.locale_code === locale
    );
    if (!matchingTranslation && fallback) {
      matchingTranslation = translations[0];
    }

    if (!matchingTranslation) {
      throw new Error(
        'No matching ' +
          locale +
          ' translation found for ' +
          fieldName +
          ' in ' +
          translations
      );
    }

    return matchingTranslation[fieldName];
  } catch (e) {
    console.error(fallback, locale, fieldName, translations, e);
    return null;
  }
};

export const displayAuthorName = (firstNames, lastName) => {
  return [firstNames, lastName].filter(Boolean).join(' ');
};

export const renderAuthor = (author, i) => {
  // not sure how or why this is happening, but this function keeps getting called twice, once with i=0, again with i=undefined
  if (i === undefined) {
    return;
  }
  if (author.slug !== null && author.slug !== undefined) {
    return (
      <Link
        href={`/authors/${author.slug}`}
        key={`${author.slug}-${i}`}
        passHref
      >
        <ArticleAuthorLink>
          {displayAuthorName(author.first_names, author.last_name)}
        </ArticleAuthorLink>
      </Link>
    );
  } else if (author !== null && author.id !== null) {
    return (
      <ArticleAuthorSpan key={`author-span-${author.id}-${i}`}>
        {displayAuthorName(author.first_names, author.last_name)}
      </ArticleAuthorSpan>
    );
  }
};

// solution that works with react elements from https://codepen.io/pascalpp/pen/MKRwjP
export const renderAuthors = (article) => {
  if (
    article.article_translations &&
    article.article_translations[0] &&
    article.article_translations[0].custom_byline
  ) {
    return article.article_translations[0].custom_byline;
  }

  if (!article.author_articles) {
    return;
  }

  var authors = [];
  article.author_articles.forEach(function (authorArticle, i) {
    authors.push(renderAuthor(authorArticle.author, i));
  });

  var output = [];
  authors.forEach(function (author, i) {
    // if list is more than one item and this is the last item, prefix with 'and '
    if (authors.length > 1 && i === authors.length - 1) output.push('and\xa0');
    // output the item
    output.push(author);
    // if list is more than 2 items, append a comma to all but the last item
    if (authors.length > 2 && i < authors.length - 1) output.push(',');
    // if list is more than 1 item, append a space to all but the last item
    if (authors.length > 1 && i < authors.length - 1) output.push('\xa0');
  });

  return output;
};

export const renderDate = (isoDate, timeZone, renderTime = true) => {
  let renderedDate;

  if (typeof isoDate === 'string') {
    isoDate = new Date(isoDate);
  }

  try {
    const convertedDate = utcToZonedTime(isoDate, timeZone);

    if (renderTime) {
      renderedDate = `${apdate(convertedDate)} at ${aptime(
        convertedDate
      )} ${tzFormat(convertedDate, 'zzz', { timeZone })}`;
    } else {
      renderedDate = `${apdate(convertedDate)}`;
    }
  } catch (e) {
    console.error('rendering date for', typeof isoDate, 'failed with:', e);
  }

  return renderedDate;
};

export const renderBody = (
  locale,
  translations,
  ads,
  isAmp,
  metadata,
  renderMainImage = false
) => {
  let adIndex = 0;
  const adPlacement = 5;
  let renderedMainImage = false;

  const renderAd = (ad) => {
    return (
      <ImageWithTextAd
        ad={{
          brand: ad.promoterDisplayName,
          image: {
            url: ad.promoterImage,
            alt: ad.promoterImageAlternativeText,
          },
          header: ad.heading,
          body: ad.blurb,
          call: ad.callToAction,
          url: ad.resolvedCallToActionUrl,
          pixel: ad.pixel,
        }}
        isAmp={isAmp}
      />
    );
  };

  const serialize = (node, i) => {
    // console.log(i, renderMainImage, 'node:', node);
    let renderedNode = null;
    switch (node.type) {
      case 'blockquote':
        renderedNode = (
          <BlockquoteNode node={node} key={i} metadata={metadata} />
        );
        break;
      case 'hr':
        renderedNode = <HorizontalRuleNode node={node} key={i} />;
        break;
      case 'list':
        renderedNode = <ListNode metadata={metadata} node={node} key={i} />;
        break;
      case 'text':
        renderedNode = <TextNode metadata={metadata} node={node} key={i} />;
        break;
      case 'paragraph':
        renderedNode = <TextNode metadata={metadata} node={node} key={i} />;
        break;
      case 'mainImage':
        if (renderMainImage && !renderedMainImage) {
          // console.log('rendering main image: ', node);
          renderedNode = <ImageNode node={node} amp={isAmp} key={i} />;
          renderedMainImage = true;
        }
        break;
      case 'image':
        // console.log('image node:', node);
        renderedNode = <ImageNode node={node} amp={isAmp} key={i} />;
        break;
      case 'embed':
        renderedNode = <EmbedNode node={node} amp={isAmp} key={i} />;
        break;
      default:
        renderedNode = null;
        break;
    }

    if (
      process.env.NEXT_PUBLIC_LETTERHEAD_ADVERTISING_STORE &&
      node.style !== 'FORMATTED_TEXT'
    ) {
      // place an ad every n nodes until we run out of ads
      if (
        i > 0 &&
        i % adPlacement === 0 &&
        ads &&
        ads.length === 0 &&
        adIndex === 0
      ) {
        adIndex = adIndex + 1;
        const adComponent = <AdPromotion metadata={metadata} />;

        if (node.style && node.style.includes('HEADING')) {
          return [adComponent, renderedNode];
          // don't place ads within specially formatted text blocks
        } else if (node.style !== 'FORMATTED_TEXT') {
          return [renderedNode, adComponent];
        }

        return (
          <>
            <AdPromotion metadata={metadata} />
          </>
        );
      }
    }

    if (i > 0 && i % adPlacement === 0 && ads && adIndex <= ads.length - 1) {
      const adComponent = renderAd(ads[adIndex]);
      adIndex++;

      // if this node is a heading, place the ad before the heading
      if (node.style && node.style.includes('HEADING')) {
        return [adComponent, renderedNode];
        // don't place ads within specially formatted text blocks
      } else if (node.style !== 'FORMATTED_TEXT') {
        return [renderedNode, adComponent];
      }
    } else {
      return renderedNode;
    }
  };

  let articleContent = hasuraLocalizeText(locale, translations, 'content');

  if (
    articleContent &&
    articleContent !== null &&
    typeof articleContent !== 'string'
  ) {
    return articleContent.map((node, i) => serialize(node, i));
  } else {
    return [];
  }
};

// letterhead newsletter content isn't localised, this is a slight variation of renderBody
export const renderNewsletterContent = (content, ads, isAmp, metadata) => {
  let adIndex = 0;
  const adPlacement = 5;

  const renderAd = (ad) => {
    return (
      <ImageWithTextAd
        ad={{
          brand: ad.promoterDisplayName,
          image: {
            url: ad.promoterImage,
            alt: ad.promoterImageAlternativeText,
          },
          header: ad.heading,
          body: ad.blurb,
          call: ad.callToAction,
          url: ad.resolvedCallToActionUrl,
          pixel: ad.pixel,
        }}
        isAmp={isAmp}
      />
    );
  };

  const serialize = (node, i) => {
    let renderedNode = null;
    switch (node.type) {
      case 'list':
        renderedNode = <ListNode metadata={metadata} node={node} key={i} />;
        break;
      case 'text':
        renderedNode = <TextNode metadata={metadata} node={node} key={i} />;
        break;
      case 'paragraph':
        renderedNode = <TextNode metadata={metadata} node={node} key={i} />;
        break;
      case 'image':
        renderedNode = <ImageNode node={node} amp={isAmp} key={i} />;
        break;
      case 'embed':
        renderedNode = <EmbedNode node={node} amp={isAmp} key={i} />;
        break;
      default:
        renderedNode = null;
        break;
    }

    if (!metadata.shortName === 'Tiny News Curriculum') {
      // place an ad every n nodes until we run out of ads
      if (i > 0 && i % adPlacement === 0 && ads.length === 0 && adIndex === 0) {
        adIndex = adIndex + 1;
        return (
          <>
            <AdPromotion metadata={metadata} />
          </>
        );
      }
    }

    if (i > 0 && i % adPlacement === 0 && adIndex <= ads.length - 1) {
      const adComponent = renderAd(ads[adIndex]);
      adIndex++;

      // if this node is a heading, place the ad before the heading
      if (node.style && node.style.includes('HEADING')) {
        return [adComponent, renderedNode];
      } else {
        return [renderedNode, adComponent];
      }
    } else {
      return renderedNode;
    }
  };

  if (content && content !== null && typeof content !== 'string') {
    return content.map((node, i) => serialize(node, i));
  } else {
    return [];
  }
};

export const renderBodyWordPress = (locale, translations, metadata) => {
  const serialize = (node, i) => {
    let renderedNode = null;
    switch (node.type) {
      case 'blockquote':
        renderedNode = (
          <BlockquoteNode node={node} key={i} metadata={metadata} />
        );
        break;
      case 'hr':
        renderedNode = <HorizontalRuleNode node={node} key={i} />;
        break;
      case 'list':
        renderedNode = <ListNode metadata={metadata} node={node} key={i} />;
        break;
      case 'text':
        renderedNode = <TextNode metadata={metadata} node={node} key={i} />;
        break;
      case 'paragraph':
        renderedNode = <TextNode metadata={metadata} node={node} key={i} />;
        break;
      case 'image':
        renderedNode = (
          <ImageNodeWordPress
            locale={locale}
            node={node}
            translations={translations}
            key={i}
          />
        );
        break;
      case 'embed':
        renderedNode = <EmbedNode node={node} amp={false} key={i} />;
        break;
      default:
        renderedNode = null;
        break;
    }

    return renderedNode;
  };

  let articleContent = hasuraLocalizeText(locale, translations, 'content');

  if (
    articleContent &&
    articleContent !== null &&
    typeof articleContent !== 'string'
  ) {
    return articleContent.map((node, i) => serialize(node, i));
  } else {
    return [];
  }
};

//
// analytics dashboard util functions
//

export const formatDate = (string) => {
  return format(
    new Date(
      string.substring(0, 4),
      string.substring(4, 6) - 1,
      string.substring(6, 8)
    ),
    'MMM. d, yyyy'
  );
};

export const transformToDate = (string) => {
  return new Date(
    string.substring(0, 4),
    string.substring(4, 6) - 1,
    string.substring(6, 8)
  );
};
export const validateAuthorName = (first_names, last_name) => {
  const fakeNames = [
    'Staff Reporter',
    'Staff Editor',
    'Reporter',
    'Editor',
    'Journalist',
    'Staff Writer',
    'Staff',
    'Editorial',
    'Staff Correspondent',
    'Correspondent',
    'Writer',
    'Commentator',
    'Investigative Journalist',
    'Investigative Reporter',
    'Columnist',
    'Staff Columnist',
    'Weekly Columnist',
  ];

  const regexPattern = '^(' + fakeNames.join('|') + ')$';
  const regex = new RegExp(regexPattern, 'i');

  const fullAuthorName = displayAuthorName(first_names, last_name);
  let isFake = regex.test(fullAuthorName);
  if (isFake) {
    return false;
  } else {
    return true;
  }
};

// taken from https://dev.to/isarisariver/how-to-determine-font-color-based-on-a-random-background-color-8ek
export const determineTextColor = (color) => {
  let red = parseInt(color.substring(1, 3), 16);
  let green = parseInt(color.substring(3, 5), 16);
  let blue = parseInt(color.substring(5, 7), 16);
  let brightness = red * 0.299 + green * 0.587 + blue * 0.114;

  return brightness > 180 ? 'black' : 'white';
};

export const parsePageViews = (queryResult, limit = 0) => {
  let pv = {};
  queryResult.forEach((row, i) => {
    if (limit > 0 && i >= limit) {
      return;
    }
    let label = row.dimensions[0];

    if (!/tinycms/.test(label)) {
      if (/\?/.test(label)) {
        label = label.split('?')[0];
      }
      if (/\/en-US\//.test(label)) {
        label = label.replace('/en-US', '');
      }
      let value = parseInt(row.metrics[0].values[0]);

      if (pv[label]) {
        pv[label] += value;
      } else {
        pv[label] = value;
      }
    }
  });
  return pv;
};

export const parseReadingDepth = (queryResult) => {
  let rd = {};
  queryResult.forEach((row) => {
    let articlePath = row.dimensions[3];
    let percentage = row.dimensions[1];

    if (!/tinycms/.test(articlePath)) {
      if (/\?/.test(articlePath)) {
        articlePath = articlePath.split('?')[0];
      }
      if (/\/en-US\//.test(articlePath)) {
        articlePath = articlePath.replace('/en-US', '');
      }
      let value = parseInt(row.metrics[0].values[0]);

      if (rd[articlePath] && rd[articlePath][percentage]) {
        rd[articlePath][percentage] += value;
      } else if (rd[articlePath]) {
        rd[articlePath][percentage] = value;
      } else {
        rd[articlePath] = {};
        rd[articlePath][percentage] = value;
      }
    }
  });
  return rd;
};

export const parseDonorViews = (queryResult, limit) => {
  let dv = {};
  queryResult.forEach((row, i) => {
    if (limit > 0 && i >= limit) {
      return;
    }
    let articlePath = row.dimensions[1];

    if (!/tinycms/.test(articlePath)) {
      if (/\?/.test(articlePath)) {
        articlePath = articlePath.split('?')[0];
      }
      if (/\/en-US\//.test(articlePath)) {
        articlePath = articlePath.replace('/en-US', '');
      }
      let value = parseInt(row.metrics[0].values[0]);

      if (dv[articlePath]) {
        dv[articlePath] += value;
      } else {
        dv[articlePath] = value;
      }
    }
  });
  return dv;
};

const letterheadChannelSubscriberStatusValues = {
  'Not Subscribed': 0,
  Subscribed: 1,
  Unsubscribed: 2,
  'Needs Verification': 4,
};

export async function subscribeLetterhead(email, name) {
  const apiURL = process.env.LETTERHEAD_API_URL;
  const apiKey = process.env.LETTERHEAD_API_KEY;
  const channelSlug = process.env.LETTERHEAD_CHANNEL_SLUG;
  const subscribeURL = apiURL + 'channels/' + channelSlug + '/subscribers';

  const response = await fetch(subscribeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      channelSubscriberStatus:
        letterheadChannelSubscriberStatusValues['Needs Verification'],
      email: email,
      name: name,
      optin: true,
    }),
  });

  const data = await response.json();
  return data;
}

export async function tagLetterheadSubscriber(email, tag) {
  const apiURL = process.env.LETTERHEAD_API_URL;
  const apiKey = process.env.LETTERHEAD_API_KEY;
  const channelSlug = process.env.LETTERHEAD_CHANNEL_SLUG;
  const tagURL = `${apiURL}channels/${channelSlug}/subscribers/tag/remove`;

  try {
    const tagResponse = await fetch(tagURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        tag: tag,
      }),
    });

    const data = await tagResponse.json();

    return { status: 'success', message: data };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: error };
  }
}

export async function untagLetterheadSubscriber(email, tag) {
  const apiURL = process.env.LETTERHEAD_API_URL;
  const apiKey = process.env.LETTERHEAD_API_KEY;
  const channelSlug = process.env.LETTERHEAD_CHANNEL_SLUG;
  const tagURL = `${apiURL}channels/${channelSlug}/subscribers/tag/remove`;

  try {
    const tagResponse = await fetch(tagURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        tag: tag,
      }),
    });

    const data = await tagResponse.json();

    return { status: 'success', message: data };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: error };
  }
}

export async function stripeCreateCheckoutSession(params) {
  try {
    const stripeAccountId = process.env.CONNECTED_STRIPE_ACCOUNT_ID;
    if (!stripeAccountId) {
      return {
        status: 'error',
        message: 'Missing required Stripe account id in .env.local',
        redirectURL: null,
      };
    }
    console.log('**Stripe Account**:', stripeAccountId);

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
      stripeAccount: stripeAccountId,
    });
    const session = await stripe.checkout.sessions.create(
      {
        line_items: [
          {
            price: params['stripeId'],
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        mode: params['paymentType'],
        success_url: `${params['origin']}/thank-you?success=true`,
        cancel_url: `${params['origin']}/thank-you?canceled=true`,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    return {
      status: 'success',
      message: 'Successfully created Stripe checkout session',
      // data: JSON.stringify(session),
      redirectURL: session.url,
    };
  } catch (err) {
    console.error(
      `Error creating Stripe (account#${process.env.CONNECTED_STRIPE_ACCOUNT_ID}) checkout session:`,
      err
    );
    return { status: 'error', message: err, redirectURL: null };
  }
}

export async function stripeCreateConnectedAccount(params) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'US',
      business_type: 'company',
      company: {
        name: params['name'],
      },
    });
    console.log('Created account in stripe:', account);

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${params['origin']}/api/stripe/reauth`,
      return_url: `${params['origin']}/tinycms/payment-options?success=true&stripe=true`,
      type: 'account_onboarding',
    });
    console.log('Created account link in stripe:', accountLink);

    return {
      status: 'success',
      message: 'Created connected account and link in Stripe',
      account: account,
      accountLink: accountLink,
      accountId: account.id,
      redirectURL: accountLink.url,
    };
  } catch (err) {
    return { status: 'error', message: err };
  }
}

export async function stripeCreatePaymentIntent(params) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
      stripeAccount: process.env.CONNECTED_STRIPE_ACCOUNT_ID,
    });
    const paymentIntent = await stripe.paymentIntents.create(
      {
        payment_method_types: params['payment_method_types'],
        amount: params['amount'],
        currency: params['currency'],
        application_fee_amount: params['application_fee_amount'],
      },
      {
        stripeAccount: CONNECTED_STRIPE_ACCOUNT_ID,
      }
    );
    return {
      status: 'success',
      message: 'Successfully created Stripe payment intent',
      data: paymentIntent,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (err) {
    console.error('Error creating Stripe payment intent:', err);
    return { status: 'error', message: err, clientSecret: null };
  }
}
