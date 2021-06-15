import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import tw from 'twin.macro';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListAllTags } from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;
const AddTagButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function Tags({ tags, currentLocale, locales }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setNotificationMessage('Successfully updated tag.');
      setNotificationType('success');
      setShowNotification(true);
    }
    if (action && action === 'create') {
      setNotificationMessage('Successfully created tag.');
      setNotificationType('success');
      setShowNotification(true);
    }
  }, []);

  const listItems = tags.map((tag) => {
    let title = hasuraLocaliseText(tag.tag_translations, 'title');

    return (
      <TableRow key={tag.id}>
        <TableCell>
          <Link key={`${tag.id}-link`} href={`/tinycms/tags/${tag.id}`}>
            <a>{title}</a>
          </Link>
        </TableCell>
        <TableCell>{tag.slug}</TableCell>
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
      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div tw="container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16">
        <div tw="pt-5 pb-10">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Tags
          </h1>
        </div>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/tags/add" passHref>
            <AddTagButton>Add Tag</AddTagButton>
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
          <Link href="/tinycms/tags/add" passHref>
            <AddTagButton>Add Tag</AddTagButton>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let tags;
  let locales;

  const { errors, data } = await hasuraListAllTags({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (errors || !data) {
    console.error('error listing tags:', errors);
    return {
      notFound: true,
    };
  } else {
    tags = data.tags;
    locales = data.organization_locales;
  }

  return {
    props: {
      tags: tags,
      currentLocale: context.locale,
      locales: locales,
    },
  };
}
