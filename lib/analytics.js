import { fetchGraphQL } from './graphql';

const HASURA_GET_DATA_IMPORTS = `query FrontendDataImports($end_date: date, $start_date: date) {
  ga_data_imports(where: {end_date: {_eq: $end_date}, start_date: {_eq: $start_date}}, order_by: {organization: {slug: asc}, table_name: asc}) {
    end_date
    notes
    row_count
    start_date
    success
    table_name
    organization {
      name
      slug
    }
  }
}`;

export function hasuraGetDataImports(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['apiToken'],
    query: HASURA_GET_DATA_IMPORTS,
    name: 'FrontendDataImports',
    variables: {
      start_date: params['start_date'],
      end_date: params['end_date'],
    },
  });
}

const HASURA_GET_SOURCE_ETHNICITY_DISTRIBUTION = `query SourceEthnicityDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      ethnicity
    }
  }
}`;

export async function hasuraGetSourceDistroByEthnicity(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SOURCE_ETHNICITY_DISTRIBUTION,
    name: 'SourceEthnicityDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_RACE_DISTRIBUTION = `query SourceRaceDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      race
    }
  }
}`;

export async function hasuraGetSourceDistroByRace(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SOURCE_RACE_DISTRIBUTION,
    name: 'SourceRaceDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_AGE_DISTRIBUTION = `query SourceAgeDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      age
    }
  }
}`;

export async function hasuraGetSourceDistroByAge(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SOURCE_AGE_DISTRIBUTION,
    name: 'SourceAgeDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_GENDER_DISTRIBUTION = `query SourceGenderDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      gender
    }
  }
}`;

export async function hasuraGetSourceDistroByGender(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SOURCE_GENDER_DISTRIBUTION,
    name: 'SourceGenderDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_SEXUAL_ORIENTATION_DISTRIBUTION = `query SourceSexualOrientationDistributionAnalytics($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      sexual_orientation
    }
  }
}`;

export async function hasuraGetSourceDistroBySexualOrientation(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SOURCE_SEXUAL_ORIENTATION_DISTRIBUTION,
    name: 'SourceSexualOrientationDistributionAnalytics',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

const HASURA_GET_SOURCE_ZIPS = `query SourceZipCodes($startDate: timestamptz, $endDate: timestamptz) {
  sources_aggregate(where: {article_sources: {article: {article_translations: {first_published_at: {_gte: $startDate, _lte: $endDate}}}}}) {
    aggregate {
      count
    }
    nodes {
      zip
    }
  }
}`;

export async function hasuraGetSourceZipCodes(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SOURCE_ZIPS,
    name: 'SourceZipCodes',
    variables: {
      startDate: params['startDate'],
      endDate: params['endDate'],
    },
  });
}

export function sanitizePath(path) {
  if (/\?/.test(path)) {
    path = path.split('?')[0];
  }
  if (/\/en-US\//.test(path)) {
    path = path.replace('/en-US', '');
  }
  return path;
}
