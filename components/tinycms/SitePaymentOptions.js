import React, { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';
import DonationBlock from '../plugins/DonationBlock';
import NewsletterBlock from '../plugins/NewsletterBlock';
import HomepagePromoBar from '../homepage/HomepagePromoBar';
import AdPromotion from '../ads/AdPromotion';
import DonationOptionsBlock from '../plugins/DonationOptionsBlock';
import DonationOption from './DonationOption';
import ControlledInput from './ControlledInput';
import Upload from './Upload';
import TinyEditor from './TinyEditor';
import { TinyInputField } from './TinyFormElements';

const SettingsHeader = tw.h1`text-4xl font-bold leading-normal mt-0 mb-2 text-black`;
const SiteInfoFieldsContainer = tw.div`grid grid-cols-3 gap-4`;
const SeoContainer = tw.div``;
const DesignContainer = tw.div`grid grid-cols-2 gap-4`;
const MembershipContainer = tw.div`grid grid-cols-2 gap-8`;
const AdvertisingContainer = tw.div`grid grid-cols-2 gap-8`;
const NewsletterContainer = tw.div`grid grid-cols-2 gap-8`;
const HomepagePromoContainer = tw.div`grid grid-cols-2 gap-8`;
const DonationOptionsEditor = tw.div`grid grid-cols-3 gap-4`;
const DonationOptionsContainer = tw.div``;
const DesignHeader = tw.h1`text-2xl font-bold leading-normal mt-0 mb-2 text-black`;
const Select = tw.select`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
const SingleColumnContainer = tw.div`grid grid-cols-1 gap-4`;
const StyleOneHead = styled.span`
  font-family: 'Libre Franklin', sans-serif;
`;
const StyleOneBody = styled.span`
  font-family: 'Domine', serif;
`;
const StyleTwoHead = styled.span`
  font-family: 'Source Serif Pro', sans-serif;
`;
const StyleTwoBody = styled.span`
  font-family: 'Source Sans Pro', sans-serif;
`;
const StyleThreeHead = styled.span`
  font-family: 'Roboto Condensed', sans-serif;
`;
const StyleThreeBody = styled.span`
  font-family: 'Roboto', sans-serif;
`;
const StyleFourHead = styled.span`
  font-family: 'Arbutus Slab', serif;
`;
const StyleFourBody = styled.span`
  font-family: 'Mulish', sans-serif;
`;
const StyleFiveHead = styled.span`
  font-family: 'Bodoni Moda', serif;
`;
const StyleFiveBody = styled.span`
  font-family: 'Lato', sans-serif;
`;
const ColorContainer = styled.div`
  float: left;
`;
const ColorLabel = styled.span(
  css`
    float: left;
    ${tw`p-2 mt-1`}
  `
);
const ColorRadioFloat = styled.input`
  float: left;
  margin-right: 1em;
`;
const ColorOnePrimaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(54, 102, 209, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorOneSecondaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(209, 131, 65, 0.12);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorTwoPrimaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(209, 219, 189, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorTwoSecondaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(25, 52, 65, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorThreePrimaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: #000000;
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorThreeSecondaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(231, 229, 228, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);

const Input = styled.input`
  ${tw`px-3 py-3 mb-4 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;

export default function SitePaymentOptions(props) {
  // const [thankYouHeadline, setThankYouHeadline] = useState(
  //   props.parsedData['thankYouHeadline']
  // );
  const [paymentProvider, setPaymentProvider] = useState(
    props.parsedData['paymentProvider']
  );
  let parsedDonationOptions;
  try {
    parsedDonationOptions = JSON.parse(props.parsedData['donationOptions']);
  } catch (e) {
    console.error('Failed to parse donation options json:', e);
  }
  const [donationOptions, setDonationOptions] = useState(
    props.parsedData['donationOptions'] ? parsedDonationOptions : null
  );

  const updateKeyValue = (key, value) => {
    props.updateParsedData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // const updateThankYouHeadline = (value) => {
  //   setThankYouHeadline(value);
  //   updateKeyValue('thankYouHeadline', value);
  // };

  useEffect(() => {
    setPaymentProvider(props.parsedData['paymentProvider']);
    let parsedDonationOptions;
    try {
      parsedDonationOptions = JSON.parse(props.parsedData['donationOptions']);
    } catch (e) {
      console.error('Failed to parse donation options json:', e);
    }
    setDonationOptions(
      props.parsedData['donationOptions'] ? parsedDonationOptions : null
    );
  }, [props.parsedData]);

  return (
    <div tw="space-x-4 space-y-8">
      <DonationOptionsEditor ref={props.paymentRef} id="payment-options">
        <SettingsHeader tw="col-span-3 mt-5">Payment options</SettingsHeader>
        <div tw="col-span-3 mt-5">
          <label tw="block">
            <input
              type="radio"
              name={`paymentProvider`}
              value="monkeypod"
              checked={paymentProvider === 'monkeypod'}
              onChange={props.handleChange}
            />
            <span tw="p-2 mt-1 font-bold">MonkeyPod (contributed revenue)</span>
          </label>
          <label tw="block">
            <input
              type="radio"
              name={`paymentProvider`}
              value="stripe"
              checked={paymentProvider === 'stripe'}
              onChange={props.handleChange}
            />
            <span tw="p-2 mt-1 font-bold">Stripe (earned revenue)</span>
          </label>
        </div>
        {Array.isArray(donationOptions) &&
          donationOptions.map((option, i) => (
            <DonationOption
              index={i}
              key={`option-${i}`}
              name={option.name}
              cta={option.cta}
              desc={option.description}
              amount={option.amount}
              paymentProvider={paymentProvider}
              stripeId={option.stripeId}
              paymentType={option.paymentType}
              monkeypodId={option.monkeypodId}
              parsedData={props.parsedData}
              updateParsedData={props.updateParsedData}
              tinyApiKey={props.tinyApiKey}
            />
          ))}
      </DonationOptionsEditor>

      <DonationOptionsContainer>
        <span tw="mt-1 font-bold">Preview</span>
        <DonationOptionsBlock metadata={props.parsedData} tinycms={true} />
      </DonationOptionsContainer>
    </div>
  );
}
