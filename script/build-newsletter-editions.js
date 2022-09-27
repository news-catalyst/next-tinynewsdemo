#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const fetch = require('node-fetch');
const shared = require('./shared');

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

// https://stackoverflow.com/a/38327540
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

async function getNewsletterEditions() {
  const settingsResult = await shared.hasuraGetAllLetterheadSettings({
    url: apiUrl,
    adminSecret: adminSecret,
  });

  if (settingsResult.errors) {
    console.error(settingsResult.errors);
    return;
  }

  // group all settings by organization, then loop over each to get the newsletter editions
  const settings = settingsResult.data.settings;
  let groupedSettings = groupBy(settings, (setting) => setting.organization.id);

  for (const [organizationId, orgSettings] of groupedSettings) {
    // Only process BBG newsletters - used while testing this script
    // if (organizationId !== 109) {
    //   continue;
    // }
    // let site = orgSettings[0].organization.slug;
    // console.log('SITE:', site);

    let letterhead = {
      url: orgSettings.find((setting) => setting.name === 'LETTERHEAD_API_URL')
        ?.value,
      apiKey: orgSettings.find(
        (setting) => setting.name === 'LETTERHEAD_API_KEY'
      )?.value,
      channelSlug: orgSettings.find(
        (setting) => setting.name === 'LETTERHEAD_CHANNEL_SLUG'
      )?.value,
    };

    if (!letterhead['url']) {
      continue;
    }

    const letterheadUrl =
      letterhead['url'] + 'channels/' + letterhead['channelSlug'] + '/letters/?api=true';
    // console.log('Letterhead API URL:', letterheadUrl);

    try {
      const opts = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${letterhead['apiKey']}`,
        },
      };
      let res = await fetch(letterheadUrl, opts);
      let data = await res.json();
      let saveResult = await saveNewsletterEditions(organizationId, data);
      // console.log('save newsletter result:', saveResult);
    } catch (e) {
      console.error(e);
    }
  }
}

async function saveNewsletterEditions(organizationId, letterheadData) {
  console.log(
    organizationId,
    'Letterhead returned',
    letterheadData.length,
    'newsletter editions in total:'
  );

  for await (let newsletter of letterheadData.items) {
    let headline = shared.cleanContent(newsletter.title);

    if (newsletter.publicationStatus != 1) {
      console.log(
        '> Org#' +
        organizationId +
        ' Newsletter ID#' +
        newsletter.id +
        " '" +
        ' Newsletter status is ' + 
        newsletter.publicationStatus +
        "  " +
        headline +
        "' is not published, skipping." 
      );
      continue;
    }

    let slug = slugify(headline);
    if (!slug) {
      console.error('> no slug, skipping');
      continue;
    }

    if (!newsletter.emailTemplate) {
      console.error('> no content found, skipping this edition');
      continue;
    }

   

    let content = shared.cleanContent(newsletter.emailTemplate);
    let cleanedUpContent = content
      .replace(/<a\shref.*?>View\s+in\s+browser<\/a>/gim, '')
      .replace('Unsubscribe from this list', '')
      .replace(
        '<div style="background-color:#FFFFFF;">',
        '<div style="background-color:#FFFFFF; width: 100%;">'
      );

    let editionData = {
      slug: slug,
      headline: headline,
      letterhead_id: newsletter.id,
      letterhead_unique_id: newsletter.uniqueId,
      content: cleanedUpContent,
      newsletter_created_at: newsletter.createdAt,
      newsletter_published_at: newsletter.publicationDate,
    };

    if (newsletter.customizedByline) {
      editionData['byline'] = newsletter.customizedByline;
    }

    if (newsletter.subtitle) {
      editionData['subheadline'] = newsletter.subtitle;
    }

    const result = await shared.hasuraInsertNewsletterEdition(organizationId, {
      url: apiUrl,
      adminSecret: adminSecret,
      data: editionData,
    });

    if (result.errors) {
      console.error(
        '! Newsletter ID#' +
        newsletter.id +
        " '" +
        newsletter.title +
        "' had an error saving:",
        result.errors
      );
    } else {
      console.log(
        '. OrgID#' +
        organizationId +
        ' Newsletter ID#' +
        newsletter.id +
        " '" +
        newsletter.title +
        "' was published at " +
        newsletter.publicationDate +
        ', saved in Hasura with slug: ' +
        result.data.insert_newsletter_editions_one.slug +
        'publication status is ' + 
        newsletter.publicationStatus
      );
    }
  }
}

const slugify = (value) => {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  value = value.trim();
  value = value.toLowerCase();
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  value = value
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return value;
};

const publishNewsletters = process.env.PUBLISH_NEWSLETTERS;

if (!publishNewsletters || publishNewsletters === 'false') {
  console.log('Not publishing newsletters');
} else {
  getNewsletterEditions();
}
