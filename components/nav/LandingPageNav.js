import { Fragment } from 'react';
import Link from 'next/link';
import tw from 'twin.macro';
import { Anchor } from '../common/CommonStyles.js';

const NavWrapper = tw.div`w-full`;
const NavHeader = tw.h2`text-xl font-bold text-left mt-2`;
const NavLinks = tw.div`mt-1`;
const PageLinkWrapper = tw.span`md:mx-2 my-4 md:my-0 first:ml-0 last:mr-0 block md:inline`;
const Divider = tw.span`hidden md:inline`;

function PageLink({ locale, page, metadata }) {
  const specialSlugs = ['about', 'donate'];
  const ignoredSlugs = ['thank-you'];
  let link = null;

  if (ignoredSlugs.includes(page.slug)) {
    return <span />;
  }

  if (specialSlugs.includes(page.slug)) {
    link = `/${page.slug}`;
  } else {
    link = `/static/${page.slug}`;
  }

  const headline = page.page_translations[0].headline;

  return (
    <Link href={link} passHref>
      <Anchor meta={metadata}>{headline}</Anchor>
    </Link>
  );
}

export default function LandingPageNav({ locale, pages, metadata }) {
  return (
    <NavWrapper>
      <NavHeader>Read more</NavHeader>
      <NavLinks>
        {pages.map((page, i) => (
          <Fragment key={page.slug}>
            {!(
              metadata.shortName === 'Five Wards Media' && page.slug === 'about'
            ) && (
              <Fragment>
                <PageLinkWrapper>
                  <PageLink locale={locale} page={page} metadata={metadata} />
                </PageLinkWrapper>
                <Divider>{` | `}</Divider>
              </Fragment>
            )}
          </Fragment>
        ))}
        <PageLinkWrapper>
          <Link href="/staff" passHref>
            <Anchor meta={metadata}>Staff</Anchor>
          </Link>
        </PageLinkWrapper>
      </NavLinks>
    </NavWrapper>
  );
}
