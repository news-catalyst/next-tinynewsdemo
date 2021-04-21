import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import tw from 'twin.macro';
import { hasuraLocaliseText } from '../../../lib/utils';
import { hasuraListAllSectionsByLocale } from '../../../lib/section.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;
const AddSectionButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

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
  }, []);

  const listItems = sections.map((section) => {
    let title = hasuraLocaliseText(section.category_translations, 'title');
    return (
      <TableRow key={section.id}>
        <TableCell>
          <Link
            key={`${section.id}-link`}
            href={`/tinycms/sections/${section.id}`}
          >
            <a>{title}</a>
          </Link>
        </TableCell>
        <TableCell>{section.slug}</TableCell>
      </TableRow>
    );
  });

  return (
    <AdminLayout>
      <AdminNav
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
          <Link href="/tinycms/sections/add">
            <AddSectionButton>Add Section</AddSectionButton>
          </Link>
        </div>

        <Table tw="mb-10">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Slug</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>{listItems}</TableBody>
        </Table>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/sections/add">
            <AddSectionButton>Add Section</AddSectionButton>
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
    localeCode: context.locale,
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
