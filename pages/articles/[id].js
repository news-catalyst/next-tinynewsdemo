import Layout from '../../components/Layout.js';
import Link from "next/Link";
import kebabCase from 'lodash/kebabCase';
import { getArticle, listAllArticleIds } from '../../lib/articles.js';
import ArticleNav from '../../components/nav/ArticleNav.js';
import ArticleFooter from "../../components/nav/ArticleFooter.js";
import ImageWithTextAd from "../../components/ads/ImageWithTextAd.js";
import Coral from "../../components/plugins/Coral.js";
import MailchimpSubscribe from '../../components/plugins/MailchimpSubscribe.js';
import EmbedNode from '../../components/nodes/EmbedNode.js';
import ImageNode from '../../components/nodes/ImageNode.js';
import ListNode from '../../components/nodes/ListNode.js';
import TextNode from '../../components/nodes/TextNode.js';
import { useAmp } from 'next/amp';

let siteMetadata = {"title": "Tiny News Collective", "shortName": "Tiny News", "description": "A local news site", "labels": {"topics": "Topics"}, "nav": {"topics": "All Topics", "cms": "tinycms"}, "search": "Search", "footerTitle": "tinynewsco.org", "footerBylineLink": "https://newscatalyst.org/", "footerBylineName": "News Catalyst", "subscribe": {"subtitle": "Get the latest news about the tiny news collective in your inbox."}};
let tags = ["Coronavirus", "Police Violence", "2020 Election"];
let sections = [{"label": "News", "link": "/news"}, {"label": "Features", "link": "/features"}, {"label": "Pandemic", "link": "/pandemic"}];

export const config = { amp: 'hybrid' }

export default function Article({ article }) {
  const isAmp = useAmp()

  const serialize = (node, i) => {
    switch (node.type) {
      case 'list':
        return (<ListNode node={node} />)
      case 'text':
        return (<TextNode node={node} />)
      case 'paragraph':
        return (<TextNode node={node} />)
      case 'image':
        return (<ImageNode node={node} amp={isAmp} />)
      default:
        return null
    }
  }

  const meta = {
    title: `${article.headline} | Tiny News Demo`,
    description: "A Tiny News Collective production"
  }
  const serializedBody = article.body.map((node, i) => serialize(node, i));

  let tagLinks;
  if (tags) {
    tagLinks = tags.map((tag, index) => (
      <Link href={`/topics/${kebabCase(tag)}`} key={`${tag}-${index}`}>
        <a className="is-link tag">
          {tag}
        </a>
      </Link>
    ))
  }

  return (
    <article id="article-container">
      <ArticleNav metadata={siteMetadata} sections={sections} />
      <Layout meta={siteMetadata}>
        <article>
          <section className="hero is-bold">
            <div className="hero-body">
              <div className={article.cover ? "container head-margin" : "container"}>
                <h1 className="title is-size-1">
                  {article.headline}
                </h1>
                <h2 className="subtitle">
                  By {article.byline}
                  {/* | Published {formatRelative(parsedDate, new Date())} */}
                </h2>
              </div>
            </div>
          </section>
          {article.cover &&
            <img src={article.cover.image} alt={article.cover.title} className="image" />
          }
          <section className="section">
            <div id="articleText" className="content">
              {serializedBody}
            </div>
          </section>
        </article>
        <aside>
          <section className="section">
            <div className="align-content">
              {tagLinks &&
                <p className="subtitle">Tags</p>
              }
              <div className="tags">
                {tagLinks}
              </div>
            </div>
          </section>
        </aside>
        <section className="section">
          <div className="align-content medium-margin-top">
            <h1 className="title media-left">{siteMetadata.subscribe.subtitle}</h1>
            <MailchimpSubscribe />
          </div>
        </section>
        <div className="comments">
          {isAmp ? (
              <div>Coral AMP</div>
            ) : (
              <Coral storyURL={`/articles/${article.id}`} />
            )
          }
        </div>
      </Layout>
      <ArticleFooter metadata={siteMetadata} />
    </article>
  )
}

export async function getStaticPaths() {
  const paths = await listAllArticleIds();
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const article = await getArticle(params.id);

  return {
    props: {
      article,
    }
  };
}
