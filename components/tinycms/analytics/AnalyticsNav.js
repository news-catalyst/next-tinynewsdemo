import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';

const AnalyticsNav = (props) => {
  return (
    <ul>
      <li>
        <Link href="/tinycms/analytics/audience">
          <a tw="cursor-pointer">Audience</a>
        </Link>
        <ul>
          <li>
            <Link href="/tinycms/analytics/audience#donations">
              <a tw="w-full flex align-bottom cursor-pointer">
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
              <a tw="w-full flex align-bottom cursor-pointer">
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
        <Link href="/tinycms/analytics/newsletter">
          <a tw="cursor-pointer">Newsletters</a>
        </Link>
        <ul>
          <li>
            <Link href="/tinycms/analytics/newsletter#signups">
              <a tw="w-full flex align-bottom cursor-pointer">
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
              <a tw="w-full flex align-bottom cursor-pointer">
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
        <Link href="/tinycms/analytics/pageviews">
          <a tw="cursor-pointer">Page Views</a>
        </Link>
        <ul>
          <li>
            <Link href="/tinycms/analytics/pageviews#pageviews">
              <a tw="w-full flex align-bottom cursor-pointer">
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
              <a tw="w-full flex align-bottom cursor-pointer">
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
              <a tw="w-full flex align-bottom cursor-pointer">
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
        <Link href="/tinycms/analytics/sessions">
          <a tw="cursor-pointer">Sessions</a>
        </Link>
        <ul>
          <li>
            <Link href="/tinycms/analytics/sessions#daily">
              <a tw="w-full flex align-bottom cursor-pointer">
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
              <a tw="w-full flex align-bottom">
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
              <a tw="w-full flex align-bottom">
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
              <a tw="w-full flex align-bottom">
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
