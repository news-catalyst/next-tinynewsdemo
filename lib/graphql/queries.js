const CREATE_LAYOUT = `mutation CreateHomepageLayoutData($data: HomepageLayoutDataInput!) {
  homepageLayoutDatas {
      createHomepageLayoutData(data: $data) {
        data {
          id
          data
          layoutSchema {
            id
            name
            data
          }
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const CREATE_LAYOUT_SCHEMA = `mutation CreateHomepageLayoutSchema($data: HomepageLayoutSchemaInput!) {
  homepageLayoutSchemas {
      createHomepageLayoutSchema(data: $data) {
        data {
          id
          name
          data
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const UPDATE_LAYOUT = `mutation UpdateHomepageLayoutSchema($id: ID!, $data: HomepageLayoutSchemaInput!) {
  homepageLayoutSchemas {
    updateHomepageLayoutSchema(id: $id, data: $data) {
      data {
        id
        name
        data
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

const LIST_HOMEPAGE_DATA = `{
  homepageLayoutDatas {
    listHomepageLayoutDatas {
      error{
        code
        message
      }
      data {
        id
        data
        layoutSchema {
          id
          name
          data
        }
      }
    }
  }
}`;

const LIST_LAYOUT_SCHEMAS = `{
  homepageLayoutSchemas {
    listHomepageLayoutSchemas {
      error {
        code
        message
      }
      data {
        id
        name
        data
      }
    }
  }
}`;

const GET_LAYOUT = `query GetHomepageLayoutSchema($id: ID!) {
  homepageLayoutSchemas {
    getHomepageLayoutSchema(id: $id) {
      data {
        id
        name
        data
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

const LIST_METADATA = `{
  siteMetadatas {
    listSiteMetadatas {
      data {
        id
        data {
          values {
            locale
            value
          }
        }
        published
      }
    }
  }
}`;

const CREATE_METADATA = `mutation CreateSiteMetadata($data: SiteMetadataInput!) {
  siteMetadatas {
      createSiteMetadata(data: $data) {
        data {
          id
          data {
            values { 
              locale
              value
            }
          }
          published
          firstPublishedOn
          lastPublishedOn
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const UPDATE_METADATA = `mutation UpdateSiteMetadata($id: ID!, $data: SiteMetadataInput!) {
  siteMetadatas {
    updateSiteMetadata(id: $id, data: $data) {
      data {
        id
        data {
          values {
            locale
            value
          }
        }
        published
        firstPublishedOn
        lastPublishedOn
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

const LIST_LOCALES = `query ListI18nLocales {
  i18n {
    listI18NLocales {
      data {
        id
        code
        default
      }
    }
  }
}`;

const LIST_SECTIONS = `
{
  categories {
    listCategories {
      data {
        id
        slug
        title {
          values {
            value
            locale
          }
        }
      }
    }
  }
}
`;

const LIST_ARTICLES = `
{
  articles {
  listArticles {
    data {
      id
      availableLocales
      headlineSearch
      firstPublishedOn
      lastPublishedOn
      slug
      headline {
        values {
          locale
          value
        }
      }
      content {
        values {
          locale
          value
        }
      }
      category {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      tags {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      authors {
        id
        name
        slug
      }
      authorSlugs
      twitterTitle {
        values {
          locale
          value
        }
      }
      twitterDescription {
        values {
          locale
          value
        }
      }
      facebookTitle {
        values {
          locale
          value
        }
      }
      facebookDescription {
        values {
          locale
          value
        }
      }
      searchTitle {
        values {
          locale
          value
        }
      }
      searchDescription {
        values {
          locale
          value
        }
      }
    }
  }
}
}`;

const LIST_ARTICLES_REVERSE_CHRON = `
{
  articles {
  listArticles(sort: {firstPublishedOn: -1}) {
    data {
      id
      availableLocales
      headlineSearch
      firstPublishedOn
      lastPublishedOn
      slug
      headline {
        values {
          locale
          value
        }
      }
      content {
        values {
          locale
          value
        }
      }
      category {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      tags {
        id
        title{
          values {
            locale
            value
          }
        }
        slug
      }
      authors {
        id
        name
        slug
      }
      authorSlugs
    }
  }
}
  }`;

const LIST_ARTICLES_BY_SLUG = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        tags {
          id
          title{
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
      }
    }
  }
}`;

const LIST_ARTICLES_BY_AUTHOR = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        tags {
          id
          title{
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
      }
    }
  }
}`;

const LIST_IDS = `
{
  articles {
    listArticles {
      data {
        id
      }
    }
  }
}`;

const LIST_SLUGS = `
{
  articles {
    listArticles {
      data {
        category {
          slug
        }
        slug
      }
    }
  }
}`;

const LIST_AUTHORS = `
{
  authors {
    listAuthors {
      data {
        bio {
          values {
            locale
            value
          }
        }
        name
        title {
          values {
            locale
            value
          }
        }
        slug
      }
    }
  }
}`;

const LIST_TAGS = `{
  tags {
    listTags {
      data {
        id
        slug
        title {
          values {
            locale
            value
          }
        }
      }
    }
  }
}`;

const UPDATE_TAG = `mutation UpdateTag($id: ID!, $data: TagInput!) {
  tags {
    updateTag(id: $id, data: $data) {
      data {
        id
        title {
          values {
            locale
            value
          }
        }
        published
        slug
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

const GET_TAG_BY_ID = `query GetTag($id: ID!) {
  tags {
		getTag(id: $id) {
      data {
        id
        published
        title {
          values {
            locale
            value
          }
        }
        slug
      }
    }
  }
}`;

const GET_AUTHOR_BY_SLUG = `query Author($slug: String) {
  authors {
    listAuthors(where: {slug: $slug}) {
      data {
        name
        slug
      }
    }
  }
}`;

const SEARCH_ARTICLES = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(sort: {firstPublishedOn: -1}, where: $where) {
      data {
        id
        availableLocales
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        tags {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
        twitterTitle {
          values {
            locale
            value
          }
        }
        twitterDescription {
          values {
            locale
            value
          }
        }
        facebookTitle {
          values {
            locale
            value
          }
        }
        facebookDescription {
          values {
            locale
            value
          }
        }
        searchTitle {
          values {
            locale
            value
          }
        }
        searchDescription {
          values {
            locale
            value
          }
        }
      }
    }
  }
}`;

const GET_ARTICLE = `
query Article($id: ID!) {
  articles {
    getArticle(id: $id) {
      data {
        id
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
            locale
              value
            }
          }
          slug
        }
        tags {
          id
          title{
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
        twitterTitle {
          values {
            locale
            value
          }
        }
        twitterDescription {
          values {
            locale
            value
          }
        }
        facebookTitle {
          values {
            locale
            value
          }
        }
        facebookDescription {
          values {
            locale
            value
          }
        }
        searchTitle {
          values {
            locale
            value
          }
        }
        searchDescription {
          values {
            locale
            value
          }
        }
      }
    }
  }
  }`;

const GET_PAGE_BY_SLUG = `
query SearchPages($where: PageListWhere) {
  pages {
    listPages(where: $where) {
      data {
        id
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        twitterTitle {
          values {
            locale
            value
          }
        }
        twitterDescription {
          values {
            locale
            value
          }
        }
        facebookTitle {
          values {
            locale
            value
          }
        }
        facebookDescription {
          values {
            locale
            value
          }
        }
        searchTitle {
          values {
            locale
            value
          }
        }
        searchDescription {
          values {
            locale
            value
          }
        }
        slug
        published
      }
    }
  }
}`;

const GET_ARTICLE_BY_SLUG = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        published
        availableLocales
        firstPublishedOn
        lastPublishedOn
        twitterTitle {
          values {
            locale
            value
          }
        }
        twitterDescription {
          values {
            locale
            value
          }
        }
        facebookTitle {
          values {
            locale
            value
          }
        }
        facebookDescription {
          values {
            locale
            value
          }
        }
        searchTitle {
          values {
            locale
            value
          }
        }
        searchDescription {
          values {
            locale
            value
          }
        }

        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        tags {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
          slug
        }
        authorSlugs
      }
    }
  }
}`;

const GET_TAG_BY_SLUG = `
query Tag($slug: String) {
  tags {
    listTags(where: {slug: $slug}) {
      data {
        title {
          values {
            locale
            value
          }
        }
        slug
      }
    }
  }
}`;

const CREATE_TAG = `mutation CreateTag($data: TagInput!) {
  tags {
   createTag(data: $data) {
     data {
       id
       slug
     }
     error {
       code
       message
     }
   }
  }
 }`;

const CREATE_CATEGORY = `mutation CreateCategory($data: CategoryInput!) {
  categories {
      createCategory(data: $data) {
        data {
          id
          title {
            values {
              value                
              locale
            }
          }
          slug
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

module.exports = {
  CREATE_CATEGORY,
  CREATE_LAYOUT,
  CREATE_LAYOUT_SCHEMA,
  CREATE_METADATA,
  CREATE_TAG,
  LIST_ARTICLES,
  LIST_ARTICLES_BY_AUTHOR,
  LIST_ARTICLES_BY_SLUG,
  LIST_ARTICLES_REVERSE_CHRON,
  LIST_AUTHORS,
  LIST_HOMEPAGE_DATA,
  LIST_IDS,
  LIST_LAYOUT_SCHEMAS,
  LIST_LOCALES,
  LIST_METADATA,
  LIST_SECTIONS,
  LIST_SLUGS,
  LIST_TAGS,
  GET_ARTICLE,
  GET_ARTICLE_BY_SLUG,
  GET_AUTHOR_BY_SLUG,
  GET_LAYOUT,
  GET_PAGE_BY_SLUG,
  GET_TAG_BY_ID,
  GET_TAG_BY_SLUG,
  SEARCH_ARTICLES,
  UPDATE_LAYOUT,
  UPDATE_METADATA,
};
