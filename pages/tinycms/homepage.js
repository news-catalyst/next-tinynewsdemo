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

export default function HomePageEditor({ hpData, hpArticles, tags, sections }) {
  console.log('hp data:', hpData);
  console.log('hp articles:', hpArticles);
  return (
    <>
      {hpData.layoutComponent === 'BigFeaturedStory' && (
        <BigFeaturedStory
          articles={hpArticles}
          tags={tags}
          sections={sections}
        />
      )}
      {hpData.layoutComponent === 'LargePackageStoryLead' && (
        <LargePackageStoryLead
          articles={hpArticles}
          tags={tags}
          sections={sections}
        />
      )}
    </>
  );
}

export async function getStaticProps() {
  //    get selected homepage layout / data
  const hpData = await getHomepageData();
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
    },
  };
}
