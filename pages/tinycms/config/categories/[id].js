import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import {
  getCategory,
  listCategoryIds,
  updateCategory,
} from '../../../../lib/category';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';

export default function EditCategory({ apiUrl, apiToken, localeID, category }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [categoryId, setCategoryId] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (category) {
      setTitle(category.title.values[0].value);
      setSlug(category.slug);
      setCategoryId(category.id);
    }
  }, []);
  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await updateCategory(
      apiUrl,
      apiToken,
      localeID,
      categoryId,
      title,
      slug
    );

    if (response.categories.updateCategory.error !== null) {
      setNotificationMessage(response.categories.updateCategory.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      setCategoryId(response.categories.updateCategory.data.id);
      // display success message
      setNotificationMessage('Successfully saved and published the category!');
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
        <h1 className="title">Edit Category</h1>

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

          <div className="field is-grouped">
            <div className="control">
              <input
                className="button is-link"
                name="submit"
                type="submit"
                value="Submit"
              />
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
  const apiUrl = process.env.ADMIN_CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;
  const localeID = process.env.LOCALE_ID;

  let category = await getCategory(context.params.id);

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      localeID: localeID,
      category: category,
    },
  };
}
