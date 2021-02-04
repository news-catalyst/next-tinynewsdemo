import Link from 'next/link';
import { apdate, aptime } from 'journalize';
import EmbedNode from '../components/nodes/EmbedNode.js';
import ImageNode from '../components/nodes/ImageNode.js';
import ListNode from '../components/nodes/ListNode.js';
import TextNode from '../components/nodes/TextNode.js';
import ImageWithTextAd from '../components/ads/ImageWithTextAd.js';

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

  if (translations.length > 0) {
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
  // first cover a byline-only article
  if (!article.authors && article.byline) {
    return article.byline;
  }

  if (!article.authors) {
    return;
  }

  const authors = article.authors.map(renderAuthor);

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

export const renderDate = (isoDate, renderTime = true) => {
  const parsed = new Date(isoDate);

  let renderedDate;

  try {
    if (renderTime) {
      renderedDate = `${apdate(parsed)} at ${aptime(parsed)}`;
    } else {
      renderedDate = `${apdate(parsed)}`;
    }
  } catch (e) {
    console.log(e);
  }
  return renderedDate;
};

export const renderBody = (article, ads, isAmp) => {
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
          url: ad.callToActionUrl,
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

  if (article.content) {
    return article.content.map((node, i) => serialize(node, i));
  } else {
    return [];
  }
};
