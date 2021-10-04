import tw from 'twin.macro';
import Layout from './Layout';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from './common/CommonStyles.js';
import Staffer from './Staffer.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const AuthorName = tw.h3`font-bold text-xl leading-tight mt-5 mb-4`;
const AuthorAvatar = tw.div`overflow-hidden relative w-full rounded-full h-12 w-12 mr-2 float-left`;

export default function StaffPage({ sections, siteMetadata, authors, isAmp }) {
  const staffers = authors.filter((a) => a.staff);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <article className="container">
        <SectionContainer>
          <div key="title" className="section post__header">
            <ArticleTitle meta={siteMetadata}>Staff</ArticleTitle>
          </div>

          <div className="section post__body rich-text" key="body">
            <PostText>
              <PostTextContainer>
                {staffers.map((author) => (
                  <Staffer key={author} author={author} isAmp={isAmp} />
                ))}
              </PostTextContainer>
            </PostText>
          </div>
        </SectionContainer>
      </article>
    </Layout>
  );
}
