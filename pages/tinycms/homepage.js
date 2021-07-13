import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { hasuraLocaliseText } from '../../lib/utils.js';
import {
  hasuraGetHomepageEditor,
  hasuraSaveHomepageLayout,
} from '../../lib/articles.js';
import AdminNav from '../../components/nav/AdminNav';
import Notification from '../../components/tinycms/Notification';
import AdminLayout from '../../components/AdminLayout';
import homepageStyles from '../../styles/homepage.js';

const BigFeaturedStory = dynamic(() =>
  import(`../../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../../components/homepage/LargePackageStoryLead`)
);

export default function HomePageEditor({
  layoutSchemas,
  hpData,
  hpArticles,
  tags,
  sections,
  locale,
  siteMetadata,
  apiUrl,
  apiToken,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(
    hpData.homepage_layout_schema
  );
  const [featuredArticle, setFeaturedArticle] = useState(hpArticles[0]);
  const [subFeaturedTopArticle, setSubFeaturedTopArticle] = useState(
    hpArticles[1]
  );
  const [subFeaturedBottomArticle, setSubFeaturedBottomArticle] = useState(
    hpArticles[2]
  );
  const [homepageKey, setHomepageKey] = useState(Math.random());

  function changeLayout(layout) {
    setSelectedLayout(layout);
    setHomepageKey(Math.random());
  }

  async function saveAndPublishHomepage() {
    let article1 = featuredArticle.id;
    let article2 = null;
    let article3 = null;

    if (selectedLayout.name !== 'Big Featured Story' && subFeaturedTopArticle) {
      article2 = subFeaturedTopArticle.id;
    }
    if (
      selectedLayout.name !== 'Big Featured Story' &&
      subFeaturedBottomArticle
    ) {
      article3 = subFeaturedBottomArticle.id;
    }

    const { errors, data } = await hasuraSaveHomepageLayout({
      url: apiUrl,
      orgSlug: apiToken,
      schemaId: selectedLayout.id,
      article1: article1,
      article2: article2,
      article3: article3,
    });

    if (errors) {
      console.log(errors);
      setNotificationMessage(
        'An error occured while trying to create the new layout config:',
        errors
      );
      setNotificationType('error');
      setShowNotification(true);
    } else {
      console.log('data:', data);
      setNotificationMessage('Successfully published homepage!');
      setNotificationType('success');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout>
      <AdminNav
        switchLocales={true}
        homePageEditor={true}
        layoutSchemas={layoutSchemas}
        changeLayout={changeLayout}
        saveAndPublishHomepage={saveAndPublishHomepage}
        hpData={hpData}
      />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}

      <div className="homepage" key={homepageKey}>
        {selectedLayout && selectedLayout.name === 'Big Featured Story' && (
          <BigFeaturedStory
            editable={true}
            apiUrl={apiUrl}
            apiToken={apiToken}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            hpData={hpData}
            articles={hpArticles}
            tags={tags}
            sections={sections}
            locale={locale}
            metadata={siteMetadata}
          />
        )}
        {selectedLayout &&
          selectedLayout.name === 'Large Package Story Lead' && (
            <LargePackageStoryLead
              editable={true}
              apiUrl={apiUrl}
              apiToken={apiToken}
              featuredArticle={featuredArticle}
              setFeaturedArticle={setFeaturedArticle}
              subFeaturedTopArticle={subFeaturedTopArticle}
              setSubFeaturedTopArticle={setSubFeaturedTopArticle}
              subFeaturedBottomArticle={subFeaturedBottomArticle}
              setSubFeaturedBottomArticle={setSubFeaturedBottomArticle}
              hpData={hpData}
              articles={hpArticles}
              tags={tags}
              sections={sections}
              locale={locale}
              metadata={siteMetadata}
            />
          )}
      </div>
      <input
        type="submit"
        value="Save Homepage"
        onClick={saveAndPublishHomepage}
      />
      <style jsx global>
        {homepageStyles}
      </style>
    </AdminLayout>
  );
}

export async function getServerSideProps({ locale }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  const { errors, data } = await hasuraGetHomepageEditor({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('error getting homepage data:', errors);
    throw errors;
  }

  const layoutSchemas = data.homepage_layout_schemas;
  let hpData = data.homepage_layout_datas[0];
  let hpArticles = [];

  if (hpData) {
    hpArticles = [
      hpData.first_article,
      hpData.second_article,
      hpData.third_article,
    ];
  } else {
    hpData = {};
  }

  const tags = data.tags;
  for (var i = 0; i < tags.length; i++) {
    tags[i].title = hasuraLocaliseText(tags[i].tag_translations, 'title');
  }

  const sections = data.categories;
  for (var j = 0; j < sections.length; j++) {
    sections[j].title = hasuraLocaliseText(
      sections[j].category_translations,
      'title'
    );
  }

  let siteMetadata;
  let metadatas = data.site_metadatas;
  try {
    siteMetadata = metadatas[0].site_metadata_translations[0].data;
  } catch (err) {
    console.log('failed finding site metadata for ', locale, metadatas);
  }

  return {
    props: {
      layoutSchemas,
      hpData,
      hpArticles,
      tags,
      sections,
      locale,
      siteMetadata,
      apiUrl,
      apiToken,
    },
  };
}
