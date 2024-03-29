import Link from 'next/link';
import React from 'react';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';
import tw from 'twin.macro';
import {
  ChartBarIcon,
  HomeIcon,
  CogIcon,
  UserIcon,
  CollectionIcon,
  TagIcon,
  MenuIcon,
} from '@heroicons/react/solid';
import { findSetting, getOrgSettings } from '../../../../lib/settings.js';

const Content = tw.div`max-w-6xl my-16 mx-auto`;
const Header = tw.h1`text-3xl font-bold text-center`;
const CardsContainer = tw.section`flex items-center justify-center p-4 bg-white grid grid-cols-2 gap-2 mx-auto`;
const Card = tw.div`max-w-lg w-full rounded-lg shadow-lg p-4 flex flex-row bg-gray-100 my-4`;
const CardIcon = tw.div`lg:w-1/5 h-auto text-blue-700 mr-4`;
const CardContentContainer = tw.div`lg:w-4/5 p-2`;
const CardHeader = tw.h3`font-semibold text-lg tracking-wide`;
const CardContent = tw.p`text-gray-500 my-1`;

const cardContent = [
  {
    title: 'Analytics',
    description: 'View your source diversity data.',
    href: '/tinycms/analytics',
    icon: <ChartBarIcon />,
  },
  {
    title: 'Homepage',
    description: 'Choose the layout and featured stories on your homepage.',
    href: '/tinycms/homepage',
    icon: <HomeIcon />,
  },
  {
    title: 'Settings',
    description: 'Customize the look, feel and language of your website.',
    href: '/tinycms/settings',
    icon: <CogIcon />,
  },
  {
    title: 'Nav Builder',
    description: 'Customize the navigation links on your website.',
    href: '/tinycms/nav',
    icon: <MenuIcon />,
  },
  {
    title: 'Authors',
    description: 'Add, remove and edit authors on your website.',
    href: '/tinycms/authors',
    icon: <UserIcon />,
  },
  {
    title: 'Sections',
    description:
      'Add, remove and edit the overall sections or categories on your website.',
    href: '/tinycms/sections',
    icon: <CollectionIcon />,
  },
  {
    title: 'Tags',
    description: 'Add, remove and edit the tags fo content on your website.',
    href: '/tinycms/tags',
    icon: <TagIcon />,
  },
];

export default function TinyCmsHome(props) {
  return (
    <AdminLayout
      host={props.host}
      siteUrl={props.siteUrl}
      authorizedEmailDomains={props.authorizedEmailDomains}
    >
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <Content>
          <Header>Welcome to the TinyCMS!</Header>
          <CardsContainer>
            {cardContent.map((card) => (
              <Link href={card.href} key={card.title}>
                <a>
                  <Card>
                    <CardIcon>{card.icon}</CardIcon>
                    <CardContentContainer>
                      <CardHeader>{card.title}</CardHeader>
                      <CardContent>{card.description}</CardContent>
                    </CardContentContainer>
                  </Card>
                </a>
              </Link>
            ))}
          </CardsContainer>
        </Content>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('error:', settingsResult);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const authorizedEmailDomains = findSetting(
    settings,
    'AUTHORIZED_EMAIL_DOMAINS'
  );
  const host = context.req.headers.host; // will give you localhost:3000

  return {
    props: {
      host,
      siteUrl,
      authorizedEmailDomains,
    },
  };
}
