import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import Link from 'next/link';
import {
  FormContainer,
  FormHeader,
  TinyInputField,
  TinySubmitCancelButtons,
  UrlSlugValue,
  UrlSlugLabel,
} from '../../../../../components/tinycms/TinyFormElements';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import Notification from '../../../../../components/tinycms/Notification';
import {
  hasuraGetTagById,
  hasuraUpdateTag,
} from '../../../../../lib/section.js';
import { getLatestVersion } from '../../../../../lib/utils.js';
import { slugify } from '../../../../../lib/graphql';

const ViewOnSiteLink = tw.a`font-bold cursor-pointer hover:underline`;

export default function EditTag({ apiUrl, site, tag }) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [tagId, setTagId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (tag) {
      setTagId(tag.id);
      let title = getLatestVersion(tag.tag_translations, 'title', false);
      setTitle(title);
      setSlug(tag.slug);
    }
  }, [tag]);

  function updateTitleAndSlug(value) {
    setTitle(value);
    setSlug(slugify(value));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let published = true;
    let params = {
      url: apiUrl,
      site: site,
      id: tagId,
      localeCode: 'en-US',
      title: title,
      published: published,
      slug: slug,
    };
    const { errors, data } = await hasuraUpdateTag(params);

    if (errors) {
      console.error(errors);
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('The tag is updated.');
      setNotificationType('success');
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

      <FormContainer>
        <FormHeader title="Edit Tag" />
        {slug && (
          <div tw="relative">
            <p tw="absolute right-0">
              <Link href={`/tags/${slug}`} key={`${slug}`} passHref>
                <ViewOnSiteLink>View on site</ViewOnSiteLink>
              </Link>
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <TinyInputField
            name="title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            label="Title"
          />

          {slug && (
            <label>
              <UrlSlugLabel>URL Slug</UrlSlugLabel>
              <UrlSlugValue>{slug}</UrlSlugValue>
            </label>
          )}

          <TinySubmitCancelButtons destURL="/tinycms/tags" />
        </form>
      </FormContainer>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;
  const id = context.params.id;

  let tag = {};
  const { errors, data } = await hasuraGetTagById({
    url: apiUrl,
    site: site,
    id: id,
  });
  if (errors) {
    throw errors;
  } else {
    tag = data.tags_by_pk;
  }

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      tag: tag,
    },
  };
}
