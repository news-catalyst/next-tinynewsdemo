import React, { useState } from 'react';
import tw from 'twin.macro';
import {
  FormContainer,
  FormHeader,
  TinyYesNoField,
  TinyInputField,
  TinySubmitCancelButtons,
} from '../../../../../components/tinycms/TinyFormElements';
import TinyEditor from '../../../../../components/tinycms/TinyEditor';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import Notification from '../../../../../components/tinycms/Notification';
import Upload from '../../../../../components/tinycms/Upload';
import { getOrgSettings } from '../../../../../lib/articles.js';
import { hasuraCreateAuthor } from '../../../../../lib/authors';
import {
  displayAuthorName,
  validateAuthorName,
  findSetting,
} from '../../../../../lib/utils.js';
import { slugify } from '../../../../../lib/graphql';

const UploadContainer = tw.div`container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10`;

export default function AddAuthor({
  apiUrl,
  site,
  tinyApiKey,
  currentLocale,
  locales,
  awsConfig,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [firstNames, setFirstNames] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [twitter, setTwitter] = useState('');
  const [slug, setSlug] = useState('');
  const [staff, setStaff] = useState('no');
  const [bio, setBio] = useState('');
  const [bioImage, setBioImage] = useState('');
  const [displayUpload, setDisplayUpload] = useState(false);
  const [email, setEmail] = useState('');

  const handleEditorChange = (value) => {
    setBio(value);
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

  const handleChange = (ev) => setStaff(ev.target.value);

  async function handleSubmit(ev) {
    ev.preventDefault();

    if (!firstNames || !lastName) {
      setNotificationMessage('First and last names are required.');
      setNotificationType('error');
      setDisplayUpload(false);
      setShowNotification(true);
      return false;
    }

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
      setEmail('');
      setDisplayUpload(false);
      return false;
    }
    let published = true;

    let staffBool = false;
    if (staff === 'yes') {
      staffBool = true;
    }
    let params = {
      url: apiUrl,
      site: site,
      localeCode: currentLocale,
      bio: bio,
      title: title,
      first_names: firstNames,
      last_name: lastName,
      published: published,
      slug: slug,
      email: email,
      staff: staffBool,
      twitter: twitter,
      photoUrl: bioImage,
    };
    const { errors, data } = await hasuraCreateAuthor(params);

    if (data && data.insert_authors) {
      setNotificationMessage('Added the author.');
      setNotificationType('success');
      setShowNotification(true);
    } else if (errors) {
      console.error('error creating author:', errors);
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
        <FormHeader title="Add Author" />

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
          <TinyInputField
            name="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            label="Email"
          />
          <TinyEditor
            tinyApiKey={tinyApiKey}
            setValue={handleEditorChange}
            value={''}
          />

          <TinyYesNoField
            name="staff"
            value={staff}
            onChange={handleChange}
            labelYes="Staff"
            labelNo="Not Staff"
          />
          <UploadContainer>
            {displayUpload && (
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
  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.log('error:', settingsResult);
    throw settingsResult.errors;
  }
  let siteMetadata = settingsResult.data.settings;
  let locales = settingsResult.data.organization_locales;

  let bucketName = findSetting(siteMetadata, 'TNC_AWS_BUCKET_NAME');
  let dir = findSetting(siteMetadata, 'TNC_AWS_DIR_NAME');
  let region = findSetting(siteMetadata, 'TNC_AWS_REGION');
  let accessKey = findSetting(siteMetadata, 'TNC_AWS_ACCESS_ID');
  let secretKey = findSetting(siteMetadata, 'TNC_AWS_ACCESS_KEY');
  let tinyApiKey = findSetting(siteMetadata, 'TINYMCE_API_KEY');

  const awsConfig = {
    bucketName: bucketName,
    dirName: dir,
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    s3Url: `https://${bucketName}.s3.${region}.amazonaws.com`,
  };

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      tinyApiKey: tinyApiKey,
      currentLocale: context.locale,
      locales: locales,
      awsConfig: awsConfig,
    },
  };
}
