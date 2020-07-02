import Link from 'next/link';
import { listAllArticles } from '../lib/articles.js';
import Layout from '../components/Layout.js';

export default function Home({ articles }) {
  return (
    <Layout>
      <div className="container">
        <h2 class="title is-size-2">Articles</h2>
        {articles.map((article) => (
          <div className="article">
            <h3 className="title is-size-3">
              <Link href="/articles/[id]/" as={`/articles/${article.id}`}>
                <a>{article.headline}</a>
              </Link>
            </h3>
            <p class="subtitle">by {article.byline}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const articles = await listAllArticles();

  return {
    props: {
      articles,
    },
  };
}
