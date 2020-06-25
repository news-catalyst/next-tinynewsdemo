import Head from 'next/head'
import { listAllArticles } from '../lib/articles.js';

export default function Home({ articles }) {
  console.log(articles);
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <h2>Articles</h2>
        {articles.listBasicArticles.data.map((article) => (
          <div className="article">
            <h3>{article.headline}</h3>
            <p>by {article.byline.fullName}</p>
          </div>
        ))}

      </main>

      <footer>
      </footer>
    </div>
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
