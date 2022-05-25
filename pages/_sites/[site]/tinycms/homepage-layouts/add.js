import React, { useState } from 'react';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import {
  FormContainer,
  FormHeader,
  TinyInputField,
  TinySubmitCancelButtons,
} from '../../../../../components/tinycms/TinyFormElements';
import Notification from '../../../../../components/tinycms/Notification';
import { hasuraUpsertHomepageLayout } from '../../../../../lib/homepage';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';

export default function AddHomepageLayout({
  apiUrl,
  site,
  siteUrl,
  host,
  authorizedEmailDomains,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [jsonData, setJsonData] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    const { errors, data } = await hasuraUpsertHomepageLayout({
      url: apiUrl,
      site: site,
      name: name,
      data: jsonData,
    });

    if (errors) {
      console.error('Error creating layout:', errors);
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      console.error('Created layout:', data);
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

      <FormContainer>
        <FormHeader title="Add Homepage Layout" />

        <form onSubmit={handleSubmit}>
          <TinyInputField
            name="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            label="Name"
          />
          <TinyInputField
            name="jsonData"
            value={jsonData}
            onChange={(ev) => setJsonData(ev.target.value)}
            label="Data"
          />
          <TinySubmitCancelButtons destURL="/tinycms/homepage-layouts" />
        </form>
      </FormContainer>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

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

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      siteUrl: siteUrl,
      host: host,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
