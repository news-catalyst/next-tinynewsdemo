import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import tw from 'twin.macro';
import Notification from '../../../../../components/tinycms/Notification';
import {
  getOrgSettings,
  hasuraListAllTagsByLocale,
} from '../../../../../lib/articles.js';
import { deleteSingleTag } from '../../../../../lib/section.js';
import { findSetting, getLatestVersion } from '../../../../../lib/utils.js';
import {
  DeleteButton,
  AddButton,
} from '../../../../../components/common/CommonStyles.js';

const Table = tw.table`table-auto w-full`;
const TableHead = tw.thead``;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableHeader = tw.th`px-4 py-2`;
const TableCell = tw.td`border px-4 py-2`;
const AddTagButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function Tags({ apiUrl, site, tags, siteUrl, host }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();
  const { action } = router.query;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function deleteTag(tagId) {
    let params = {
      url: apiUrl,
      site: site,
      id: tagId,
    };
    const { errors, data } = await deleteSingleTag(params);

    if (errors) {
      console.error(errors);
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Removed the tag with id ' + tagId);
      setNotificationType('success');
      refreshData();
      setShowNotification(true);
    }
  }

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
  }, [action]);

  const listItems = tags.map((tag) => {
    let title = getLatestVersion(tag.tag_translations, 'title', false);

    return (
      <TableRow key={tag.id}>
        <TableCell>
          <Link
            key={`${tag.id}-link`}
            href={`/tinycms/tags/${tag.id}`}
            passHref
          >
            <a tw="underline">{title}</a>
          </Link>
        </TableCell>
        <TableCell>{tag.slug}</TableCell>
        <TableCell>{tag.tag_articles_aggregate.aggregate.count}</TableCell>

        <TableCell>
          <DeleteButton
            className="delete-tag"
            onClick={() => {
              if (window.confirm('Are you sure you wish to delete this tag?'))
                deleteTag(tag.id);
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
      <div tw="container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16">
        <div tw="pt-5 pb-10">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Tags
          </h1>
        </div>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/tags/add" passHref>
            <AddButton>Add Tag</AddButton>
          </Link>
        </div>

        <Table tw="mb-10">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Article Count</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>{listItems}</TableBody>
        </Table>

        <div tw="flex pt-8 justify-end">
          <Link href="/tinycms/tags/add" passHref>
            <AddButton>Add Tag</AddButton>
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

  let tags;

  const { errors, data } = await hasuraListAllTagsByLocale({
    url: apiUrl,
    site: site,
  });

  if (errors || !data) {
    console.error('error listing tags:', errors);
    return {
      notFound: true,
    };
  } else {
    tags = data.tags;
  }

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      tags: tags,
      siteUrl: siteUrl,
      host: host,
    },
  };
}
