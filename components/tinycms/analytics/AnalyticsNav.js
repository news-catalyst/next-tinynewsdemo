import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';

const AnalyticsNav = (props) => {
  return (
    <ul>
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
