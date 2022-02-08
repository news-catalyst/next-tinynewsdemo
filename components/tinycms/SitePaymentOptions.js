import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import tw, { css, styled } from 'twin.macro';
import DonationOptionsBlock from '../plugins/DonationOptionsBlock';
import DonationOption from './DonationOption';
import TinyEditor from './TinyEditor';
import { TinyInputField } from './TinyFormElements';
import { AddButton } from '../common/CommonStyles.js';
import { hasuraUpsertMetadata } from '../../lib/site_metadata';

const SettingsHeader = tw.h1`text-4xl font-bold leading-normal mt-0 mb-2 text-black`;
const SiteInfoFieldsContainer = tw.div`grid grid-cols-1 gap-4`;
const DonationOptionsEditor = tw.div`grid grid-cols-3 gap-4`;
const DonationOptionsContainer = tw.div``;

export default function SitePaymentOptions(props) {
  const router = useRouter();

  const [stripeAccountId, setStripeAccountId] = useState(
    props.parsedData['stripeAccountId']
  );

  const [shortName, setShortName] = useState(props.parsedData['shortName']);
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

  async function handleCreateStripeConnectedAccount() {
    const response = await fetch('/api/stripe/create-connected-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: shortName,
      }),
    });
    const data = await response.json();

    if (data.status === 'error') {
      props.setNotificationType('error');
      props.setNotificationMessage(
        'An error occurred setting up your Stripe Connected Account: ' +
          JSON.stringify(data)
      );
      props.setShowNotification(true);
    } else {
      updateStripeAccountId(data.account.id);

      let latestSiteMetadata = props.parsedData;
      latestSiteMetadata['stripeAccountId'] = data.account.id;

      console.log(
        'Submitting this data:',
        latestSiteMetadata.stripeAccountId,
        latestSiteMetadata
      );
      // update the data in Hasura
      const hasuraResult = await hasuraUpsertMetadata({
        url: props.apiUrl,
        orgSlug: props.apiToken,
        data: latestSiteMetadata,
        published: true,
        localeCode: props.currentLocale,
      });
      console.log('hasura result:', hasuraResult);
      if (hasuraResult.errors) {
        props.setNotificationType('error');
        props.setNotificationMessage(
          'An error occurred setting up your Stripe Connected Account: ' +
            JSON.stringify(hasuraResult)
        );
        props.setShowNotification(true);
      } else {
        console.log('all good', hasuraResult);
        props.setNotificationType('success');
        props.setNotificationMessage(
          'Redirecting you to Stripe to finish setting up your Stripe Connected Account to ' +
            data.redirectURL
        );
        props.setShowNotification(true);
        router.push(data.redirectURL);
      }
    }
  }
  const updateKeyValue = (key, value) => {
    props.updateParsedData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateStripeAccountId = (value) => {
    setStripeAccountId(value);
    updateKeyValue('stripeAccountId', value);
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
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') && query.get('stripe')) {
      props.setNotificationType('success');
      props.setShowNotification(true);
      props.setNotificationMessage(
        'All done! Your account is set up in Stripe.'
      );
    }
    setThankYouHeadline(props.parsedData['thankYouHeadline']);
    setThankYouCancel(props.parsedData['thankYouCancel']);
    setThankYouSuccess(props.parsedData['thankYouSuccess']);
    setPaymentProvider(props.parsedData['paymentProvider']);
    setShortName(props.parsedData['shortName']);
    setStripeAccountId(props.parsedData['stripeAccountId']);

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
        {paymentProvider === 'stripe' && !stripeAccountId && (
          <div tw="col-span-3 mt-5">
            <AddButton onClick={handleCreateStripeConnectedAccount}>
              Setup Stripe
            </AddButton>
          </div>
        )}
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

        {paymentProvider === 'stripe' && (
          <div tw="col-span-3 mt-5">
            <TinyInputField
              name="stripeAccountId"
              value={stripeAccountId}
              onChange={(ev) => updateStripeAccountId(ev.target.value)}
              label="Stripe Account ID"
            />
          </div>
        )}

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
