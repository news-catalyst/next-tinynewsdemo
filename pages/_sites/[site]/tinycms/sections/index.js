import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import tw from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import { getLatestVersion } from '../../../../../lib/utils';
import { hasuraListAllSectionsByLocale } from '../../../../../lib/section.js';
import { AddButton } from '../../../../../components/common/CommonStyles.js';
import { getOrgSettings } from '../../../../../lib/articles.js';
import { findSetting } from '../../../../../lib/utils';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;

export default function Sections({ sections, siteUrl, host }) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;
  const currentLocale = 'en-US';

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated section.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created section.');
    }
  }, [action]);

  const listItems = sections.map((section) => {
    let title = getLatestVersion(section.category_translations, 'title', false);
    return (
      <TableRow key={section.id}>
        <TableCell>
          <Link
            key={`${section.id}-link`}
            href={`/tinycms/sections/${section.id}`}
            passHref
          >
            <a tw="underline">{title}</a>
          </Link>
        </TableCell>
        <TableCell>{section.slug}</TableCell>
        <TableCell>{section.articles_aggregate.aggregate.count}</TableCell>
        <TableCell>
          {section.published ? <CheckIcon tw="w-4" /> : <XIcon tw="w-4" />}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <AdminLayout host={host} siteUrl={siteUrl}>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div tw="container mx-auto">
        <div tw="px-10 pt-5">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Sections
          </h1>
        </div>

        {message && <div className="success">{message}</div>}

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/sections/add" passHref>
            <AddButton>Add Section</AddButton>
          </Link>
        </div>

        <Table tw="mb-10">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Article Count</TableHeader>
              <TableHeader>Show in nav?</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>{listItems}</TableBody>
        </Table>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/sections/add" passHref>
            <AddButton>Add Section</AddButton>
          </Link>
        </div>
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
    console.log('error:', settingsResult);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const host = context.req.headers.host;

  const { errors, data } = await hasuraListAllSectionsByLocale({
    url: apiUrl,
    site: site,
    localeCode: 'en-US',
  });

  if (errors) {
    console.error(errors);
    throw errors;
  }

  let sections = data.categories;

  return {
    props: {
      sections: sections,
      siteUrl: siteUrl,
      host: host,
    },
  };
}
