import Link from 'next/link';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';

const DonateLink = styled.a(({ meta }) => ({
  ...tw`items-center bg-black text-white flex font-bold leading-4 pt-0.5 px-5 ml-5 order-2 lg:ml-0 lg:order-none`,
  fontFamily: Typography[meta.theme].DonateLink,
}));

const Donate = ({ label, url, metadata }) => {
  const { trackEvent } = useAnalytics();

  const trackClick = () => {
    trackEvent({
      action: 'Clicked',
      category: 'Donate',
      label: 'Global Nav',
      non_interaction: false,
    });
  };
  return (
    <Link href={url}>
      <DonateLink
        style={{
          minHeight: '2.375rem',
        }}
        className="site__cta button donate"
        onClick={trackClick}
        meta={metadata}
      >
        {label}
      </DonateLink>
    </Link>
  );
};
export default Donate;
