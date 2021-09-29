import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Donate from './Donate';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';

const NavContainer = tw.header`border-b border-gray-200 flex w-full`;
const NavInnerContainer = tw.div`lg:p-5 flex flex-wrap flex-row mx-auto max-w-7xl w-full justify-items-start pt-5`;
const NavHeader = tw.h1`text-4xl leading-none font-bold ml-4 lg:ml-0 flex-1 order-1`;
const LogoWrapper = tw.div`flex-1 order-1 h-12 lg:w-64 relative mx-auto lg:mx-0 w-screen`;
const Logo = tw.div`mx-auto w-64 h-full relative`;
const RightNav = tw.nav`lg:text-right lg:flex-1 flex flex-row flex-nowrap mt-5 order-3 lg:order-none overflow-y-hidden w-full flex-grow border-t border-gray-200 lg:border-t-0 lg:w-auto lg:block lg:mt-0`;
const SectionLink = styled.a(({ meta }) => ({
  ...tw`lg:items-center lg:mr-8 lg:py-0 inline-flex items-end h-full py-2 px-5 lg:pb-0 lg:px-0`,
  fontFamily: Typography[meta.theme].SectionLink,
}));

export default function GlobalNav({ metadata, sections, isAmp }) {
  let sectionLinks;

  if (sections && sections[0] && typeof sections[0].title === 'string') {
    sectionLinks = sections
      .slice(0, 4)
      .filter((section) => section.published)
      .map((section) => (
        <Link
          key={`navbar-${section.slug}`}
          href={`/categories/${section.slug}`}
          passHref
        >
          <SectionLink href={`/categories/${section.slug}`} meta={metadata}>
            {section.title}
          </SectionLink>
        </Link>
      ));
  }

  let title;
  let logo;
  if (metadata) {
    title = metadata['shortName'];
    logo = metadata['logo'];
  }

  let LogoComponent;
  if (logo) {
    LogoComponent = (
      <LogoWrapper>
        <Logo>
          {isAmp ? (
            <amp-img
              src={logo}
              layout="fill"
              alt={title}
              style={{
                objectFit: 'contain',
                objectPosition: 'left',
              }}
            />
          ) : (
            <Image
              src={logo}
              layout="fill"
              objectFit="contain"
              objectPosition="left"
              alt={title}
              priority={true}
            />
          )}
        </Logo>
      </LogoWrapper>
    );
  }

  return (
    <NavContainer>
      <NavInnerContainer>
        <Link href="/">
          <a>{logo ? LogoComponent : <NavHeader>{title}</NavHeader>}</a>
        </Link>
        <RightNav>{sectionLinks}</RightNav>
        {process.env.NEXT_PUBLIC_MONKEYPOD_URL && (
          <Donate label={metadata.supportCTA} metadata={metadata} />
        )}
      </NavInnerContainer>
    </NavContainer>
  );
}
