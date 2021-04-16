import React, { useState } from 'react';
import { useRouter } from 'next/router';
import tw, { css, styled } from 'twin.macro';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraListLocales } from '../../../lib/articles.js';
import { hasuraCreateTag } from '../../../lib/section';

const Input = styled.input`
  ${tw`mb-5 px-3 py-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const SubmitButton = tw.input`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-green-700 hover:bg-green-500 text-white md:rounded`;
const CancelButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-gray-600 hover:bg-gray-300 text-white md:rounded`;

export default function AddTag({ apiUrl, apiToken, currentLocale, locales }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const router = useRouter();

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
      localeCode: currentLocale,
      title: title,
      published: published,
      slug: slug,
    };
    console.log('params:', params);
    const { errors, data } = await hasuraCreateTag(params);

    if (data && data.insert_tags_one) {
      console.log(data.insert_tags_one);
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
      <AdminNav homePageEditor={false} showConfigOptions={true} />

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
            Add Tag
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
