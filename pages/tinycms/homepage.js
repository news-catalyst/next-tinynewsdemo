import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import {
  getHomepageData,
  listLayoutSchemas,
  createHomepageLayout,
  publishLayout,
} from '../../lib/homepage.js';
import {
  listAllTags,
  listAllSections,
  getHomepageArticles,
} from '../../lib/articles.js';
import AdminNav from '../../components/nav/AdminNav';
import Notification from '../../components/tinycms/Notification';

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
  apiUrl,
  apiToken,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(hpData.layoutSchema);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [subFeaturedLeftArticle, setSubFeaturedLeftArticle] = useState(null);
  const [subFeaturedRightArticle, setSubFeaturedRightArticle] = useState(null);
  const [subFeaturedMiddleArticle, setSubFeaturedMiddleArticle] = useState(
    null
  );
  const [homepageKey, setHomepageKey] = useState(Math.random());

  useEffect(() => {
    setSelectedLayout(hpData.layoutSchema);
    console.log('selectedLayout:', selectedLayout);
    console.log('hpData:', hpData);
    console.log('hpArticles:', hpArticles);
  }, [hpData]);

  function changeLayout(layout) {
    console.log('changing layout...', layout);
    setSelectedLayout(layout);
    setHomepageKey(Math.random());
  }

  // NOTE: this should be called after confirming
  // 1. save a new layout data record in webiny
  // 2. publish
  // 3. display success or error message
  async function saveAndPublishHomepage() {
    console.log(
      'saving homepage...',
      selectedLayout,
      'featuredArticle:',
      featuredArticle,
      'subfeaturedLeft:',
      subFeaturedLeftArticle
    );

    let articlesData;
    if (selectedLayout.name.value === 'Big Featured Story') {
      articlesData = {
        featured: featuredArticle.slug,
      };
    } else if (selectedLayout.name.value === 'Large Package Story lead') {
      articlesData = {
        featured: featuredArticle.slug,
        'subfeatured-left': subFeaturedLeftArticle.slug,
        'subfeatured-middle': subFeaturedMiddleArticle.slug,
        'subfeatured-right': subFeaturedRightArticle.slug,
      };
    }

    console.log('articlesData:', articlesData);
    const results = await createHomepageLayout(
      apiUrl,
      apiToken,
      selectedLayout.id,
      articlesData
    );
    console.log('results:', results);
    if (results && results.content && results.content.data) {
      const publishResults = await publishLayout(
        apiUrl,
        apiToken,
        results.content.data.id
      );
      console.log('publishResults:', publishResults);
      setNotificationMessage('Successfully published homepage!');
      setNotificationType('success');
      setShowNotification(true);
    } else {
      setNotificationMessage(
        'An error occured while trying to create the new layout config:',
        results
      );
      setNotificationType('error');
      setShowNotification(true);
    }

    // force the page to rerender to display the new homepage
    // location.reload();
  }

  return (
    <>
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

      <div key={homepageKey}>
        {(selectedLayout.name.value === 'Big Featured Story' ||
          selectedLayout.name === 'Big Featured Story') && (
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
          />
        )}
        {(selectedLayout.name.value === 'Large Package Story lead' ||
          selectedLayout.name === 'Large Package Story lead') && (
          <LargePackageStoryLead
            editable={true}
            apiUrl={apiUrl}
            apiToken={apiToken}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            subFeaturedLeftArticle={subFeaturedLeftArticle}
            setSubFeaturedLeftArticle={setSubFeaturedLeftArticle}
            subFeaturedRightArticle={subFeaturedRightArticle}
            setSubFeaturedRightArticle={setSubFeaturedRightArticle}
            subFeaturedMiddleArticle={subFeaturedMiddleArticle}
            setSubFeaturedMiddleArticle={setSubFeaturedMiddleArticle}
            hpData={hpData}
            articles={hpArticles}
            tags={tags}
            sections={sections}
          />
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const apiUrl = process.env.ADMIN_CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;

  // get all available layout options
  const layoutSchemas = await listLayoutSchemas();

  //    get selected homepage layout / data
  const hpData = await getHomepageData();

  //    look up selected homepage articles
  const hpArticles = await getHomepageArticles(hpData.articles);

  const tags = await listAllTags();
  const sections = await listAllSections();

  return {
    props: {
      layoutSchemas,
      hpData,
      hpArticles,
      tags,
      sections,
      apiUrl,
      apiToken,
    },
  };
}
