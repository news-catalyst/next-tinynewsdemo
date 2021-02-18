import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraUpsertMetadata } from '../../lib/site_metadata';
import Notification from './Notification';

export default function UpdateMetadata(props) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [parsedData, setParsedData] = useState({});
  const [editData, setEditData] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setParsedData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setParsedData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (props.metadata) {
      let parsed = props.metadata;
      setParsedData(parsed);
      let formattedJSON = JSON.stringify(parsed, null, 2);
      setJsonData(formattedJSON);
    }
  }, []);

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let parsed = parsedData;
    if (jsonData && (Object.keys(parsedData).length === 0 || editData)) {
      parsed = JSON.parse(jsonData);
      setParsedData(parsed);
    }
    // return;

    const { errors, data } = await hasuraUpsertMetadata({
      url: props.apiUrl,
      orgSlug: props.apiToken,
      data: parsed,
      published: true,
      localeCode: props.currentLocale,
    });
    if (errors) {
      setNotificationMessage(JSON.stringify(errors));
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
      {!editData && (
        <div className="field">
          <label className="label" htmlFor="name">
            JSON Data:
          </label>
          <div className="control">
            <pre>{jsonData}</pre>
          </div>
          <a
            href="#"
            className="button is-link"
            onClick={() => setEditData(true)}
          >
            Edit JSON
          </a>
        </div>
      )}
      {Object.keys(parsedData).length === 0 ||
        (editData && (
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
        ))}
      {Object.keys(parsedData).map((key) => (
        <div className="field" key={key}>
          {typeof parsedData[key] === 'boolean' ? (
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name={key}
                  checked={parsedData[key]}
                  onChange={handleChange}
                />
                {' ' + key}
              </label>
            </div>
          ) : (
            <>
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
            </>
          )}
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
