import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  FormContainer,
  FormHeader,
  TinyInputField,
  TinySubmitCancelButtons,
  UrlSlugLabel,
  UrlSlugValue,
} from '../../../components/tinycms/TinyFormElements';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListLocales } from '../../../lib/articles.js';
import { hasuraCreateTag } from '../../../lib/section';
import { slugify } from '../../../lib/utils';

export default function AddTag({ apiUrl, apiToken, currentLocale, locales }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const router = useRouter();

  function updateTitleAndSlug(value) {
    setTitle(value);
    setSlug(slugify(value));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let published = true;
    let params = {
      url: apiUrl,
      orgSlug: apiToken,
      localeCode: currentLocale,
      title: title,
      published: published,
      slug: slug,
    };
    console.log('params:', params);
    const { errors, data } = await hasuraCreateTag(params);

    if (data && data.insert_tags_one) {
      setNotificationMessage('Successfully saved and published the tag!');
      setNotificationType('success');
      setShowNotification(true);
      router.push('/tinycms/tags?action=create');
    } else if (errors) {
      setNotificationMessage(JSON.stringify(errors));
      setNotificationType('error');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout>
      <AdminNav
        currentLocale={currentLocale}
        switchLocales={true}
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
        <FormHeader title="Add Tag" />

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

          <TinySubmitCancelButtons destURL="/tinycms/tags" />
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
    console.log('error listing locales:', errors);
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
