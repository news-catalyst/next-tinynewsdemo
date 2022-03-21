import { fetchGraphQL } from './graphql';

const HASURA_LIST_AUTHORS = `query FrontendListAuthors {
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
      email
      staff
      twitter
      photoUrl
      published
      author_translations(order_by: {id: desc}, limit: 1) {
        locale_code
        title
        bio
      }
    }
  }`;

const HASURA_INSERT_AUTHOR = `mutation FrontendInsertAuthor($bio: String, $first_names: String, $last_name: String, $locale_code: String, $title: String, $photoUrl: String, $published: Boolean, $email: String, $slug: String, $staff: Boolean, $twitter: String) {
  insert_authors(objects: {first_names: $first_names, last_name: $last_name, author_translations: {data: {bio: $bio, locale_code: $locale_code, title: $title}, on_conflict: {constraint: author_translations_pkey, update_columns: [bio, locale_code, title]}}, photoUrl: $photoUrl, published: $published, slug: $slug, email: $email, staff: $staff, twitter: $twitter}, on_conflict: {constraint: authors_slug_organization_id_key, update_columns: [first_names, last_name, slug, email, twitter, staff, published, photoUrl]}) {
    returning {
      first_names
      last_name
      photoUrl
      published
      slug
      email
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
    email
    staff
    twitter
    updated_at
    created_at
    author_translations(order_by: {id: desc}, limit: 1) {
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
    email
    staff
    twitter
    updated_at
    created_at
    author_translations(order_by: {id: desc}, limit: 1) {
      bio
      locale_code
      title
    }
  }
}`;

const HASURA_UPDATE_AUTHOR = `mutation updateAuthorWithTranslations($author_id: Int!, $locale_code: String!, $title: String, $bio: String, $first_names: String, $last_name: String, $photoUrl: String, $published: Boolean, $slug: String, $email: String, $staff: Boolean, $twitter: String) {
  delete_author_translations(where: {author_id: {_eq: $author_id}, locale_code: {_eq: $locale_code}}) {
    affected_rows
  }
  insert_author_translations(objects: [{author_id: $author_id, locale_code: $locale_code, title: $title, bio: $bio}]) {
    affected_rows
  }
  update_authors_by_pk(pk_columns: {id: $author_id}, _set: {first_names: $first_names, last_name: $last_name, photoUrl: $photoUrl, published: $published, slug: $slug, email: $email, staff: $staff, twitter: $twitter}) {
    id
    first_names
    last_name
    photoUrl
    published
    slug
    email
    staff
    twitter
    updated_at
    created_at
  }
}`;

const HASURA_AUTHOR_PAGE = `query FrontendAuthorPage($author_slug: String!, $locale_code: String!) {
  articles(order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}, where: {article_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, author_articles: {author: {slug: {_eq: $author_slug}}}}) {
    article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      main_image
      search_description
      search_title
      twitter_description
      twitter_title
      locale_code
    }
    category {
      slug
      id
      published
      category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        locale_code
        title
      }
    }
    slug
    author_articles(where: {author: {slug: {_eq: $author_slug}}}) {
      author {
        first_names
        last_name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
          locale_code
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}}}) {
      tag {
        tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
          locale_code
          title
        }
        slug
      }
    }
  }
  categories(where: {published: {_eq: true}, category_translations: {locale_code: {_eq: $locale_code}}}) {
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  site_metadatas(where: {published: {_eq: true}, site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    site_metadata_translations(order_by: {id: desc}, limit: 1, where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  authors(where: {slug: {_eq: $author_slug}}, limit: 1) {
    id
    slug
    author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      bio
      locale_code
      title
    }
    photoUrl
    first_names
    last_name
    twitter
    staff
  }
}`;
const HASURA_LIST_AUTHOR_PAGE_PATHS = `query FrontendListAuthorPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    authors(where: {published: {_eq: true}}) {
      id
      slug
      author_translations {
        locale_code
        title
      }
    }
  }
}`;

const HASURA_GET_AUTHOR_SLUGS = `query FrontendGetAuthorSlugs {
  authors(where: {published: {_eq: true}}) {
    slug
    author_translations {
      locale_code
    }
  }
}`;

export async function hasuraListAllAuthorPaths(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_GET_AUTHOR_SLUGS,
    name: 'FrontendGetAuthorSlugs',
  });
}

export function hasuraListAllAuthors(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  // console.log('listAllAuthors locale:', localeCode);
  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_LIST_AUTHORS,
    name: 'FrontendListAuthors',
  });
}

export function hasuraCreateAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
      email: params['email'],
      staff: params['staff'],
      twitter: params['twitter'],
    },
  });
}

export function hasuraUpdateAuthor(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
      email: params['email'],
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
    site: params['site'],
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
    site: params['site'],
    query: DELETE_AUTHOR_MUTATION,
    name: 'DeleteSingleAuthor',
    variables: {
      id: params['id'],
    },
  });
}

export async function hasuraAuthorPage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;

  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_AUTHOR_PAGE,
    name: 'FrontendAuthorPage',
    variables: {
      author_slug: params['authorSlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function listAuthorPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_AUTHOR_PAGE_PATHS,
    name: 'FrontendListAuthorPagePaths',
  });
}

export async function generateAllAuthorPagePaths(params = {}) {
  const { errors, data } = await listAuthorPagePaths(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.authors.length; x++) {
      let author = org.authors[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = author.slug;

      allPaths.push({
        params: siteParams,
      });
    }
  }

  return allPaths;
}
