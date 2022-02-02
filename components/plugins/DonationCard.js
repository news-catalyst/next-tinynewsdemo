import tw, { styled } from 'twin.macro';
import { useState, useEffect } from 'react';
import Colors from '../common/Colors';
import Typography from '../common/Typography';
import { determineTextColor } from '../../lib/utils';
import CurrencyInput from 'react-currency-input-field';

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
const DonateFooterButton = styled.button(
  ({ meta, backgroundColor, textColor, tinycms }) => ({
    ...tw`items-center justify-center flex font-bold w-full py-4 absolute bottom-0`,
    fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockDek,
    color: textColor,
    pointerEvents: tinycms ? 'none' : '',
    backgroundColor: backgroundColor,
  })
);

export default function DonationCard({ option, metadata, tinycms, provider }) {
  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [customAmount, setCustomAmount] = useState(null);

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

  let monkeyPodURL = `${process.env.NEXT_PUBLIC_MONKEYPOD_URL}?option_id=${option.monkeypodId}`;

  if (customAmount) {
    monkeyPodURL += `&amount=${customAmount}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardHeading meta={metadata}>{option.name}</CardHeading>
      </CardHeader>
      <CardContent>
        <div className="content">
          {option.paymentType !== 'pay-what-you-want' && (
            <CardDonationAmount meta={metadata}>
              ${option.amount}
              {option.paymentType === 'monthly' && <PerMonth>/month</PerMonth>}
            </CardDonationAmount>
          )}
          {option.paymentType === 'one-time' && (
            <OneTimePayment>One-time payment</OneTimePayment>
          )}
          {option.paymentType === 'pay-what-you-want' && (
            <>
              <label>
                <p tw="font-bold">Amount</p>
                <CurrencyInput
                  id="custom-amount"
                  name="custom-amount"
                  placeholder="Enter your donation amount"
                  decimalsLimit={2}
                  prefix={'$'}
                  onValueChange={(value, name) => setCustomAmount(value)}
                />
              </label>
            </>
          )}

          <CardDonationDescription
            meta={metadata}
            dangerouslySetInnerHTML={{ __html: option.description }}
          ></CardDonationDescription>
        </div>
      </CardContent>
      <CardFooter
        style={{
          height: '4rem',
        }}
      >
        {provider == 'monkeypod' ? (
          <DonateFooterLink
            href={monkeyPodURL}
            meta={metadata}
            backgroundColor={backgroundColor}
            textColor={textColor}
            tinycms={tinycms}
          >
            {option.cta}
          </DonateFooterLink>
        ) : (
          <form action="/api/checkout_sessions" method="POST">
            <input
              type="hidden"
              name="stripeId"
              id="stripeId"
              value={option.stripeId}
            />
            <input
              type="hidden"
              name="paymentType"
              id="paymentType"
              value={option.paymentType}
            />
            <DonateFooterButton
              meta={metadata}
              backgroundColor={backgroundColor}
              textColor={textColor}
              tinycms={tinycms}
              type="submit"
              role="link"
            >
              {option.cta}
            </DonateFooterButton>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
