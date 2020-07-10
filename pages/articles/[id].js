import escapeHtml from 'escape-html'
import { Text } from 'slate'
import Layout from '../../components/Layout.js';
import Link from "next/Link";
import _ from 'lodash';
import ArticleNav from '../../components/ArticleNav.js';
import ArticleFooter from "../../components/ArticleFooter.js";
import ImageWithTextAd from "../../components/ImageWithTextAd.js";
import SignUp from "../../components/SignUp.js";
import { getArticle, listAllArticleIds } from '../../lib/articles.js';

const serialize = (node, i) => {
  if (Text.isText(node)) {
    return escapeHtml(node.text);
  }

  const children = node.children.map(n => serialize(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return (<p key={i}>{children}</p>)
    default:
      return children
  }
}

let siteMetadata = {"title": "Tiny News Collective", "shortName": "Tiny News", "description": "A local news site", "labels": {"topics": "Topics"}, "nav": {"topics": "All Topics", "cms": "tinycms"}, "search": "Search", "footerTitle": "tinynewsco.org", "footerBylineLink": "https://newscatalyst.org/", "footerBylineName": "News Catalyst", "subscribe": {"subtitle": "Get the latest news about the tiny news collective in your inbox."}};
let tags = ["Coronavirus", "Police Violence", "2020 Election"];
let sections = [{"label": "News", "link": "/news"}, {"label": "Features", "link": "/features"}, {"label": "Pandemic", "link": "/pandemic"}];

export default function Article({ article }) {
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
    <div id="article-container">
        <ArticleNav metadata={siteMetadata} sections={sections} />
        <Layout>
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
                <ImageWithTextAd ad={{
                  brand: "test",
                  image: {
                    url: "https://placehold.it/300x300",
                    alt: "Alt text"
                  },
                  header: "test header",
                  body: "This is the body text of an advertisement.",
                  call: "Call to action",
                  url: "https://www.w3schools.com/"
                }} />
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
              <SignUp/>
            </div>
          </section>
        </Layout>
        <ArticleFooter metadata={siteMetadata} />
    </div>
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
