import tw from 'twin.macro';

const Footer = tw.footer`flex items-center justify-center bg-gray-200 h-40 text-xl uppercase`;

const FooterHoverUnderline = tw.a`no-underline md:hover:underline`;

const FooterLinksDiv = tw.div`mt-2 space-x-6 text-center`;

const FooterLink = tw.p`inline text-black text-base`;

const FooterCopyright = tw.div`text-xs mt-5 text-center`;
const FooterTitle = tw.p`text-center`;

export default function GlobalFooter(props) {
  let title;
  let bylineLink;
  let byline;
  if (props.metadata) {
    title = props.metadata['siteName'];
    bylineLink = props.metadata['footerBylineLink'];
    byline = props.metadata['footerBylineName'];
  }
  return (
    <Footer>
      <div>
        <div>
          <FooterTitle>
            <strong>{title}</strong>
          </FooterTitle>
          <FooterLinksDiv>
            <FooterLink>
              <FooterHoverUnderline href="./about">about</FooterHoverUnderline>{' '}
            </FooterLink>
            {process.env.NEXT_PUBLIC_LETTERHEAD_ADVERTISING_STORE && (
              <FooterLink>
                <FooterHoverUnderline href="https://store.tryletterhead.com/catalyst-test">
                  advertising
                </FooterHoverUnderline>
              </FooterLink>
            )}
            {process.env.NEXT_PUBLIC_MONKEYPOD_URL && (
              <FooterLink>
                <FooterHoverUnderline href="./donate">
                  donate
                </FooterHoverUnderline>{' '}
              </FooterLink>
            )}
          </FooterLinksDiv>
        </div>
        <FooterCopyright>
          <p> copyright {title}</p>
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
