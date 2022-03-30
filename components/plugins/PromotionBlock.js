import NewsletterBlock from './NewsletterBlock';
import DonationBlock from './DonationBlock';
import storage from 'local-storage-fallback';

export default function PromotionBlock({
  metadata,
  prefer,
  site,
  monkeypodLink,
}) {
  let promo = null;
  const newsletter = <NewsletterBlock metadata={metadata} site={site} />;
  const donation = <DonationBlock metadata={metadata} />;

  if (!metadata || metadata.shortName === 'Tiny News Collective Curriculum') {
    promo = <div />;
  } else if (prefer === 'newsletter') {
    if (!storage.getItem('TNCNewsletterSubscriber')) {
      promo = newsletter;
    } else if (monkeypodLink) {
      promo = donation;
    }
  } else if (prefer === 'donation') {
    if (monkeypodLink) {
      promo = donation;
    } else {
      promo = newsletter;
    }
  }

  return promo;
}
