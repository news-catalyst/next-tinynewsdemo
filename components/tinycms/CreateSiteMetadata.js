import React, { useState } from 'react';
import Notification from './Notification';
import { createSiteMetadata } from '../../lib/site_metadata';

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
          <button className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  );
}
