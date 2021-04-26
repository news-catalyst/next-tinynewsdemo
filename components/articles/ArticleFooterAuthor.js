import Image from 'next/image';
import tw, { styled } from 'twin.macro';
import { renderAuthor } from '../../lib/utils';
import Typography from '../common/Typography';

const AuthorWrapper = styled.div(({ last }) => [
  tw`mr-6 mb-5 flex flex-row flex-nowrap items-center`,
  !last && tw`border-b border-gray-200`,
]);

const AuthorAvatar = tw.div`h-16 w-16 mb-5 overflow-hidden relative rounded-full`;
const AuthorMeta = styled.div(({ meta }) => ({
  ...tw`flex flex-col flex-nowrap flex-grow ml-3 pb-5`,
  fontFamily: Typography[meta.theme].ArticleMetaTop,
}));
const AuthorNameWrapper = tw.span`text-base`;
const AuthorContact = tw.a`text-xs font-normal cursor-pointer bg-no-repeat ml-2 pl-4`;

export default function ArticleFooterAuthor({
  author,
  isAmp,
  i,
  last,
  metadata,
}) {
  let authorPhoto = author.photoUrl;
  return (
    <AuthorWrapper last={last}>
      {authorPhoto && (
        <AuthorAvatar>
          <figure>
            <a className="content" href={`/authors/${author.slug}`}>
              {isAmp ? (
                <amp-img
                  width={82}
                  height={82}
                  src={authorPhoto}
                  alt="author"
                  layout="responsive"
                />
              ) : (
                <Image src={authorPhoto} width={82} height={82} alt="author" />
              )}
            </a>
          </figure>
        </AuthorAvatar>
      )}

      <AuthorMeta meta={metadata}>
        <div className="header">
          <AuthorNameWrapper>{renderAuthor(author, i)}</AuthorNameWrapper>
          <span className="contact">
            {author.twitter && (
              <AuthorContact
                href={`https://twitter.com/${author.twitter}`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 17 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.725 4.111v.402c0 4.32-3.28 9.242-9.143 9.242-1.888 0-3.578-.502-4.97-1.507h.796c1.49 0 2.981-.502 4.074-1.406-1.39 0-2.583-1.005-3.08-2.31.198 0 .397.1.596.1.298 0 .596 0 .894-.1C2.402 8.23 1.31 6.923 1.31 5.316c.397.2.894.402 1.49.402-.894-.603-1.49-1.608-1.49-2.713 0-.603.198-1.205.397-1.708a8.943 8.943 0 0 0 6.758 3.416c-.1-.2-.1-.502-.1-.703 0-1.808 1.491-3.315 3.28-3.315.894 0 1.789.401 2.385 1.004.696-.1 1.49-.402 2.087-.803-.199.803-.795 1.406-1.391 1.808.695-.1 1.292-.302 1.888-.502-.696.904-1.292 1.506-1.888 1.908' fill='%234099FF' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundPosition: 'left center',
                  backgroundSize: 'auto 0.75rem',
                }}
              >
                @{author.twitter}
              </AuthorContact>
            )}
          </span>
        </div>
        <p>{author.bio}</p>
      </AuthorMeta>
    </AuthorWrapper>
  );
}
