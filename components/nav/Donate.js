import Link from 'next/link';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';
import Colors from '../common/Colors';

const DonateLink = styled.a(({ meta }) => ({
  ...tw`items-center flex font-bold leading-none px-5 ml-5 order-2 lg:ml-0 lg:order-none`,
  fontFamily: Typography[meta.theme].DonateLink,
  color: Colors[meta.color].CTAText,
  backgroundColor: Colors[meta.color].CTABackground,
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
