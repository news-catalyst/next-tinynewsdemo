import Link from 'next/link';
import tw from 'twin.macro';
import fetch from 'node-fetch';
import { apdate, aptime } from 'journalize';
import BlockquoteNode from '../components/nodes/BlockquoteNode.js';
import EmbedNode from '../components/nodes/EmbedNode.js';
import ImageNode from '../components/nodes/ImageNode.js';
import ListNode from '../components/nodes/ListNode.js';
import TextNode from '../components/nodes/TextNode.js';
import ImageWithTextAd from '../components/ads/ImageWithTextAd.js';
import { format } from 'date-fns';
import { utcToZonedTime, format as tzFormat } from 'date-fns-tz';
import AdPromotion from '../components/ads/AdPromotion.js';
import HorizontalRuleNode from '../components/nodes/HorizontalRuleNode.js';

const ORG_SLUG = process.env.ORG_SLUG;
const HASURA_API_URL = process.env.HASURA_API_URL;

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

export async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  let adminSecret;

  if (Object.prototype.hasOwnProperty.call(params, 'url')) {
    url = params['url'];
  } else {
    url = HASURA_API_URL;
  }

  if (Object.prototype.hasOwnProperty.call(params, 'adminSecret')) {
    adminSecret = params['adminSecret'];
  }

  if (Object.prototype.hasOwnProperty.call(params, 'orgSlug')) {
    orgSlug = params['orgSlug'];
  } else {
    orgSlug = ORG_SLUG;
  }

  let requestHeaders = {};

  if (!adminSecret) {
    requestHeaders = {
      'TNC-Organization': orgSlug,
    };
  } else {
    requestHeaders = {
      'x-hasura-admin-secret': adminSecret,
    };
  }

  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  let stringifiedData;
  try {
    stringifiedData = JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    });
  } catch (error) {
    console.error(error);
  }

  const result = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: stringifiedData,
  });

  return await result.json();
}

export const hasuraLocalizeText = (
  locale,
  translations,
  fieldName,
  fallback = true
) => {
  console.log(fallback, locale, fieldName, 'translations:', translations);
  // let text = 'NEEDS TRANSLATION'; // for now, default to this so it's obvious what's missing
  let matchingTranslation = translations.find((t) => t.locale_code === locale);
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
};

export const hasuraLocaliseText = (translations, fieldName) => {
  let text = 'NEEDS TRANSLATION'; // for now, default to this so it's obvious what's missing

  if (translations && translations.length > 0) {
    text = translations[0][fieldName];
  }

  return text;
};

export const localiseText = (locale, field) => {
  let localisedValue;
  let text = 'NEEDS TRANSLATION'; // for now, default to this so it's obvious what's missing

  if (field && field.values && typeof field.values === 'object') {
    localisedValue = field.values.find((item) => item.locale === locale.id);
    if (localisedValue) {
      text = localisedValue.value;
    }
  }

  return text;
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

export const renderBody = (translations, ads, isAmp, metadata) => {
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
        renderedNode = <ImageNode node={node} amp={isAmp} key={i} />;
        break;
      case 'embed':
        renderedNode = <EmbedNode node={node} amp={isAmp} key={i} />;
        break;
      default:
        renderedNode = null;
        break;
    }

    if (process.env.NEXT_PUBLIC_LETTERHEAD_ADVERTISING_STORE) {
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

  let articleContent = hasuraLocaliseText(translations, 'content');
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

// Implementation from https://gist.github.com/codeguy/6684588
// takes a regular string and returns a slug
export const slugify = (value) => {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  value = value.trim();
  value = value.toLowerCase();
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  value = value
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return value;
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
