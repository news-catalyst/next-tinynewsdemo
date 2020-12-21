import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import Notification from '../../../components/tinycms/Notification';
import { createSection } from '../../../lib/section';
import { listAllLocales } from '../../../lib/articles.js';
import { cachedContents } from '../../../lib/cached';

export default function AddSection({
  apiUrl,
  apiToken,
  currentLocale,
  locales,
}) {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [errors, setErrors] = useState([]);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/sections');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let formIsValid = true;

    if (title === null || title === '') {
      if (errors.indexOf('Title is required.') < 0) {
        errors.push('Title is required.');
        setErrors(errors);
      }
      console.log('errors:', errors);
      formIsValid = false;
    } else {
      let removeAtIndex = errors.indexOf('Title is required.');
      errors.splice(removeAtIndex, 1);
      setErrors(errors);
    }

    if (slug === null || slug === '') {
      if (errors.indexOf('Slug is required.') < 0) {
        errors.push('Slug is required.');
        setErrors(errors);
      }
      console.log('errors:', errors);
      formIsValid = false;
    }

    if (!formIsValid) {
      setNotificationMessage(errors);
      console.log(notificationMessage);
      setNotificationType('error');
      setShowNotification(true);
      return;
    }

    const response = await createSection(
      apiUrl,
      apiToken,
      currentLocale,
      title,
      slug
    );

    if (response.categories.createCategory.error !== null) {
      console.log('error creating category:', response.categories);
      setNotificationMessage(response.categories.createCategory.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage(['Successfully saved and published the section!']);
      setNotificationType('success');
      setShowNotification(true);
    }
  }

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
          title="Add a Section"
        />

        <form onSubmit={handleSubmit}>
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

          <div className="field">
            <label className="label" htmlFor="data">
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

          <div className="field is-grouped">
            <div className="control">
              <input type="submit" className="button is-link" value="Submit" />
            </div>
            <div className="control">
              <button
                className="button is-link is-light"
                name="cancel"
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
      locales: localeMappings,
    },
  };
}
