import { GraphQLClient } from 'graphql-request';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
const LOCALE_ID = process.env.LOCALE_ID;

const LIST_AUTHORS = `
{
  authors {
    listAuthors {
      data {
        id
        name
        bio {
          values {
            value
          }
        }
        twitter
        photoUrl
        title {
          values {
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
                  value
                }
        }
        title {
                values {
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
  title,
  twitter,
  bio,
  staff
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
        values: [
          {
            value: title,
            locale: LOCALE_ID,
          },
        ],
      },
      bio: {
        values: [
          {
            value: bio,
            locale: LOCALE_ID,
          },
        ],
      },
      twitter: twitter,
      staff: staffBool,
      published: true,
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
