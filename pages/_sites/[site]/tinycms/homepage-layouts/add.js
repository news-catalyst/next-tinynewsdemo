import React, { useState } from 'react';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import Notification from '../../../../../components/tinycms/Notification';
import { hasuraUpsertHomepageLayout } from '../../../../../lib/homepage';

export default function AddHomepageLayout({ apiUrl, apiToken }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [jsonData, setJsonData] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    const { errors, data } = await hasuraUpsertHomepageLayout({
      url: apiUrl,
      orgSlug: apiToken,
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
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div id="page">
        <h1 className="title">Add a homepage layout</h1>

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
            <label className="label" htmlFor="jsonData">
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
              <input type="submit" className="button is-link" value="Submit" />
            </div>
            <div className="control">
              <button className="button is-link is-light">Cancel</button>
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

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
    },
  };
}
