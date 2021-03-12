import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraUpsertMetadata } from '../../lib/site_metadata';
import Notification from './Notification';
import MetadataTextInput from './MetadataTextInput';
import NewsletterBlock from './../plugins/NewsletterBlock';

export default function UpdateMetadata(props) {
  const [randomDataKey, setRandomDataKey] = useState(Math.random());
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
      setRandomDataKey(Math.random());
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

      let formattedJSON = JSON.stringify(parsed, null, 2);
      setJsonData(formattedJSON);
      setRandomDataKey(Math.random());
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
      <div className="field" key="landingPage">
        <div className="control">
          <label className="checkbox">
            <input
              type="checkbox"
              name="landingPage"
              checked={parsedData['landingPage']}
              onChange={handleChange}
            />
            {' Toggle landing page mode'}
          </label>
        </div>
      </div>

      <h2 className="subtitle">Newsletter Preview:</h2>
      <NewsletterBlock metadata={parsedData} />
      <MetadataTextInput
        label="Newsletter headline"
        name="newsletterHed"
        handleChange={handleChange}
        value={parsedData['newsletterHed']}
      />
      <MetadataTextInput
        label="Newsletter dek"
        name="newsletterDek"
        handleChange={handleChange}
        value={parsedData['newsletterDek']}
      />

      <MetadataTextInput
        label="Navigation"
        name="nav"
        handleChange={handleChange}
        value={parsedData['nav']}
      />
      <MetadataTextInput
        label="Color scheme"
        name="color"
        handleChange={handleChange}
        value={parsedData['color']}
      />
      <MetadataTextInput
        label="Theme"
        name="theme"
        handleChange={handleChange}
        value={parsedData['theme']}
      />
      <MetadataTextInput
        label="Labels"
        name="labels"
        handleChange={handleChange}
        value={parsedData['labels']}
      />
      <MetadataTextInput
        label="Site short name"
        name="shortName"
        handleChange={handleChange}
        value={parsedData['shortName']}
      />
      <MetadataTextInput
        label="Site URL"
        name="siteUrl"
        handleChange={handleChange}
        value={parsedData['siteUrl']}
      />
      <MetadataTextInput
        label="About page: CTA button text"
        name="aboutCTA"
        handleChange={handleChange}
        value={parsedData['aboutCTA']}
      />
      <MetadataTextInput
        label="About page: headline"
        name="aboutHed"
        handleChange={handleChange}
        value={parsedData['aboutHed']}
      />
      <MetadataTextInput
        label="About page: dek"
        name="aboutDek"
        handleChange={handleChange}
        value={parsedData['aboutDek']}
      />
      <MetadataTextInput
        label="Subscribe"
        name="subscribe"
        handleChange={handleChange}
        value={parsedData['subscribe']}
      />
      <MetadataTextInput
        label="Support: CTA button text"
        name="supportCTA"
        handleChange={handleChange}
        value={parsedData['supportCTA']}
      />
      <MetadataTextInput
        label="Support: headline"
        name="supportHed"
        handleChange={handleChange}
        value={parsedData['supportHed']}
      />
      <MetadataTextInput
        label="Support: dek"
        name="supportDek"
        handleChange={handleChange}
        value={parsedData['supportDek']}
      />
      <MetadataTextInput
        label="Footer: title"
        name="footerTitle"
        handleChange={handleChange}
        value={parsedData['footerTitle']}
      />
      <MetadataTextInput
        label="Footer: byline name"
        name="footerBylineName"
        handleChange={handleChange}
        value={parsedData['footerBylineName']}
      />
      <MetadataTextInput
        label="Footer: byline link"
        name="footerBylineLink"
        handleChange={handleChange}
        value={parsedData['footerBylineLink']}
      />
      <MetadataTextInput
        label="Search: title"
        name="searchTitle"
        handleChange={handleChange}
        value={parsedData['searchTitle']}
      />
      <MetadataTextInput
        label="Search: description"
        name="searchDescription"
        handleChange={handleChange}
        value={parsedData['searchDescription']}
      />
      <MetadataTextInput
        label="Facebook: title"
        name="facebookTitle"
        handleChange={handleChange}
        value={parsedData['facebookTitle']}
      />
      <MetadataTextInput
        label="Facebook: description"
        name="facebookDescription"
        handleChange={handleChange}
        value={parsedData['facebookDescription']}
      />
      <MetadataTextInput
        label="Twitter: title"
        name="twitterTitle"
        handleChange={handleChange}
        value={parsedData['twitterTitle']}
      />
      <MetadataTextInput
        label="Twitter: description"
        name="twitterDescription"
        handleChange={handleChange}
        value={parsedData['twitterDescription']}
      />

      {!editData && (
        <div className="field">
          <a href="#" className="button" onClick={() => setEditData(true)}>
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
