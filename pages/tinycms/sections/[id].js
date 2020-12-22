import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { getSection, deleteSection, updateSection } from '../../../lib/section';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import Notification from '../../../components/tinycms/Notification';
import { localiseText } from '../../../lib/utils';
import { listAllLocales } from '../../../lib/articles.js';
import { cachedContents } from '../../../lib/cached';

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
  const [sectionId, setSectionId] = useState('');

  const [title, setTitle] = useState('');
  const [i18nTitleValues, setI18nTitleValues] = useState([]);

  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (section) {
      setI18nTitleValues(section.title.values);

      let localisedTitle = localiseText(currentLocale, section.title);
      setTitle(localisedTitle);
      setSlug(section.slug);
      setSectionId(section.id);
    }
  }, []);

  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/sections');
  }

  async function handleDeleteSection(section) {
    const response = await deleteSection(apiUrl, apiToken, section.id);

    if (response.categories.deleteCategory.error !== null) {
      setNotificationMessage(response.categories.deleteCategory.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message

      setNotificationMessage('Successfully deleted the section!');
      setNotificationType('success');
      setShowNotification(true);
      // handleCancel();
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let foundIt = false;
    i18nTitleValues.map((localValue) => {
      if (localValue.locale === currentLocale.id) {
        foundIt = true;
        localValue.value = title;
      }
    });
    if (!foundIt) {
      i18nTitleValues.push({ value: title, locale: currentLocale.id });
      setI18nTitleValues(i18nTitleValues);
    }

    const response = await updateSection(
      apiUrl,
      apiToken,
      sectionId,
      i18nTitleValues,
      slug
    );

    if (response.categories.updateCategory.error !== null) {
      setNotificationMessage(response.categories.updateCategory.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      setSectionId(response.categories.updateCategory.data.id);
      // display success message
      setNotificationMessage('Successfully saved and published the section!');
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
              <div className="level-item">
                <a
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this section?'
                      )
                    )
                      handleDeleteSection(section);
                  }}
                  className="button is-danger"
                >
                  Delete
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );
  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

  let section = await getSection(context.params.id);

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale,
      section: section,
      locales: localeMappings,
    },
  };
}
