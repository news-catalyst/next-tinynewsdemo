import fetch from 'node-fetch';
import { fetchGraphQL, slugify } from './graphql';
import { getFacebookMarkup, getInstagramReelMarkup } from './embeds';
import TinyS3 from './tiny_s3';

const HASURA_LOOKUP_GOOGLE_DOC = `query ApiLookupGoogleDoc($document_id: String!) {
  google_documents(where: {document_id: {_eq: $document_id}}) {
    article_google_documents {
      article {
        id
        slug
        canonical_url
        category {
          id
          slug
          title
        }
        author_articles {
          author {
            id
            first_names
            last_name
            slug
          }
        }
        article_sources {
          source {
            affiliation
            age
            created_at
            email
            ethnicity
            gender
            id
            name
            phone
            race
            role
            sexual_orientation
            updated_at
            zip
          }
        }
        tag_articles {
          tag_id
        }
        article_translations(order_by: {id: desc}, limit: 1) {
          custom_byline
          facebook_description
          facebook_title
          first_published_at
          headline
          id
          last_published_at
          locale_code
          published
          search_description
          search_title
          twitter_description
          twitter_title
          published_article_translations {
            article_translation {
              first_published_at
              id
              locale_code
              last_published_at
            }
          }
        }
      }
      google_document {
        locale_code
      }
    }
    page_google_documents {
      google_document {
        locale_code
      }
      page {
        id
        slug
        author_pages {
          author {
            first_names
            last_name
            id
            slug
          }
        }
        page_translations(limit: 1, order_by: {id: desc}) {
          facebook_description
          facebook_title
          first_published_at
          headline
          id
          last_published_at
          locale_code
          published
          search_description
          search_title
          twitter_title
          twitter_description
        }
      }
    }
  }
  authors {
    id
    slug
    first_names
    last_name
  }
  categories {
    id
    published
    slug
    category_translations(where: {locale_code: {_eq: "en-US"}}) {
      locale_code
      title
    }
  }
  homepage_layout_datas {
    article_priority_1
    article_priority_2
    article_priority_3
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  tags {
    id
    slug
    tag_translations(where: {locale_code: {_eq: "en-US"}}) {
      locale_code
      title
    }
  }
}`;

export async function hasuraLookupGoogleDoc(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LOOKUP_GOOGLE_DOC,
    name: 'ApiLookupGoogleDoc',
    variables: {
      document_id: params['documentId'],
    },
  });
}

const HASURA_GET_GOOGLE_DOCS_FOR_ARTICLE = `query ApiLookupGoogleDocsForArticle($article_id: Int!, $locale_code: String!) {
  article_google_documents(where: {article_id: {_eq: $article_id}}) {
    google_document {
      document_id
      locale_code
      locale {
        code
        name
      }
      url
    }
    article_id
  }
  published_article_translations(where: {locale_code: {_eq: $locale_code}, article_id: {_eq: $article_id}}) {
    article_translation {
      id
      first_published_at
      last_published_at
      locale_code
    }
  }
}`;

export async function hasuraGetGoogleDocsForArticle(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_GOOGLE_DOCS_FOR_ARTICLE,
    name: 'ApiLookupGoogleDocsForArticle',
    variables: {
      article_id: params['articleId'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_GET_GOOGLE_DOCS_FOR_PAGE = `query ApiLookupGoogleDocsForPage($page_id: Int!) {
  page_google_documents(where: {page_id: {_eq: $page_id}}) {
    google_document {
      document_id
      locale_code
      locale {
        code
        name
      }
      url
    }
    page_id
  }
}`;

export async function hasuraGetGoogleDocsForPage(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_GOOGLE_DOCS_FOR_PAGE,
    name: 'ApiLookupGoogleDocsForPage',
    variables: {
      page_id: params['pageId'],
    },
  });
}

export async function processDocumentContents(
  elements,
  listInfo,
  inlineObjects,
  imageList,
  slug,
  oauthToken,
  site
) {
  let orderedElements = [];

  let foundMainImage = false;
  let storedMainImage = false;
  let mainImageElement = null;
  let childImageElement = null;

  // keeping a count of all elements processed so we can store the full image list at the end
  // and properly return the full list of ordered elements
  let elementsProcessed = 0;
  let inSpecialFormatBlock = false;
  // storeElement is set to false for FORMAT START and FORMAT END only
  let storeElement = true;
  // let listElementChildren = [];
  let elementCount = elements.length;

  for (const element of elements) {
    if (element.paragraph && element.paragraph.elements) {
      // console.log("paragraph element: " + JSON.stringify(element))

      let eleData = {
        children: [],
        link: null,
        type: null,
        html: null,
        index: element.endIndex,
      };

      // handle list items
      if (element.paragraph.bullet) {
        storeElement = true;

        // console.log('Processing List: ' + JSON.stringify(element));
        eleData.items = [];
        eleData.type = 'list';
        eleData.index = element.endIndex;
        let nestingLevel = element.paragraph.bullet.nestingLevel;
        if (nestingLevel === null || typeof nestingLevel === 'undefined') {
          nestingLevel = 0;
        }
        // Find existing element with the same list ID
        let listID = element.paragraph.bullet.listId;
        // console.log('listID:', listID, element.paragraph.elements.length);

        let findListElement = (element) =>
          element.type === 'list' && element.listId === listID;

        let listElementIndex = orderedElements.findIndex(findListElement);
        // don't create a new element for an existing list
        // just append this element's text to the exist list's items
        if (listElementIndex > 0) {
          let listElement = orderedElements[listElementIndex];

          let listItemChild;
          let listItemChildren = [];
          element.paragraph.elements.forEach((subElement) => {
            let subElementContent = cleanContent(subElement.textRun.content);
            if (!subElementContent) {
              // console.log(
              //   'error skipping blank list item',
              //   JSON.stringify(subElement)
              // );
              return;
            }
            // append list items to the main list element's children
            listItemChild = {
              content: cleanContent(subElement.textRun.content),
              style: cleanStyle(subElement.textRun.textStyle),
            };
            // console.log('listItemChild:', JSON.stringify(listItemChild));
            if (
              subElement.textRun.textStyle &&
              subElement.textRun.textStyle.link
            ) {
              listItemChild.link = subElement.textRun.textStyle.link.url;
            }
            listItemChildren.push(listItemChild);
          });

          if (!listElement.items || !listElement.items[0]) {
            let newListItem = {
              nestingLevel: nestingLevel,
              children: listItemChildren,
              index: eleData.index,
            };
            // console.log(
            //   listID,
            //   'li99 no items, adding first one to listElement:',
            //   JSON.stringify(newListItem)
            // );
            listElement.items = [];
            listElement.items.push(newListItem);
          } else if (
            listElement.items &&
            listElement.items[0] &&
            listElement.items[0].children
          ) {
            // console.log(
            //   listID,
            //   'li111 has items - what to do?: ' +
            //     listElement.items.length +
            //     ': '
            // );
            // console.log(
            //   'listItemChildren:',
            //   listItemChildren.length,
            //   JSON.stringify(listItemChildren)
            // );
            // console.log('LIST ITEM CHILD:', JSON.stringify(listItemChild));
            // console.log('LIST ELEMENT:', JSON.stringify(listElement));
            listElement.items.push({
              children: listItemChildren,
              index: eleData.index,
              nestingLevel: nestingLevel,
            });
          }
          orderedElements[listElementIndex] = listElement;
        } else {
          // make a new list element
          if (listInfo[listID]) {
            eleData.listType = listInfo[listID];
          } else {
            eleData.listType = 'BULLET';
          }
          eleData.type = 'list';
          eleData.listId = listID;

          let listItemChild = {};
          element.paragraph.elements.forEach((subElement) => {
            // append list items to the main list element's children
            listItemChild = {
              content: cleanContent(subElement.textRun.content),
              style: cleanStyle(subElement.textRun.textStyle),
            };
            if (
              subElement.textRun.textStyle &&
              subElement.textRun.textStyle.link
            ) {
              listItemChild.link = subElement.textRun.textStyle.link.url;
            }

            if (!eleData.items || !eleData.items[0]) {
              eleData.items = [];
              eleData.items.push({
                nestingLevel: nestingLevel,
                children: [listItemChild],
                index: eleData.index,
              });
            } else if (
              eleData.items &&
              eleData.items[0] &&
              eleData.items[0].children
            ) {
              eleData.items[0].children.push(listItemChild);
            }
          });

          orderedElements.push(eleData);
        }
      }

      // filter out blank subelements
      let subElements = element.paragraph.elements.filter(
        (subElement) =>
          subElement.textRun && subElement.textRun.content.trim().length > 0
      );
      // try to find an embeddable link: url on its own line matching one of a set of hosts (twitter, youtube, etc)
      if (subElements.length === 1) {
        storeElement = true;
        let foundLink = subElements.find((subElement) =>
          Object.prototype.hasOwnProperty.call(
            subElement.textRun.textStyle,
            'link'
          )
        );
        let linkUrl = null;
        // let embeddableUrlRegex = /twitter\.com|youtube\.com|youtu\.be|google\.com|imgur.com|twitch\.tv|vimeo\.com|mixcloud\.com|instagram\.com|facebook\.com|dailymotion\.com|spotify.com|apple.com/i;
        let embeddableUrlRegex = /twitter\.com|youtube\.com|youtu\.be|instagram\.com|facebook\.com|spotify\.com|vimeo\.com|apple\.com|tiktok\.com|forms\.gle|airtable\.com|docs\.google\.com\/forms/i;
        if (foundLink) {
          linkUrl = foundLink.textRun.textStyle.link.url;
          // console.log('found embed: ' + linkUrl + ' type: ' + eleData.type);

          // try to find a URL by itself that google hasn't auto-linked
        } else if (
          embeddableUrlRegex.test(subElements[0].textRun.content.trim())
        ) {
          linkUrl = subElements[0].textRun.content.trim();
        }

        if (linkUrl !== null && eleData.type !== 'list') {
          let embeddableUrl = embeddableUrlRegex.test(linkUrl);
          if (embeddableUrl) {
            eleData.type = 'embed';

            // special case to get the full URL for Google Forms - the short form URL doesn't embed correctly
            if (/forms\.gle/.test(linkUrl)) {
              let redirectURL = await getFullGoogleFormsUrl(linkUrl);
              eleData.link = redirectURL;
              orderedElements.push(eleData);

              // special case to grab the html from Facebook as doing this in the Embed node is ridiculous/doesn't work
            } else if (/facebook\.com/.test(linkUrl)) {
              let markup = await getFacebookMarkup(linkUrl);
              eleData.link = linkUrl;
              eleData.html = markup;
              // console.log(
              //   'facebook eleData stored with html:',
              //   JSON.stringify(eleData)
              // );
              orderedElements.push(eleData);

              // special case to grab the html from Instagram for Reels
            } else if (/instagram\.com\/reel/.test(linkUrl)) {
              let markup = await getInstagramReelMarkup(linkUrl);
              eleData.link = linkUrl;
              eleData.html = markup;
              // console.log(
              //   'facebook eleData stored with html:',
              //   JSON.stringify(eleData)
              // );
              orderedElements.push(eleData);
            } else {
              eleData.link = linkUrl;
              orderedElements.push(eleData);
            }
          }
        }
      }

      for (const subElement of element.paragraph.elements) {
        // console.log('subElement:', subElement);

        let newEleData;

        // skip lists and embed links - we already processed these above
        if (eleData.type !== 'list' && eleData.type !== 'embed') {
          // console.log('* not a list or embed');
          let namedStyle;

          // found a paragraph of text
          if (subElement.textRun && subElement.textRun.content) {
            // handle specially formatted blocks of text
            // FORMAT START flips the "are we in a specially formatted block?" switch on
            // FORMAT END turns it off
            // all lines in between are given a style of FORMATTED_TEXT without any whitespace stripped
            if (subElement.textRun.content.trim() === 'FORMAT START') {
              // console.log('START format block', subElement);
              inSpecialFormatBlock = true;
              storeElement = false;
            } else if (subElement.textRun.content.trim() === 'FORMAT END') {
              // console.log('END format block', subElement);
              inSpecialFormatBlock = false;
              storeElement = false;
            } else {
              // console.log('storing this element:', subElement);
              storeElement = true;
            }
            eleData.type = 'text';

            if (inSpecialFormatBlock) {
              // console.log('IN SPECIAL BLOCK', eleData);
              namedStyle = 'FORMATTED_TEXT';
            } else if (element.paragraph.paragraphStyle.namedStyleType) {
              // console.log('NOT IN SPECIAL BLOCK', eleData);
              namedStyle = element.paragraph.paragraphStyle.namedStyleType;
            }

            eleData.style = namedStyle;

            // treat any indented text as a blockquote
            if (
              (element.paragraph.paragraphStyle.indentStart &&
                element.paragraph.paragraphStyle.indentStart.magnitude) ||
              (element.paragraph.paragraphStyle.indentFirstLine &&
                element.paragraph.paragraphStyle.indentFirstLine.magnitude)
            ) {
              // console.log('indent para:' + JSON.stringify(element.paragraph));
              eleData.type = 'blockquote';
            }

            let childElement = {
              index: subElement.endIndex,
              style: cleanStyle(subElement.textRun.textStyle),
            };

            if (
              subElement.textRun.textStyle &&
              subElement.textRun.textStyle.link
            ) {
              childElement.link = subElement.textRun.textStyle.link.url;
            }
            if (inSpecialFormatBlock) {
              childElement.content = subElement.textRun.content.trimEnd();
            } else {
              childElement.content = cleanContent(subElement.textRun.content);
            }

            let headingRegEx = new RegExp(/^HEADING/, 'i');
            // if this is a heading with more than one child element
            // check if we've already created a heading top-level element
            // instead of appending another child element onto it, we want to:
            //  * create a new top-level element
            //  * bump the total elements & elements processed by one
            if (
              headingRegEx.test(eleData.style) &&
              element.paragraph.elements.length > 1 &&
              eleData.children.length === 1
            ) {
              // console.log('Heading element: ' + JSON.stringify(eleData));
              // console.log("Heading subelement: " + JSON.stringify(subElement));
              newEleData = {
                type: 'text',
                style: namedStyle,
                index: eleData.index,
                children: [childElement],
              };
              // console.log("new eleData: " + JSON.stringify(newEleData));
              orderedElements.push(newEleData);
              elementCount++;
              elementsProcessed++;
              // storeElement = false;
            } else {
              // console.log('else heading regex', childElement);
              eleData.children.push(childElement);
              storeElement = true;
              // console.log('regular eleData:' + JSON.stringify(eleData));
            }

            // blank content but contains a "horizontalRule" element?
          } else if (subElement.horizontalRule) {
            // console.log('subElement.horizontalRule!', subElement);
            storeElement = true;

            newEleData = {
              type: 'hr',
              index: subElement.startIndex,
              children: [],
            };
            orderedElements.push(newEleData);
            elementCount++;
            elementsProcessed++;
          }

          // found an image
          if (
            subElement.inlineObjectElement &&
            subElement.inlineObjectElement.inlineObjectId
          ) {
            storeElement = true;
            let imageID = subElement.inlineObjectElement.inlineObjectId;
            eleData.type = 'image';

            // treat the first image as the main article image used in featured links
            if (!foundMainImage) {
              eleData.type = 'mainImage';
              foundMainImage = true;
            }

            let fullImageData = inlineObjects[imageID];
            if (fullImageData) {
              // console.log("Found full image data: " + JSON.stringify(fullImageData))
              const storedImageData = imageList[imageID];
              let s3Url = null;
              let imageHeight = null;
              let imageWidth = null;

              // console.log('storedImageData', storedImageData);
              // check for the new format. if it's the old format, reupload to force getting new data
              if (typeof storedImageData === 'object') {
                s3Url = storedImageData.url;
                imageHeight = storedImageData.height;
                imageWidth = storedImageData.width;
              }
              let articleSlugMatches = false;
              let assetDomainMatches = false;

              try {
                if (s3Url && s3Url.match(slug)) {
                  articleSlugMatches = true;
                }
                // image URL should be stored as assets.tinynewsco.org not the s3 bucket domain
                if (s3Url && s3Url.match(/assets\.tinynewsco\.(org|dev)/)) {
                  assetDomainMatches = true;
                }
              } catch (e) {
                console.error(e);
                articleSlugMatches = false;
                assetDomainMatches = false;
              }

              if (
                s3Url === null ||
                s3Url === undefined ||
                !s3Url ||
                !articleSlugMatches ||
                !assetDomainMatches
              ) {
                // console.log(
                //   'attempting to upload image to s3...',
                //   fullImageData.inlineObjectProperties.embeddedObject
                //     .imageProperties.contentUri
                // );

                const data = await TinyS3.upload(
                  oauthToken,
                  imageID,
                  fullImageData.inlineObjectProperties.embeddedObject
                    .imageProperties.contentUri,
                  slug,
                  site
                );
                s3Url = data.s3Url;

                imageList[imageID] = {
                  url: s3Url,
                  height: data?.height,
                  width: data?.width,
                };

                if (data && data.height) {
                  imageHeight = data.height;
                  // console.log('Image Height: ', imageHeight);
                }
                if (data && data.width) {
                  imageWidth = data.width;
                  // console.log('Image Width: ', imageWidth);
                }
              } else {
                // console.log(slug + " " + imageID + " has already been uploaded: " + articleSlugMatches + " " + s3Url);
                imageList[imageID] = storedImageData;
              }

              let childImage = {
                index: subElement.endIndex,
                height: imageHeight,
                width: imageWidth,
                imageId: subElement.inlineObjectElement.inlineObjectId,
                imageUrl: s3Url,
                imageAlt: cleanContent(
                  fullImageData.inlineObjectProperties.embeddedObject.title
                ),
              };

              // console.log('childImage:', childImage);

              if (eleData.type === 'mainImage') {
                mainImageElement = {
                  children: [childImage],
                  link: null,
                  type: 'mainImage',
                  index: eleData.index,
                };
              } else {
                childImageElement = {
                  type: 'image',
                  children: [childImage],
                  link: null,
                  index: childImage.index,
                };
              }

              if (mainImageElement && !storedMainImage) {
                orderedElements.push(mainImageElement);
                // bump the total count and the total processed
                elementCount++;
                elementsProcessed++;
                storedMainImage = true;
                // console.log(
                //   elementCount +
                //     ' STORED MAINIMAGE: ' +
                //     JSON.stringify(mainImageElement)
                // );
              }

              if (childImageElement) {
                orderedElements.push(childImageElement);
                elementCount++;
                elementsProcessed++;
                // console.log(
                //   elementCount +
                //     ' STORED CHILD IMAGE: ' +
                //     JSON.stringify(childImageElement)
                // );
                childImageElement = null;
              }

              // console.log("mainImageElement: " + JSON.stringify(mainImageElement))
            }
          }
        }
      }
      // skip any blank elements, embeds and lists because they've already been handled above
      if (
        storeElement &&
        eleData.type !== null &&
        eleData.type !== 'list' &&
        eleData.type !== 'embed' &&
        eleData.type !== 'image' &&
        eleData.children &&
        eleData.children[0] &&
        eleData.children[0].content !== 'FORMAT START' &&
        eleData.content !== 'FORMAT END'
      ) {
        // console.log(
        //   elementCount + ' STORED ELEMENT: ' + JSON.stringify(eleData)
        // );
        orderedElements.push(eleData);
      } else if (!storeElement) {
        // console.log(elementCount + ' NOT storing' + JSON.stringify(eleData));
      }
    }
    elementsProcessed++;
  }

  let formattedElements = formatElements(orderedElements);
  let mainImage = getMainImage(formattedElements);

  return {
    formattedElements: formattedElements,
    mainImage: mainImage,
    updatedImageList: imageList,
  };
}

const findArticleByCategoryAndSlugQuery = `query AddonFindArticleByCategorySlug($category_id: Int!, $slug: String!, $document_id: String!, $locale_code: String) {
  articles(where: {category_id: {_eq: $category_id}, slug: {_eq: $slug}, article_google_documents: {google_document: {document_id: {_neq: $document_id}, locale_code: {_eq: $locale_code}}}}) {
    id
    slug
    category_id
    created_at
  }
}`;

async function findArticleByCategoryAndSlug(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: findArticleByCategoryAndSlugQuery,
    name: 'AddonFindArticleByCategorySlug',
    variables: {
      category_id: params['category_id'],
      document_id: params['document_id'],
      slug: params['slug'],
      locale_code: params['locale_code'],
    },
  });
}

const findPageBySlugQuery = `query AddonFindPageBySlug($slug: String!, $document_id: String!, $locale_code: String) {
  pages(where: {slug: {_eq: $slug}, page_google_documents: {google_document: {document_id: {_neq: $document_id}, locale_code: {_eq: $locale_code}}}}) {
    id
    created_at
    slug
    page_google_documents {
      google_document {
        document_id
      }
    }
  }
}`;

async function findPageBySlug(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: findPageBySlugQuery,
    name: 'AddonFindPageBySlug',
    variables: {
      document_id: params['document_id'],
      slug: params['slug'],
      locale_code: params['locale_code'],
    },
  });
}

const deleteExistingAuthorTagArticlesMutation = `mutation AddonDeleteAuthorArticlesTagArticles($article_id: Int) {
  delete_author_articles(where: {article_id: {_eq: $article_id}}) {
    affected_rows
  }
  delete_tag_articles(where: {article_id: {_eq: $article_id}}) {
    affected_rows
  }
}`;

async function deleteExistingAuthorTagArticles(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: deleteExistingAuthorTagArticlesMutation,
    name: 'AddonDeleteAuthorArticlesTagArticles',
    variables: {
      article_id: params['article_id'],
    },
  });
}

const deleteExistingAuthorPagesMutation = `mutation AddonDeleteAuthorPages($page_id: Int) {
  delete_author_pages(where: {page_id: {_eq: $page_id}}) {
    affected_rows
  }
}`;

async function deleteExistingAuthorPages(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: deleteExistingAuthorPagesMutation,
    name: 'AddonDeleteAuthorPages',
    variables: {
      page_id: params['page_id'],
    },
  });
}

const insertArticleGoogleDocMutationWithoutId = `mutation AddonInsertArticleGoogleDocNoID($locale_code: String!, $created_by_email: String, $headline: String!, $published: Boolean, $category_id: Int!, $slug: String!, $document_id: String, $url: String, $custom_byline: String, $content: jsonb, $facebook_description: String, $facebook_title: String, $search_description: String, $search_title: String, $twitter_description: String, $twitter_title: String, $canonical_url: String, $main_image: jsonb, $article_sources: [article_source_insert_input!]!) {
  insert_articles(
    objects: {
      article_translations: {
        data: {
          created_by_email: $created_by_email, 
          headline: $headline, 
          locale_code: $locale_code, 
          published: $published, 
          content: $content, 
          custom_byline: $custom_byline, 
          facebook_description: $facebook_description, 
          facebook_title: $facebook_title, 
          search_description: $search_description, 
          search_title: $search_title, 
          twitter_description: $twitter_description, 
          twitter_title: $twitter_title,
          main_image: $main_image,
        }
      }, 
      category_id: $category_id, 
      slug: $slug, 
      canonical_url: $canonical_url,
      article_sources: {
        data: $article_sources,
        on_conflict: {constraint: article_source_article_id_source_id_key, update_columns: article_id}
      },
      article_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id, 
              locale_code: $locale_code, 
              url: $url
            }, 
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key, update_columns: locale_code
            }
          }
        }, 
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }
    }, 
    on_conflict: {
      constraint: articles_slug_category_id_organization_id_key, update_columns: [canonical_url, slug, updated_at]
    }
  ) {
    returning {
      id
      slug
      updated_at
      created_at
      article_google_documents {
        id
        google_document {
          document_id
          locale_code
          locale {
            code
            name
          }
          url
          id
        }
      }
      article_sources {
        source {
          affiliation
          age
          email
          ethnicity
          gender
          id
          name
          phone
          race
          role
          sexual_orientation
          zip
        }
      }
      category {
        slug
      }
      article_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        article_id
        locale_code
        published
        headline
        first_published_at
        last_published_at
      }
      published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
        article_translation {
          id
          first_published_at
          last_published_at
          locale_code
        }
      }
    }
  }
}`;

const insertArticleGoogleDocMutation = `mutation AddonInsertArticleGoogleDocWithID($id: Int!, $locale_code: String!, $headline: String!, $created_by_email: String, $published: Boolean, $category_id: Int!, $slug: String!, $document_id: String, $url: String, $custom_byline: String, $content: jsonb, $facebook_description: String, $facebook_title: String, $search_description: String, $search_title: String, $twitter_description: String, $twitter_title: String, $canonical_url: String, $main_image: jsonb,
  $article_sources: [article_source_insert_input!]!) {
  insert_articles(
    objects: {
      article_translations: {
        data: {
          created_by_email: $created_by_email, headline: $headline, locale_code: $locale_code, published: $published, content: $content, custom_byline: $custom_byline, facebook_description: $facebook_description, facebook_title: $facebook_title, search_description: $search_description, search_title: $search_title, twitter_description: $twitter_description, twitter_title: $twitter_title, main_image: $main_image
        }
      }, 
      article_sources: {
        data: $article_sources,
        on_conflict: {constraint: article_source_article_id_source_id_key, update_columns: article_id}
      },
      category_id: $category_id, 
      id: $id, 
      slug: $slug, 
      canonical_url: $canonical_url,
      article_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id, locale_code: $locale_code, url: $url
            }, 
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key, update_columns: locale_code
            }
          }
        }, 
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }
    }, 
    on_conflict: {
      constraint: articles_pkey, update_columns: [category_id, canonical_url, slug, updated_at]
    }
  ) {
    returning {
      id
      canonical_url
      slug
      updated_at
      created_at
      article_google_documents {
        id
        google_document {
          document_id
          locale_code
          locale {
            code
            name
          }
          url
          id
        }
      }
      article_sources {
        source {
          affiliation
          age
          email
          ethnicity
          gender
          id
          name
          phone
          race
          role
          sexual_orientation
          zip
        }
      }
      category {
        slug
      }
      article_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        article_id
        locale_code
        published
        headline
        first_published_at
        last_published_at
      }
      published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
        article_translation {
          id
          first_published_at
          last_published_at
          locale_code
        }
      }
    }
  }
}`;

export async function saveArticle(params) {
  let returnValue = {
    status: 'success',
    message: '',
    data: {},
  };

  let data = params['data'];
  // console.log('data keys:', Object.keys(data).sort());
  let articleAuthors = data.article_authors;
  let articleTags = data.article_tags;
  delete data.article_authors;
  delete data.article_tags;

  let index = 0;

  let articleID;

  let existingArticles = await findArticleByCategoryAndSlug({
    url: params['url'],
    site: params['site'],
    category_id: data['category_id'],
    document_id: data['document_id'],
    slug: data['slug'],
    locale_code: data['locale_code'],
  });

  if (
    existingArticles &&
    existingArticles.data &&
    existingArticles.data.articles &&
    existingArticles.data.articles.length > 0
  ) {
    returnValue.status = 'error';
    returnValue.message =
      'Article already exists in that category with the same slug, please pick a unique slug value.';
    returnValue.data = existingArticles.data;
    return returnValue;
  }

  let result;
  let insertResult;

  if (!data['id']) {
    delete data.id;
    // console.log(
    //   'inserting WITHOUT id: ' + JSON.stringify(Object.keys(data).sort())
    // );
    insertResult = await fetchGraphQL({
      url: params['url'],
      site: params['site'],
      query: insertArticleGoogleDocMutationWithoutId,
      name: 'AddonInsertArticleGoogleDocNoID',
      variables: data,
    });
  } else {
    let deleteExistingAssociationsResult = await deleteExistingAuthorTagArticles(
      {
        url: params['url'],
        site: params['site'],
        article_id: data['id'],
      }
    );
    if (deleteExistingAssociationsResult.errors) {
      console.error(JSON.stringify(deleteExistingAssociationsResult));
      returnValue.status = 'error';
      returnValue.message =
        'An error occurred resetting existing associated data: ' +
        JSON.stringify(deleteExistingAssociationsResult.errors);
      returnValue.data = deleteExistingAssociationsResult.errors;
      return returnValue;
    }

    // console.log(
    //   'inserting WITH id: ' + JSON.stringify(Object.keys(data).sort())
    // );
    data['id'] = parseInt(data['id']);
    articleID = data['id'];

    insertResult = await fetchGraphQL({
      url: params['url'],
      site: params['site'],
      query: insertArticleGoogleDocMutation,
      name: 'AddonInsertArticleGoogleDocWithID',
      variables: data,
    });
  }
  // console.log(Object.keys(insertResult), JSON.stringify(insertResult));

  if (insertResult.errors) {
    returnValue.status = 'error';
    returnValue.message =
      'Something went wrong saving the article: ' +
      JSON.stringify(insertResult.errors);
    returnValue.data = insertResult.errors;
    return returnValue;
  }
  returnValue.status = 'success';
  returnValue.data = insertResult.data.insert_articles.returning;
  articleID = insertResult.data.insert_articles.returning[0].id;

  let localeCode =
    insertResult.data.insert_articles.returning[0].article_translations[0]
      .locale_code;

  returnValue.message = 'Successfully saved the article.';

  // save tags
  if (articleTags) {
    // console.log('TAGS:', articleTags);
    let tags;
    // ensure this is an array; selecting one in the UI results in a string being sent
    if (typeof articleTags === 'string') {
      tags = [articleTags];
    } else {
      tags = articleTags;
    }

    for (index = 0; index < tags.length; index++) {
      let tag = tags[index];
      let slug = slugify(tag);
      // console.log(`${slug} ${tag}`);
      result = await hasuraCreateTag({
        url: params['url'],
        site: params['site'],
        title: tag,
        slug: slug,
        article_id: articleID,
        locale_code: localeCode,
      });
    }
  }

  if (articleAuthors) {
    // console.log('AUTHORS:', articleAuthors);
    let authors;
    // ensure this is an array; selecting one in the UI results in a string being sent
    if (typeof articleAuthors === 'string') {
      authors = [articleAuthors];
    } else {
      authors = articleAuthors;
    }
    // Logger.log('Found authors: ' + JSON.stringify(authors));
    for (index = 0; index < authors.length; index++) {
      let author = authors[index];
      // console.log(author);
      result = await hasuraCreateAuthorArticle({
        url: params['url'],
        site: params['site'],
        author_id: author,
        article_id: articleID,
      });
      // console.log(result);
    }
  }

  return returnValue;
}

const insertPageGoogleDocsMutationWithoutId = `mutation AddonInsertPageGoogleDocNoID($slug: String!, $locale_code: String!, $created_by_email: String, $document_id: String, $url: String, $facebook_title: String, $facebook_description: String, $search_title: String, $search_description: String, $headline: String, $twitter_title: String, $twitter_description: String, $content: jsonb, $published: Boolean) {
  insert_pages(objects: {page_google_documents: {data: {google_document: {data: {document_id: $document_id, locale_code: $locale_code, url: $url}, on_conflict: {constraint: google_documents_organization_id_document_id_key, update_columns: [document_id]}}}, on_conflict: {constraint: page_google_documents_page_id_google_document_id_key, update_columns: [google_document_id]}}, slug: $slug, page_translations: {data: {created_by_email: $created_by_email, published: $published, search_description: $search_description, search_title: $search_title, twitter_description: $twitter_description, twitter_title: $twitter_title, locale_code: $locale_code, headline: $headline, facebook_title: $facebook_title, facebook_description: $facebook_description, content: $content}}}, on_conflict: {constraint: pages_slug_organization_id_key, update_columns: [slug, updated_at]}) {
    returning {
      id
      slug
      page_google_documents {
        id
        google_document {
          document_id
          locale_code
          locale {
            code
            name
          }
          url
        }
      }
      page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        page_id
        headline
        first_published_at
        last_published_at
        locale_code
        published
      }
    }
  }
}`;
const insertPageGoogleDocsMutation = `mutation AddonInsertPageGoogleDocWithID($id: Int!, $slug: String!, $locale_code: String!, $created_by_email: String, $document_id: String, $url: String, $facebook_title: String, $facebook_description: String, $search_title: String, $search_description: String, $headline: String, $twitter_title: String, $twitter_description: String, $content: jsonb, $published: Boolean) {
  insert_pages(objects: {page_google_documents: {data: {google_document: {data: {document_id: $document_id, locale_code: $locale_code, url: $url}, on_conflict: {constraint: google_documents_organization_id_document_id_key, update_columns: [document_id]}}}, on_conflict: {constraint: page_google_documents_page_id_google_document_id_key, update_columns: [google_document_id]}}, id: $id, slug: $slug, page_translations: {data: {created_by_email: $created_by_email, published: $published, search_description: $search_description, search_title: $search_title, twitter_description: $twitter_description, twitter_title: $twitter_title, locale_code: $locale_code, headline: $headline, facebook_title: $facebook_title, facebook_description: $facebook_description, content: $content}}}, on_conflict: {constraint: pages_pkey, update_columns: [slug, updated_at]}) {
    returning {
      id
      slug
      page_google_documents {
        id
        google_document {
          document_id
          locale_code
          locale {
            code
            name
          }
          url
        }
      }
      page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        page_id
        headline
        first_published_at
        last_published_at
        locale_code
        published
      }
    }
  }
}`;

export async function savePage(params) {
  let returnValue = {
    status: 'success',
    message: '',
    data: {},
  };

  let index = 0;

  let data = params['data'];
  // console.log('data keys:', Object.keys(data).sort());
  let pageAuthors = data.page_authors;

  delete data.page_authors;

  let pageID;

  // Check if page already exists with the given slug for this organization
  let existingPages = await findPageBySlug({
    url: params['url'],
    site: params['site'],
    document_id: data['document_id'],
    slug: data['slug'],
    locale_code: data['locale_code'],
  });
  // Logger.log("existingPages: " + JSON.stringify(existingPages));
  if (
    existingPages &&
    existingPages.data &&
    existingPages.data.pages &&
    existingPages.data.pages.length > 0
  ) {
    returnValue.status = 'error';
    returnValue.message =
      'Page already exists with the same slug, please pick a unique slug value.';
    returnValue.data = existingPages.data;
    return returnValue;
  }

  let insertResult;
  if (!data['id']) {
    delete data.id;
    // console.log(
    //   'inserting WITHOUT id: ' + JSON.stringify(Object.keys(data).sort())
    // );
    insertResult = await fetchGraphQL({
      url: params['url'],
      site: params['site'],
      query: insertPageGoogleDocsMutationWithoutId,
      name: 'AddonInsertPageGoogleDocNoID',
      variables: data,
    });
  } else {
    let deleteExistingAssociationsResult = await deleteExistingAuthorPages({
      url: params['url'],
      site: params['site'],
      page_id: data['id'],
    });
    if (deleteExistingAssociationsResult.errors) {
      console.error(JSON.stringify(deleteExistingAssociationsResult));
      returnValue.status = 'error';
      returnValue.message =
        'An error occurred resetting existing associated data: ' +
        JSON.stringify(deleteExistingAssociationsResult.errors);
      returnValue.data = deleteExistingAssociationsResult.errors;
      return returnValue;
    }

    // console.log(
    //   'inserting WITH id: ' + JSON.stringify(Object.keys(data).sort())
    // );
    pageID = data['id'];
    insertResult = await fetchGraphQL({
      url: params['url'],
      site: params['site'],
      query: insertPageGoogleDocsMutation,
      name: 'AddonInsertPageGoogleDocWithID',
      variables: data,
    });
  }
  // console.log(Object.keys(insertResult), JSON.stringify(insertResult));

  if (insertResult.errors) {
    returnValue.status = 'error';
    returnValue.message =
      'Something went wrong saving the page: ' +
      JSON.stringify(insertResult.errors);
    returnValue.data = insertResult.errors;
    return returnValue;
  }
  returnValue.status = 'success';
  returnValue.data = insertResult.data.insert_pages.returning;
  pageID = insertResult.data.insert_pages.returning[0].id;

  let localeCode =
    insertResult.data.insert_pages.returning[0].page_translations[0]
      .locale_code;

  returnValue.message = 'Successfully saved the page.';

  if (pageAuthors) {
    // console.log('AUTHORS:', pageAuthors);
    let authors;
    // ensure this is an array; selecting one in the UI results in a string being sent
    if (typeof pageAuthors === 'string') {
      authors = [pageAuthors];
    } else {
      authors = pageAuthors;
    }
    // Logger.log('Found authors: ' + JSON.stringify(authors));
    for (index = 0; index < authors.length; index++) {
      let author = authors[index];
      // console.log(author);
      let result = await hasuraCreateAuthorPage({
        url: params['url'],
        site: params['site'],
        author_id: author,
        page_id: pageID,
      });
      // console.log(result);
    }
  }

  return returnValue;
}

const insertAuthorArticleMutation = `mutation AddonInsertAuthorArticle($article_id: Int!, $author_id: Int!) {
  insert_author_articles(objects: {article_id: $article_id, author_id: $author_id}, on_conflict: {constraint: author_articles_article_id_author_id_key, update_columns: article_id}) {
    affected_rows
  }
}`;

const insertAuthorPageMutation = `mutation AddonInsertAuthorPage($page_id: Int!, $author_id: Int!) {
  insert_author_pages(objects: {page_id: $page_id, author_id: $author_id}, on_conflict: {constraint: author_pages_page_id_author_id_key, update_columns: page_id}) {
    affected_rows
  }
}`;

async function hasuraCreateAuthorArticle(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertAuthorArticleMutation,
    name: 'AddonInsertAuthorArticle',
    variables: {
      author_id: params['author_id'],
      article_id: params['article_id'],
    },
  });
}

async function hasuraCreateAuthorPage(authorId, pageId) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertAuthorPageMutation,
    name: 'AddonInsertAuthorPage',
    variables: {
      author_id: params['author_id'],
      page_id: params['page_id'],
    },
  });
}

const insertTagMutation = `mutation AddonInsertTag($slug: String, $locale_code: String, $title: String, $article_id: Int!) {
  insert_tag_articles(objects: {article_id: $article_id, tag: {data: {slug: $slug, tag_translations: {data: {locale_code: $locale_code, title: $title}, on_conflict: {constraint: tag_translations_tag_id_locale_code_key, update_columns: locale_code}}, published: true}, on_conflict: {constraint: tags_organization_id_slug_key, update_columns: organization_id}}}, on_conflict: {constraint: tag_articles_article_id_tag_id_key, update_columns: article_id}) {
    returning {
      id
      article_id
      tag_id
    }
  }
}`;

async function hasuraCreateTag(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertTagMutation,
    name: 'AddonInsertTag',
    variables: {
      slug: params['slug'],
      article_id: params['article_id'],
      locale_code: params['locale_code'],
      title: params['title'],
    },
  });
}

const HASURA_UNPUBLISH_ARTICLE = `mutation FrontendUnpublishArticle($article_id: Int!, $locale_code: String!) {
  update_article_translations(where: {article_id: {_eq: $article_id}, locale_code: {_eq: $locale_code}}, _set: {published: false}) {
    affected_rows
  }
  delete_published_article_translations(where: {article_id: {_eq: $article_id}, locale_code: {_eq: $locale_code}}) {
    affected_rows
  }
}`;

export async function unpublishArticle(params) {
  // console.log('unpublishArticle params:', params);
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_UNPUBLISH_ARTICLE,
    name: 'FrontendUnpublishArticle',
    variables: {
      article_id: params['article_id'],
      locale_code: params['locale_code'],
    },
  });
}

const HASURA_UNPUBLISH_PAGE = `mutation FrontendUnpublishPage($page_id: Int!, $locale_code: String!) {
  update_page_translations(where: {page_id: {_eq: $page_id}, locale_code: {_eq: $locale_code}}, _set: {published: false}) {
    affected_rows
  }
}`;

export async function unpublishPage(params) {
  // console.log('unpublishPage params:', params);
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_UNPUBLISH_PAGE,
    name: 'FrontendUnpublishPage',
    variables: {
      page_id: params['page_id'],
      locale_code: params['locale_code'],
    },
  });
}

/*
.* Gets elements and formats them into JSON structure for us to work with on the front-end
.*/
function formatElements(elements) {
  let formattedElements = [];
  elements
    .sort(function (a, b) {
      if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    })
    .forEach((element) => {
      // console.log(
      //   'element.type: ' + element.type + ' - ' + JSON.stringify(element)
      // );
      let formattedElement = {
        type: element.type,
        style: element.style,
        link: element.link,
        html: element.html,
        listType: element.listType,
      };
      if (formattedElement.type === 'list') {
        formattedElement.listType = element.listType;
        formattedElement.items = element.items;
      } else {
        formattedElement.children = element.children;
      }
      formattedElements.push(formattedElement);
    });

  return formattedElements;
}

/*
.* for now this only trims whitespace, but stands to allow for any other text cleaning up we may need
.*/
function cleanContent(content) {
  if (content === null || typeof content === 'undefined') {
    return '';
  }
  return content.trim();
}

/*
.* condenses text style into one object allowing for bold, italic and underline
.* google docs style attribute often contains unrelated info, sometimes even the text content
.*/
function cleanStyle(incomingStyle) {
  let cleanedStyle = {
    underline: incomingStyle.underline,
    bold: incomingStyle.bold,
    italic: incomingStyle.italic,
  };
  return cleanedStyle;
}

export function getMainImage(elements) {
  let mainImageNodes = elements.filter(
    (element) => element.type === 'mainImage'
  );

  if (!mainImageNodes[0]) {
    // console.log("no mainImage type found in elements " + JSON.stringify(elements))
    return {};
  }
  // console.log("mainImageNodes[0]: " + JSON.stringify(mainImageNodes[0]));
  return mainImageNodes[0];
}

const insertArticleSlugVersion = `mutation AddonInsertArticleSlugVersion($article_id: Int!, $slug: String!, $category_slug: String!) {
  insert_article_slug_versions(on_conflict: {constraint: slug_versions_pkey, update_columns: article_id}, objects: {article_id: $article_id, slug: $slug, category_slug: $category_slug}) {
    affected_rows
  }
}`;

export async function storeArticleIdAndSlug(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertArticleSlugVersion,
    name: 'AddonInsertArticleSlugVersion',
    variables: {
      slug: params['slug'],
      article_id: params['article_id'],
      category_slug: params['category_slug'],
    },
  });
}

const upsertPublishedArticleTranslationMutation = `mutation AddonUpsertPublishedArticleTranslation($article_id: Int, $article_translation_id: Int, $locale_code: String) {
  insert_published_article_translations(objects: {article_id: $article_id, article_translation_id: $article_translation_id, locale_code: $locale_code}, on_conflict: {constraint: published_article_translations_article_id_locale_code_key, update_columns: article_translation_id}) {
    affected_rows
    returning {
      article_translation {
        id
        first_published_at
        last_published_at
        locale_code
        article_id
      }
    }
  }
}`;

export async function upsertPublishedArticle(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: upsertPublishedArticleTranslationMutation,
    name: 'AddonUpsertPublishedArticleTranslation',
    variables: {
      article_id: params['article_id'],
      locale_code: params['locale_code'],
      article_translation_id: params['article_translation_id'],
    },
  });
}

const insertPageSlugVersion = `mutation AddonInsertPageSlugVersion($slug: String!, $page_id: Int!) {
  insert_page_slug_versions(objects: {page_id: $page_id, slug: $slug}, on_conflict: {constraint: page_slug_versions_pkey, update_columns: page_id}) {
    affected_rows
  }
}`;

export async function storePageIdAndSlug(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertPageSlugVersion,
    name: 'AddonInsertPageSlugVersion',
    variables: {
      page_id: params['page_id'],
      slug: params['slug'],
    },
  });
}

const insertArticleGoogleDoc = `mutation FrontendInsertArticleGoogleDoc($article_id: Int!, $document_id: String!, $locale_code: String!, $url: String) {
  insert_article_google_documents(objects: {article_id: $article_id, google_document: {data: {document_id: $document_id, locale_code: $locale_code, url: $url}, on_conflict: {constraint: google_documents_organization_id_document_id_key, update_columns: url}}}, on_conflict: {constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id}) {
    affected_rows
  }
}`;

export async function hasuraInsertArticleGoogleDoc(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertArticleGoogleDoc,
    name: 'FrontendInsertArticleGoogleDoc',
    variables: {
      article_id: params['article_id'],
      document_id: params['document_id'],
      locale_code: params['locale_code'],
      url: params['document_url'],
    },
  });
}

const insertPageGoogleDoc = `mutation FrontendInsertPageGoogleDoc($page_id: Int!, $document_id: String!, $locale_code: String!, $url: String) {
  insert_page_google_documents(objects: {page_id: $page_id, google_document: {data: {document_id: $document_id, locale_code: $locale_code, url: $url}, on_conflict: {constraint: google_documents_organization_id_document_id_key, update_columns: url}}}, on_conflict: {constraint: page_google_documents_page_id_google_document_id_key, update_columns: google_document_id}) {
    affected_rows
  }
}`;

export async function hasuraInsertPageGoogleDoc(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: insertPageGoogleDoc,
    name: 'FrontendInsertPageGoogleDoc',
    variables: {
      page_id: params['page_id'],
      document_id: params['document_id'],
      locale_code: params['locale_code'],
      url: params['document_url'],
    },
  });
}

async function getFullGoogleFormsUrl(shortUrl) {
  try {
    const response = await fetch(shortUrl, {
      redirect: 'follow',
    });
    if (response.redirected && response.url) {
      const followedParams = new URL(response.url).searchParams;
      let longUrl = followedParams.get('continue');
      if (longUrl) {
        return longUrl;
      } else {
        return response.url;
      }
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
