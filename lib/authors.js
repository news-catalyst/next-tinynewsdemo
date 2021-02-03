import { GraphQLClient } from 'graphql-request';
import { fetchGraphQL } from './utils';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const HASURA_LIST_AUTHORS = `
  query MyQuery($localeCode: String) {
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

export function hasuraListAllAuthors(localeCode) {
  return fetchGraphQL(HASURA_LIST_AUTHORS, 'MyQuery', {
    localeCode: localeCode,
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
