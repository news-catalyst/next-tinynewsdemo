import Link from 'next/link';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import tw, { styled } from 'twin.macro';
import { determineTextColor } from '../../lib/utils';
import Typography from '../common/Typography';
import Colors from '../common/Colors';

const AdvertiseLink = styled.a(({ meta }) => ({
  ...tw`items-center flex font-bold leading-none px-5 ml-5 order-2 lg:ml-0 lg:order-none`,
  fontFamily: Typography[meta.theme].AdvertiseLink,
  backgroundColor:
    meta.color === 'custom'
      ? meta.primaryColor
      : Colors[meta.color].CTABackground,
  color:
    meta.color === 'custom'
      ? determineTextColor(meta.primaryColor)
      : Colors[meta.color].CTAText,
}));

const Advertise = ({ label, metadata }) => {
  const { trackEvent } = useAnalytics();

  const trackClick = () => {
    trackEvent({
      action: 'Clicked',
      category: 'Advertise',
      label: 'Global Nav',
      non_interaction: false,
    });
  };
  return (
    <AdvertiseLink
      style={{
        minHeight: '2.375rem',
      }}
      className="site__cta button Advertise"
      onClick={trackClick}
      meta={metadata}
      href="https://store.tryletterhead.com/catalyst-test"
    >
      {label}
    </AdvertiseLink>
  );
};
Advertise.displayName = 'Advertise';

export default Advertise;
