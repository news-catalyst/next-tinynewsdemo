#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const fetch = require('node-fetch');
const shared = require('./shared');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');
const imageType = require('image-type');

const apiUrl = process.env.HASURA_API_URL;
const adminSecret = process.env.HASURA_ADMIN_SECRET;

async function upload(imageID, contentUri, slug, site, settings) {
  // console.log('upload settings:', settings);
  const AWS_ACCESS_KEY_ID = settings.find(
    (setting) => setting.name === 'TNC_AWS_ACCESS_ID'
  )?.value;
  const AWS_SECRET_KEY = settings.find(
    (setting) => setting.name === 'TNC_AWS_ACCESS_KEY'
  )?.value;
  const AWS_BUCKET = settings.find(
    (setting) => setting.name === 'TNC_AWS_BUCKET_NAME'
  )?.value;

  if (!AWS_SECRET_KEY || !AWS_ACCESS_KEY_ID || !AWS_BUCKET) {
    console.error(settings);
    return;
  }

  const assetsDomain = process.env.NEXT_PUBLIC_ASSETS_DOMAIN;
  // console.log('TINYS3 Assets Domain:', assetsDomain, AWS_BUCKET);

  const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
  });

  var objectName = 'image' + imageID;

  // get the image data from google first
  let imageData;
  let imageDimensions;
  let imageExtension;
  let buffer;
  const response = await fetch(contentUri, {
    method: 'GET',
  });

  let params = {
    Bucket: AWS_BUCKET,
  };
  if (response.ok) {
    imageData = await response.blob();

    if (imageData) {
      try {
        buffer = await imageData.arrayBuffer();
        buffer = Buffer.from(buffer);
        params.Body = buffer;
        imageDimensions = sizeOf(buffer);
        imageExtension = imageType(buffer);
        // console.log('imageDims:', imageDimensions);
      } catch (e) {
        console.error(
          'error getting size of imageData buffer:',
          typeof buffer,
          e
        );
      }
    }
  } else {
    console.error('Failed to fetch image data for uri: ', contentUri);
    return null;
  }

  const destinationPath = `${site}/newsletters/${slug}/${objectName}.${imageExtension.ext}`;
  params.Key = destinationPath;
  params.ContentType = imageExtension.mime;
  params.ACL = 'public-read';

  // console.log('uploading image:', params, imageDimensions);

  const imageS3Url = `https://${assetsDomain}/${destinationPath}`;

  try {
    // console.log('token:', oauthToken);
    const data = await s3.upload(params).promise();
    // console.log('uploadImage const data:', data);
    let imageData = {
      s3Url: imageS3Url,
      height: imageDimensions.height,
      width: imageDimensions.width,
      imageID: imageID,
    };
    // console.log('uploaded data:', imageData);
    return imageData;
  } catch (err) {
    console.error('Error uploading to S3:', err);
    return null;
  }
}

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

async function uploadToS3(params) {
  // console.log('uploadToS3 settings:', params['settings']);
  const data = await upload(
    params['imageID'],
    params['url'],
    params['slug'],
    params['site'],
    params['settings']
  );
  return data;
}

async function handleImageBlot(blot, site, slug, settings) {
  if (!blot.src) {
    return;
  }
  let imageID = blot.id;
  if (!imageID) {
    imageID = uuidv4();
  }
  // console.log('handleImageBlot settings');
  let imageData = await uploadToS3({
    imageID: imageID,
    site: site,
    slug: slug,
    url: blot.src,
    settings: settings,
  });
  // console.log('Uploaded image to s3:', imageData);
  return imageData;
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
    if (organizationId !== 109) {
      continue;
    }
    let site = orgSettings[0].organization.slug;
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
      letterhead['url'] + 'channels/' + letterhead['channelSlug'] + '/letters';
    // console.log('Letterhead API URL:', letterheadUrl);

    const opts = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${letterhead['apiKey']}`,
      },
    };
    let res = await fetch(letterheadUrl, opts);
    let data = await res.json();
    let saveResult = await saveNewsletterEditions(
      organizationId,
      site,
      data,
      orgSettings
    );
    // console.log('save newsletter result:', saveResult);
  }
}

//{"ops":[{"insert":"This is my newsletter"},{"attributes":{"header":1},"insert":"\n"},{"insert":"By Tyler \nThis is a paragraph followed by a list:\nlist item 1"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"list item 2"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"list item 3"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Section title"},{"attributes":{"header":2},"insert":"\n"},{"attributes":{"bold":true},"insert":"Bold text. "},{"attributes":{"italic":true,"bold":true},"insert":"Italic bold text. "},{"attributes":{"italic":true},"insert":"Just italic."},{"insert":"\n\n"}]}

async function processDeltaOp(elements, element, site, slug, settings, index) {
  // console.log('processDeltaOp', typeof elements, elements.length);
  // console.log('processDeltaOp settings:', settings);
  // console.log('element:', element);
  if (!element.insert) {
    // console.log('no element to insert:', JSON.stringify(element));
    return elements;
  }

  if (typeof element.insert === 'string') {
    // let lines = element.insert.split('\n');
    // if (!element.attributes && lines.length > 1) {
    //   lines.forEach((line) => {
    //     if (line) {
    //       elements.push({
    //         insert: line,
    //       });
    //     }
    //   });
    // } else {
    elements.push(element);
    // }

    console.log('element:', element);
  } else if (element.insert && element.insert.imageBlot) {
    console.log(`found element.insert.imageBlot`, element.insert.imageBlot);
    const imageData = await handleImageBlot(
      element.insert.imageBlot,
      site,
      slug,
      settings
    );
    let childImage = {
      imageId: imageData.id,
      imageAlt: element.insert.imageBlot.caption,
      imageUrl: imageData.s3Url,
      height: imageData.height,
      width: imageData.width,
    };
    let imageElement = {
      index: index,
      type: 'image',
      children: [childImage],
      link: null,
    };
    console.log('Image Element:', JSON.stringify(imageElement));
    // console.log('element.insert.imageBlot childImage', childImage);
    elements.push(imageElement);
  }
  return elements;
}

async function transformDelta(headline, content, site, slug, settings) {
  let elements = [];

  let i = 0;
  for await (let contentElement of content) {
    if (!contentElement && !contentElement.delta && !contentElement.columns) {
      // console.log(`blank content element, skipping`, contentElement);
      return;
    }
    if (contentElement.columns && contentElement.columns.length) {
      let x = 0;
      for await (let column of contentElement.columns) {
        // console.log(` > ${column.delta.ops.length} delta ops found`);
        let y = 0;
        for await (let element of column.delta.ops) {
          elements = await processDeltaOp(
            elements,
            element,
            site,
            slug,
            settings,
            y
          );
          y++;
        }
        x++;
      }
    } else if (contentElement.delta) {
      let y = 0;
      for await (let element of contentElement.delta.ops) {
        elements = await processDeltaOp(
          elements,
          element,
          site,
          slug,
          settings,
          y
        );
        y++;
      }
    }
    i++;
  }

  // console.log('elements:', elements);

  let list = { items: [] };
  let paragraph = { children: [] };

  let formattedElements = [];
  // console.log(`${elements.length} elements found`);
  elements.forEach((element, x) => {
    let previousIndex = x - 1;

    if (element.attributes && element.attributes.header) {
      let headerElement = elements[previousIndex];
      if (!headerElement) {
        console.error(
          'No header element; current element is:',
          x,
          JSON.stringify(element)
        );
        return;
      }
      if (!headerElement.insert) {
        // console.log(x, previousIndex, 'blank header element');
        return;
      }

      // don't store the newsletter title as a body element or we'll have a repeated title on the page!
      let headingText = shared.cleanContent(headerElement.insert);
      if (headingText !== headline) {
        // console.log(x, previousIndex, 'header:', headerElement.insert);
        formattedElements.push({
          link: null,
          type: 'text',
          style: 'HEADING_' + element.attributes.header,
          children: [
            {
              index: x,
              style: {},
              content: headingText,
            },
          ],
        });
      }
    } else if (element.attributes && element.attributes.list) {
      // console.log(i, "list:", elements[i-1].insert)

      list.items.push({
        index: x,
        children: [
          {
            style: {},
            content: shared.cleanContent(elements[previousIndex].insert),
          },
        ],
        nestingLevel: 0,
      });

      // if there is a second next element and it's not a list, this is the last item in the list;
      // if there is no second next element, this is also the last item in the list; finish it
      // by pushing it onto the formattedElements, then set it to an empty object again
      // we do this in case there are more lists in the email
      // if there is a second next element and it has a list attr, this list has more items
      if (
        (elements[x + 2] &&
          (!elements[x + 2].attributes || !elements[x + 2].attributes.list)) ||
        !elements[x + 2]
      ) {
        // hardcode as "bullet" for now
        formattedElements.push({
          type: 'list',
          listType: 'BULLET',
          items: list.items,
          link: null,
        });
        // reset the list holder
        list = { items: [] };
      }
    } else if (element.attributes && element.attributes.link) {
      // console.log(i, "link:", element.attributes.link);

      let normalLinkedTextElement = {
        index: x,
        link: null,
        type: 'text',
        style: 'NORMAL_TEXT',
        children: [
          {
            link: element.attributes.link,
            index: x,
            style: {
              underline: true,
            },
            content: element.insert,
          },
        ],
      };
      console.log('normal linked text:', normalLinkedTextElement);

      formattedElements.push(normalLinkedTextElement);
    } else if (element.attributes && element.attributes.align) {
      if (shared.cleanContent(element.insert)) {
        let alignedElement = {
          link: null,
          type: 'text',
          style: 'NORMAL_TEXT',
          index: x,
          children: [
            {
              link: null,
              index: x,
              style: {
                align: element.attributes.align,
              },
              content: shared.cleanContent(element.insert),
            },
          ],
        };

        console.log('aligned element:', JSON.stringify(alignedElement));
        formattedElements.push(alignedElement);
      }
    } else if (element.type && element.type === 'image') {
      // just add these to the formattedElements, images were dealt with already
      formattedElements.push(element);
    } else if (
      typeof element.insert === 'string' ||
      (element.attributes &&
        (element.attributes.bold || element.attributes.italic))
    ) {
      // let children = [];

      // console.log(i, "formatted text:", element.insert);
      let style = {};
      if (element.attributes && element.attributes.bold) {
        style['bold'] = true;
      }
      if (element.attributes && element.attributes.italic) {
        style['italic'] = true;
      }

      paragraph.children.push({
        index: x,
        style: style,
        content: element.insert,
      });

      // if this is the last element of the newsletter, or
      // if the next element is blank string, or
      // if the next element is a list/header/image item, close the paragraph
      if (
        !elements[x + 1] ||
        (elements[x + 1] &&
          elements[x + 1].insert &&
          !elements[x + 1].insert.replace(/[\\n]|\n/g, '')) ||
        (elements[x + 1] &&
          elements[x + 1].attributes &&
          (elements[x + 1].attributes.list ||
            elements[x + 1].attributes.header ||
            (elements[x + 1].insert && elements[x + 1].insert.imageBlot)))
      ) {
        let normalTextElement = {
          index: x,
          link: null,
          type: 'text',
          style: 'NORMAL_TEXT',
          children: paragraph.children,
        };
        console.log('normal text:', normalTextElement);
        formattedElements.push(normalTextElement);
        paragraph = { children: [] };
        // otherwise, continue on
      }
    } else if (element.attributes) {
      console.log('unhandled element.attributes:', element.attributes);
    } else {
      if (
        elements[x + 1] &&
        elements[x + 1].attributes &&
        elements[x + 1].attributes.header
      ) {
        // console.log(i, 'skip, header is handled next:', element.insert);
      } else if (
        elements[x + 1] &&
        elements[x + 1].attributes &&
        elements[x + 1].attributes.list
      ) {
        // console.log(i, 'skip, list is handled next:', element.insert);
      } else {
        let plainTextElement = {
          index: x,
          link: null,
          type: 'text',
          style: 'NORMAL_TEXT',
          children: [
            {
              index: x,
              style: {},
              content: element.insert,
            },
          ],
        };
        console.log(i, 'plain text:', element.insert);
        formattedElements.push(plainTextElement);
        // paragraph.children.push(plainTextElement);

        // if this is the last element of the newsletter, or
        // if the next element is blank string, or
        // if the next element is a list/header item, close the paragraph
        if (
          !elements[x + 1] ||
          (elements[x + 1] &&
            elements[x + 1].insert &&
            !elements[x + 1].insert.replace(/[\\n]|\n/g, '')) ||
          (elements[x + 1] &&
            elements[x + 1].attributes &&
            (elements[x + 1].attributes.list ||
              elements[x + 1].attributes.header))
        ) {
          // formattedElements.push({
          //   index: x,
          //   link: null,
          //   type: 'text',
          //   style: 'NORMAL_TEXT',
          //   children: paragraph.children,
          // });
          paragraph = { children: [] };
        }
      }
    }
  });

  // console.log(formattedElements.length, 'formattedElements');

  return formattedElements;
}

async function saveNewsletterEditions(
  organizationId,
  site,
  letterheadData,
  settings
) {
  console.log(
    organizationId,
    'Letterhead returned',
    letterheadData.length,
    'newsletter editions in total:'
  );

  for await (let newsletter of letterheadData) {
    let headline = shared.cleanContent(newsletter.title);

    if (!newsletter.publicationDate) {
      console.log(
        '> Org#' +
          organizationId +
          ' Newsletter ID#' +
          newsletter.id +
          " '" +
          headline +
          "' is not published, skipping."
      );
      continue;
    }

    console.log(Object.keys(newsletter).sort());
    console.log(newsletter.emailTemplate);
    console.log(
      organizationId,
      newsletter.id,
      newsletter.publicationDate,
      headline
    );

    let slug = slugify(headline);
    if (!slug) {
      console.error('> no slug, skipping');
      continue;
    }

    let unprocessedContent;

    if (newsletter.sections) {
      unprocessedContent = newsletter.sections;
    } else if (newsletter.delta) {
      unprocessedContent = newsletter.delta;
    } else {
      console.log(
        '> no content found in newsletter.sections or newsletter.delta, skipping this edition'
      );
      continue;
    }

    let unprocessedContentJSON = JSON.parse(unprocessedContent);
    if (
      headline ===
      'Black West Virginians Are At A Unique Disadvantage When It Comes To Mental Health'
    ) {
      console.log('UNPROCESSED CONTENT:', unprocessedContent);
    }

    let content = await transformDelta(
      headline,
      unprocessedContentJSON,
      site,
      slug,
      settings
    );
    // console.log('CONTENT:', content);

    let editionData = {
      slug: slug,
      headline: headline,
      letterhead_id: newsletter.id,
      letterhead_unique_id: newsletter.uniqueId,
      content: content,
      newsletter_created_at: newsletter.createdAt,
      newsletter_published_at: newsletter.publicationDate,
    };
    if (newsletter.customizedByline) {
      editionData['byline'] = newsletter.customizedByline;
    }
    if (newsletter.customizedByline) {
      editionData['subheadline'] = newsletter.subtitle;
    }

    if (editionData.content && editionData.content.length) {
      const result = await shared.hasuraInsertNewsletterEdition(
        organizationId,
        {
          url: apiUrl,
          adminSecret: adminSecret,
          data: editionData,
        }
      );

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
            result.data.insert_newsletter_editions_one.slug
        );
      }
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
