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
  console.log('layoutSchemas:', layoutSchemas);

  const [selectedLayout, setSelectedLayout] = useState(null);

  useEffect(() => {
    console.log(hpData);
    setSelectedLayout(hpData.layoutSchema);
  }, [hpData]);

  return (
    <>
      <AdminNav
        homePageEditor={true}
        layoutSchemas={layoutSchemas}
        changeLayout={setSelectedLayout}
        hpData={hpData}
      />

      {hpData.layoutComponent === 'BigFeaturedStory' && (
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
      {hpData.layoutComponent === 'LargePackageStoryLead' && (
        <LargePackageStoryLead
          editable={true}
          articles={hpArticles}
          tags={tags}
          sections={sections}
        />
      )}
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
