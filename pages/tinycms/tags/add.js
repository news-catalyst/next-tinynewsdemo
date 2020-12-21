import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { cachedContents } from '../../../lib/cached';
import { createTag, listAllLocales } from '../../../lib/articles.js';

export default function AddTag({ apiUrl, apiToken, currentLocale }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // const [tagId, setTagId] = useState('');
  const [title, setTitle] = useState('');
  const [i18nTitleValues, setI18nTitleValues] = useState([]);
  const [slug, setSlug] = useState('');

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/tags');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let foundTitle = false;
    i18nTitleValues.map((localValue) => {
      if (localValue.locale === currentLocale.id) {
        foundTitle = true;
        localValue.value = title;
      }
    });
    if (!foundTitle) {
      i18nTitleValues.push({ value: title, locale: currentLocale.id });
      setI18nTitleValues(i18nTitleValues);
    }

    const response = await createTag(apiUrl, apiToken, i18nTitleValues, slug);

    if (response.tags.createTag.error !== null) {
      setNotificationMessage(response.tags.createTag.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the tag!');
      setNotificationType('success');
      setShowNotification(true);

      router.push('/tinycms/tags?action=create');
    }
  }

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
        <h1 className="title">Add a tag</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="slug">
              Slug
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={slug}
                name="slug"
                onChange={(ev) => setSlug(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                name="title"
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <input type="submit" className="button is-link" value="Submit" />
            </div>
            <div className="control">
              <button
                className="button is-link is-light"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: currentLocale,
    },
  };
}
