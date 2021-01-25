import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { cachedContents } from '../../lib/cached';
import { getSiteMetadataForLocale } from '../../lib/site_metadata.js';
import {
  getHomepageData,
  listLayoutSchemas,
  createHomepageLayout,
} from '../../lib/homepage.js';
import {
  listAllLocales,
  listAllTags,
  listAllSections,
  getHomepageArticles,
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
  currentLocale,
  metadata,
  apiUrl,
  apiToken,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState();
  const [featuredArticle, setFeaturedArticle] = useState(
    hpArticles['featured']
  );
  const [subFeaturedTopArticle, setSubFeaturedTopArticle] = useState(null);
  const [subFeaturedBottomArticle, setSubFeaturedBottomArticle] = useState(
    null
  );
  const [homepageKey, setHomepageKey] = useState(Math.random());

  useEffect(() => {
    if (hpData === null) {
      console.log('setting layout to:', layoutSchemas[0]);
      setSelectedLayout(layoutSchemas[0]);
    } else {
      console.log('setting layout to hpdata:', hpData);
      setSelectedLayout(hpData.layoutSchema);
    }
    console.log('selectedLayout:', selectedLayout);
    console.log('hpData:', hpData);
    console.log('hpArticles:', hpArticles);

    if (selectedLayout && selectedLayout.name === 'Big Featured Story') {
      setFeaturedArticle(hpArticles['featured']);
      console.log('BFS featuredArticle:', featuredArticle);
    }
    if (selectedLayout && selectedLayout.name === 'Large Package Story lead') {
      setFeaturedArticle(hpArticles['featured']);
      setSubFeaturedTopArticle(hpArticles['subfeatured-top']);
      setSubFeaturedBottomArticle(hpArticles['subfeatured-bottom']);
    }
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
      featuredArticle
    );

    let articlesData;
    if (selectedLayout.name === 'Big Featured Story') {
      articlesData = {
        featured: featuredArticle.slug,
      };
    } else if (selectedLayout.name === 'Large Package Story Lead') {
      articlesData = {};
      if (featuredArticle) {
        articlesData.featured = featuredArticle.slug;
      }
      if (subFeaturedTopArticle) {
        articlesData['subfeatured-top'] = subFeaturedTopArticle.slug;
      }
      if (subFeaturedBottomArticle) {
        articlesData['subfeatured-bottom'] = subFeaturedBottomArticle.slug;
      }
    }

    console.log('articlesData:', articlesData);
    const results = await createHomepageLayout(
      apiUrl,
      apiToken,
      selectedLayout.id,
      articlesData
    );
    console.log('results:', results);
    if (
      results &&
      results.homepageLayoutDatas &&
      results.homepageLayoutDatas.createHomepageLayoutData &&
      results.homepageLayoutDatas.createHomepageLayoutData.data
    ) {
      setNotificationMessage('Successfully published homepage!');
      setNotificationType('success');
      setShowNotification(true);
    } else {
      console.log(results);
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
    <AdminLayout>
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
            apiToken={apiToken}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            hpData={hpData}
            articles={hpArticles}
            tags={tags}
            sections={sections}
            locale={currentLocale}
            metadata={metadata}
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
              locale={currentLocale}
              metadata={metadata}
            />
          )}
      </div>
      <style jsx global>
        {homepageStyles}
      </style>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  console.log('locales:', context.locales);
  console.log('current locale:', context.locale);

  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

  // get all available layout options
  const layoutSchemas = await listLayoutSchemas();

  //    get selected homepage layout / data
  const hpData = await getHomepageData();

  //    look up selected homepage articles
  const hpArticles = await getHomepageArticles(currentLocale, hpData);

  const metadata = await getSiteMetadataForLocale(currentLocale);

  const tags = await listAllTags();
  const sections = await listAllSections();

  return {
    props: {
      layoutSchemas,
      hpData,
      hpArticles,
      tags,
      sections,
      currentLocale,
      metadata,
      apiUrl,
      apiToken,
    },
  };
}
