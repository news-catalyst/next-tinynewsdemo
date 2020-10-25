import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';
import { createCategory } from '../../../../lib/category';

export default function AddCategory({ apiUrl, apiToken, localeID }) {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [errors, setErrors] = useState([]);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config/categories');
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

    const response = await createCategory(
      apiUrl,
      apiToken,
      localeID,
      title,
      slug
    );

    if (response.categories.createCategory.error !== null) {
      console.log('error creating category:', response.categories);
      setNotificationMessage(response.categories.createCategory.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // console.log("success creating category:", response.categories);
      // display success message
      setNotificationMessage([
        'Successfully saved and published the category!',
      ]);
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
