import Link from 'next/link';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import tw, { styled } from 'twin.macro';
import { determineTextColor } from '../../lib/utils';
import Typography from '../common/Typography';
import Colors from '../common/Colors';

const DonateLink = styled.a(({ meta }) => ({
  ...tw`items-center flex font-bold leading-none px-5 ml-5 order-2 lg:ml-0 lg:order-none`,
  fontFamily:
    Typography && Typography[meta.theme]
      ? Typography[meta.theme].DonateLink
      : '',
  backgroundColor:
    meta.color === 'custom'
      ? meta.primaryColor
      : Colors[meta.color]
      ? Colors[meta.color].CTABackground
      : '',
  color:
    meta.color === 'custom'
      ? determineTextColor(meta.primaryColor)
      : Colors[meta.color]
      ? Colors[meta.color].CTAText
      : '',
}));

const Donate = ({ label, metadata }) => {
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
    <Link href="/donate" passHref>
      <DonateLink
        style={{
          minHeight: '2.375rem',
        }}
        className="site__cta button donate"
        onClick={trackClick}
        meta={metadata}
        href="/donate"
      >
        {label}
      </DonateLink>
    </Link>
  );
};

Donate.displayName = 'Donate';

export default Donate;
