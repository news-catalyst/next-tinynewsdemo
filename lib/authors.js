import { fetchGraphQL } from './utils';

const HASURA_LIST_AUTHORS = `
  query FrontendListAuthors($localeCode: String) {
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

const HASURA_GET_AUTHOR_BY_SLUG = `query FrontendGetAuthorBySlug($slug: String) {
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

const HASURA_GET_AUTHOR_BY_ID = `query FrontendGetAuthorByID($id: Int!) {
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
    name: 'FrontendListAuthors',
    variables: { localeCode: localeCode },
  });
}

export function hasuraCreateAuthor(params) {
  console.log('hasuraCreateAuthor:', params);
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
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_AUTHOR_BY_SLUG,
    name: 'FrontendGetAuthorBySlug',
    variables: {
      slug: params['slug'],
    },
  });
}

export function hasuraGetAuthorById(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_AUTHOR_BY_ID,
    name: 'FrontendGetAuthorByID',
    variables: {
      id: params['id'],
    },
  });
}

const DELETE_AUTHOR_MUTATION = `mutation DeleteSingleAuthor($id: Int!) {
  delete_author_translations(where: {author_id: {_eq: $id}}) {
    affected_rows
  }
  delete_author_articles(where: {author_id: {_eq: $id}}) {
    affected_rows
  }
  delete_author_pages(where: {author_id: {_eq: 0}}) {
    affected_rows
  }
  delete_authors(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;

export function deleteSingleAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: DELETE_AUTHOR_MUTATION,
    name: 'DeleteSingleAuthor',
    variables: {
      id: params['id'],
    },
  });
}
