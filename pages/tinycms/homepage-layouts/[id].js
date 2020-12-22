import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { getHomepageLayout, updateHomepageLayout } from '../../../lib/homepage';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';

export default function EditHomepageLayout({
  apiUrl,
  apiToken,
  homepageLayout,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [homepageLayoutId, setHomepageLayoutId] = useState('');

  const [name, setName] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (homepageLayout) {
      setName(homepageLayout.name);
      setData(homepageLayout.data);
      setHomepageLayoutId(homepageLayout.id);
    }
  }, []);
  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/homepage-layouts');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await updateHomepageLayout(
      apiUrl,
      apiToken,
      homepageLayoutId,
      name,
      data
    );

    if (
      response.homepageLayoutSchemas.updateHomepageLayoutSchema.error !== null
    ) {
      setNotificationMessage(
        response.homepageLayoutSchemas.updateHomepageLayoutSchema.error
      );
      setNotificationType('error');
      setShowNotification(true);
    } else {
      setHomepageLayoutId(
        response.homepageLayoutSchemas.updateHomepageLayoutSchema.data.id
      );
      // display success message
      setNotificationMessage(
        'Successfully saved and published the homepage layout!'
      );
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
        <h1 className="title">Edit Homepage Layout</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Name
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="data">
              Data
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={data}
                name="data"
                onChange={(ev) => setData(ev.target.value)}
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
  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

  let homepageLayout = await getHomepageLayout(context.params.id);
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      homepageLayout: homepageLayout,
    },
  };
}
