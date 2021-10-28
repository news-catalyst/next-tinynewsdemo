import tw, { styled } from 'twin.macro';
import { generateMonkeypodUrl } from '../../lib/utils';
import Colors from '../common/Colors';
import Typography from '../common/Typography';
import { determineTextColor } from '../../lib/utils';
import { useEffect, useState } from 'react';

const OptionsBlockContainer = tw.div`md:flex md:grid-cols-3 md:gap-4`;
const Card = tw.div`rounded overflow-hidden shadow-lg w-full border-gray-200 border my-8 md:my-0 relative`;
const CardHeader = tw.header`border-b border-gray-200 pb-4 mb-4`;
const CardHeading = styled.h4(({ meta }) => ({
  ...tw`text-2xl leading-none font-bold text-center px-8 pt-4`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockHed,
}));
const CardContent = tw.div`p-8`;
const CardDonationAmount = styled.h5(({ meta }) => ({
  ...tw`text-4xl font-bold text-center leading-none mb-4`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockDek,
}));
const PerMonth = tw.span`text-sm`;
const OneTimePayment = tw.p`text-sm text-center`;
const CardDonationDescription = styled.div(({ meta }) => ({
  ...tw`text-lg mt-8`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockDek,
}));
const CardFooter = tw.footer`mt-4`;
const DonateFooterLink = styled.a(
  ({ meta, backgroundColor, textColor, tinycms }) => ({
    ...tw`items-center justify-center flex font-bold w-full py-4 absolute bottom-0`,
    fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockDek,
    color: textColor,
    pointerEvents: tinycms ? 'none' : '',
    backgroundColor: backgroundColor,
  })
);

export default function DonationOptionsBlock({
  metadata,
  tinycms,
  wrap = true,
}) {
  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

  useEffect(() => {
    let bgc;
    let tc;
    if (metadata.color === 'custom') {
      bgc = metadata.primaryColor;
      tc = determineTextColor(metadata.primaryColor);
    } else if (Colors[metadata.color]) {
      tc = Colors[metadata.color].PromoBlockText;
      bgc = Colors[metadata.color].PromoBlockBackground;
    }
    setBackgroundColor(bgc);
    setTextColor(tc);
  }, [metadata]);

  if (metadata.donationOptions === '' || metadata.donationOptions === null) {
    return null;
  }

  let parsedOptions = [];
  try {
    parsedOptions = JSON.parse(metadata.donationOptions);
  } catch (e) {
    console.error(e);
  }

  const block = parsedOptions
    .filter((option) => !!option.name)
    .map((option, i) => (
      <Card key={`donate-option-${i}`}>
        <CardHeader>
          <CardHeading meta={metadata}>{option.name}</CardHeading>
        </CardHeader>
        <CardContent>
          <div className="content">
            <CardDonationAmount meta={metadata}>
              ${option.amount}
              {option.paymentType === 'monthly' && <PerMonth>/month</PerMonth>}
            </CardDonationAmount>
            {option.paymentType === 'one-time' && (
              <OneTimePayment>One-time payment</OneTimePayment>
            )}
            <CardDonationDescription meta={metadata}>
              {option.description}
            </CardDonationDescription>
          </div>
        </CardContent>
        <CardFooter
          style={{
            height: '4rem',
          }}
        >
          <DonateFooterLink
            href={`${process.env.NEXT_PUBLIC_MONKEYPOD_URL}?option_id=${option.monkeypodId}`}
            meta={metadata}
            backgroundColor={backgroundColor}
            textColor={textColor}
            tinycms={tinycms}
          >
            {option.cta}
          </DonateFooterLink>
        </CardFooter>
      </Card>
    ));

  return wrap ? <OptionsBlockContainer>{block}</OptionsBlockContainer> : block;
}
