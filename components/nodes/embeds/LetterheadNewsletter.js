import { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';

const NewsletterContainer = tw.div`flex mb-12 w-full mx-auto`;
const NewsletterMarkupContainer = tw.div`flex w-full mx-auto`;

export default function LetterheadNewsletter({ content }) {
  const [markup, setMarkup] = useState(null);

  useEffect(() => {
    if (content) {
      setMarkup(content);
    }
  }, []);

  return (
    <NewsletterContainer>
      <NewsletterMarkupContainer dangerouslySetInnerHTML={{ __html: markup }} />
    </NewsletterContainer>
  );
}
