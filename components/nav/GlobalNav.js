import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Donate from './Donate';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';
import { generateNavLinkFor, hasuraLocalizeText } from '../../lib/utils';

const NavTopContainer = tw.header`flex w-full`;
const NavBottomContainer = tw.header`border-b border-gray-200 flex w-full justify-center items-center`;
const NavInnerContainer = styled.div(() => ({
  ...tw`w-full grid lg:py-4 mx-auto max-w-7xl my-0 pl-5`,
  gridTemplateAreas: '"left right"',
  gridTemplateColumns: '1fr 4rem',
}));
const NavInnerLeftContainer = styled.div(() => ({
  ...tw`w-full justify-self-start`,
  gridArea: 'left',
}));
const NavInnerRightContainer = styled.div(() => ({
  ...tw`mr-0 self-auto`,
  placeSelf: 'center end',
  gridArea: 'right',
  width: 'initial',
}));
const NavHeader = tw.h1`text-4xl leading-none font-bold`;
const LogoWrapper = tw.div`flex flex-row justify-center md:max-h-24 max-h-16`;
const Logo = styled.div(() => ({
  ...tw`max-w-full max-h-full block cursor-pointer`,
  maxWidth: '16rem',
}));
const NavLinks = tw.nav`lg:flex-1 flex flex-row flex-wrap items-center justify-center mt-5 lg:order-none w-full flex-grow border-t border-gray-200 lg:w-auto lg:mt-0 py-2`;
const SectionLink = styled.a(({ meta }) => ({
  ...tw`lg:items-center lg:mr-8 lg:py-0 inline-flex items-center lg:h-full py-2 px-5 lg:pb-0 lg:px-0 hover:underline`,
  fontFamily: Typography[meta.theme].SectionLink,
}));

export default function GlobalNav({ locale, metadata, sections, isAmp }) {
  const [logoWidth, setLogoWidth] = useState();
  const [logoHeight, setLogoHeight] = useState();

  useEffect(() => {
    if ((metadata['logo'] && !metadata['logoWidth'], !metadata['logoHeight'])) {
      console.warn(
        'Reading logo in client to determine dimensions. You should reset the logo in the TinyCMS.'
      );
      const img = document.createElement('img');
      img.onload = function () {
        setLogoWidth(this.width);
        setLogoHeight(this.height);
      };
      img.src = metadata['logo'];
    }
  }, [metadata]);

  let sectionLinks;

  if (metadata && Array.isArray(metadata['nav'])) {
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
  let width;
  let height;
  if (metadata) {
    title = metadata['shortName'];
    logo = metadata['logo'];
    width = metadata['logoWidth'] || logoWidth;
    height = metadata['logoHeight'] || logoHeight;
  }

  let LogoComponent;
  if (logo && width && height) {
    LogoComponent = (
      <Logo>
        {isAmp ? (
          <amp-img src={logo} alt={title} width={width} height={height} />
        ) : (
          <Image
            src={logo}
            width={width}
            height={height}
            alt={title}
            priority={true}
          />
        )}
      </Logo>
    );
  } else {
    LogoComponent = (
      <Logo>
        <NavHeader>{title}</NavHeader>
      </Logo>
    );
  }

  return (
    <>
      <NavTopContainer>
        <NavInnerContainer>
          <NavInnerLeftContainer>
            <LogoWrapper>
              <Link href="/" passHref>
                {LogoComponent}
              </Link>
            </LogoWrapper>
          </NavInnerLeftContainer>
          <NavInnerRightContainer>
            {process.env.NEXT_PUBLIC_MONKEYPOD_URL && (
              <Donate label={metadata.supportCTA} metadata={metadata} />
            )}
          </NavInnerRightContainer>
        </NavInnerContainer>
      </NavTopContainer>
      <NavBottomContainer>
        <NavLinks>{sectionLinks}</NavLinks>
      </NavBottomContainer>
    </>
  );
}
