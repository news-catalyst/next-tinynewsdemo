import { renderAuthor } from '../../lib/utils';

export default function ArticleFooterAuthor({ author, isAmp }) {
  console.log('author footer:', author);
  return (
    <div className="post__author">
      <div className="post__author-avatar">
        <figure>
          <a className="content" href="#">
            {isAmp ? (
              <amp-img
                width={41}
                height={41}
                src="4ab3c1806d4d17cc6670d111a4bbd8d7.jpg"
                alt="author"
                layout="responsive"
              />
            ) : (
              <img src="4ab3c1806d4d17cc6670d111a4bbd8d7.jpg" />
            )}
          </a>
        </figure>
      </div>
      <div className="post__author-meta">
        <div className="header">
          <span className="name">{renderAuthor(author)}</span>
          <span className="contact">
            <a href="#">@{author.twitter}</a>
          </span>
        </div>
        <p>{author.bio || 'This is a test bio'}</p>
      </div>
    </div>
  );
}
