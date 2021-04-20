import Link from 'next/link';
import tw from 'twin.macro';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { generateMonkeypodUrl } from '../../lib/utils.js';

const Donate = ({ metadata, style }) => {
  const { trackEvent } = useAnalytics();

  const trackClick = () => {
    trackEvent({
      action: 'Clicked',
      category: 'Donate',
      label: 'Global Nav',
      non_interaction: false,
    });
  };

  if (metadata.donationOptions === '' || metadata.donationOptions === null) {
    return (
      <Link href={metadata.supportURL}>
        <a
          style={style}
          className="site__cta button donate"
          onClick={trackClick}
        >
          {metadata.supportCTA}
        </a>
      </Link>
    );
  }

  let parsedOptions = [];
  try {
    parsedOptions = JSON.parse(metadata.donationOptions);
  } catch (e) {
    console.error(e);
  }

  const links = parsedOptions.map((option, i) => {
    let donateUrl = generateMonkeypodUrl(option.uuid);
    return (
      <Link href={donateUrl} key={`donate-option-${i}`}>
        <a
          href={donateUrl}
          tw="inline-block px-4 py-2 text-xs font-medium leading-4 text-center text-black hover:text-black uppercase transition bg-gray-100 border-2 border-black rounded hover:bg-gray-300"
        >
          ${option.amount}
        </a>
      </Link>
    );
  });

  return (
    <>
      <Link href={metadata.supportURL}>
        <a
          style={style}
          tw="inline-block px-4 py-2 text-xs font-medium leading-4 text-center text-white uppercase transition bg-black rounded shadow hover:text-white hover:shadow-lg focus:outline-none hover:bg-black"
          onClick={trackClick}
        >
          {metadata.supportCTA}
        </a>
      </Link>
      {links}
    </>
  );
};
export default Donate;
