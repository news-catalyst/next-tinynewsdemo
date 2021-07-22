import tw from 'twin.macro';

const Footer = tw.footer`flex items-center justify-center bg-gray-200 h-40 text-xl uppercase`;

const FooterHoverUnderline = tw.a`no-underline md:hover:underline`;

const FooterLinksDiv = tw.div`mt-2 space-x-6 text-center`;

const FooterLink = tw.p`inline text-black text-base`;

const FooterCopyright = tw.div`text-xs mt-5 text-center`;

export default function GlobalFooter(props) {
  let title;
  let bylineLink;
  let byline;
  if (props.metadata) {
    title = props.metadata['footerTitle'];
    bylineLink = props.metadata['footerBylineLink'];
    byline = props.metadata['footerBylineName'];
  }
  return (
    <Footer>
      <div>
        <div>
          <p>
            <strong>{title}</strong> by{' '}
            <FooterHoverUnderline href={bylineLink}>
              {byline}
            </FooterHoverUnderline>
            .
          </p>
          <FooterLinksDiv>
            <FooterLink>
              <FooterHoverUnderline href="./about">about</FooterHoverUnderline>{' '}
            </FooterLink>
            <FooterLink>
              <FooterHoverUnderline href="https://store.tryletterhead.com/catalyst-test">
                advertising
              </FooterHoverUnderline>
            </FooterLink>
            <FooterLink>
              <FooterHoverUnderline href="./donate">
                donate
              </FooterHoverUnderline>{' '}
            </FooterLink>
          </FooterLinksDiv>
        </div>
        <FooterCopyright>
          <p> copyright {props.metadata.footerTitle}</p>
          <p>
            this project is part of the{' '}
            <FooterHoverUnderline href="https://tinynewsco.org">
              tiny news collective
            </FooterHoverUnderline>
            .
          </p>
        </FooterCopyright>
      </div>
    </Footer>
  );
}
