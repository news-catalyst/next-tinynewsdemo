import React from 'react';
import Link from 'next/link';

const AnalyticsNav = (props) => {
  return (
    <aside className="menu">
      <p className="menu-label">Sections:</p>
      <ul className="menu-list">
        <li>
          <a href="/tinycms/analytics/audience">Audience</a>
          <ul>
            <li>
              <Link href="/tinycms/analytics/audience#donations">
                <a>Donations</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/audience#subscriptions">
                <a>Subscriptions</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <a href="/tinycms/analytics/newsletter">Newsletters</a>
          <ul>
            <li>
              <Link href="/tinycms/analytics/newsletter#signups">
                <a>Signup Stats</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/newsletter#campaigns">
                <a>Mailchimp Campaigns</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <a href="/tinycms/analytics/pageviews">Page Views</a>
          <ul>
            <li>
              <Link href="/tinycms/analytics/pageviews#pageviews">
                <a>Page Views</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/pageviews#depth">
                <a>Reading Depth</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/pageviews#frequency">
                <a>Reading Frequency</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <a href="/tinycms/analytics/sessions">Sessions</a>
          <ul>
            <li>
              <Link href="/tinycms/analytics/sessions#daily">
                <a>Daily</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/sessions#geo">
                <a>Regional</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/sessions#referral">
                <a>Referral Sources</a>
              </Link>
            </li>
            <li>
              <Link href="/tinycms/analytics/sessions#time">
                <a>Time Spent</a>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
};

export default AnalyticsNav;
