#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const fetch = require('node-fetch');

const shared = require("./shared");

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

function getNewsletterEditions() {
  const letterheadUrl = process.env.LETTERHEAD_API_URL + "channels/" + process.env.LETTERHEAD_CHANNEL_SLUG + "/letters";
  const opts = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LETTERHEAD_API_KEY}`,
    },
  };
  fetch(letterheadUrl, opts)
    .then((res) => res.json())
    .then((data) => {
      saveNewsletterEditions(data);
    })
    .catch(console.error);
}

async function saveNewsletterEditions(letterheadData) {
  console.log("Letterhead returned", letterheadData.length, "newsletter editions in total:");

  for await (let newsletter of letterheadData) {
    if (!newsletter.publicationDate) {
      console.log("> Newsletter ID#" + newsletter.id + " '" + newsletter.title + "' is not published, skipping.")
      continue;
    }

    let slug = slugify(newsletter.title);
    if (!slug) {
      continue;
    }

    let editionData = {
      slug: slug,
      headline: newsletter.title,
      letterhead_id: newsletter.id,
      letterhead_unique_id: newsletter.uniqueId,
      content: newsletter.delta,
      newsletter_created_at: newsletter.createdAt,
      newsletter_published_at: newsletter.publicationDate,
    }
    if (newsletter.customizedByline) {
      editionData['byline'] = newsletter.customizedByline;
    }
    if (newsletter.customizedByline) {
      editionData['subheadline'] = newsletter.subtitle;
    }

    const result = await shared.hasuraInsertNewsletterEdition({
      url: apiUrl,
      orgSlug: apiToken,
      data: editionData,
    });

    if (result.errors) {
      console.error("! Newsletter ID#" + newsletter.id + " '" + newsletter.title + "' had an error saving:", result.errors);
    } else {
      console.log(". Newsletter ID#" + newsletter.id + " '" + newsletter.title + "' was published at " + newsletter.publicationDate + ", saved in Hasura with slug: " + result.data.insert_newsletter_editions_one.slug)
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


getNewsletterEditions();