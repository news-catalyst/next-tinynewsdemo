import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import tw, { styled } from 'twin.macro';
import { determineTextColor } from '../../lib/utils';
import Typography from '../common/Typography';
import Colors from '../common/Colors';

const AdvertiseLink = styled.a(({ meta }) => ({
  ...tw`inline-flex text-base font-bold cursor-pointer items-center px-5 hover:underline`,
  fontFamily: Typography[meta.theme]
    ? Typography[meta.theme].AdvertiseLink
    : Typography['styleone'].AdvertiseLink,
  backgroundColor:
    meta.color === 'custom'
      ? meta.primaryColor
      : Colors[meta.color]
      ? Colors[meta.color].CTABackground
      : Colors['colorone'].CTABackground,
  color:
    meta.color === 'custom'
      ? determineTextColor(meta.primaryColor)
      : Colors[meta.color]
      ? Colors[meta.color].CTAText
      : Colors['colorone'].CTAText,
}));

const Advertise = ({ label, metadata }) => {
  const { trackEvent } = useAnalytics();

  const trackClick = () => {
    trackEvent({
      action: 'Clicked',
      category: 'Advertise',
      label: 'Article promotion',
      non_interaction: false,
    });
  };
  return (
    <AdvertiseLink
      style={{
        minHeight: '2.375rem',
      }}
      onClick={trackClick}
      meta={metadata}
      href={process.env.NEXT_PUBLIC_LETTERHEAD_ADVERTISING_STORE}
    >
      {label}
    </AdvertiseLink>
  );
};
Advertise.displayName = 'Advertise';

export default Advertise;
