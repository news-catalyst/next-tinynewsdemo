import Coral from '../plugins/Coral.js';

export default function Comments({ article, isAmp }) {
  return (
    <section className="section comments" key="comments">
      <div className="section__container">
        {isAmp ? (
          <div>Coral AMP</div>
        ) : (
          <Coral storyURL={`/articles/${article.id}`} />
        )}
      </div>
    </section>
  );
}
