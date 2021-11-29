import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import tw from 'twin.macro';
import { hasuraLocalizeText } from '../../../lib/utils';
import { hasuraListAllSectionsByLocale } from '../../../lib/section.js';
import {
  DeleteButton,
  AddButton,
} from '../../../components/common/CommonStyles.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;

export default function Sections({ sections, currentLocale, locales }) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated section.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created section.');
    }
  }, [action]);

  const listItems = sections.map((section) => {
    let title = hasuraLocalizeText(
      currentLocale,
      section.category_translations,
      'title',
      false
    );
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
    <AdminLayout>
      <AdminNav
        switchLocales={true}
        currentLocale={currentLocale}
        locales={locales}
        homePageEditor={false}
        showConfigOptions={true}
      />
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
  const apiToken = process.env.ORG_SLUG;

  const { errors, data } = await hasuraListAllSectionsByLocale({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (errors) {
    console.error(errors);
  }

  let sections = data.categories;
  let locales = data.organization_locales;

  return {
    props: {
      sections: sections,
      currentLocale: context.locale,
      locales: locales,
    },
  };
}
