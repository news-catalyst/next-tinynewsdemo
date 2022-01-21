import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Donate from './Donate';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';
import { generateNavLinkFor, hasuraLocalizeText } from '../../lib/utils';

const NavTopContainer = tw.header`flex w-full`;
const NavBottomContainer = tw.header`border-b border-gray-200 flex w-full justify-center items-center`;
const NavInnerContainer = tw.div`w-full flex lg:p-4 flex-wrap flex-row mx-auto max-w-7xl justify-center items-center`;
const NavHeader = tw.h1`text-4xl leading-none font-bold ml-4 lg:ml-0 flex-1 order-1`;
const LogoWrapper = tw.div`flex-1 order-1 h-12 w-80 relative mx-auto lg:mx-0 flex-1 order-1`;
const Logo = tw.div`lg:mx-0 ml-5 lg:w-64 h-full relative`;
const NavLinks = tw.nav`lg:flex-1 flex flex-row flex-wrap items-center justify-center mt-5 order-3 lg:order-none w-full flex-grow border-t border-gray-200 lg:border-t-0 lg:w-auto lg:mt-0`;
const SectionLink = styled.a(({ meta }) => ({
  ...tw`lg:items-center lg:mr-8 lg:py-0 inline-flex items-center lg:h-full py-2 px-5 lg:pb-0 lg:px-0 hover:underline`,
  fontFamily: Typography[meta.theme].SectionLink,
}));

export default function GlobalNav({ locale, metadata, sections, isAmp }) {
  let sectionLinks;

  if (metadata && metadata['nav']) {
    sectionLinks = metadata['nav'].map((link) => (
      <Link
        key={`navbar-${link.slug}`}
        href={`/categories/${link.slug}`}
        passHref
      >
        <SectionLink href={generateNavLinkFor(link)} meta={metadata}>
          {link.label}
        </SectionLink>
      </Link>
    ));
  } else if (sections && sections[0] && typeof sections[0].title === 'string') {
    sectionLinks = sections
      .filter((section) => section.published)
      .map((section) => (
        <Link
          key={`navbar-${section.slug}`}
          href={`/categories/${section.slug}`}
          passHref
        >
          <SectionLink href={`/categories/${section.slug}`} meta={metadata}>
            {hasuraLocalizeText(locale, section.category_translations, 'title')}
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
    <>
      <NavTopContainer>
        {process.env.NEXT_PUBLIC_MONKEYPOD_URL && (
          <Donate
            tw="absolute top-0 right-0"
            label={metadata.supportCTA}
            metadata={metadata}
          />
        )}
        <NavInnerContainer>
          <Link href="/">
            <a>{logo ? LogoComponent : <NavHeader>{title}</NavHeader>}</a>
          </Link>
        </NavInnerContainer>
      </NavTopContainer>
      <NavBottomContainer>
        <NavInnerContainer>
          <NavLinks>{sectionLinks}</NavLinks>
        </NavInnerContainer>
      </NavBottomContainer>
    </>
  );
}
