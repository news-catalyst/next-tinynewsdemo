import { GraphQLClient } from 'graphql-request';
import { fetchGraphQL } from './utils';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const HASURA_LIST_AUTHORS = `
  query MyQuery($localeCode: String) {
    organization_locales {
      locale {
        code
      }
    }
    authors {
      id
      name
      created_at
      slug
      staff
      twitter
      photoUrl
      published
      author_translations(where: {locale_code: {_eq: $localeCode}}) {
        title
        bio
      }
    }
  }
`;

const HASURA_INSERT_AUTHOR = `
mutation insert_single_author($locale_code: String, $bio: String, $title: String, $name: String, $photoUrl: String, $published: Boolean, $slug: String, $staff: Boolean, $twitter: String) {
  insert_authors_one(object: {
    name: $name,
    slug: $slug,
    author_translations:
    {
      data: {
        title: $title,
        bio: $bio,
        locale_code:
        $locale_code
      }
    },
    published: $published,
    photoUrl: $photoUrl,
    staff: $staff,
    twitter: $twitter
  }) {
    id
    name
    slug
  }
}`;

const HASURA_GET_AUTHOR_BY_SLUG = `query MyQuery($slug: String) {
  authors(where: {slug: {_eq: $slug}}) {
    id
    name
    photoUrl
    published
    slug
    staff
    twitter
    updated_at
    created_at
    author_translations {
      bio
      title
    }
  }
}`;

const HASURA_GET_AUTHOR_BY_ID = `query MyQuery($id: Int!) {
  organization_locales {
    locale {
      code
    }
  }
  authors_by_pk(id: $id) {
    id
    name
    photoUrl
    published
    slug
    staff
    twitter
    updated_at
    created_at
    author_translations {
      bio
      title
    }
  }
}`;

const HASURA_UPDATE_AUTHOR = `mutation updateAuthorWithTranslations($author_id: Int!, $locale_code: String!, $title: String, $bio: String, $name: String, $photoUrl: String, $published: Boolean, $slug: String, $staff: Boolean, $twitter: String) {
  delete_author_translations(where: {author_id: {_eq: $author_id}, locale_code: {_eq: $locale_code}}) {
    affected_rows
  }
  insert_author_translations(objects: [{author_id: $author_id, locale_code: $locale_code, title: $title, bio: $bio}]) {
    affected_rows
  }
  update_authors_by_pk(pk_columns: {id: $author_id}, _set: {name: $name, photoUrl: $photoUrl, published: $published, slug: $slug, staff: $staff, twitter: $twitter}) {
    id
    name
    photoUrl
    published
    slug
    staff
    twitter
    updated_at
    created_at
  }
}`;

export function hasuraListAllAuthors(localeCode) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_LIST_AUTHORS,
    name: 'MyQuery',
    variables: { localeCode: localeCode },
  });
}

export function hasuraCreateAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_AUTHOR,
    name: 'insert_single_author',
    variables: {
      locale_code: params['localeCode'],
      bio: params['bio'],
      title: params['title'],
      name: params['name'],
      photoUrl: params['photoUrl'],
      published: params['published'],
      slug: params['slug'],
      staff: params['staff'],
      twitter: params['twitter'],
    },
  });
}

export function hasuraUpdateAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPDATE_AUTHOR,
    name: 'updateAuthorWithTranslations',
    variables: {
      author_id: params['id'],
      locale_code: params['localeCode'],
      bio: params['bio'],
      title: params['title'],
      name: params['name'],
      photoUrl: params['photoUrl'],
      published: params['published'],
      slug: params['slug'],
      staff: params['staff'],
      twitter: params['twitter'],
    },
  });
}
export function hasuraGetAuthorBySlug(params) {
  console.log('params:', params);
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_AUTHOR_BY_SLUG,
    name: 'MyQuery',
    variables: {
      slug: params['slug'],
    },
  });
}

export function hasuraGetAuthorById(params) {
  console.log('params:', params);
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_AUTHOR_BY_ID,
    name: 'MyQuery',
    variables: {
      id: params['id'],
    },
  });
}

const LIST_AUTHORS = `
{
  authors {
    listAuthors {
      data {
        id
        name
        bio {
          values {
            locale
            value
          }
        }
        twitter
        photoUrl
        title {
          values {
            locale
            value
          }
        }
        staff
      }
    }
  }
}
`;

const UPDATE_AUTHOR = `mutation UpdateAuthor($id: ID!, $data: AuthorInput!) {
  authors {
      updateAuthor(id: $id, data: $data) {
          data {
            id
            name
            bio {
              values {
                locale
                value
              }
            }
            title {
              values {
                locale
                value
              }
            }
            photoUrl
            twitter
            slug
            published
            staff
          }
          error  {
            code
            message
            data
          }
      }
  }
}`;

const GET_AUTHOR = `query GetAuthor($id: ID!) {
  authors {
    getAuthor(id: $id) {
      data {
        id
        name
        bio {
          values {
            locale
            value
          }
        }
        title {
          values {
            locale
            value
          }
        }
        staff
        photoUrl
        twitter
        slug
        published
      }
      error  {
        			code
        			message
        			data
    	}
   }
 }
}`;

const CREATE_AUTHOR = `mutation CreateAuthor($data: AuthorInput!) {
  authors {
      createAuthor(data: $data) {
          data {
            id
            name
            bio {
              values {
                value
              }
            }
            title {
              values {
                value
              }
            }
            photoUrl
            twitter
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

export async function createAuthor(
  apiUrl,
  apiToken,
  name,
  slug,
  title,
  twitter,
  bio,
  staff,
  currentLocale
) {
  let staffBool = false;
  if (staff === 'yes') {
    staffBool = true;
  }
  const variables = {
    data: {
      name: name,
      title: {
        values: [
          {
            locale: currentLocale.id,
            value: title,
          },
        ],
      },
      bio: {
        values: [
          {
            locale: currentLocale.id,
            value: bio,
          },
        ],
      },
      slug: slug,
      twitter: twitter,
      staff: staffBool,
    },
  };

  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: apiToken,
    },
  });

  const data = await webinyHeadlessCms.request(CREATE_AUTHOR, variables);

  return data;
}

export async function getAuthor(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorData = await webinyHeadlessCms.request(GET_AUTHOR, { id });
  return authorData.authors.getAuthor.data;
}

export async function updateAuthor(
  apiUrl,
  apiToken,
  authorId,
  name,
  slug,
  titleValues,
  twitter,
  bioValues,
  staff,
  bioImage
) {
  let staffBool = false;
  if (staff === 'yes') {
    staffBool = true;
  }
  const variables = {
    id: authorId,
    data: {
      name: name,
      title: {
        values: titleValues,
      },
      bio: {
        values: bioValues,
      },
      slug: slug,
      twitter: twitter,
      staff: staffBool,
      published: true,
      photoUrl: bioImage,
    },
  };

  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: apiToken,
    },
  });

  const data = await webinyHeadlessCms.request(UPDATE_AUTHOR, variables);

  return data;
}

export async function listAllAuthors() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const data = await webinyHeadlessCms.request(LIST_AUTHORS);

  return data.authors.listAuthors.data;
}

export async function listAllAuthorIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const data = await webinyHeadlessCms.request(LIST_AUTHORS);
  const authorIds = data.authors.listAuthors.data.map((author) => {
    return {
      params: {
        id: author.id,
      },
    };
  });
  return authorIds;
}
