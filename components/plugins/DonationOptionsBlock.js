import tw from 'twin.macro';
import DonationCard from './DonationCard';

const OptionsBlockContainer = tw.div`md:flex md:grid-cols-3 md:gap-4`;

export default function DonationOptionsBlock({
  metadata,
  tinycms,
  wrap = true,
  provider = 'monkeypod',
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

  const block = parsedOptions
    .filter((option) => !!option.name)
    .map((option, i) => (
      <DonationCard
        key={`donation-card-${i}`}
        option={option}
        metadata={metadata}
        tinycms={tinycms}
        provider={provider}
      />
    ));

  return wrap ? <OptionsBlockContainer>{block}</OptionsBlockContainer> : block;
}
