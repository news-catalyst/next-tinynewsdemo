import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { listAllLocales } from '../../../lib/articles.js';
import { listAllAuthors } from '../../../lib/authors.js';
import { localiseText } from '../../../lib/utils.js';
import { cachedContents } from '../../../lib/cached';

export default function Authors({ authors, currentLocale }) {
  // const [message, setMessage] = useState(null);
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
    let title = localiseText(currentLocale, author.title);

    return (
      <li key={author.id}>
        <Link key={`${author.id}-link`} href={`/tinycms/authors/${author.id}`}>
          <a>
            {author.name}, {title}
          </a>
        </Link>
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
        <h1 className="title">Authors</h1>
        <Link href="/tinycms/authors/add">Add Author</Link>

        {/* {message && <div className="success">{message}</div>} */}
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

  let authors = await listAllAuthors();
  return {
    props: {
      authors: authors,
      currentLocale: currentLocale,
    },
  };
}
