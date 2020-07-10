import dynamic from 'next/dynamic';
import escapeHtml from 'escape-html'
import { Text } from 'slate'
import Layout from '../../components/Layout.js';
import { getArticle, listAllArticleIds } from '../../lib/articles.js';
import MailchimpSubscribe from '../../components/MailchimpSubscribe.js';

const DynamicCoral = dynamic(
  () => import("../../components/Coral.js"),
  { ssr: false }
);

const DynamicPico = dynamic(
  () => import("../../components/Pico.js"),
  { ssr: false }
);

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

export default function Article({ article }) {
  const serializedBody = article.body.map((node, i) => serialize(node, i));
  return (
    <Layout>
      <article>
        <h1 className="title is-size-1">{article.headline}</h1>
        <div className="content">
          {serializedBody}
        </div>
        <div className="subscribe">
          <MailchimpSubscribe />
        </div>
        <DynamicPico article={true} post_type="post" />
        <div className="comments">
          <DynamicCoral storyURL={`/articles/${article.id}`} />
        </div>
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
