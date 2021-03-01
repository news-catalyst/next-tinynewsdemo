import { renderAuthor } from '../../lib/utils';

export default function ArticleFooterAuthor({ author, isAmp, i }) {
  let authorPhoto = author.photoUrl;
  return (
    <div className="post__author">
      <div className="post__author-avatar">
        {authorPhoto && (
          <figure>
            <a className="content" href={`/authors/${author.slug}`}>
              {isAmp ? (
                <amp-img
                  width={41}
                  height={41}
                  src={authorPhoto}
                  alt="author"
                  layout="responsive"
                />
              ) : (
                <img src={authorPhoto} />
              )}
            </a>
          </figure>
        )}
      </div>

      <div className="post__author-meta">
        <div className="header">
          <span className="name">{renderAuthor(author, i)}</span>
          <span className="contact">
            <a href={`https://twitter.com/${author.twitter}`}>
              @{author.twitter}
            </a>
          </span>
        </div>
        <p>{author.bio}</p>
      </div>
    </div>
  );
}
