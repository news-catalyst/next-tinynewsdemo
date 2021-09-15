import Link from 'next/link';
import tw from 'twin.macro';

const Footer = tw.footer`flex items-center justify-center bg-gray-200 h-40 text-xl uppercase`;

const FooterHoverUnderline = tw.a`no-underline md:hover:underline`;

const FooterLinksDiv = tw.div`mt-2 space-x-6 text-center`;
const FooterLink = tw.p`inline text-black text-base`;
const FooterCopyright = tw.div`text-xs mt-5 text-center`;
const FooterTitle = tw.p`text-center`;

const FounderSocialLinkWrapper = tw.div`w-full flex flex-row justify-center`;
const SocialIcon = tw.span`bg-no-repeat bg-center border-gray-200 border inline-flex flex items-center justify-center w-10 h-10 pl-6 overflow-hidden rounded-full leading-none text-sm`;

export default function GlobalFooter(props) {
  let title;
  let bylineLink;
  let byline;

  let founderFacebook;
  let founderTwitter;
  let founderInstagram;

  if (props.metadata) {
    title = props.metadata['siteName'];
    bylineLink = props.metadata['footerBylineLink'];
    byline = props.metadata['footerBylineName'];

    founderTwitter = props.metadata['founderTwitter'];
    founderFacebook = props.metadata['founderFacebook'];
    founderInstagram = props.metadata['founderInstagram'];
  }
  const currentYear = new Date().getFullYear();
  return (
    <Footer>
      <div>
        <div>
          <FooterTitle>
            <strong>{title}</strong>
          </FooterTitle>
          {/* <FooterLinksDiv>
            <FooterLink>
              <Link href="/about" passHref>
                <FooterHoverUnderline>about</FooterHoverUnderline>
              </Link>{' '}
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
                <Link href="/donate" passHref>
                  <FooterHoverUnderline>donate</FooterHoverUnderline>
                </Link>{' '}
              </FooterLink>
            )}
            </FooterLinksDiv>*/}
          <FounderSocialLinkWrapper>
            {founderFacebook && (
              <FooterLink>
                <Link href={founderFacebook}>
                  <a href={founderFacebook} target="_blank" rel="noreferrer">
                    <SocialIcon
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 8 17' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.688 5.82l-.384 2.713H5.196v7.75H2.033v-7.75H.5V5.82h1.533V4.076c0-1.259.575-3.293 3.259-3.293h2.396v2.615H5.962c-.287 0-.67.097-.67.775V5.82h2.396' fill='%233B5998' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E\")",
                        backgroundSize: 'auto 1.0625rem',
                      }}
                    />
                  </a>
                </Link>
              </FooterLink>
            )}
            {founderTwitter && (
              <FooterLink>
                <Link href={founderTwitter}>
                  <a target="_blank" rel="noreferrer">
                    <SocialIcon
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 17 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.725 4.111v.402c0 4.32-3.28 9.242-9.143 9.242-1.888 0-3.578-.502-4.97-1.507h.796c1.49 0 2.981-.502 4.074-1.406-1.39 0-2.583-1.005-3.08-2.31.198 0 .397.1.596.1.298 0 .596 0 .894-.1C2.402 8.23 1.31 6.923 1.31 5.316c.397.2.894.402 1.49.402-.894-.603-1.49-1.608-1.49-2.713 0-.603.198-1.205.397-1.708a8.943 8.943 0 0 0 6.758 3.416c-.1-.2-.1-.502-.1-.703 0-1.808 1.491-3.315 3.28-3.315.894 0 1.789.401 2.385 1.004.696-.1 1.49-.402 2.087-.803-.199.803-.795 1.406-1.391 1.808.695-.1 1.292-.302 1.888-.502-.696.904-1.292 1.506-1.888 1.908' fill='%234099FF' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E\")",
                        backgroundSize: 'auto 0.9375rem',
                      }}
                    />
                  </a>
                </Link>
              </FooterLink>
            )}
            {founderInstagram && (
              <FooterLink>
                <Link href={founderInstagram}>
                  <a href={founderInstagram} target="_blank" rel="noreferrer">
                    <SocialIcon
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' fill='black'/%3E%3C/svg%3E%0A\")",
                        backgroundSize: '0.9375rem auto',
                      }}
                    />
                  </a>
                </Link>
              </FooterLink>
            )}
          </FounderSocialLinkWrapper>
        </div>
        <FooterCopyright>
          <p>
            copyright © {currentYear} {title}
          </p>
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
