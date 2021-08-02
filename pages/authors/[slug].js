import { useRouter } from 'next/router';
import Layout from '../../components/Layout.js';
import {
  hasuraListAllAuthorPaths,
  hasuraAuthorPage,
} from '../../lib/articles.js';
import { hasuraLocaliseText } from '../../lib/utils';
import { cachedContents } from '../../lib/cached';
import { getArticleAds } from '../../lib/ads.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';
import tw from 'twin.macro';

export default function AuthorPage({
  sections,
  articles,
  author,
  siteMetadata,
  expandedAds,
}) {
  const router = useRouter();
  const isAmp = useAmp();
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
    authorName = author.name;
    authorPhoto = author.photoUrl;
    authorTitle = author.title;
    authorBio = author.bio;
    authorTwitter = author.twitter;
  }

  let twitterCall;
  let twitterLink;
  if (authorTwitter) {
    twitterCall = `Follow ${authorName} on Twitter @`;
    twitterLink = 'https://twitter.com/' + authorTwitter;
  }

  const ProfileHeaderDiv = tw.div`flex flex-row items-center md:w-full mx-5 my-8 bg-white`;
  const ProfileImage = tw.img`flex block rounded-full mr-5 w-48 h-48 bg-white`;
  const ProfileHeadingText = tw.p`text-3xl uppercase`;
  const ProfileTitle = tw.p`text-xl`;
  const ProfileDiv = tw.div`w-2/3 border-b-2 border-black pb-2`;
  const ProfileBio = tw.p`pt-2 text-lg`;
  const ProfileTwitter = tw.p`text-base pt-3`;
  const TwitterHoverUnderline = tw.a`hover:underline`;

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <ProfileHeaderDiv>
        <ProfileImage src={authorPhoto}></ProfileImage>
        <div>
          <ProfileHeadingText>
            <strong>{authorName}</strong>
          </ProfileHeadingText>
          <ProfileTitle>{authorTitle}</ProfileTitle>
          <ProfileDiv></ProfileDiv>
          <ProfileBio>{authorBio}</ProfileBio>
          <ProfileTwitter>
            <em>
              {twitterCall}
              <TwitterHoverUnderline href={twitterLink}>
                {authorTwitter}
              </TwitterHoverUnderline>
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
      />
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const { errors, data } = await hasuraListAllAuthorPaths();
  let paths = [];
  let authors = [];
  if (errors || !data) {
    return {
      paths,
      fallback: true,
    };
  } else {
    authors = data.authors;
  }

  authors.map((author) => {
    author.author_translations.map((translation) => {
      paths.push({
        params: {
          slug: author.slug,
        },
        locale: translation.locale_code,
      });
    });
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

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
    orgSlug: apiToken,
    authorSlug: params.slug,
    localeCode: locale,
  });

  if (errors || !data) {
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;
    author = data.authors[0];

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  let expandedAds = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
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
    },
  };
}
