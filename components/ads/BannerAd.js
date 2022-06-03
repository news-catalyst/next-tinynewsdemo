import Image from 'next/image';
import AdPixel from './AdPixel';
import tw from 'twin.macro';

const AdWrapper = tw.div`block`;
const AdBrand = tw.div``;
const AdBrandP = tw.p`text-sm text-gray-500 pt-1 mb-2 text-center`;
const AdImgContainer = tw.div`w-full mb-4 lg:mb-0 mx-auto text-center`;

export default function BannerAd({ ad, isAmp }) {
  console.log(ad);
  return (
    <AdWrapper>
      <AdBrand>
        <AdBrandP>Advertisement from {ad.brand}</AdBrandP>
      </AdBrand>
      <AdImgContainer>
        <a href={ad.url}>
          {isAmp ? (
            <amp-img
              width={728}
              height={90}
              src={ad.image.url}
              alt={ad.image.alt}
              layout="responsive"
            />
          ) : (
            <Image
              src={ad.image.url}
              className="ad-banner"
              alt={ad.image.alt}
              width={728}
              height={90}
            />
          )}
        </a>
      </AdImgContainer>
      <AdPixel pixel={ad.pixel} isAmp={isAmp} />
    </AdWrapper>
  );
}
