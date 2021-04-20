import React, { useState } from 'react';
import { useRouter } from 'next/router';
import tw, { css, styled } from 'twin.macro';
import AdminLayout from '../../../components/AdminLayout';
import {
  hasuraGetSectionById,
  hasuraUpdateSection,
} from '../../../lib/section';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraLocaliseText } from '../../../lib/utils';

const Input = styled.input`
  ${tw`mb-5 px-3 py-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const SubmitButton = tw.input`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-green-700 hover:bg-green-500 text-white md:rounded`;
const CancelButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-gray-600 hover:bg-gray-300 text-white md:rounded`;

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

      <div tw="container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16">
        <div tw="pt-5 pb-10">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Edit Section
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">
            <span tw="block font-medium text-gray-700">Title</span>
            <Input
              type="text"
              value={title}
              name="title"
              onChange={(ev) => setTitle(ev.target.value)}
            />
          </label>

          <label htmlFor="slug">
            <span tw="block font-medium text-gray-700">Slug</span>
            <Input
              type="text"
              value={slug}
              name="slug"
              onChange={(ev) => setSlug(ev.target.value)}
            />
          </label>

          <label tw="mt-5" htmlFor="published">
            <input
              name="published"
              type="checkbox"
              checked={published}
              onChange={handlePublished}
            />
            <span tw="ml-5 font-medium text-gray-700">Published</span>
          </label>

          <div tw="grid grid-cols-4 gap-24 mt-4">
            <SubmitButton type="submit" value="Submit" />
            <CancelButton>Cancel</CancelButton>
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
