import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';
import { createSiteMetadata } from '../../../../lib/site_metadata';

export default function AddMetadata({ apiUrl, apiToken, localeID }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [data, setData] = useState('{}');

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await createSiteMetadata(apiUrl, apiToken, data);

    if (response.siteMetadatas.createSiteMetadata.error !== null) {
      setNotificationMessage(response.siteMetadatas.createSiteMetadata.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the metadata!');
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
        <h1 className="title">Add metadata</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Data: enter as JSON
            </label>
            <div className="control">
              <textarea
                className="textarea"
                name="data"
                onChange={(ev) => setData(ev.target.value)}
              >
                {data}
              </textarea>
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
