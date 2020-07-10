import Layout from '../../components/Layout.js';
import { getArticle, listAllArticleIds } from '../../lib/articles.js';
import Coral from "../../components/Coral.js";
import MailchimpSubscribe from '../../components/MailchimpSubscribe.js';
import EmbedNode from '../../components/EmbedNode.js';
import ImageNode from '../../components/ImageNode.js';
import ListNode from '../../components/ListNode.js';
import TextNode from '../../components/TextNode.js';


const serialize = (node, i) => {
  console.log(node.type);
  switch (node.type) {
    case 'list':
      return (<ListNode node={node} />)
    case 'text':
      return (<TextNode node={node} />)
    case 'paragraph':
      return (<TextNode node={node} />)
    case 'image':
      return (<ImageNode node={node} />)
    default:
      return null
  }
}

export default function Article({ article }) {
  const meta = {
    title: `${article.headline} | Tiny News Demo`,
    description: "A Tiny News Collective production"
  }
  const serializedBody = article.body.map((node, i) => serialize(node, i));
  console.log(serializedBody);
  return (
    <Layout meta={meta}>
      <article>
        <h1 className="title is-size-1">{article.headline}</h1>
        <div className="content">
          {serializedBody}
        </div>
        <div className="subscribe">
          <MailchimpSubscribe />
        </div>
        <div className="comments">
          <Coral storyURL={`/articles/${article.id}`} />
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
