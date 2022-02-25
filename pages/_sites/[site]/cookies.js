import tw from 'twin.macro';
import {
  hasuraGetSiteMetadata,
  generateAllDomainPaths,
} from '../../../lib/articles.js';
import Layout from '../../../components/Layout';
import { getPostBySlug, markdownToHtml } from '../../../lib/markdown';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../../../components/common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function Cookies({ siteMetadata, post, content }) {
  if (!post) {
    return null;
  }
  return (
    <Layout meta={siteMetadata} sections={{}}>
      <SectionContainer>
        <div key="title" className="section post__header">
          <ArticleTitle meta={siteMetadata}>{post.title}</ArticleTitle>
        </div>
        <div className="section post__body rich-text" key="body">
          <PostText>
            <PostTextContainer>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </PostTextContainer>
          </PostText>
        </div>
      </SectionContainer>
      <style jsx global>
        {`
          .rich-text p {
            margin-bottom: 1.25rem;
            font-size: 1.25rem;
            line-height: 1.625;
          }
          .rich-text a {
            color: black;
            cursor: pointer;
            border-bottom: 1px solid rgb(59, 130, 246);
          }
          .rich-text h2 {
            font-size: 1.875rem;
            font-weight: bold;
          }
        `}
      </style>
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: { slug: 'cookies' },
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;
  const locale = 'en-US';

  let siteMetadata = {};

  const { errors, data } = await hasuraGetSiteMetadata({
    url: apiUrl,
    site: site,
    localeCode: locale,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    const post = getPostBySlug('cookies', ['title', 'content']);
    if (!post) {
      return {
        notFound: true,
      };
    }
    const content = await markdownToHtml(post.content || '');

    return {
      props: {
        locale,
        siteMetadata,
        post,
        content,
      },
    };
  }
}
