import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import tw from 'twin.macro';
import { revalidate } from '../../../../lib/utils';

import {
  hasuraGetHomepageEditor,
  hasuraSaveHomepageLayout,
} from '../../../../lib/homepage';
import { findSetting, getOrgSettings } from '../../../../lib/settings.js';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';
import AdminLayout from '../../../../components/AdminLayout';
import homepageStyles from '../../../../styles/homepage.js';

const BigFeaturedStory = dynamic(() =>
  import(`../../../../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../../../../components/homepage/LargePackageStoryLead`)
);

const SaveButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-left bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function HomePageEditor({
  layoutSchemas,
  hpData,
  hpArticles,
  tags,
  sections,
  siteMetadata,
  apiUrl,
  site,
  siteUrl,
  host,
  apiSecret,
  lambdaURL,
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
    if (!featuredArticle) {
      setNotificationMessage(
        'Sorry, you must feature at least one article to save the homepage!'
      );
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
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
      site: site,
      schemaId: selectedLayout.id,
      article1: article1,
      article2: article2,
      article3: article3,
    });

    if (errors) {
      console.error(errors);
      setNotificationMessage(
        'An error occured while trying to create the new layout config:',
        errors
      );
      setNotificationType('error');
      setShowNotification(true);
    } else {
      await revalidate({
        lambdaURL: lambdaURL,
        paths: ['/'],
        site: site,
      });

      setNotificationMessage(
        'Successfully re-published homepage with these changes!'
      );

      setNotificationType('success');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout host={host} siteUrl={siteUrl}>
      <AdminNav
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
            site={site}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            hpData={hpData}
            articles={hpArticles}
            tags={tags}
            sections={sections}
            metadata={siteMetadata}
          />
        )}
        {selectedLayout &&
          selectedLayout.name === 'Large Package Story Lead' && (
            <LargePackageStoryLead
              editable={true}
              apiUrl={apiUrl}
              site={site}
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
              metadata={siteMetadata}
            />
          )}
      </div>

      <div tw="flex pt-8 justify-center">
        <SaveButton onClick={saveAndPublishHomepage}>Save Homepage</SaveButton>
      </div>

      <style jsx global>
        {homepageStyles}
      </style>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const lambdaURL = process.env.REVALIDATE_LAMBDA_URL;
  const site = context.params.site;
  const locale = 'en-US';

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('error:', settingsResult);
    throw settingsResult.errors;
  }
  let settings = settingsResult.data.settings;
  const { errors, data } = await hasuraGetHomepageEditor({
    url: apiUrl,
    site: site,
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('error getting homepage data:', errors);
    throw errors;
  }
  const siteMetadata =
    data.site_metadatas[0].site_metadata_translations[0].data;

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
    tags[i].title = tags[i].tag_translations[0].title;
  }

  const sections = data.categories;
  for (var j = 0; j < sections.length; j++) {
    sections[j].title = sections[j].category_translations[0].title;
  }
  const host = context.req.headers.host; // will give you localhost:3000
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const apiSecret = findSetting(settings, 'API_TOKEN');

  return {
    props: {
      layoutSchemas,
      hpData,
      hpArticles,
      tags,
      sections,
      siteMetadata,
      apiUrl,
      site,
      siteUrl,
      host,
      apiSecret,
      lambdaURL,
    },
  };
}
