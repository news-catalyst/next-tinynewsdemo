import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListAllAuthors } from '../../../lib/authors.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';

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
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div id="page">
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Authors"
        />

        {/* {message && <div className="success">{message}</div>} */}
        <ul>{listItems}</ul>

        <section className="section">
          <Link href="/tinycms/authors/add">
            <button className="button">Add an Author</button>
          </Link>
        </section>
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
