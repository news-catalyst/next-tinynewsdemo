import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import {
  FormContainer,
  FormHeader,
  TinyInputField,
  TinySubmitCancelButtons,
} from '../../../components/tinycms/TinyFormElements';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraGetTagById, hasuraUpdateTag } from '../../../lib/section.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';

export default function EditTag({
  apiUrl,
  apiToken,
  tag,
  currentLocale,
  locales,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [tagId, setTagId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (tag) {
      setTagId(tag.id);
      let title = hasuraLocaliseText(tag.tag_translations, 'title');
      setTitle(title);
      setSlug(tag.slug);
    }
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();

    let published = true;
    let params = {
      url: apiUrl,
      orgSlug: apiToken,
      id: tagId,
      localeCode: currentLocale,
      title: title,
      published: published,
      slug: slug,
    };
    const { errors, data } = await hasuraUpdateTag(params);

    if (errors) {
      console.log(errors);
      setNotificationMessage(JSON.stringify(errors));
      setNotificationType('error');
      setShowNotification(true);
    } else {
      console.log(data);
      // display success message
      setNotificationMessage('The tag is updated.');
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
        <FormHeader title="Edit Tag" />

        <form onSubmit={handleSubmit}>
          <TinyInputField
            name="title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            label="Title"
          />
          <TinyInputField
            name="slug"
            value={slug}
            onChange={(ev) => setSlug(ev.target.value)}
            label="Slug"
          />

          <TinySubmitCancelButtons destURL="/tinycms/tags" />
        </form>
      </FormContainer>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let tag = {};
  let locales;
  const { errors, data } = await hasuraGetTagById({
    url: apiUrl,
    orgSlug: apiToken,
    id: context.params.id,
  });
  if (errors) {
    throw errors;
  } else {
    tag = data.tags_by_pk;
    locales = data.organization_locales;
  }

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      tag: tag,
      currentLocale: context.locale,
      locales: locales,
    },
  };
}
