import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout.js';
import {
  generateAllAuthorPagePaths,
  hasuraAuthorPage,
} from '../../../../lib/authors';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../lib/settings.js';
import { avoidRateLimit, displayAuthorName } from '../../../../lib/utils';
import { cachedContents } from '../../../../lib/cached';
import { getArticleAds } from '../../../../lib/ads.js';
import ArticleStream from '../../../../components/homepage/ArticleStream';
import tw from 'twin.macro';
import { Anchor } from '../../../../components/common/CommonStyles.js';
import { NextSeo } from 'next-seo';

export default function AuthorPage({
  sections,
  articles,
  author,
  siteMetadata,
  expandedAds,
  monkeypodLink,
  site,
}) {
  const router = useRouter();
  const isAmp = false;

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let authorName;
  let authorPhoto;
  let authorTitle;
  let authorBio;
  let authorTwitter;
  if (author) {
    authorName = displayAuthorName(author.first_names, author.last_name);
    authorPhoto = author.photoUrl;
    authorTitle = author.author_translations[0]?.title;
    authorBio = author.author_translations[0]?.bio;
    authorTwitter = author.twitter;

    // set page title
    siteMetadata['homepageTitle'] =
      authorName + ' | ' + siteMetadata['shortName'];
  }

  let twitterCall;
  let twitterLink;
  if (authorTwitter) {
    twitterCall = `Follow ${authorName} on Twitter @`;
    twitterLink = 'https://twitter.com/' + authorTwitter;
  }

  const ProfileHeaderDiv = tw.div`flex flex-row items-center max-w-7xl mx-auto px-5 my-8 bg-white`;
  const ProfileImage = tw.img`flex block rounded-full mr-5 w-48 h-48 bg-white`;
  const ProfileHeadingText = tw.p`text-4xl uppercase`;
  const ProfileTitle = tw.p`text-2xl`;
  const ProfileDiv = tw.div`w-full border-b-2 border-black pb-2`;
  const ProfileBio = tw.p`pt-2 text-lg`;
  const ProfileTwitter = tw.p`text-base pt-3`;
 console.log(author)
  return (
    <Layout
      meta={siteMetadata}
      sections={sections}
      monkeypodLink={monkeypodLink}
      site={site}
    >
      <ProfileHeaderDiv>
        {authorPhoto && <ProfileImage src={authorPhoto}></ProfileImage>}
        <div>
          <ProfileHeadingText>
            <strong>{authorName}</strong>
          </ProfileHeadingText>
          <ProfileTitle>{authorTitle}</ProfileTitle>
          <ProfileDiv></ProfileDiv>
          <ProfileBio dangerouslySetInnerHTML={{ __html: authorBio }} />
          <ProfileTwitter>
            <em>
              {twitterCall}
              <Anchor meta={siteMetadata} href={twitterLink}>
                {authorTwitter}
              </Anchor>
            </em>
          </ProfileTwitter>
        </div>
      </ProfileHeaderDiv>
      <ArticleStream
        sections={sections}
        articles={articles}
        title={`Stories by ${authorName}`}
        showCategory={true}
        isAmp={isAmp}
        metadata={siteMetadata}
        ads={expandedAds}
        monkeypodLink={monkeypodLink}
      />

<NextSeo
  title={authorName || siteMetadata.searchTitle}
  description={siteMetadata.searchDescription}
  canonical={`${siteMetadata.siteUrl}/authors/${author.slug}`}
  openGraph={{
    title: authorName || siteMetadata.searchTitle,
    description: siteMetadata.facebookDescription || siteMetadata.searchDescription,
    url: `${siteMetadata.siteUrl}/authors/${author.slug}`,
    images: [
      {
        url: siteMetadata.defaultSocialImage,
        width: siteMetadata.defaultSocialImageWidth, 
        height: siteMetadata.defaultSocialImageHeight,
      },
    ],
  }}
/>
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllAuthorPagePaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  await avoidRateLimit();

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

  let slug = params.slug;
  if (slug === undefined) {
    return {
      notFound: true,
    };
  }

  let articles = [];
  let sections = [];
  let author;
  let siteMetadata;

  const { errors, data } = await hasuraAuthorPage({
    url: apiUrl,
    site: site,
    authorSlug: params.slug,
    localeCode: 'en-US',
  });

  if (errors || !data) {
    // console.log('author page errors:', errors, data);
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;
    author = data.authors[0];

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0].title;
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }
  const settings = settingsResult.data.settings;
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  let expandedAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  if (author === undefined) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      sections,
      articles,
      author,
      siteMetadata,
      expandedAds,
      monkeypodLink,
      site,
    },
  };
}
