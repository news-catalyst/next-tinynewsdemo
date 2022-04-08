<<<<<<< Updated upstream
import {
  generateAllDomainPaths,
  getOrgSettings,
  findSetting,
} from '../../../lib/settings';
=======

import { generateAllDomainPaths } from '../../../lib/settings';
>>>>>>> Stashed changes
import { hasuraGetPage } from '../../../lib/pages.js';
import StaffPage from '../../../components/StaffPage';
import { NextSeo } from 'next-seo';


export default function Staff(props) {
  

  const isAmp = false;

  console.log(props)
  
  return ( 
    <>
  
  <StaffPage {...props} isAmp={isAmp} /> 
  <NextSeo
  title= "Staff"
  description={props.siteMetadata.facebookDescription || props.metaValues.searchDescription}
  canonical={`${props.siteMetadata.siteUrl}/staff`}
  openGraph={{
    title: `Staff`,
    description: props.siteMetadata.facebookDescription,
    url: `${props.siteMetadata.siteUrl}/staff`,
    images: [
      {
        url: props.siteMetadata.defaultSocialImage,
        width: props.siteMetadata.defaultSocialImageWidth, 
        height: props.siteMetadata.defaultSocialImageHeight,
      },
    ],
  }}
/>
</>


  
  ) 
}


export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  const locale = 'en-US';

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: { slug: 'staff' },
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;
  const locale = 'en-US';

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  let page = {};
  let sections;
  let siteMetadata = {};
  let authors = [];

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: 'staff',
    localeCode: 'en-US',
  });

  if (errors || !data) {
    console.error('getPage errors:', errors);
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    sections = data.categories;
    authors = data.authors;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0]?.data;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0]?.title;
    }
  }

  return {
    props: {
      authors,
      locale,
      sections,
      siteMetadata,
      monkeypodLink,
      site,
    },
    
    revalidate: 1,
  };

  
}

