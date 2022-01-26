import React, { useState } from 'react';
import {
  FormContainer,
  FormHeader,
  TinyCheckboxField,
  TinyInputField,
  TinySubmitCancelButtons,
  UrlSlugLabel,
  UrlSlugValue,
} from '../../../components/tinycms/TinyFormElements';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListLocales } from '../../../lib/articles.js';
import { hasuraCreateSection } from '../../../lib/section';
import { slugify } from '../../../lib/graphql';

export default function AddSection({
  apiUrl,
  apiToken,
  currentLocale,
  locales,
}) {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState(null);
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState([]);

  function updateTitleAndSlug(value) {
    setTitle(value);
    setSlug(slugify(value));
  }

  function handlePublished(event) {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    setPublished(value);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let formIsValid = true;

    if (title === null || title === '') {
      if (errors.indexOf('Title is required.') < 0) {
        errors.push('Title is required.');
        setErrors(errors);
      }
      formIsValid = false;
    } else {
      let removeAtIndex = errors.indexOf('Title is required.');
      errors.splice(removeAtIndex, 1);
      setErrors(errors);
    }

    if (!formIsValid) {
      setNotificationMessage(errors);
      console.error(errors, notificationMessage);
      setNotificationType('error');
      setShowNotification(true);
      return;
    }

    let published = true;
    let params = {
      url: apiUrl,
      orgSlug: apiToken,
      localeCode: currentLocale,
      title: title,
      published: published,
      slug: slug,
    };
    const { hasuraErrors, data } = await hasuraCreateSection(params);

    if (data && data.insert_categories_one) {
      setNotificationMessage('Added the new section.');
      setNotificationType('success');
      setShowNotification(true);
    } else if (hasuraErrors) {
      setNotificationMessage(hasuraErrors);
      setNotificationType('error');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout>
      <AdminNav
        switchLocales={true}
        currentLocale={currentLocale}
        locales={locales}
        homePageEditor={false}
        showConfigOptions={true}
      />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}

      <FormContainer>
        <FormHeader title="Add Section" />

        <form onSubmit={handleSubmit}>
          <TinyInputField
            name="title"
            value={title}
            onChange={(ev) => updateTitleAndSlug(ev.target.value)}
            label="Title"
          />

          {slug && (
            <label>
              <UrlSlugLabel>URL Slug</UrlSlugLabel>
              <UrlSlugValue>{slug}</UrlSlugValue>
            </label>
          )}

          <TinyCheckboxField
            name="published"
            checked={published}
            onChange={handlePublished}
            label="Show in nav"
          />

          <TinySubmitCancelButtons destURL="/tinycms/sections" />
        </form>
      </FormContainer>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;
  const { errors, data } = await hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;

  if (errors || !data) {
    console.error('error listing locales:', errors);
    return {
      notFound: true,
    };
  } else {
    locales = data.organization_locales;
  }

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: context.locale,
      locales: locales,
    },
  };
}
