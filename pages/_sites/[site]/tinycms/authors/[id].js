import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import tw from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import {
  FormContainer,
  FormHeader,
  TinyYesNoField,
  TinyInputField,
  TinySubmitCancelButtons,
} from '../../../../../components/tinycms/TinyFormElements';
import TinyEditor from '../../../../../components/tinycms/TinyEditor';
import Notification from '../../../../../components/tinycms/Notification';
import Upload from '../../../../../components/tinycms/Upload';
import {
  hasuraGetAuthorById,
  hasuraUpdateAuthor,
} from '../../../../../lib/authors';
import {
  displayAuthorName,
  validateAuthorName,
} from '../../../../../lib/utils.js';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';
import { slugify } from '../../../../../lib/graphql';

const UploadContainer = tw.div`container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10`;
const ArticleAuthorLink = tw.a`font-bold cursor-pointer hover:underline`;

export default function EditAuthor({
  apiUrl,
  site,
  tinyApiKey,
  author,
  awsConfig,
  siteUrl,
  host,
  authorizedEmailDomains,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [displayUpload, setDisplayUpload] = useState(true);

  const currentLocale = 'en-US';

  const [firstNames, setFirstNames] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [title, setTitle] = useState(author.author_translations[0].title);
  const [bio, setBio] = useState(author.author_translations[0].bio);
  const [staticBio, setStaticBio] = useState(undefined);

  const [twitter, setTwitter] = useState(author.twitter);
  const [slug, setSlug] = useState(author.slug);
  const [staff, setStaff] = useState(author.staff);
  const [bioImage, setBioImage] = useState(author.photoUrl);
  const [authorId, setAuthorId] = useState(author.id);
  const [staffYesNo, setStaffYesNo] = useState('no');

  const handleEditorChange = (value) => {
    setBio(value);
  };

  useEffect(() => {
    if (author && author.staff) {
      setStaffYesNo('yes');
      setStaff(true);
    } else {
      setStaffYesNo('no');
      setStaff(false);
    }
    if (bio) {
      setStaticBio(bio);
    }
    if (author.first_names) {
      setFirstNames(author.first_names);
    }
    if (author.last_name) {
      setLastName(author.last_name);
    }
    if (author.email) {
      setEmail(author.email);
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

  async function handleSubmit(ev) {
    let published = true;
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
        ' Please use a real name of an actual person - editorial guidelines prohibit fake bylines: ' +
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

    let params = {
      url: apiUrl,
      site: site,
      id: authorId,
      localeCode: currentLocale,
      bio: bio,
      title: title,
      first_names: firstNames,
      last_name: lastName,
      published: published,
      slug: slug,
      email: email,
      staff: staff,
      twitter: twitter,
      photoUrl: bioImage,
    };

    const { errors, data } = await hasuraUpdateAuthor(params);

    if (errors) {
      console.error(errors);
      setNotificationMessage(JSON.stringify(errors));
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
    <AdminLayout
      host={host}
      siteUrl={siteUrl}
      authorizedEmailDomains={authorizedEmailDomains}
    >
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}

      <FormContainer>
        <FormHeader title="Edit Author" />
        {slug && (
          <div tw="relative">
            <p tw="absolute right-0">
              <Link href={`/authors/${slug}`} key={`${slug}`} passHref>
                <ArticleAuthorLink>View on site</ArticleAuthorLink>
              </Link>
            </p>
          </div>
        )}
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
            value={staticBio}
          />

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
  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('error:', settingsResult);
    throw settingsResult.errors;
  }
  let settings = settingsResult.data.settings;

  let bucketName = findSetting(settings, 'TNC_AWS_BUCKET_NAME');
  let dir = findSetting(settings, 'TNC_AWS_DIR_NAME');
  let region = findSetting(settings, 'TNC_AWS_REGION');
  let accessKey = findSetting(settings, 'TNC_AWS_ACCESS_ID');
  let secretKey = findSetting(settings, 'TNC_AWS_ACCESS_KEY');
  let tinyApiKey = findSetting(settings, 'TINYMCE_API_KEY');
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const authorizedEmailDomains = findSetting(
    settings,
    'AUTHORIZED_EMAIL_DOMAINS'
  );
  const host = context.req.headers.host;

  const awsConfig = {
    bucketName: bucketName,
    dirName: dir,
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    s3Url: `https://${bucketName}.s3.${region}.amazonaws.com`,
  };

  let author = {};
  const { errors, data } = await hasuraGetAuthorById({
    url: apiUrl,
    site: site,
    id: context.params.id,
  });
  if (errors) {
    throw errors;
  } else {
    author = data.authors_by_pk;
  }

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      tinyApiKey: tinyApiKey,
      author: author,
      awsConfig: awsConfig,
      siteUrl: siteUrl,
      host: host,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
