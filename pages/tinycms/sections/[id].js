import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import {
  hasuraGetSectionById,
  hasuraUpdateSection,
} from '../../../lib/section';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import Notification from '../../../components/tinycms/Notification';
import { hasuraLocaliseText } from '../../../lib/utils';

export default function EditSection({
  apiUrl,
  apiToken,
  currentLocale,
  section,
  locales,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [sectionId, setSectionId] = useState(section.id);

  const [title, setTitle] = useState(
    hasuraLocaliseText(section.category_translations, 'title')
  );
  const [slug, setSlug] = useState(section.slug);
  const [published, setPublished] = useState(section.published);

  const router = useRouter();

  function handlePublished(event) {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    setPublished(value);
  }

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/sections');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let params = {
      url: apiUrl,
      orgSlug: apiToken,
      id: sectionId,
      localeCode: currentLocale,
      title: title,
      published: published,
      slug: slug,
    };
    const { errors, data } = await hasuraUpdateSection(params);

    if (errors) {
      setNotificationMessage(JSON.stringify(errors));
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      let message = 'Successfully updated the section!';
      if (published) {
        message += ' (section is live)';
      } else {
        message += ' (section is unpublished)';
      }
      setNotificationMessage(message);
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
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Edit Section"
          id={section.id}
        />

        <form onSubmit={handleSubmit}>
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
            <label className="checkbox" htmlFor="slug">
              <input
                name="published"
                type="checkbox"
                checked={published}
                onChange={handlePublished}
              />
              Published
            </label>
          </div>

          <div className="level">
            <div className="level-left">
              <div className="level-item">
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
            </div>
            <div className="level-right">
              <div className="level-item"></div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let section = {};
  let locales;
  const { errors, data } = await hasuraGetSectionById({
    url: apiUrl,
    orgSlug: apiToken,
    id: context.params.id,
  });
  if (errors) {
    throw errors;
  } else {
    section = data.categories_by_pk;
    locales = data.organization_locales;
  }

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: context.locale,
      section: section,
      locales: locales,
    },
  };
}
