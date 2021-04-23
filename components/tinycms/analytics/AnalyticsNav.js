import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';

const AnalyticsNav = (props) => {
  return (
    <ul>
      <li>
        <a href="/tinycms/analytics/audience">Audience</a>
        <ul>
          <li>
            <Link href="/tinycms/analytics/audience#donations">
              <a
                href="/tinycms/analytics/audience#donations"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Donations
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/audience#subscriptions">
              <a
                href="/tinycms/analytics/audience#subscriptions"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Subscriptions
              </a>
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <a href="/tinycms/analytics/newsletter">Newsletters</a>
        <ul>
          <li>
            <Link href="/tinycms/analytics/newsletter#signups">
              <a
                href="/tinycms/analytics/newsletter#signups"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Signup Stats
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/newsletter#campaigns">
              <a
                href="/tinycms/analytics/newsletter#signups"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Mailchimp Campaigns
              </a>
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <a href="/tinycms/analytics/pageviews">Page Views</a>
        <ul>
          <li>
            <Link href="/tinycms/analytics/pageviews#pageviews">
              <a
                href="/tinycms/analytics/pageviews#pageviews"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Page Views
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/pageviews#depth">
              <a
                href="/tinycms/analytics/pageviews#depth"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Reading Depth
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/pageviews#frequency">
              <a
                href="/tinycms/analytics/pageviews#frequency"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Reading Frequency
              </a>
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <a href="/tinycms/analytics/sessions">Sessions</a>
        <ul>
          <li>
            <Link href="/tinycms/analytics/sessions#daily">
              <a
                href="/tinycms/analytics/sessions#daily"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Daily
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sessions#geo">
              <a
                href="/tinycms/analytics/sessions#geo"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Regional
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sessions#referral">
              <a
                href="/tinycms/analytics/sessions#referral"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Referral Sources
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sessions#time">
              <a
                href="/tinycms/analytics/sessions#time"
                tw="w-full flex align-bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  tw="float-left align-bottom h-6 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Time Spent
              </a>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default AnalyticsNav;
