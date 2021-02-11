import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Notification from './Notification';
import { hasuraUpsertMetadata } from '../../lib/site_metadata';

export default function AddMetadata(props) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jsonData, setJsonData] = useState('{}');
  const [metadataID, setMetadataID] = useState(null);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const { errors, data } = await hasuraUpsertMetadata({
      url: props.apiUrl,
      orgSlug: props.apiToken,
      data: JSON.parse(jsonData),
      published: true,
      localeCode: props.currentLocale,
    });
    if (errors) {
      setNotificationMessage(JSON.stringify(errors));
      setNotificationType('error');
      setShowNotification(true);
    } else {
      let id = data.insert_site_metadatas.returning[0].id;
      setMetadataID(id);
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
            value={jsonData}
            onChange={(ev) => setJsonData(ev.target.value)}
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
