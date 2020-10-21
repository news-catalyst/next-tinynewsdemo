import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import {
  getSiteMetadata,
  updateSiteMetadata,
} from '../../../../lib/site_metadata';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';

export default function EditMetadata({ apiUrl, apiToken, metadata }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (metadata) {
      setName(metadata.name);
      setDescription(metadata.description);
      setLogo(metadata.logo);
    }
  }, []);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let data = {
      name: name,
      description: description,
      logo: logo,
    };
    const response = await updateSiteMetadata(
      apiUrl,
      apiToken,
      metadata.id,
      data
    );

    if (response.siteMetadatas.updateSiteMetadata.error !== null) {
      setNotificationMessage(response.siteMetadatas.updateSiteMetadata.error);
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
        <h1 className="title">Edit Site Metadata</h1>

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

  let metadata = await getSiteMetadata(context.params.id);

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      metadata: metadata,
    },
  };
}
