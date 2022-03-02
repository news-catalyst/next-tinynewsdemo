import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import Notification from '../../../../../components/tinycms/Notification';
import { getOrgSettings } from '../../../../../lib/articles.js';
import {
  deleteSingleAuthor,
  hasuraListAllAuthors,
} from '../../../../../lib/authors.js';
import {
  DeleteButton,
  AddButton,
} from '../../../../../components/common/CommonStyles.js';
import {
  displayAuthorName,
  getLatestVersion,
  findSetting,
} from '../../../../../lib/utils.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;

export default function Authors({ apiUrl, site, authors, siteUrl, host }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const currentLocale = 'en-US';
  const router = useRouter();
  const { action } = router.query;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function deleteAuthor(authorId) {
    let params = {
      url: apiUrl,
      site: site,
      id: authorId,
    };
    const { errors, data } = await deleteSingleAuthor(params);

    if (errors) {
      console.error(errors);
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Removed the author with id ' + authorId);
      setNotificationType('success');
      refreshData();
      setShowNotification(true);
    }
  }

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
  }, [action]);

  const listItems = authors.map((author) => {
    let title = getLatestVersion(author.author_translations, 'title', false);
    if (!title) {
      title = 'NEEDS TRANSLATION';
    }

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
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      ''
    );

    return (
      <TableRow key={author.id}>
        <TableCell>
          <Link href={`/tinycms/authors/${author.id}`}>
            <a tw="underline" href={`/tinycms/authors/${author.id}`}>
              {displayAuthorName(author.first_names, author.last_name)}
            </a>
          </Link>
        </TableCell>
        <TableCell tw="content-center">{staff}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>{author.twitter}</TableCell>
        <TableCell>
          <DeleteButton
            className="delete-author"
            onClick={() => {
              if (
                window.confirm('Are you sure you wish to delete this author?')
              )
                deleteAuthor(author.id);
            }}
          >
            Delete
          </DeleteButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <AdminLayout host={host} siteUrl={siteUrl}>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div tw="container mx-auto">
        <div tw="px-10 pt-5">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Authors
          </h1>
        </div>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/authors/add" passHref>
            <AddButton>Add Author</AddButton>
          </Link>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Staff</TableHeader>
              <TableHeader>Title</TableHeader>
              <TableHeader>Twitter</TableHeader>
              <TableHeader></TableHeader>
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
    console.log('error:', settingsResult);
    throw settingsResult.errors;
  }
  let settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const host = context.req.headers.host;
  const { errors, data } = await hasuraListAllAuthors({
    url: apiUrl,
    site: site,
  });

  if (errors) {
    console.error(errors);
  }

  let authors = data.authors;

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      authors: authors,
      siteUrl: siteUrl,
      host: host,
    },
  };
}
