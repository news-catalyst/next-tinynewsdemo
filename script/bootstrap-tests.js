#! /usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const shared = require('./shared');
// const vercel = require("./vercel");

require('dotenv').config({ path: '.env.local' });

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

// const googleAnalyticsAccountID = process.env.GA_ACCOUNT_ID;

let organizationID;

async function createOrganization(opts) {
  let name = opts.name;
  let slug = opts.slug;
  let locales = opts.locales;

  const { errors, data } = await shared.hasuraInsertOrganization({
    url: apiUrl,
    adminSecret: adminSecret,
    name: name,
    slug: slug,
  });

  if (errors) {
    console.error(
      "Error creating a record for organization with name '" + name + "':",
      errors
    );
  } else {
    organizationID = data.insert_organizations_one.id;
    console.log(
      'Created a record for organization with ID ' + organizationID,
      data
    );

    const result = await shared.hasuraInsertLocale({
      url: apiUrl,
      adminSecret: adminSecret,
      name: 'English',
      code: 'en-US',
    });
    if (result.errors) {
      console.error('Error setting en-US locale:', result.errors);
      return;
    }

    shared
      .hasuraListAllLocales({
        url: apiUrl,
        adminSecret: adminSecret,
      })
      .then((res) => {
        let allLocales = res.data.locales;
        let orgLocaleObjects = [];
        allLocales.forEach((aLocale) => {
          console.log('all locales:', aLocale, 'locales:', locales);
          let foundLocale = locales.find((l) => l === aLocale.code);
          console.log('all locales found:', foundLocale);
          if (foundLocale) {
            orgLocaleObjects.push({
              locale_id: aLocale.id,
              organization_id: organizationID,
            });
          }
        });
        console.log('orgLocaleObjects:', orgLocaleObjects);
        shared
          .hasuraInsertOrgLocales({
            url: apiUrl,
            adminSecret: adminSecret,
            orgLocales: orgLocaleObjects,
          })
          .then((res) => {
            console.log('Setup locales for the organization:', res);

            let siteMetadata = {
              color: 'colorone',
              theme: 'styleone',
              siteUrl: 'https://tinynewsco.org/',
              aboutCTA: 'Learn more',
              aboutDek: `About the ${name} TK`,
              aboutHed: 'Who We Are',
              bodyFont: 'Source Sans Pro',
              shortName: name,
              supportCTA: 'Donate',
              supportDek: `${name} exists based on the support of our readers. Chip in today to help us continue delivering quality journalism.`,
              supportHed: 'Support our work',
              supportURL:
                'https://tiny-news-collective.monkeypod.io/give/support-the-oaklyn-observer?secret=84fc2987ea6e8f11b8f4f8aca8b749d7',
              footerTitle: 'tinynewsco.org',
              headingFont: 'Source Serif Pro',
              landingPage: false,
              searchTitle: name,
              primaryColor: '#de7a00',
              twitterTitle: 'Twitter title',
              facebookTitle: 'Facebook title',
              homepageTitle: name,
              membershipDek:
                'Support great journalism by becoming a member for a low monthly price.',
              membershipHed: 'Become a member',
              newsletterDek: `Get the latest headlines from ${name} right in your inbox.`,
              newsletterHed: 'Sign up for our newsletter',
              donateBlockDek:
                'Support our local journalism with a monthly pledge.',
              donateBlockHed: 'Donate',
              secondaryColor: '#002c57',
              donationOptions:
                '[{\n"uuid": "92f77857-eea6-4035-ae86-e9781e2627b2",\n"amount": 5,\n"name": "Member"\n},\n{\n"uuid": "92f778a9-3187-4fe5-9d6b-a3041f126456",\n"amount": 10,\n"name": "Supporter"\n},\n{\n"uuid": "92f77888-d1cc-4491-8080-780f0b109320",\n"amount": 20,\n"name": "Superuser"\n}]',
              footerBylineLink: 'https://newscatalyst.org',
              footerBylineName: 'News Catalyst',
              searchDescription: 'Page description',
              twitterDescription: 'Twitter description',
              facebookDescription: 'Facebook description',
            };

            locales.map((locale) => {
              shared
                .hasuraUpsertMetadata({
                  url: apiUrl,
                  adminSecret: adminSecret,
                  organization_id: organizationID,
                  data: siteMetadata,
                  locale_code: locale,
                  published: true,
                })
                .then((res) => {
                  console.log(
                    'created site metadata for ' + name + ' in locale ' + locale
                  );
                  console.log(res);
                });
              shared
                .hasuraInsertSections({
                  url: apiUrl,
                  adminSecret: adminSecret,
                  objects: [
                    {
                      organization_id: organizationID,
                      title: 'News',
                      slug: 'news',
                      published: true,
                      category_translations: {
                        data: {
                          locale_code: locale,
                          title: 'News',
                        },
                        on_conflict: {
                          constraint:
                            'category_translations_locale_code_category_id_key',
                          update_columns: 'title',
                        },
                      },
                    },
                    {
                      organization_id: organizationID,
                      title: 'Politics',
                      slug: 'politics',
                      published: false,
                      category_translations: {
                        data: {
                          locale_code: locale,
                          title: 'Politics',
                        },
                        on_conflict: {
                          constraint:
                            'category_translations_locale_code_category_id_key',
                          update_columns: 'title',
                        },
                      },
                    },
                    {
                      organization_id: organizationID,
                      title: 'COVID-19',
                      slug: 'covid-19',
                      published: false,
                      category_translations: {
                        data: {
                          locale_code: locale,
                          title: 'COVID-19',
                        },
                        on_conflict: {
                          constraint:
                            'category_translations_locale_code_category_id_key',
                          update_columns: 'title',
                        },
                      },
                    },
                  ],
                })
                .then((res) => {
                  console.log('Created the default sections:', res);
                  shared
                    .hasuraUpsertHomepageLayout({
                      url: apiUrl,
                      adminSecret: adminSecret,
                      organization_id: organizationID,
                      name: 'Large Package Story Lead',
                      data:
                        '{ "subfeatured-top":"string", "subfeatured-bottom":"string", "featured":"string" }',
                    })
                    .then((res) => {
                      console.log(
                        'Created the Large Package Story Lead homepage layout:',
                        res
                      );
                      shared
                        .hasuraUpsertHomepageLayout({
                          url: apiUrl,
                          adminSecret: adminSecret,
                          organization_id: organizationID,
                          name: 'Big Featured Story',
                          data: '{ "featured":"string" }',
                        })
                        .then((res) => {
                          console.log(
                            'Created the Big Featured Story homepage layout:',
                            res
                          );
                        });
                    });
                });
            });
            console.log(
              'Make sure to review settings in the tinycms once this is done!'
            );
          });
      })
      .catch(console.error);
  }
}

function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
}

program
  .requiredOption('-n, --name <name>', 'the name of the new organization')
  .requiredOption(
    '-s, --slug <slug>',
    'a short (A-Za-z0-9_) slug for the organization'
  )
  .requiredOption('-l, --locales [locales...]', 'specify supported locales')
  .description('sets up a new organization in Hasura for running Cypress tests')
  .action((opts) => {
    createOrganization(opts);
  });

program.parse(process.argv);
