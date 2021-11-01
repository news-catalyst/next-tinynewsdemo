import React, { useState } from 'react';
import tw from 'twin.macro';
import Link from 'next/link';
import {
  FormContainer,
  FormHeader,
  TinyCheckboxField,
  TinyInputField,
  TinySubmitCancelButtons,
  UrlSlugLabel,
  UrlSlugValue,
} from '../../../components/tinycms/TinyFormElements';
import AdminLayout from '../../../components/AdminLayout';
import {
  hasuraGetSectionById,
  hasuraUpdateSection,
} from '../../../lib/section';
import { hasuraInsertArticleSlugVersions } from '../../../lib/articles';
import AdminNav from '../../../components/nav/AdminNav';
import Notification from '../../../components/tinycms/Notification';
import { hasuraLocalizeText } from '../../../lib/utils';

const ViewOnSiteLink = tw.a`font-bold cursor-pointer hover:underline`;

export default function EditSection({
  apiUrl,
  apiToken,
  currentLocale,
  section,
  locales,
  vercelHook,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [sectionId, setSectionId] = useState(section.id);
  const [articleCount, setArticleCount] = useState(
    section.articles_aggregate.aggregate.count
  );

  const [title, setTitle] = useState(
    hasuraLocalizeText(
      currentLocale,
      section.category_translations,
      'title',
      false
    )
  );
  const [slug, setSlug] = useState(section.slug);
  const [currentSlug, setCurrentSlug] = useState(section.slug);
  const [published, setPublished] = useState(section.published);

  function handlePublished(event) {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    setPublished(value);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    if (currentSlug !== slug && articleCount > 0) {
      if (
        !window.confirm(
          `You're going to change the URL for ${articleCount} articles in this category. Are you sure?`
        )
      ) {
        setNotificationType('warning');
        setNotificationMessage('Okay, we cancelled the section update.');
        setShowNotification(true);

        return false;
      }
    }

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
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // add entries to the article_slug_versions table if the slug has changed
      if (currentSlug !== slug) {
        let articleSlugVersions = section.articles_aggregate.nodes.map(
          (node) => {
            return {
              article_id: node.id,
              slug: node.slug,
              category_slug: slug,
            };
          }
        );
        params['objects'] = articleSlugVersions;
        const response = await hasuraInsertArticleSlugVersions(params);
        if (response.errors) {
          console.error('error:', response.errors);
        } else {
          const rebuildResponse = await fetch(vercelHook, {
            method: 'POST',
          });
          const statusCode = rebuildResponse.status;

          setCurrentSlug(slug);

          if (statusCode < 200 || statusCode > 299) {
            setNotificationType('error');
            setNotificationMessage(
              'An error occurred republishing the site: ' + JSON.stringify(data)
            );
            setShowNotification(true);
          } else {
            setNotificationType('success');
            setNotificationMessage(
              'Successfully saved settings, republishing the site now!'
            );
            setShowNotification(true);
          }
        }
      }

      // display success message
      let message = 'The section is updated.';
      if (published) {
        message += ' (section appears in nav)';
      } else {
        message += ' (section is hidden in nav)';
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
        switchLocales={true}
        locales={locales}
        homePageEditor={false}
        showConfigOptions={true}
        id={sectionId}
      />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}

      <FormContainer>
        <FormHeader
          title={`Edit Section (${articleCount} article${
            articleCount === 1 ? '' : 's'
          })`}
        />

        {slug && (
          <div tw="relative">
            <p tw="absolute right-0">
              <Link href={`/categories/${slug}`} key={`${slug}`} passHref>
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
          {currentLocale === 'en-US' && (
            <TinyInputField
              name="slug"
              value={slug}
              onChange={(ev) => setSlug(ev.target.value)}
              label="URL Slug"
            />
          )}
          {currentLocale !== 'en-US' && (
            <label>
              <UrlSlugLabel>URL Slug (edit in English)</UrlSlugLabel>
              <UrlSlugValue>{slug}</UrlSlugValue>
            </label>
          )}

          <TinyCheckboxField
            name="published"
            checked={published}
            onChange={handlePublished}
            label="Show in nav"
          />

          <TinySubmitCancelButtons destURL="/tinycms/sections" />
        </form>
      </FormContainer>

      {articleCount > 0 && (
        <FormContainer>
          <FormHeader title="Articles in this category" />
          <ul>
            {section.articles_aggregate.nodes.map((node) => (
              <li key={`li-category-article-${node.slug}`}>
                <Link
                  href="/articles/[category]/[slug]"
                  as={`/articles/${slug}/${node.slug}`}
                  passHref
                >
                  <a>
                    {hasuraLocalizeText(
                      currentLocale,
                      node.article_translations,
                      'headline',
                      false
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </FormContainer>
      )}
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
      vercelHook: process.env.VERCEL_DEPLOY_HOOK,
    },
  };
}
