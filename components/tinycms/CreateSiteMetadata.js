import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Notification from './Notification';
import { createSiteMetadata, getSiteMetadata } from '../../lib/site_metadata';

export default function AddMetadata(props) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState('{}');
  const [metadataID, setMetadataID] = useState(null);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await createSiteMetadata(
      props.apiUrl,
      props.apiToken,
      data
    );

    if (response.siteMetadatas.createSiteMetadata.error !== null) {
      setNotificationMessage(response.siteMetadatas.createSiteMetadata.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the metadata!');
      setNotificationType('success');
      setShowNotification(true);
      let id = response.siteMetadatas.createSiteMetadata.data.id;
      setMetadataID(id);
      let siteMetadata = await getSiteMetadata(props.apiUrl, props.apiToken);
      props.setMetadata(siteMetadata);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div className="field">
        <label className="label" htmlFor="name">
          Data: enter as JSON
        </label>
        <div className="control">
          <textarea
            className="textarea"
            name="data"
            value={data}
            onChange={(ev) => setData(ev.target.value)}
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
  );
}
