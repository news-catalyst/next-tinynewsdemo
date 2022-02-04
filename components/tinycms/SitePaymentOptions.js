import React, { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';

import DonationOptionsBlock from '../plugins/DonationOptionsBlock';
import DonationOption from './DonationOption';
import TinyEditor from './TinyEditor';
import { TinyInputField } from './TinyFormElements';

const SettingsHeader = tw.h1`text-4xl font-bold leading-normal mt-0 mb-2 text-black`;
const SiteInfoFieldsContainer = tw.div`grid grid-cols-1 gap-4`;
const DonationOptionsEditor = tw.div`grid grid-cols-3 gap-4`;
const DonationOptionsContainer = tw.div``;

export default function SitePaymentOptions(props) {
  const [thankYouHeadline, setThankYouHeadline] = useState(
    props.parsedData['thankYouHeadline']
  );
  const [thankYouSuccess, setThankYouSuccess] = useState(
    props.parsedData['thankYouSuccess']
  );
  const [staticThankYouSuccess, setStaticThankYouSuccess] = useState(
    props.parsedData['thankYouSuccess']
  );
  const [thankYouCancel, setThankYouCancel] = useState(
    props.parsedData['thankYouCancel']
  );
  const [staticThankYouCancel, setStaticThankYouCancel] = useState(
    props.parsedData['thankYouCancel']
  );

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

  const updateThankYouHeadline = (value) => {
    setThankYouHeadline(value);
    updateKeyValue('thankYouHeadline', value);
  };

  const updateThankYouSuccess = (value) => {
    setThankYouSuccess(value);
    updateKeyValue('thankYouSuccess', value);
  };

  const updateThankYouCancel = (value) => {
    setThankYouCancel(value);
    updateKeyValue('thankYouCancel', value);
  };

  useEffect(() => {
    setThankYouHeadline(props.parsedData['thankYouHeadline']);
    setThankYouCancel(props.parsedData['thankYouCancel']);
    setThankYouSuccess(props.parsedData['thankYouSuccess']);
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

      <SettingsHeader id="thankYouPage">Thank You Page</SettingsHeader>
      <SiteInfoFieldsContainer>
        <TinyInputField
          name="thankYouHeadline"
          value={thankYouHeadline}
          onChange={(ev) => updateThankYouHeadline(ev.target.value)}
          label="Headline"
        />

        <label htmlFor="thankYouSuccess">
          <span tw="mt-1 font-bold">Successful Payment Message</span>
          <TinyEditor
            tinyApiKey={props.tinyApiKey}
            setValue={updateThankYouSuccess}
            value={staticThankYouSuccess}
          />
        </label>
        <label htmlFor="thankYouCancel">
          <span tw="mt-1 font-bold">Customer Cancelled Payment Message</span>
          <TinyEditor
            tinyApiKey={props.tinyApiKey}
            setValue={updateThankYouCancel}
            value={staticThankYouCancel}
          />
        </label>
      </SiteInfoFieldsContainer>
    </div>
  );
}
