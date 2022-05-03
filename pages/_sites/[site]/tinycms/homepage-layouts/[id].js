import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../components/AdminLayout';
import {
  hasuraGetHomepageLayout,
  hasuraUpdateHomepageLayout,
} from '../../../../../lib/homepage';
import AdminNav from '../../../../../components/nav/AdminNav';
import Notification from '../../../../../components/tinycms/Notification';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';

export default function EditHomepageLayout({
  apiUrl,
  site,
  homepageLayout,
  siteUrl,
  host,
  authorizedEmailDomains,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [homepageLayoutId, setHomepageLayoutId] = useState('');

  const [name, setName] = useState('');
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    if (homepageLayout) {
      setName(homepageLayout.name);
      setJsonData(homepageLayout.data);
      setHomepageLayoutId(homepageLayout.id);
    }
  }, [homepageLayout]);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/homepage-layouts');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const { errors, data } = await hasuraUpdateHomepageLayout({
      url: apiUrl,
      site: site,
      id: homepageLayoutId,
      name: name,
      data: jsonData,
    });

    if (errors) {
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      setHomepageLayoutId(data.id);
      // display success message
      setNotificationMessage(
        'Successfully saved and published the homepage layout!'
      );
      setNotificationType('success');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout
      host={host}
      siteUrl={siteUrl}
      authorizedEmailDomains={authorizedEmailDomains}
    >
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}

      <div id="page">
        <h1 className="title">Edit Homepage Layout</h1>

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
            <label className="label" htmlFor="data">
              Data
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={jsonData}
                name="jsonData"
                onChange={(ev) => setJsonData(ev.target.value)}
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
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;
  const id = context.params.id;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('error:', settingsResult);
    throw settingsResult.errors;
  }
  let settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const authorizedEmailDomains = findSetting(
    settings,
    'AUTHORIZED_EMAIL_DOMAINS'
  );
  const host = context.req.headers.host;

  let homepageLayout;

  const { errors, data } = await hasuraGetHomepageLayout({
    url: apiUrl,
    site: site,
    id: id,
  });

  if (errors) {
    throw errors;
  } else {
    homepageLayout = data.homepage_layout_schemas_by_pk;
  }
  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      homepageLayout: homepageLayout,
      siteUrl: siteUrl,
      host: host,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
