import escapeHtml from 'escape-html'
import { Text } from 'slate'
import Layout from '../../components/Layout.js';
import { getArticle, listAllArticleIds } from '../../lib/articles.js';

const serialize = node => {
  if (Text.isText(node)) {
    return escapeHtml(node.text);
  }

  const children = node.children.map(n => serialize(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return (<p>{children}</p>)
    default:
      return children
  }
}

export default function Article({ article }) {
  const serializedBody = article.body.map(node => serialize(node));
  return (
    <Layout>
      <article>
        <h1>{article.headline}</h1>
        {serializedBody}
      </article>
    </Layout>
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
