import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'twin.macro';
import AdminLayout from '../../../components/AdminLayout.js';
import LocaleSwitcher from '../../../components/tinycms/LocaleSwitcher';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListAllAuthors } from '../../../lib/authors.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;
const AddAuthorButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function Authors({ authors, currentLocale, locales }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setNotificationMessage('Successfully updated author.');
      setNotificationType('success');
      setShowNotification(true);
    }
    if (action && action === 'create') {
      setNotificationMessage('Successfully created author.');
      setNotificationType('success');
      setShowNotification(true);
    }
  }, []);

  const listItems = authors.map((author) => {
    let title = hasuraLocaliseText(author.author_translations, 'title');
    let bio = hasuraLocaliseText(author.author_translations, 'bio');
    let staff = author.staff ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        width="24"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      ''
    );

    return (
      <TableRow key={author.id}>
        <TableCell>{author.name}</TableCell>
        <TableCell tw="content-center">{staff}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>{author.twitter}</TableCell>
        <TableCell>{bio}</TableCell>
      </TableRow>
    );
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div tw="container mx-auto">
        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/authors/add">
            <AddAuthorButton>Add Author</AddAuthorButton>
          </Link>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Staff</TableHeader>
              <TableHeader>Title</TableHeader>
              <TableHeader>Twitter</TableHeader>
              <TableHeader>Bio</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>{listItems}</TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const { errors, data } = await hasuraListAllAuthors(context.locale);

  if (errors) {
    console.error(errors);
  }

  let authors = data.authors;
  let locales = data.organization_locales;

  return {
    props: {
      authors: authors,
      currentLocale: context.locale,
      locales: locales,
    },
  };
}
