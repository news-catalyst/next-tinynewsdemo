import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { createHomepageLayoutSchema } from '../../../lib/homepage';

export default function AddHomepageLayout({ apiUrl, apiToken }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [data, setData] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await createHomepageLayoutSchema(
      apiUrl,
      apiToken,
      name,
      data
    );

    if (
      response.homepageLayoutSchemas.createHomepageLayoutSchema.error !== null
    ) {
      setNotificationMessage(
        response.homepageLayoutSchemas.createHomepageLayoutSchema.error
      );
      setNotificationType('error');
      setShowNotification(true);
    } else {
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
        <h1 className="title">Add a homepage layout</h1>

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
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
    },
  };
}
