import Link from 'next/link';
import tw from 'twin.macro';

const ItemWrapper = tw.div`w-full md:w-1/2 lg:w-1/3 p-4`;
const Item = tw.div`w-full border border-gray-200 shadow-lg`;
const ItemImageContainer = tw.div`w-full h-48 bg-blue-500 mb-4`;
const ItemTextContainer = tw.div`w-full p-6 pt-0`;
const Hammer = tw.p`text-xs font-bold uppercase mb-2 text-gray-500`;
const ItemHeader = tw.h3`text-2xl font-bold leading-tight tracking-tight mb-4`;
const ItemDek = tw.p`text-base`;

export default function GridItem({ header, dek, hammer, article }) {
  return (
    <ItemWrapper>
      <Link
        href="/articles/[category]/[slug]"
        as={`/articles/${article.category.slug}/${article.slug}`}
      >
        <a>
          <Item
            style={{
              minHeight: '34rem',
            }}
          >
            <ItemImageContainer />
            <ItemTextContainer>
              <Hammer>{hammer}</Hammer>
              <ItemHeader>{header}</ItemHeader>
              <ItemDek>{dek}</ItemDek>
            </ItemTextContainer>
          </Item>
        </a>
      </Link>
    </ItemWrapper>
  );
}
