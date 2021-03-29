import Link from 'next/link';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';

const Donate = ({ label, url }) => {
  const { trackEvent } = useAnalytics();

  const trackClick = () => {
    console.log('click');
    trackEvent({
      action: 'Clicked',
      category: 'Donate',
      label: 'Global Nav',
      non_interaction: false,
    });
  };
  return (
    <Link href={url}>
      <a className="site__cta button" onClick={trackClick}>
        {label}
      </a>
    </Link>
  );
};
export default Donate;
