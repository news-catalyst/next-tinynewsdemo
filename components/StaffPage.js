import tw from 'twin.macro';
import Image from 'next/image';
import { displayAuthorName, hasuraLocaliseText } from '../lib/utils';
import Layout from './Layout';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  Paragraph,
  H2,
  H3,
} from './common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const AuthorName = tw.h3`font-bold text-xl leading-tight mt-5 mb-4`;
const AuthorAvatar = tw.div`overflow-hidden relative w-full rounded-full h-12 w-12 mr-2 float-left`;

export default function StaffPage({ sections, siteMetadata, authors, isAmp }) {
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
                {authors.map((author) => (
                  <div className="author mb-4" key={author.last_name}>
                    {author.photoUrl && (
                      <AuthorAvatar>
                        <figure>
                          <a className="content" href="#">
                            {isAmp ? (
                              <amp-img
                                width={82}
                                height={82}
                                src={author.photoUrl}
                                alt="author"
                                layout="responsive"
                              />
                            ) : (
                              <Image
                                src={author.photoUrl}
                                width={82}
                                height={82}
                                alt="author"
                              />
                            )}
                          </a>
                        </figure>
                      </AuthorAvatar>
                    )}
                    <AuthorName>
                      {displayAuthorName(author.first_names, author.last_name)},{' '}
                      {hasuraLocaliseText(author.author_translations, 'title')}
                    </AuthorName>
                    <Paragraph>
                      {hasuraLocaliseText(author.author_translations, 'bio')}
                    </Paragraph>
                  </div>
                ))}
              </PostTextContainer>
            </PostText>
          </div>
        </SectionContainer>
      </article>
    </Layout>
  );
}
