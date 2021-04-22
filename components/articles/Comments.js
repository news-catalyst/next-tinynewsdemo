import tw from 'twin.macro';
import Coral from '../plugins/Coral.js';

const CommentsSection = tw.section`mb-10`;
const CommentsContainer = tw.div`flex flex-col flex-nowrap items-center mx-auto max-w-7xl w-full`;

export default function Comments({ article, isAmp }) {
  return (
    <CommentsSection key="comments">
      <CommentsContainer>
        {isAmp ? (
          <div>Coral AMP</div>
        ) : (
          <Coral storyURL={`/articles/${article.id}`} />
        )}
      </CommentsContainer>
    </CommentsSection>
  );
}
