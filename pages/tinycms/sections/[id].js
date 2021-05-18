import React, { useState } from 'react';
import tw from 'twin.macro';
import {
  FormContainer,
  FormHeader,
  TinyCheckboxField,
  TinyInputField,
  TinySubmitCancelButtons,
} from '../../../components/tinycms/TinyFormElements';
import AdminLayout from '../../../components/AdminLayout';
import {
  hasuraGetSectionById,
  hasuraUpdateSection,
} from '../../../lib/section';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraLocaliseText } from '../../../lib/utils';
import { slugify } from '../../../lib/utils';

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
      let message = 'The section is updated.';
      if (published) {
        message += ' (section appears in nav)';
      } else {
        message += ' (section is hidden in nav)';
      }
      setNotificationMessage(message);
      setNotificationType('success');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout>
      <AdminNav
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
        <FormHeader title="Edit Section" />

        <form onSubmit={handleSubmit}>
          <TinyInputField
            name="title"
            value={title}
            onChange={(ev) => updateTitleAndSlug(ev.target.value)}
            label="Title"
          />
          {slug && (
            <label>
              <span tw="block font-medium text-gray-700">URL Slug</span>
              <span tw="block font-light text-gray-700">{slug}</span>
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
