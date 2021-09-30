import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import tw from 'twin.macro';
import {
  FormContainer,
  FormHeader,
  TinyYesNoField,
  TinyTextArea,
  TinyInputField,
  TinySubmitCancelButtons,
} from '../../../components/tinycms/TinyFormElements';
import Notification from '../../../components/tinycms/Notification';
import Upload from '../../../components/tinycms/Upload';
import { hasuraGetAuthorById, hasuraUpdateAuthor } from '../../../lib/authors';
import {
  displayAuthorName,
  hasuraLocaliseText,
  slugify,
  validateAuthorName,
} from '../../../lib/utils.js';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const UploadContainer = tw.div`container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10`;

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

  const [firstNames, setFirstNames] = useState(author.first_names);
  const [lastName, setLastName] = useState(author.last_name);

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

  useEffect(() => {
    if (author && author.staff) {
      setStaffYesNo('yes');
      setStaff(true);
    } else {
      setStaffYesNo('no');
      setStaff(false);
    }
  }, [author]);

  const handleChange = (ev) => {
    if (ev.target.value === 'yes') {
      setStaff(true);
    } else {
      setStaff(false);
    }
    setStaffYesNo(ev.target.value);
  };

  // slugifies the name and stores slug plus name values
  function updateFirstNames(val) {
    setFirstNames(val);
    let displayName = displayAuthorName(val, lastName);
    let slugifiedVal = slugify(displayName);
    setSlug(slugifiedVal);
    setDisplayUpload(true);
  }

  function updateLastName(val) {
    setLastName(val);
    let slugifiedVal = slugify(displayAuthorName(firstNames, val));
    setSlug(slugifiedVal);
    setDisplayUpload(true);
  }

  // removes leading @ from twitter handle before storing
  function updateTwitter(val) {
    let cleanedUpVal = val.replace(/@/, '');
    setTwitter(cleanedUpVal);
  }

  async function handleSubmit(ev) {
    let published = true;
    ev.preventDefault();

    let nameIsValid = validateAuthorName(firstNames, lastName);
    if (!nameIsValid) {
      setNotificationMessage(
        'Please use a real name of an actual person - editorial guidelines prohibit fake bylines: ' +
          displayAuthorName(firstNames, lastName)
      );
      setShowNotification(true);
      setNotificationType('error');
      setFirstNames('');
      setLastName('');
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
      first_names: firstNames,
      last_name: lastName,
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
      setNotificationMessage('The author is updated.');
      setNotificationType('success');
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
        <FormHeader title="Edit Author" />

        <form onSubmit={handleSubmit}>
          <TinyInputField
            name="first_names"
            value={firstNames}
            onChange={(ev) => updateFirstNames(ev.target.value)}
            label="First names"
          />
          <TinyInputField
            name="last_name"
            value={lastName}
            onChange={(ev) => updateLastName(ev.target.value)}
            label="Last name (staff page sorts by this value)"
          />
          <TinyInputField
            name="title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            label="Title"
          />
          <TinyInputField
            name="twitter"
            value={twitter}
            placeholder="@handle"
            onChange={(ev) => setTwitter(ev.target.value)}
            label="Twitter"
          />
          <TinyInputField
            name="slug"
            value={slug}
            onChange={(ev) => setSlug(ev.target.value)}
            label="Slug"
          />

          <ReactQuill theme="snow" value={bio} onChange={setBio} />

          {/* <TinyTextArea
            name="bio"
            value={bio}
            onChange={(ev) => setBio(ev.target.value)}
            label="Bio"
          /> */}
          <TinyYesNoField
            name="staff"
            value={staffYesNo}
            onChange={handleChange}
            labelYes="Staff"
            labelNo="Not Staff"
          />
          <UploadContainer>
            {displayUpload && (
              <div tw="mt-3 mb-6">
                <label tw="mt-3">
                  <span tw="block font-medium text-gray-700 block">Avatar</span>
                  <Upload
                    awsConfig={awsConfig}
                    slug={slug}
                    image={bioImage}
                    setter={setBioImage}
                    setNotificationMessage={setNotificationMessage}
                    setNotificationType={setNotificationType}
                    setShowNotification={setShowNotification}
                    folderName="authors"
                  />
                </label>
              </div>
            )}
          </UploadContainer>

          <TinySubmitCancelButtons destURL="/tinycms/authors" />
        </form>
      </FormContainer>
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
    s3Url: `https://${process.env.TNC_AWS_BUCKET_NAME}.s3.${process.env.TNC_AWS_REGION}.amazonaws.com`,
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
