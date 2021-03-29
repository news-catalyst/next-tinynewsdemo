import Link from 'next/link';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';

const Donate = ({ label, url }) => {
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
    <Link href={url} onClick={trackClick}>
      <a className="site__cta button">{label}</a>
    </Link>
  );
};
export default Donate;
