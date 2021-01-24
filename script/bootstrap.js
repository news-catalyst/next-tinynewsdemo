#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const fetch = require('node-fetch');

const gql = require('../lib/graphql/queries');

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

function createGeneralNewsCategory() {
  const url = CONTENT_DELIVERY_API_URL;

  let localeOpts = {
    method: 'POST',
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query: gql.LIST_LOCALES}),
  };

  let values = [];
  fetch(url, localeOpts)
    .then((res) => res.json())
    .then((responseParsed) => {
      // console.log(responseParsed)
      let locales = responseParsed.data.i18n.listI18NLocales.data;

      locales.map(
        (locale) => {
          values.push({
            value: "News",
            locale: locale.id
          })

        });
      })
    .then((arg) => {
      const catVars = {
        data: {
          slug: "news",
          title: {
            values: values
          }
        }
      };

      let opts = {
        method: 'POST',
        headers: {
          authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ 
          query: gql.CREATE_CATEGORY,
          variables: catVars
        }),
      };

      fetch(url, opts)
        .then((res) => res.json())
        .then((data) => {
          console.log("- created general news category in all locales");
        })
        .catch(console.error);
    })
}

function createHomepageLayouts() {
  const url = CONTENT_DELIVERY_API_URL;

  const lpslVars = {
    data: {
      name: "Large Package Story Lead",
      data: "{ \"subfeatured-left\":\"string\", \"subfeatured-middle\":\"string\", \"subfeatured-right\":\"string\", \"featured\":\"string\" }"
    }
  };

  const bfsVars = {
    data: {
      name: "Big Featured Story",
      data: "{ \"featured\":\"string\" }"
    }
  };
  
  let opts = {
    method: 'POST',
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ 
      query: gql.CREATE_LAYOUT_SCHEMA,
      variables: lpslVars
    }),
  };

  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      console.log("- created homepage layout schema: large package story lead")
    })
    .catch(console.error);

  opts.body = JSON.stringify({
      query: gql.CREATE_LAYOUT_SCHEMA,
      variables: bfsVars
  })

  fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      console.log("- created homepage layout schema: big featured story")
    })
    .catch(console.error);
}

function createMetadata() {

  const data = {
    "shortName": "The New Oaklyn Observer",
    "siteUrl": "https://tinynewsco.org/",
    "homepageTitle": "The New Oaklyn Observer",
    "homepageSubtitle": "a new local news initiative",
    "subscribe": "{\"title\":\"Subscribe\",\"subtitle\":\"Get the latest news from Oaklyn in your inbox.\"}",
    "footerTitle": "tinynewsco.org",
    "footerBylineName": "News Catalyst",
    "footerBylineLink": "https://newscatalyst.org",
    "labels": "{\"latestNews\":\"Latest News\",\"search\":\"Search\",\"topics\":\"Topics\"}",
    "nav": "{\"articles\":\"Articles\",\"topics\":\"All Topics\",\"cms\":\"tinycms\"}",
    "searchTitle": "The Oaklyn Observer",
    "searchDescription": "Page description",
    "facebookTitle": "Facebook title",
    "facebookDescription": "Facebook description",
    "twitterTitle": "Twitter title",
    "twitterDescription": "Twitter description",
    "aboutHed": "Who We Are",
    "aboutDek": "We’re journalists for Oaklyn. We amplify community voices, share information resources, and investigate systems, not just symptoms.",
    "aboutCTA": "Learn more",
    "supportHed": "Support our work",
    "supportDek": "The Oaklyn Observer exists based on the support of our readers. Chip in today to help us continue serving Oaklyn with quality journalism.",
    "supportCTA": "Donate"
  };

  const url = CONTENT_DELIVERY_API_URL;

  let localeOpts = {
    method: 'POST',
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query: gql.LIST_LOCALES}),
  };

  fetch(url, localeOpts)
    .then((res) => res.json())
    .then((responseParsed) => {
      // console.log(responseParsed)
      let locales = responseParsed.data.i18n.listI18NLocales.data;

      let metadataRecords = null;
      let metadataOpts = {
        method: 'POST',
        headers: {
          authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: gql.LIST_METADATA}),
      };

      fetch(url, metadataOpts)
        .then((res) => res.json())
        .then((metadataParsed) => {
          try {
            metadataRecords = metadataParsed.data.siteMetadatas.listSiteMetadatas.data;
          } catch(e) {
            console.log("error finding records in response: ", e)
          }

          if (metadataRecords === null || metadataRecords === undefined || metadataRecords.length <= 0) {
            console.log("- no metadata found, creating...")
            let metadataVars = [];
            locales.map((locale) => {
              metadataVars.push({
                locale: locale.id,
                value: JSON.stringify(data)
              })
            });

            let variables = {
              data: {
                data: {
                  values: metadataVars
                },
                published: true,
              },
            };
            
            let opts = {
              method: 'POST',
              headers: {
                authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                query: gql.CREATE_METADATA,
                variables: variables
              }),
            };

            fetch(url, opts)
              .then((res) => res.json())
              .then((data) => {
                console.log("... done! created site metadata for all locales");
              })
              .catch(console.error);

          } else {
            console.log("- found metadata, checking for all locales...")

            let updatedMetadataVars = [];
            let metadataID = metadataRecords[0].id;

            // this should only be true if a locale is missing site metadata, otherwise there's no point in updating it
            let needsUpdate = false;
            locales.map((locale) => {
              let metadata = metadataRecords[0].data.values.find(
                (value) => value.locale === locale.id
              );

              if (metadata !== null && metadata !== undefined) {
                // don't do anything: metadata exists for this locale
                console.log("- metadata exists for locale: " + locale.code);

                updatedMetadataVars.push(metadata);
              } else {
                // update the metadata record to add in this locale
                console.log("- creating metadata for locale: " + locale.code);
                needsUpdate = true;

                updatedMetadataVars.push({
                  locale: locale.id,
                  value: JSON.stringify(data)
                })
              }
            })

            if (updatedMetadataVars.length > 0 && needsUpdate) {
              let variables = {
                id: metadataID,
                data: {
                  data: {
                    values: updatedMetadataVars
                  },
                  published: true,
                },
              };
            
              let opts = {
                method: 'POST',
                headers: {
                  authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  query: gql.UPDATE_METADATA,
                  variables: variables
                }),
              };

              fetch(url, opts)
                .then((res) => res.json())
                .then((data) => {
                  console.log("... done! updated site metadata for all locales");
                })
                .catch(console.error);

            }
          }
        })
        .catch( (err) => {
          // I think this is the "no metadata whatsoever exists, db is empty" situation?
          // create metadata (one record) with values for all site locales here.
          console.log("error listing metadata:");
          console.error(err);
        });
    })
    .catch( (err) => {
      console.log("error listing locales:");
      console.error(err);
    });

}

async function main() {
  createGeneralNewsCategory();
  createHomepageLayouts();
  createMetadata();
}

main().catch((error) => console.error(error));
