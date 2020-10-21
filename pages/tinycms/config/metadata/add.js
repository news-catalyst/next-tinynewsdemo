import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';
import { createSiteMetadata } from '../../../../lib/site_metadata';

export default function AddMetadata({ apiUrl, apiToken, localeID }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    let data = {
      name: name,
      description: description,
      logo: logo,
    };
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
      <AdminNav homePageEditor={false} />

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
            <label className="label" htmlFor="description">
              Description
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={description}
                name="description"
                onChange={(ev) => setDescription(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="logo">
              Logo
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={logo}
                name="logo"
                onChange={(ev) => setLogo(ev.target.value)}
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
