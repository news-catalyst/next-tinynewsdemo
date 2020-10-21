import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';
import { createCategory } from '../../../../lib/category';

export default function AddCategory({ apiUrl, apiToken, localeID }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await createCategory(
      apiUrl,
      apiToken,
      localeID,
      title,
      slug
    );

    if (response.categories.createCategory.error !== null) {
      setNotificationMessage(response.categories.createCategory.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the category!');
      setNotificationType('success');
      setShowNotification(true);
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
        <h1 className="title">Add a category</h1>

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
              <button className="button is-link is-light">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
  const localeID = process.env.LOCALE_ID;
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      localeID: localeID,
    },
  };
}
