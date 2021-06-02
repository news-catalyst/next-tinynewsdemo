import NewsletterBlock from './NewsletterBlock';
import DonationBlock from './DonationBlock';

export default function PromotionBlock({ metadata, prefer }) {
  let promo = null;
  const newsletter = <NewsletterBlock metadata={metadata} />;
  const donation = <DonationBlock metadata={metadata} />;

  if (prefer === 'newsletter') {
    if (process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL) {
      promo = newsletter;
    } else if (process.env.NEXT_PUBLIC_MONKEYPOD_URL) {
      promo = donation;
    }
  }
  if (prefer === 'donation') {
    if (process.env.NEXT_PUBLIC_MONKEYPOD_URL) {
      promo = donation;
    } else if (process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL) {
      promo = newsletter;
    }
  }

  return promo;
}
