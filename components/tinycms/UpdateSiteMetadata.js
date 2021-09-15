import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraUpsertMetadata } from '../../lib/site_metadata';
import Notification from './Notification';
import MetadataTextInput from './MetadataTextInput';
import MetadataTextArea from './MetadataTextArea';
import MetadataSelect from './MetadataSelect';
import NewsletterBlock from './../plugins/NewsletterBlock';
import ColorStylePreview from './ColorStylePreview';

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
    try {
      if (props.metadata) {
        let parsed = props.metadata;
        console.log('props.metadata:', props.metadata);
        setParsedData(parsed);
        console.log('parsedData donation options:', parsed['donationOptions']);
        setRandomDataKey(Math.random());
        let formattedJSON = JSON.stringify(parsed, null, 2);
        setJsonData(formattedJSON);
      }
    } catch (error) {
      console.error('error setting up site metadata in tinycms:', error);
    }
  }, [props.metadata]);

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
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the metadata!');
      setNotificationType('success');
      setShowNotification(true);

      try {
        let formattedJSON = JSON.stringify(parsed, null, 2);
        setJsonData(formattedJSON);
        setRandomDataKey(Math.random());
      } catch (error) {
        console.error('error stringifying json:', error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={parsedData['color']}>
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

      <section className="section">
        <div className="container">
          <h2 className="subtitle">
            Customize your color scheme and typography:
          </h2>
          <div className="level pb-3">
            <div className="level-left">
              <div className="level-item">
                <MetadataSelect
                  label="Color scheme"
                  name="color"
                  handleChange={handleChange}
                  value={parsedData['color']}
                  choices={['colorone', 'colortwo', 'colorthree']}
                />
              </div>
              <div className="level-item">
                <MetadataSelect
                  label="Typography"
                  name="theme"
                  handleChange={handleChange}
                  value={parsedData['theme']}
                  choices={['styleone', 'styletwo', 'stylethree', 'stylefour']}
                />
              </div>
            </div>
          </div>
          <ColorStylePreview
            color={parsedData['color']}
            theme={parsedData['theme']}
          />
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
          <h2 className="has-text-weight-bold is-size-2">
            Newsletter Preview:
          </h2>
          <NewsletterBlock metadata={parsedData} />
        </div>
      </section>

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
        label="Support: CTA button text"
        name="supportCTA"
        handleChange={handleChange}
        value={parsedData['supportCTA']}
      />
      <MetadataTextInput
        label="Support: CTA button link url"
        name="supportURL"
        handleChange={handleChange}
        value={parsedData['supportURL']}
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

      <MetadataTextInput
        label="404 page: title"
        name="title404"
        handleChange={handleChange}
        value={parsedData['title404']}
      />
      <MetadataTextInput
        label="404 page: description"
        name="description404"
        handleChange={handleChange}
        value={parsedData['description404']}
      />

      <MetadataTextInput
        label="Donation Block: Headline"
        name="donateBlockHed"
        handleChange={handleChange}
        value={parsedData['donateBlockHed']}
      />

      <MetadataTextInput
        label="Donation Block: Deck"
        name="donateBlockDek"
        handleChange={handleChange}
        value={parsedData['donateBlockDek']}
      />

      <MetadataTextArea
        label="Donation Options"
        name="donationOptions"
        handleChange={handleChange}
        value={parsedData['donationOptions']}
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
