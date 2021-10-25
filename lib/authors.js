import { fetchGraphQL } from './utils';

const HASURA_LIST_AUTHORS = `
  query FrontendListAuthors($localeCode: String) {
    organization_locales {
      locale {
        code
      }
    }
    authors(order_by: {last_name: asc}) {
      id
      first_names
      last_name
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

const HASURA_INSERT_AUTHOR = `mutation FrontendInsertAuthor($bio: String, $first_names: String, $last_name: String, $locale_code: String, $title: String, $photoUrl: String, $published: Boolean, $slug: String, $staff: Boolean, $twitter: String) {
  insert_authors(objects: {first_names: $first_names, last_name: $last_name, author_translations: {data: {bio: $bio, locale_code: $locale_code, title: $title}, on_conflict: {constraint: author_translations_pkey, update_columns: [bio, locale_code, title]}}, photoUrl: $photoUrl, published: $published, slug: $slug, staff: $staff, twitter: $twitter}, on_conflict: {constraint: authors_slug_key, update_columns: [first_names, last_name, slug, twitter, staff, published, photoUrl]}) {
    returning {
      first_names
      last_name
      photoUrl
      published
      slug
      staff
      twitter
      id
      author_translations {
        bio
        title
        locale_code
      }
    }
  }
}`;

const HASURA_GET_AUTHOR_BY_SLUG = `query FrontendGetAuthorBySlug($slug: String) {
  authors(where: {slug: {_eq: $slug}}) {
    id
    first_names
    last_name
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
    first_names
    last_name
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

const HASURA_UPDATE_AUTHOR = `mutation updateAuthorWithTranslations($author_id: Int!, $locale_code: String!, $title: String, $bio: String, $first_names: String, $last_name: String, $photoUrl: String, $published: Boolean, $slug: String, $staff: Boolean, $twitter: String) {
  delete_author_translations(where: {author_id: {_eq: $author_id}, locale_code: {_eq: $locale_code}}) {
    affected_rows
  }
  insert_author_translations(objects: [{author_id: $author_id, locale_code: $locale_code, title: $title, bio: $bio}]) {
    affected_rows
  }
  update_authors_by_pk(pk_columns: {id: $author_id}, _set: {first_names: $first_names, last_name: $last_name, photoUrl: $photoUrl, published: $published, slug: $slug, staff: $staff, twitter: $twitter}) {
    id
    first_names
    last_name
    photoUrl
    published
    slug
    staff
    twitter
    updated_at
    created_at
  }
}`;

export function hasuraListAllAuthors(localeCode, params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  // console.log('listAllAuthors locale:', localeCode);
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_LIST_AUTHORS,
    name: 'FrontendListAuthors',
    variables: { localeCode: localeCode },
  });
}

export function hasuraCreateAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_AUTHOR,
    name: 'FrontendInsertAuthor',
    variables: {
      locale_code: params['localeCode'],
      bio: params['bio'],
      title: params['title'],
      first_names: params['first_names'],
      last_name: params['last_name'],
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
      first_names: params['first_names'],
      last_name: params['last_name'],
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
