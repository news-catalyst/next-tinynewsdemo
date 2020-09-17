import dynamic from 'next/dynamic';
import { getHomepageData } from '../../lib/homepage.js';
import {
  listAllTags,
  listAllSections,
  getHomepageArticles,
} from '../../lib/articles.js';

const BigFeaturedStory = dynamic(() =>
  import(`../../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../../components/homepage/LargePackageStoryLead`)
);

export default function HomePageEditor({
  hpData,
  hpArticles,
  tags,
  sections,
  apiUrl,
  apiToken,
}) {
  console.log('hpData:', hpData);

  return (
    <>
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

  //    get selected homepage layout / data
  const hpData = await getHomepageData();
  console.log('HPDATA:', hpData);
  console.log('HPDATA.articles:', hpData.articles);
  console.log('HPDATA[articles]:', hpData['articles']);
  //    look up selected homepage articles
  const hpArticles = await getHomepageArticles(hpData.articles);
  console.log('found hpArticles keys:', Object.keys(hpArticles));

  const tags = await listAllTags();
  const sections = await listAllSections();

  return {
    props: {
      hpData,
      hpArticles,
      tags,
      sections,
      apiUrl,
      apiToken,
    },
  };
}
