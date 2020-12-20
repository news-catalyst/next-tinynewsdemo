import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { listAllLocales, listAllTags } from '../../../lib/articles.js';
import { localiseText } from '../../../lib/utils.js';
import { cachedContents } from '../../../lib/cached';

export default function Tags({ tags, currentLocale }) {
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
    let title = localiseText(currentLocale, tag.title);

    return (
      <li key={tag.id}>
        <Link key={`${tag.id}-link`} href={`/tinycms/tags/${tag.id}`}>
          <a>{title}</a>
        </Link>{' '}
        ({tag.slug})
      </li>
    );
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} />
      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div id="page">
        <h1 className="title">Tags</h1>
        <Link href="/tinycms/tags/add">Add Tag</Link>

        <ul>{listItems}</ul>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  let tags = await listAllTags();
  return {
    props: {
      tags: tags,
      currentLocale: currentLocale,
    },
  };
}
