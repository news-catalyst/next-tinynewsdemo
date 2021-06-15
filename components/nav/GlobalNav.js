import React from 'react';
import Link from 'next/link';
import Donate from './Donate';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';

const NavContainer = tw.header`border-b border-gray-200 flex w-full`;
const NavInnerContainer = tw.div`lg:p-5 flex flex-wrap flex-row mx-auto max-w-7xl w-full justify-items-start pt-5`;
const NavHeader = tw.h1`text-4xl leading-none font-bold ml-4 lg:ml-0 flex-1 order-1`;
const RightNav = tw.nav`lg:text-right lg:flex-1 flex flex-row flex-nowrap mt-5 order-3 lg:order-none overflow-y-hidden overflow-x-scroll w-full flex-grow border-t border-gray-200 lg:border-t-0 lg:w-auto lg:block lg:mt-0`;
const SectionLink = styled.a(({ meta }) => ({
  ...tw`lg:items-center lg:mr-8 lg:py-0 inline-flex items-end h-full py-2 px-5 lg:pb-0 lg:px-0`,
  fontFamily: Typography[meta.theme].SectionLink,
}));

export default function GlobalNav({ metadata, sections }) {
  let sectionLinks;

  if (sections && typeof sections[0].title === 'string') {
    sectionLinks = sections.slice(0, 4).map((section) => (
      <Link key={`navbar-${section.slug}`} href={`/${section.slug}`} passHref>
        <SectionLink href={`/${section.slug}`} meta={metadata}>
          {section.title}
        </SectionLink>
      </Link>
    ));
  }

  let title;
  if (metadata) {
    title = metadata['shortName'];
  }

  return (
    <NavContainer>
      <NavInnerContainer>
        <Link href="/">
          <a>
            <NavHeader>{title}</NavHeader>
          </a>
        </Link>
        <RightNav>{sectionLinks}</RightNav>
        {process.env.NEXT_PUBLIC_MONKEYPOD_URL && (
          <Donate label={metadata.supportCTA} metadata={metadata} />
        )}
      </NavInnerContainer>
    </NavContainer>
  );
}
