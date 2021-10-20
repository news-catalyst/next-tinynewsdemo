import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';

const AnalyticsNav = (props) => {
  return (
    <ul>
      <li>
        <Link href="/tinycms/analytics/donations">
          <a tw="cursor-pointer">Donations</a>
        </Link>
        <ul>
          <li>
            <Link href="/tinycms/analytics/donations#clicks">
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
                Clicks
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/donations#conversions">
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
                Conversions
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/donations#frequency">
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
          <li>
            <Link href="/tinycms/analytics/donations#sessions">
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
                Sessions
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
      <li>
        <Link href="/tinycms/analytics/sources">
          <a tw="cursor-pointer">Source Diversity</a>
        </Link>
        <ul>
          <li>
            <Link href="/tinycms/analytics/sources#age">
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
                Age
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sources#ethnicity">
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
                Ethnicity
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sources#gender">
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
                Gender
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sources#race">
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
                Race
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tinycms/analytics/sources#sexual_orientation">
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
                Sexual Orientation
              </a>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

AnalyticsNav.displayName = 'AnalyticsNav';

export default AnalyticsNav;
