import ArticleNav from './nav/ArticleNav.js';
import ArticleFooter from './nav/ArticleFooter.js';
import Coral from './plugins/Coral.js';
import MailchimpSubscribe from './plugins/MailchimpSubscribe.js';
import EmbedNode from './nodes/EmbedNode.js';
import ImageNode from './nodes/ImageNode.js';
import ListNode from './nodes/ListNode.js';
import TextNode from './nodes/TextNode.js';
import ImageWithTextAd from './ads/ImageWithTextAd.js';
import { useAmp } from 'next/amp';
import { parseISO } from 'date-fns';
import { siteMetadata } from '../lib/siteMetadata.js';
import Link from 'next/link';
import Layout from './Layout.js';
import { renderAuthors } from '../lib/utils.js';

export default function Article({ article, sections, tags }) {
  const mainImageNode = article.content.find(
    (node) => node.type === 'mainImage'
  );
  let mainImage = null;

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  siteMetadata.searchTitle = article.searchTitle;
  siteMetadata.searchDescription = article.searchDescription;
  siteMetadata.facebookTitle = article.facebookTitle;
  siteMetadata.facebookDescription = article.facebookDescription;
  siteMetadata.twitterTitle = article.twitterTitle;
  siteMetadata.twitterDescription = article.twitterDescription;
  siteMetadata.tags = tags;
  siteMetadata.firstPublishedOn = article.firstPublishedOn;
  siteMetadata.lastPublishedOn = article.lastPublishedOn;
  if (mainImage !== null) {
    siteMetadata.coverImage = mainImage.imageUrl;
  }

  const isAmp = useAmp();

  const ad_placement = 5;
  let adComponent = (
    <ImageWithTextAd
      ad={{
        brand: 'test',
        image: {
          url: 'https://placehold.it/300x300',
          alt: 'Alt text',
        },
        header: 'test header',
        body: 'This is the body text of an advertisement.',
        call: 'Call to action',
        url: 'https://www.w3schools.com/',
      }}
    />
  );

  const serialize = (node, i) => {
    if (i != ad_placement) {
      switch (node.type) {
        case 'list':
          return <ListNode node={node} key={i} />;
        case 'text':
          return <TextNode node={node} key={i} />;
        case 'paragraph':
          return <TextNode node={node} key={i} />;
        case 'image':
          return <ImageNode node={node} amp={isAmp} key={i} />;
        case 'embed':
          return <EmbedNode node={node} amp={isAmp} key={i} />;
        default:
          return null;
      }
    } else {
      switch (node.type) {
        case 'list':
          return [<ListNode node={node} key={i} />, adComponent];
        case 'text':
          return [<TextNode node={node} key={i} />, adComponent];
        case 'paragraph':
          return [<TextNode node={node} key={i} />, adComponent];
        case 'image':
          return [<ImageNode node={node} amp={isAmp} key={i} />, adComponent];
        case 'embed':
          return [<EmbedNode node={node} amp={isAmp} key={i} />, adComponent];
        default:
          return null;
      }
    }
  };

  const serializedBody = article.content.map((node, i) => serialize(node, i));

  let tagLinks;
  if (article.tags) {
    tagLinks = article.tags.map((tag, index) => (
      <Link href={`/tags/${tag.slug}`} key={`${tag.slug}-${index}`}>
        <a className="is-link tag">{tag.title}</a>
      </Link>
    ));
  }
  let authorLinks;
  if (article.authors) {
    authorLinks = renderAuthors(article.authors);
  } else if (article.byline !== undefined) {
    authorLinks = article.byline;
  }

  let firstPublishedOn = null;
  let lastPublishedOn = null;
  if (article.firstPublishedOn !== null) {
    var Dateline = require('dateline');
    let parsedDate = parseISO(article.firstPublishedOn);
    firstPublishedOn =
      Dateline(parsedDate).getAPDate() +
      ' at ' +
      Dateline(parsedDate).getAPTime();
    parsedDate = parseISO(article.lastPublishedOn);
    lastPublishedOn =
      Dateline(parsedDate).getAPDate() +
      ' at ' +
      Dateline(parsedDate).getAPTime();
  }

  return (
    <Layout meta={siteMetadata}>
      <ArticleNav metadata={siteMetadata} sections={sections} />
      <article>
        <section className="hero is-bold" key="title">
          <div className="hero-body">
            <div
              className={article.cover ? 'container head-margin' : 'container'}
            >
              <h2 className="subtitle">
                <Link
                  key={article.category.title}
                  href={`/${article.category.slug}`}
                >
                  {article.category.title}
                </Link>
              </h2>
              <h1 className="title is-size-1">{article.headline}</h1>
              <h2 className="subtitle" key="byline">
                By {authorLinks} |
                {firstPublishedOn !== null && ` Published ${firstPublishedOn}`}
              </h2>
              <h2 className="subtitle" key="last-updated">
                {lastPublishedOn !== null && `Last updated: ${lastPublishedOn}`}
              </h2>
            </div>
          </div>
        </section>
        {mainImage && isAmp && (
          <amp-img
            width={mainImage.width}
            height={mainImage.height}
            src={mainImage.imageUrl}
            alt={mainImage.imageAlt}
            layout="responsive"
          />
        )}

        {mainImage && !isAmp && (
          <img
            src={mainImage.imageUrl}
            alt={mainImage.imageAlt}
            className="image"
          />
        )}
        <section className="section" key="body">
          <div id="articleText" className="content">
            {serializedBody}
          </div>
        </section>
      </article>
      <aside>
        <section className="section" key="sidebar">
          <div className="align-content">
            {tagLinks && <p className="subtitle">Tags</p>}
            <div className="tags">{tagLinks}</div>
          </div>
        </section>
      </aside>
      <section className="section" key="plugins">
        <div className="align-content medium-margin-top">
          <h1 className="title media-left">
            {siteMetadata.subscribe.subtitle}
          </h1>
          <MailchimpSubscribe />
          <div className="comments">
            {isAmp ? (
              <div>Coral AMP</div>
            ) : (
              <Coral storyURL={`/articles/${article.id}`} />
            )}
          </div>
        </div>
      </section>
      <ArticleFooter metadata={siteMetadata} />
    </Layout>
  );
}
