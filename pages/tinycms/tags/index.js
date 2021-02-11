import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListAllTags } from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';

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
          title="Tags"
        />

        <ul>{listItems}</ul>
        <section className="section">
          <Link href="/tinycms/tags/add">
            <button className="button">Add Tag</button>
          </Link>
        </section>
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
