import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { useRouter } from 'next/router';
import { hasuraListHomepageLayoutSchemas } from '../../../../../lib/homepage.js';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import {
  DeleteButton,
  AddButton,
} from '../../../../../components/common/CommonStyles.js';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;

export default function HomepageLayouts({
  homepageLayouts,
  siteUrl,
  host,
  authorizedEmailDomains,
}) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated homepage layout.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created homepage layout.');
    }
  }, [action]);

  const listItems = homepageLayouts.map((homepageLayout) => {
    return (
      <TableRow key={homepageLayout.id}>
        <TableCell>
          <Link href={`/tinycms/homepage-layouts/${homepageLayout.id}`}>
            <a tw="underline cursor-pointer">{homepageLayout.name}</a>
          </Link>
        </TableCell>
        <TableCell>{homepageLayout.data}</TableCell>
      </TableRow>
    );
  });

  return (
    <AdminLayout
      host={host}
      siteUrl={siteUrl}
      authorizedEmailDomains={authorizedEmailDomains}
    >
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div tw="container mx-auto">
        <div tw="px-10 pt-5">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Homepage Layouts
          </h1>
        </div>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/homepage-layouts/add" passHref>
            <AddButton>Add Layout</AddButton>
          </Link>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Data</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>{listItems}</TableBody>
        </Table>
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
  let settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const authorizedEmailDomains = findSetting(
    settings,
    'AUTHORIZED_EMAIL_DOMAINS'
  );
  const host = context.req.headers.host;

  const { errors, data } = await hasuraListHomepageLayoutSchemas({
    url: apiUrl,
    site: site,
  });

  let homepageLayouts;
  if (errors) {
    throw errors;
  } else {
    homepageLayouts = data.homepage_layout_schemas;
  }

  return {
    props: {
      homepageLayouts: homepageLayouts,
      siteUrl: siteUrl,
      host: host,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
