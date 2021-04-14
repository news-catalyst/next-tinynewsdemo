import Link from 'next/link';
import React from 'react';
import { hasuraListLocales } from '../../lib/articles.js';
import AdminLayout from '../../components/AdminLayout.js';
import AdminNav from '../../components/nav/AdminNav';
import AdminHeader from '../../components/tinycms/AdminHeader';
import tw from 'twin.macro';

const CardsContainer = tw.section`flex items-center justify-center p-4 bg-white grid grid-cols-2 gap-2`;
const Card = tw.div`max-w-lg w-full rounded-lg shadow-lg p-4 flex flex-row`;
const CardIcon = tw.div`lg:w-1/5 h-auto`;
const CardContentContainer = tw.div`lg:w-4/5 p-2`;
const CardHeader = tw.h3`font-semibold text-lg tracking-wide`;
const CardContent = tw.p`text-gray-500 my-1`;

export default function TinyCmsHome(props) {
  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <AdminHeader
          locales={props.locales}
          currentLocale={props.currentLocale}
          title="tinycms site config"
        />

        <CardsContainer>
          <Card>
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </CardIcon>
            <CardContentContainer>
              <CardHeader>
                <Link href="/tinycms/analytics">
                  <a href="/tinycms/analytics">Analytics</a>
                </Link>
              </CardHeader>
              <CardContent>
                Learn more about your audience via data from Google Analytics
                and Mailchimp.
              </CardContent>
            </CardContentContainer>
          </Card>
          <Card>
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </CardIcon>
            <CardContentContainer>
              <CardHeader>
                <Link href="/tinycms/homepage">
                  <a href="/tinycms/homepage">Homepage</a>
                </Link>
              </CardHeader>
              <CardContent>
                Choose the layout and featured stories on your homepage.
              </CardContent>
            </CardContentContainer>
          </Card>
          <Card>
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </CardIcon>
            <CardContentContainer>
              <CardHeader>
                <Link href="/tinycms/metadata">
                  <a href="/tinycms/metadata">Settings</a>
                </Link>
              </CardHeader>
              <CardContent>
                Customize the look, feel and language of your website.
              </CardContent>
            </CardContentContainer>
          </Card>
          <Card>
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </CardIcon>
            <CardContentContainer>
              <CardHeader>
                <Link href="/tinycms/authors">
                  <a href="/tinycms/authors">Authors</a>
                </Link>
              </CardHeader>
              <CardContent>
                Add, remove and edit authors on your website.
              </CardContent>
            </CardContentContainer>
          </Card>
          <Card>
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </CardIcon>
            <CardContentContainer>
              <CardHeader>
                <Link href="/tinycms/sections">
                  <a href="/tinycms/sections">Sections</a>
                </Link>
              </CardHeader>
              <CardContent>
                Add, remove and edit the overall sections or categories on your
                website.
              </CardContent>
            </CardContentContainer>
          </Card>
          <Card>
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </CardIcon>
            <CardContentContainer>
              <CardHeader>
                <Link href="/tinycms/tags">
                  <a href="/tinycms/tags">Tags</a>
                </Link>
              </CardHeader>
              <CardContent>
                Add, remove and edit the tags for content on your website.
              </CardContent>
            </CardContentContainer>
          </Card>
        </CardsContainer>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;
  const { errors, data } = await hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;

  if (errors || !data) {
    console.log('error listing locales:', errors);
    return {
      notFound: true,
    };
  } else {
    locales = data.organization_locales;
  }

  return {
    props: {
      locales: locales,
      currentLocale: context.locale,
    },
  };
}
