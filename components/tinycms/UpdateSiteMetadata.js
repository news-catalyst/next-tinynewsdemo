import React, { useEffect, useState } from 'react';
import { updateSiteMetadata } from '../../lib/site_metadata';
import Notification from './Notification';

export default function UpdateMetadata({ apiUrl, apiToken, metadata }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [data, setData] = useState('');

  useEffect(() => {
    if (metadata) {
      let formattedJSON = JSON.stringify(JSON.parse(metadata.data), null, 2);
      setData(formattedJSON);
    }
  }, []);

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

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
  );
}
