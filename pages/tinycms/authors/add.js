import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { listAllLocales } from '../../../lib/articles.js';
import { cachedContents } from '../../../lib/cached';
import { createAuthor } from '../../../lib/authors';

export default function AddAuthor({ apiUrl, apiToken, currentLocale }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [twitter, setTwitter] = useState('');
  const [slug, setSlug] = useState('');
  const [staff, setStaff] = useState('no');
  const [bio, setBio] = useState('');

  const router = useRouter();

  const handleChange = (ev) => setStaff(ev.target.value);

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await createAuthor(
      apiUrl,
      apiToken,
      name,
      slug,
      title,
      twitter,
      bio,
      staff,
      currentLocale
    );

    if (response.authors.createAuthor.error !== null) {
      setNotificationMessage(response.authors.createAuthor.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the author!');
      setNotificationType('success');
      setShowNotification(true);

      router.push('/tinycms/authors?action=create');
    }
  }

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div id="page">
        <h1 className="title">Add an author</h1>

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
            <label className="label" htmlFor="slug">
              Slug
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={slug}
                name="slug"
                onChange={(ev) => setSlug(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                name="title"
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="twitter">
              Twitter
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={twitter}
                name="twitter"
                onChange={(ev) => setTwitter(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="bio">
              Bio
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bio}
                name="Twitter"
                onChange={(ev) => setBio(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="yes"
                  checked={staff === 'yes'}
                  onChange={handleChange}
                />{' '}
                Staff
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="no"
                  checked={staff === 'no'}
                  onChange={handleChange}
                />{' '}
                Not Staff
              </label>
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
  console.log('locales:', context.locales);
  console.log('current locale:', context.locale);

  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: currentLocale,
    },
  };
}
