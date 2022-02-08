import tw from 'twin.macro';
import React from 'react';

import DonationCard from './DonationCard';

const OptionsBlockContainer = tw.div`md:flex md:grid-cols-3 md:gap-4`;

export default function DonationOptionsBlock({
  metadata,
  tinycms,
  wrap = true,
}) {
  if (metadata.donationOptions === '' || metadata.donationOptions === null) {
    return null;
  }

  let parsedOptions = [];
  try {
    // console.log('donationOptions metadata:', metadata.donationOptions);
    parsedOptions = JSON.parse(metadata.donationOptions);
  } catch (e) {
    console.error(e);
  }

  let paymentProvider = metadata.paymentProvider;
  if (!paymentProvider) {
    paymentProvider = 'monkeypod'; // fallback just in case this isn't set
  }

  const block = parsedOptions
    .filter((option) => !!option.name)
    .map((option, i) => (
      <DonationCard
        key={`donation-card-${i}`}
        option={option}
        metadata={metadata}
        tinycms={tinycms}
        provider={paymentProvider}
      />
    ));

  return wrap ? <OptionsBlockContainer>{block}</OptionsBlockContainer> : block;
}
