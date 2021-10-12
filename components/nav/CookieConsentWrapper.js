import Link from 'next/link';
import tw from 'twin.macro';
import CookieConsent from 'react-cookie-consent';
import { determineTextColor } from '../../lib/utils';
import { useAnalytics, initialize } from '../../lib/hooks/useAnalytics.js';

export default function CookieConsentWrapper({ meta }) {
  const hookObj = useAnalytics();

  const initalizeAnalytics = function () {
    initialize(hookObj);
  };

  return (
    <CookieConsent
      buttonText="Accept"
      enableDeclineButton
      flipButtons
      declineButtonText="Decline"
      style={{
        backgroundColor: meta.secondaryColor || 'black',
        color: determineTextColor(meta.secondaryColor) || 'white',
      }}
      buttonStyle={{
        backgroundColor: determineTextColor(meta.primaryColor) || 'white',
        color: meta.primaryColor || 'black',
        fontWeight: 'bold',
      }}
      location="bottom"
      onAccept={initalizeAnalytics}
    >
      This website uses cookies. We use cookies to analyze our traffic and
      ensure our website functions correctly. Read our cookie policy{' '}
      <Link href="/cookies">
        <a tw="underline cursor-pointer">here</a>
      </Link>
      .
    </CookieConsent>
  );
}
