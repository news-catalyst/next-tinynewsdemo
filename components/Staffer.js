import tw from 'twin.macro';
import Image from 'next/image';
import { displayAuthorName, hasuraLocalizeText } from '../lib/utils';

const AuthorName = tw.h3`font-bold text-xl leading-tight mt-5 mb-4`;
const AuthorAvatar = tw.div`overflow-hidden relative w-full h-48 w-48 mr-4 md:float-left`;

export default function Staffer({ author, locale, isAmp }) {
  const name = displayAuthorName(author.first_names, author.last_name);
  const bio = hasuraLocalizeText(locale, author.author_translations, 'bio');
  const title = hasuraLocalizeText(locale, author.author_translations, 'title');

  return (
    <div className="author mb-4">
      {author.photoUrl && (
        <AuthorAvatar>
          <figure>
            {isAmp ? (
              <amp-img
                width={164}
                height={164}
                src={author.photoUrl}
                alt={name}
                layout="responsive"
              />
            ) : (
              <Image
                src={author.photoUrl}
                width={164}
                height={164}
                alt={name}
                layout="responsive"
              />
            )}
          </figure>
        </AuthorAvatar>
      )}
      <AuthorName>
        {name}
        {title ? ', ' : ''}
        {title}
      </AuthorName>
      <div dangerouslySetInnerHTML={{ __html: bio }} />
      <style jsx global>{`
        .rich-text p {
          margin-bottom: 1.25rem;
          font-size: 1.125rem;
          line-height: 1.625;
        }
        .rich-text a {
          color: black;
          border-bottom: 1px solid rgba(59, 130, 246);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
