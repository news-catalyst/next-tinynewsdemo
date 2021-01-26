import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import Notification from '../../../components/tinycms/Notification';
import Upload from '../../../components/tinycms/Upload';
import { listAllLocales } from '../../../lib/articles.js';
import { getAuthor, updateAuthor } from '../../../lib/authors';
import { localiseText } from '../../../lib/utils.js';
import { cachedContents } from '../../../lib/cached';

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

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [i18nTitleValues, setI18nTitleValues] = useState([]);
  const [twitter, setTwitter] = useState('');
  const [slug, setSlug] = useState('');
  const [staff, setStaff] = useState(false);
  const [bio, setBio] = useState('');
  const [bioImage, setBioImage] = useState('');
  const [i18nBioValues, setI18nBioValues] = useState([]);
  const [authorId, setAuthorId] = useState(null);
  const [staffYesNo, setStaffYesNo] = useState('no');

  const router = useRouter();

  useEffect(() => {
    if (author) {
      setAuthorId(author.id);
      setName(author.name);
      setBioImage(author.photoUrl);

      setI18nTitleValues(author.title.values);
      setI18nBioValues(author.bio.values);

      if (author.title && author.title.values) {
        let title = localiseText(currentLocale, author.title);
        setTitle(title);
      }
      if (author.slug) {
        setSlug(author.slug);
      }
      if (author.twitter) {
        setTwitter(author.twitter);
      }
      if (author.bio && author.bio.values) {
        let bio = localiseText(currentLocale, author.bio);
        setBio(bio);
      }
      if (author.staff) {
        setStaffYesNo('yes');
        setStaff(true);
      } else {
        setStaffYesNo('no');
        setStaff(false);
      }
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

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/authors');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let foundTitle = false;
    i18nTitleValues.map((localValue) => {
      if (localValue.locale === currentLocale.id) {
        foundTitle = true;
        localValue.value = title;
      }
    });
    if (!foundTitle) {
      i18nTitleValues.push({ value: title, locale: currentLocale.id });
      setI18nTitleValues(i18nTitleValues);
    }

    let foundBio = false;
    i18nBioValues.map((localValue) => {
      if (localValue.locale === currentLocale.id) {
        foundBio = true;
        localValue.value = bio;
      }
    });
    if (!foundBio) {
      i18nBioValues.push({ value: bio, locale: currentLocale.id });
      setI18nBioValues(i18nBioValues);
    }

    const response = await updateAuthor(
      apiUrl,
      apiToken,
      authorId,
      name,
      slug,
      i18nTitleValues,
      twitter,
      i18nBioValues,
      staff,
      bioImage
    );

    if (response.authors.updateAuthor.error !== null) {
      setNotificationMessage(response.authors.updateAuthor.error);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      setAuthorId(response.authors.updateAuthor.data.id);
      // display success message
      setNotificationMessage('Successfully saved and published the author!');
      setNotificationType('success');
      setShowNotification(true);
      router.push('/tinycms/authors?action=edit');
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

      <div id="page">
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Edit Author"
          id={author.id}
        />

        <Upload
          awsConfig={awsConfig}
          slug={slug}
          bioImage={bioImage}
          setBioImage={setBioImage}
          setNotificationMessage={setNotificationMessage}
          setNotificationType={setNotificationType}
          setShowNotification={setShowNotification}
        />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Name
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="slug">
              Slug
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={slug}
                name="slug"
                onChange={(ev) => setSlug(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                name="title"
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="twitter">
              Twitter
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={twitter}
                name="twitter"
                onChange={(ev) => setTwitter(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="bio">
              Bio
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bio}
                name="Twitter"
                onChange={(ev) => setBio(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="yes"
                  checked={staffYesNo === 'yes'}
                  onChange={handleChange}
                />{' '}
                Staff
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="no"
                  checked={staffYesNo === 'no'}
                  onChange={handleChange}
                />{' '}
                Not Staff
              </label>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <input
                className="button is-link"
                name="submit"
                type="submit"
                value="Submit"
              />
            </div>
            <div className="control">
              <button
                className="button is-link is-light"
                name="cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

  const awsConfig = {
    bucketName: process.env.TNC_AWS_BUCKET_NAME,
    dirName: process.env.TNC_AWS_DIR_NAME,
    region: process.env.TNC_AWS_REGION,
    accessKeyId: process.env.TNC_AWS_ACCESS_ID,
    secretAccessKey: process.env.TNC_AWS_ACCESS_KEY,
  };

  let author = await getAuthor(context.params.id);
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      author: author,
      currentLocale: currentLocale,
      locales: localeMappings,
      awsConfig: awsConfig,
    },
  };
}
