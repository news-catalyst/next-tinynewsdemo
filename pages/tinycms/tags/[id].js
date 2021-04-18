import React, { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraGetTagById, hasuraUpdateTag } from '../../../lib/section.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';

const Input = styled.input`
  ${tw`mb-5 px-3 py-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const SubmitButton = tw.input`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-green-700 hover:bg-green-500 text-white md:rounded`;
const CancelButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-gray-600 hover:bg-gray-300 text-white md:rounded`;

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

  const router = useRouter();

  useEffect(() => {
    if (tag) {
      setTagId(tag.id);
      let title = hasuraLocaliseText(tag.tag_translations, 'title');
      setTitle(title);
      setSlug(tag.slug);
    }
  }, []);

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/tags');
  }

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
      setNotificationMessage('Successfully saved and published the tag!');
      setNotificationType('success');
      setShowNotification(true);
      router.push('/tinycms/tags?action=edit');
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

      <div tw="container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16">
        <div tw="pt-5 pb-10">
          <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
            Edit Tag
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

          <div tw="grid grid-cols-4 gap-24 mt-4">
            <SubmitButton type="submit" value="Submit" />
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          </div>
        </form>
      </div>
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
