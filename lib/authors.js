import { GraphQLClient } from 'graphql-request';

const CONTENT_DELIVERY_API_URL = process.env.ADMIN_CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;
const LOCALE_ID = '5efce70db7dd5900074c4b73'; //TODO add to .env

const LIST_AUTHORS = `
  {
    listAuthors {
      data {
        id
        name {
          value
        }
        title {
          value
        }
        bio {
          value
        }
        twitter {
          value
        }
        photoUrl {
          value
        }
        staff {
          value
        }
      }
    }
  }
`;

const UPDATE_AUTHOR = `mutation CreateAuthorFrom($revision: ID!, $data: AuthorInput) {
  content: createAuthorFrom(revision: $revision, data: $data) {
    data {
      id
      savedOn
      meta {
        published
        version
        locked
        parent
        status
      }
    }
    error {
      message
      code
      data
    }
  }
}`;

const GET_AUTHOR = `query Author($id: ID!) {
  getAuthor(where: {id: $id}) {
    data {
      id
      name {
        value
      }
      title {
        value
      }
      twitter {
        value
      }
      bio {
        value
      }
      staff {
        value
      }
    }
  }
}`;

const CREATE_AUTHOR = `mutation CreateAuthor($data: AuthorInput!) {
      content: createAuthor(data: $data) {
        data {
          id
          savedOn
          meta {
            published
            version
            locked
            parent
            status
          }
        }
        error {
          message
          code
          data
        }
      }
    }`;

const PUBLISH_AUTHOR = `mutation PublishAuthor($revision: ID!) {
  content: publishAuthor(revision: $revision) {
    data {
      id
      meta {
        publishedOn
      	published
    	}
    }

    error {
      message
      code
      data
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
  staff
) {
  let staffBool = false;
  if (staff === 'yes') {
    staffBool = true;
  }
  const variables = {
    data: {
      name: {
        values: [
          {
            locale: LOCALE_ID,
            value: name,
          },
        ],
      },
      title: {
        values: [
          {
            locale: LOCALE_ID,
            value: title,
          },
        ],
      },
      bio: {
        values: [
          {
            locale: LOCALE_ID,
            value: bio,
          },
        ],
      },
      twitter: {
        values: [
          {
            locale: LOCALE_ID,
            value: twitter,
          },
        ],
      },
      staff: {
        values: [
          {
            locale: LOCALE_ID,
            value: staffBool,
          },
        ],
      },
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
  return authorData.getAuthor.data;
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
    revision: authorId,
    data: {
      name: {
        values: [
          {
            value: name,
            locale: LOCALE_ID,
          },
        ],
      },
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
      twitter: {
        values: [
          {
            value: twitter,
            locale: LOCALE_ID,
          },
        ],
      },
      staff: {
        values: [
          {
            locale: LOCALE_ID,
            value: staffBool,
          },
        ],
      },
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

  return data.listAuthors.data;
}

export async function listAllAuthorIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const data = await webinyHeadlessCms.request(LIST_AUTHORS);
  const authorIds = data.listAuthors.data.map((author) => {
    return {
      params: {
        id: author.id,
      },
    };
  });
  return authorIds;
}

export async function publishAuthor(url, token, authorId) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    revision: authorId,
  };
  const responseData = await webinyHeadlessCms.request(
    PUBLISH_AUTHOR,
    variables
  );
  return responseData;
}
