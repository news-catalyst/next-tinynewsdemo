import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { updateSiteMetadata } from '../../lib/site_metadata';
import Notification from './Notification';

export default function UpdateMetadata(props) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState('');
  const [parsedData, setParsedData] = useState({});

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParsedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (props.metadata) {
      console.log('metadata.data:', typeof props.metadata.data);
      let parsed = props.metadata.data;
      if (typeof props.metadata.data === 'string') {
        parsed = JSON.parse(props.metadata.data);
      }
      setParsedData(parsed);
      let formattedJSON = JSON.stringify(parsed, null, 2);
      setData(formattedJSON);
    }
  }, []);

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    console.log(parsedData);

    const response = await updateSiteMetadata(
      props.apiUrl,
      props.apiToken,
      props.metadata.id,
      parsedData
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
          JSON Data:
        </label>
        <div className="control">
          <pre>{data}</pre>
        </div>
      </div>
      {Object.keys(parsedData).map((key) => (
        <div className="field" key={key}>
          <label className="label" htmlFor={key}>
            {key}
          </label>
          <div className="control">
            <input
              type="text"
              name={key}
              className="input"
              value={parsedData[key]}
              onChange={handleChange}
            />
          </div>
        </div>
      ))}

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
