import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { getHomepageData, listLayoutSchemas } from '../../lib/homepage.js';
import {
  listAllTags,
  listAllSections,
  getHomepageArticles,
} from '../../lib/articles.js';
import AdminNav from '../../components/nav/AdminNav';

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
  const [selectedLayout, setSelectedLayout] = useState(hpData.layoutSchema);
  const [homepageKey, setHomepageKey] = useState(Math.random());

  function changeLayout(layout) {
    console.log('changing layout...', layout);
    setSelectedLayout(layout);
    setHomepageKey(Math.random());
  }
  useEffect(() => {
    setSelectedLayout(hpData.layoutSchema);
    console.log('selectedLayout:', selectedLayout);
  }, [hpData]);

  return (
    <>
      <AdminNav
        homePageEditor={true}
        layoutSchemas={layoutSchemas}
        changeLayout={changeLayout}
        hpData={hpData}
      />

      <div key={homepageKey}>
        {(selectedLayout.name.value === 'Big Featured Story' ||
          selectedLayout.name === 'Big Featured Story') && (
          <BigFeaturedStory
            editable={true}
            apiUrl={apiUrl}
            apiToken={apiToken}
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
  console.log(layoutSchemas);

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
