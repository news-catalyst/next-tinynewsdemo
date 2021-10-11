import { useRouter } from 'next/router';
import Layout from '../../components/Layout.js';
import {
  hasuraListAllAuthorPaths,
  hasuraAuthorPage,
} from '../../lib/articles.js';
import { displayAuthorName, hasuraLocaliseText } from '../../lib/utils';
import { cachedContents } from '../../lib/cached';
import { getArticleAds } from '../../lib/ads.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';
import tw from 'twin.macro';
import { Anchor } from '../../components/common/CommonStyles.js';
import ReadInOtherLanguage from '../../components/articles/ReadInOtherLanguage';
import {
  SectionContainer,
  SectionLayout,
  Block,
} from '../../components/common/CommonStyles';

export default function AuthorPage({
  sections,
  articles,
  author,
  siteMetadata,
  expandedAds,
  locales,
  locale,
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
    authorName = displayAuthorName(author.first_names, author.last_name);
    authorPhoto = author.photoUrl;
    authorTitle = hasuraLocaliseText(author.author_translations, 'title');
    authorBio = hasuraLocaliseText(author.author_translations, 'bio');
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

  const ProfileHeaderDiv = tw.div`flex flex-row items-center max-w-7xl mx-auto my-8 bg-white`;
  const ProfileImage = tw.img`flex block rounded-full mr-5 w-48 h-48 bg-white`;
  const ProfileHeadingText = tw.p`text-4xl uppercase`;
  const ProfileTitle = tw.p`text-2xl`;
  const ProfileDiv = tw.div`w-full border-b-2 border-black pb-2`;
  const ProfileBio = tw.p`pt-2 text-lg`;
  const ProfileTwitter = tw.p`text-base pt-3`;

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
      />
      {locales.length > 1 && (
        <SectionLayout>
          <SectionContainer>
            <Block>
              <ReadInOtherLanguage locales={locales} currentLocale={locale} />
            </Block>
          </SectionContainer>
        </SectionLayout>
      )}
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
  let locales = [];
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
    locales = data.organization_locales;

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
      locales,
      locale,
    },
  };
}
