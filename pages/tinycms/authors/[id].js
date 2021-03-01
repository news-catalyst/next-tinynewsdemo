import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import Notification from '../../../components/tinycms/Notification';
import Upload from '../../../components/tinycms/Upload';
import { hasuraGetAuthorById, hasuraUpdateAuthor } from '../../../lib/authors';
import { hasuraLocaliseText } from '../../../lib/utils.js';

export default function EditAuthor({
  apiUrl,
  apiToken,
  author,
  currentLocale,
  locales,
  awsConfig,
}) {
  console.log(author);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

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

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/authors');
  }

  async function handleSubmit(ev) {
    let published = true;
    ev.preventDefault();
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
