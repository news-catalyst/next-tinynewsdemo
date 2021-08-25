#! /usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const fetch = require('node-fetch');

const shared = require("./shared");

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

function getNewsletterEditions() {
  console.log("ENV:", process.env);
  if (!process.env.LETTERHEAD_API_URL) {
    return;
  }
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

//{"ops":[{"insert":"This is my newsletter"},{"attributes":{"header":1},"insert":"\n"},{"insert":"By Tyler \nThis is a paragraph followed by a list:\nlist item 1"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"list item 2"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"list item 3"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Section title"},{"attributes":{"header":2},"insert":"\n"},{"attributes":{"bold":true},"insert":"Bold text. "},{"attributes":{"italic":true,"bold":true},"insert":"Italic bold text. "},{"attributes":{"italic":true},"insert":"Just italic."},{"insert":"\n\n"}]}


function transformDelta(delta) {
  // console.log(delta);

  let elements = [];

  delta.ops.forEach((element, i) => {
    if (!element.insert) {
      console.log("no element.insert: ", element);
      return;
    }
    if (typeof(element.insert) !== 'string') {
      console.log("element.insert is a", typeof(element.insert), ": ", element.insert);
      return;
    }

    let lines = element.insert.split('\n');
    if (!element.attributes && lines.length > 1) {
      lines.forEach((line) => {
        if (line) {
          elements.push({
            "insert": line
          });
        }
      })
    } else {
      elements.push(element);
    }
  });

  // console.log(elements);

  let list = {items: []};
  let paragraph = {children: []};

  let formattedElements = [];
  elements.forEach((element, i) => {
    if (element.attributes && element.attributes.header) {
      console.log(i, "header:", elements[i-1].insert)
      formattedElements.push( {
        "link": null,
        "type": "text",
        "style": "HEADING_" + element.attributes.header,
        "children": [
          {
            "index": i,
            "style": {},
            "content": elements[i-1].insert
          }
        ]
      })
    } else if (element.attributes && element.attributes.list) {
      console.log(i, "list:", elements[i-1].insert)

      list.items.push({
        "index": i,
        "children": [
          {
            "style": {},
            "content": elements[i-1].insert
          }
        ],
        "nestingLevel": 0
      })

      // if there is a second next element and it's not a list, this is the last item in the list;
      // if there is no second next element, this is also the last item in the list; finish it
      // by pushing it onto the formattedElements, then set it to an empty object again
      // we do this in case there are more lists in the email
      // if there is a second next element and it has a list attr, this list has more items
      if ( (elements[i+2] && (!elements[i+2].attributes || !elements[i+2].attributes.list)) || !elements[i+2] ) {
         // hardcode as "bullet" for now
         formattedElements.push({
          "type": "list",
          "listType": "BULLET",
          "items": list.items,
          "link": null
        })
        // reset the list holder
        list = {items: []};
      }

    } else if (element.attributes && (element.attributes.bold || element.attributes.italic)) {
      console.log(i, "formatted text:", element.insert);
      let style = {};
      if (element.attributes.bold) {
        style["bold"] = true;
      }
      if (element.attributes.italic) {
        style["italic"] = true;
      }

      paragraph.children.push({
        "index": i,
        "style": style,
        "content": element.insert
      })

      // if this is the last element of the newsletter, or
      // if the next element is blank string, or 
      // if the next element is a list/header item, close the paragraph
      if (
        (!elements[i+1]) ||
        ( elements[i+1] && elements[i+1].insert && !(elements[i+1].insert.replace(/[\\n]|\n/g, '')) ) ||
        ( elements[i+1] && elements[i+1].attributes && (elements[i+1].attributes.list || elements[i+1].attributes.header) )
      ) {
        
        formattedElements.push({
          "link": null,
          "type": "text",
          "style": "NORMAL_TEXT",
          "children": paragraph.children
        });  
        paragraph = { "children": []}
        // otherwise, continue on
      }
      

    } else if (element.attributes && element.attributes.link) {
      console.log(i, "link:", element.attributes.link);

      formattedElements.push({
        "link": null,
        "type": "text",
        "style": "NORMAL_TEXT",
        "children": [
          {
            "link": element.attributes.link,
            "index": i,
            "style": {
              "underline": true
            },
            "content": element.insert
          }
        ]
      })
    } else if (element.attributes) {
      console.log(i, "unknown attrs:", element.attributes);

    } else {
      if (elements[i+1] && elements[i+1].attributes && elements[i+1].attributes.header) {
        console.log(i, "skip, header is handled next:", element.insert);
      } else if (elements[i+1] && elements[i+1].attributes && elements[i+1].attributes.list) {
        console.log(i, "skip, list is handled next:", element.insert);
      } else {
        console.log(i, "plain text:", element.insert);

        paragraph.children.push({
            "link": null,
            "type": "text",
            "style": "NORMAL_TEXT",
            "children": [
              {
                "index": i,
                "style": {},
                "content": element.insert
              }
            ]
        })

        // if this is the last element of the newsletter, or
        // if the next element is blank string, or 
        // if the next element is a list/header item, close the paragraph
        if (
          (!elements[i+1]) ||
          ( elements[i+1] && elements[i+1].insert && !(elements[i+1].insert.replace(/[\\n]|\n/g, '')) ) ||
          ( elements[i+1] && elements[i+1].attributes && (elements[i+1].attributes.list || elements[i+1].attributes.header) )
        ) {
          formattedElements.push({
            "link": null,
            "type": "text",
            "style": "NORMAL_TEXT",
            "children": paragraph.children
          });  
          paragraph = { "children": []}
        }
      }
    }
  })

  // console.log(formattedElements);

  return formattedElements;
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

    let content = transformDelta(JSON.parse(newsletter.delta));
console.log(content);

    let editionData = {
      slug: slug,
      headline: newsletter.title,
      letterhead_id: newsletter.id,
      letterhead_unique_id: newsletter.uniqueId,
      content: content,
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