import Link from 'next/link';
import { apdate, aptime } from 'journalize';
import EmbedNode from '../components/nodes/EmbedNode.js';
import ImageNode from '../components/nodes/ImageNode.js';
import ListNode from '../components/nodes/ListNode.js';
import TextNode from '../components/nodes/TextNode.js';
import ImageWithTextAd from '../components/ads/ImageWithTextAd.js';
import { format } from 'date-fns';
import Cookies from 'universal-cookie';

const ORG_SLUG = process.env.ORG_SLUG;
const HASURA_API_URL = process.env.HASURA_API_URL;

export async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  if (!params.hasOwnProperty('url')) {
    url = HASURA_API_URL;
  } else {
    url = params['url'];
  }
  if (!params.hasOwnProperty('orgSlug')) {
    orgSlug = ORG_SLUG;
  } else {
    orgSlug = params['orgSlug'];
  }
  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'TNC-Organization': orgSlug,
    },
    body: JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

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

export const renderAuthor = (author, i) => {
  // not sure how or why this is happening, but this function keeps getting called twice, once with i=0, again with i=undefined
  if (i === undefined) {
    return;
  }
  if (author.slug !== null && author.slug !== undefined) {
    return (
      <Link href={`/authors/${author.slug}`} key={`${author.slug}-${i}`}>
        <a className="is-link">{author.name}</a>
      </Link>
    );
  } else if (author !== null && author.id !== null) {
    return (
      <span className="author" key={`author-span-${author.id}-${i}`}>
        {author.name}
      </span>
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

export const trackMailChimpParams = (query) => {
  const cookies = new Cookies();

  let campaignId = query.mc_cid;
  let emailId = query.mc_eid;

  if (campaignId && emailId) {
    let cookieValue = {
      campaignId: campaignId,
      emailId: emailId,
    };
    cookies.set('nc_mct', JSON.stringify(cookieValue), {
      path: '/',
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    });
  }
};

export const renderDate = (isoDate, renderTime = true) => {
  let renderedDate;

  if (typeof isoDate === 'string') {
    isoDate = new Date(isoDate);
  }

  try {
    if (renderTime) {
      renderedDate = `${apdate(isoDate)} at ${aptime(isoDate)}`;
    } else {
      renderedDate = `${apdate(isoDate)}`;
    }
  } catch (e) {
    console.log('rendering date for', typeof isoDate, 'failed with:', e);
  }
  return renderedDate;
};

export const renderBody = (translations, ads, isAmp) => {
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
        renderedNode = <ListNode node={node} key={i} />;
        break;
      case 'text':
        renderedNode = <TextNode node={node} key={i} />;
        break;
      case 'paragraph':
        renderedNode = <TextNode node={node} key={i} />;
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

    // place an ad every n nodes until we run out of ads
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
export const validateAuthorName = (name) => {
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

  let isFake = regex.test(name);
  if (isFake) {
    return false;
  } else {
    return true;
  }
};
