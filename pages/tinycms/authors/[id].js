import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import tw, { css, styled } from 'twin.macro';
import Notification from '../../../components/tinycms/Notification';
import Upload from '../../../components/tinycms/Upload';
import { hasuraGetAuthorById, hasuraUpdateAuthor } from '../../../lib/authors';
import {
  hasuraLocaliseText,
  slugify,
  validateAuthorName,
} from '../../../lib/utils.js';

const Input = styled.input`
  ${tw`px-3 py-3 mb-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const TextArea = styled.textarea`
  ${tw`px-3 py-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const SubmitButton = tw.input`hidden md:flex w-full px-4 py-2 text-left bg-blue-700 hover:bg-blue-500 text-white md:rounded`;
const CancelButton = tw.button`hidden md:flex w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white md:rounded`;

export default function EditAuthor({
  apiUrl,
  apiToken,
  author,
  currentLocale,
  locales,
  awsConfig,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [displayUpload, setDisplayUpload] = useState(true);

  const [name, setName] = useState(author.name);
  const [title, setTitle] = useState(
    hasuraLocaliseText(author.author_translations, 'title')
  );
  const [bio, setBio] = useState(
    hasuraLocaliseText(author.author_translations, 'bio')
  );
  const [twitter, setTwitter] = useState(author.twitter);
  const [slug, setSlug] = useState(author.slug);
  const [staff, setStaff] = useState(author.staff);
  const [bioImage, setBioImage] = useState(author.photoUrl);
  const [authorId, setAuthorId] = useState(author.id);
  const [staffYesNo, setStaffYesNo] = useState('no');

  const router = useRouter();

  useEffect(() => {
    if (author && author.staff) {
      setStaffYesNo('yes');
      setStaff(true);
    } else {
      setStaffYesNo('no');
      setStaff(false);
    }
  }, []);

  const handleChange = (ev) => {
    if (ev.target.value === 'yes') {
      setStaff(true);
    } else {
      setStaff(false);
    }
    setStaffYesNo(ev.target.value);
  };

  // slugifies the name and stores slug plus name values
  function updateName(val) {
    setName(val);
    let slugifiedVal = slugify(val);
    setSlug(slugifiedVal);
    setDisplayUpload(true);
  }

  // removes leading @ from twitter handle before storing
  function updateTwitter(val) {
    let cleanedUpVal = val.replace(/@/, '');
    setTwitter(cleanedUpVal);
  }

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/authors');
  }

  async function handleSubmit(ev) {
    let published = true;
    ev.preventDefault();

    let nameIsValid = validateAuthorName(name);
    if (!nameIsValid) {
      setNotificationMessage(
        'Please use a real name of an actual person - editorial guidelines prohibit fake bylines: ' +
          name
      );
      setShowNotification(true);
      setNotificationType('error');
      setName('');
      setSlug('');
      setDisplayUpload(false);
      return false;
    }

    let params = {
      url: apiUrl,
      orgSlug: apiToken,
      id: authorId,
      localeCode: currentLocale,
      bio: bio,
      title: title,
      name: name,
      published: published,
      slug: slug,
      staff: staff,
      twitter: twitter,
      photoUrl: bioImage,
    };
    const { errors, data } = await hasuraUpdateAuthor(params);

    if (errors) {
      console.error(errors);
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the author!');
      setNotificationType('success');
      setShowNotification(true);
      router.push('/tinycms/authors?action=edit');
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
            Edit Author
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            <span tw="block font-medium text-gray-700">Name</span>
            <Input
              type="text"
              value={name}
              name="name"
              onChange={(ev) => updateName(ev.target.value)}
            />
          </label>

          <label htmlFor="title">
            <span tw="block font-medium text-gray-700">Title</span>
            <Input
              type="text"
              value={title}
              name="title"
              onChange={(ev) => setTitle(ev.target.value)}
            />
          </label>

          <label htmlFor="twitter">
            <span tw="block font-medium text-gray-700">Twitter</span>
            <Input
              type="text"
              value={twitter}
              name="twitter"
              placeholder="@handle"
              onChange={(ev) => updateTwitter(ev.target.value)}
            />
          </label>

          <label htmlFor="bio">
            <span tw="block font-medium text-gray-700">Bio</span>
            <TextArea
              tw="mt-1 block w-full"
              rows="3"
              value={bio}
              name="bio"
              onChange={(ev) => setBio(ev.target.value)}
            />
          </label>

          <div tw="grid grid-cols-2 mt-4">
            <label>
              <input
                type="radio"
                name="staff"
                value="yes"
                checked={staffYesNo === 'yes'}
                onChange={handleChange}
              />{' '}
              <span tw="font-medium text-gray-700">Staff</span>
            </label>
            <label>
              <input
                type="radio"
                name="staff"
                value="no"
                checked={staffYesNo === 'no'}
                onChange={handleChange}
              />{' '}
              <span tw="font-medium text-gray-700">Not Staff</span>
            </label>
          </div>

          {displayUpload && (
            <div tw="mt-3 mb-6">
              <label tw="mt-3">
                <span tw="block font-medium text-gray-700 block">Avatar</span>
                <Upload
                  awsConfig={awsConfig}
                  slug={slug}
                  bioImage={bioImage}
                  setBioImage={setBioImage}
                  setNotificationMessage={setNotificationMessage}
                  setNotificationType={setNotificationType}
                  setShowNotification={setShowNotification}
                />
              </label>
            </div>
          )}

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

  const awsConfig = {
    bucketName: process.env.TNC_AWS_BUCKET_NAME,
    dirName: process.env.TNC_AWS_DIR_NAME,
    region: process.env.TNC_AWS_REGION,
    accessKeyId: process.env.TNC_AWS_ACCESS_ID,
    secretAccessKey: process.env.TNC_AWS_ACCESS_KEY,
  };

  let author = {};
  let locales;
  const { errors, data } = await hasuraGetAuthorById({
    url: apiUrl,
    orgSlug: apiToken,
    id: context.params.id,
  });
  if (errors) {
    throw errors;
  } else {
    author = data.authors_by_pk;
    locales = data.organization_locales;
  }

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      author: author,
      currentLocale: context.locale,
      locales: locales,
      awsConfig: awsConfig,
    },
  };
}
