import Layout from '../../components/Layout.js';
import Link from "next/Link";
import _ from 'lodash';
import ArticleNav from '../../components/ArticleNav.js';
import ArticleFooter from "../../components/ArticleFooter.js";
import ImageWithTextAd from "../../components/ImageWithTextAd.js";
import SignUp from "../../components/SignUp.js";
import { getArticle, listAllArticleIds } from '../../lib/articles.js';
import Coral from "../../components/Coral.js";
import MailchimpSubscribe from '../../components/MailchimpSubscribe.js';
import EmbedNode from '../../components/EmbedNode.js';
import ImageNode from '../../components/ImageNode.js';
import ListNode from '../../components/ListNode.js';
import TextNode from '../../components/TextNode.js';

const ad_placement = 6;
let ad = <ImageWithTextAd ad={{
  brand: "test",
  image: {
    url: "https://placehold.it/300x300",
    alt: "Alt text"
  },
  header: "test header",
  body: "This is the body text of an advertisement.",
  call: "Call to action",
  url: "https://www.w3schools.com/"
}} />;

const serialize = (node, i) => {
  if (i != ad_placement){
    switch (node.type) {
      case 'list':
        return (<ListNode node={node} />);
      case 'text':
        return (<TextNode node={node} />);
      case 'paragraph':
        return (<TextNode node={node} />);
      case 'image':
        return (<ImageNode node={node} />);
      default:
        return null;
    }
  }
  else {
    switch (node.type) {
      case 'list':
        return [<ListNode node={node} />, ad];
      case 'text':
        return [<TextNode node={node} />, ad];
      case 'paragraph':
        return [<TextNode node={node} />, ad];
      case 'image':
        return [<ImageNode node={node} />, ad];
      default:
        return null;
    }
  }
}

let siteMetadata = {"title": "Tiny News Collective", "shortName": "Tiny News", "description": "A local news site", "labels": {"topics": "Topics"}, "nav": {"topics": "All Topics", "cms": "tinycms"}, "search": "Search", "footerTitle": "tinynewsco.org", "footerBylineLink": "https://newscatalyst.org/", "footerBylineName": "News Catalyst", "subscribe": {"subtitle": "Get the latest news about the tiny news collective in your inbox."}};
let tags = ["Coronavirus", "Police Violence", "2020 Election"];
let sections = [{"label": "News", "link": "/news"}, {"label": "Features", "link": "/features"}, {"label": "Pandemic", "link": "/pandemic"}];

export default function Article({ article }) {
  const meta = {
    title: `${article.headline} | Tiny News Demo`,
    description: "A Tiny News Collective production"
  }
  const serializedBody = article.body.map((node, i) => serialize(node, i));

  let tagLinks;
  if (tags) {
    tagLinks = tags.map((tag, index) => (
      <Link href={`/topics/${_.kebabCase(tag)}`} key={`${tag}-${index}`}>
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
            <MailchimpSubscribe/>
          </div>
        </section>
        <div className="comments">
          <Coral storyURL={`/articles/${article.id}`} />
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
