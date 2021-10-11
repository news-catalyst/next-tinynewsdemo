import Link from 'next/link';
import tw from 'twin.macro';
import CookieConsent from 'react-cookie-consent';
import { determineTextColor } from '../../lib/utils';

export default function CookieConsentWrapper({ meta }) {
  return (
    <CookieConsent
      buttonText="I accept"
      enableDeclineButton
      flipButtons
      declineButtonText="I decline"
      style={{
        backgroundColor: meta.secondaryColor,
        color: determineTextColor(meta.secondaryColor),
      }}
      buttonStyle={{
        backgroundColor: determineTextColor(meta.primaryColor),
        color: meta.primaryColor,
        fontWeight: 'bold',
      }}
      location="bottom"
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
