import tw from 'twin.macro';
import Layout from './Layout';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from './common/CommonStyles.js';
import Staffer from './Staffer.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function StaffPage({
  authors,
  locale,
  sections,
  siteMetadata,
  isAmp,
}) {
  if (!authors) {
    return null;
  }

  const staffers = authors.filter((a) => a.staff);

  return (
    <Layout locale={locale} meta={siteMetadata} sections={sections}>
      <article className="container">
        <SectionContainer>
          <div key="title" className="section post__header">
            <ArticleTitle meta={siteMetadata}>Staff</ArticleTitle>
          </div>

          <div className="section post__body rich-text" key="body">
            <PostText>
              <PostTextContainer>
                {staffers.map((author) => (
                  <Staffer
                    key={`staff-author-${author.id}`}
                    author={author}
                    locale={locale}
                    isAmp={isAmp}
                  />
                ))}
              </PostTextContainer>
            </PostText>
          </div>
        </SectionContainer>
      </article>
    </Layout>
  );
}
