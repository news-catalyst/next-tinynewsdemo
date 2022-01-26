import { processDocumentContents } from '../../lib/document';

describe('document API', () => {
  let listInfo = {};
  let inlineObjects = {};
  let imageList = {};

  let slug = 'foo';
  let oauthToken = 'foobar';
  const elements = [
    {
      sectionBreak: {
        sectionStyle: {
          contentDirection: 'LEFT_TO_RIGHT',
          columnSeparatorStyle: 'NONE',
          sectionType: 'CONTINUOUS',
        },
      },
      endIndex: 1,
    },
    {
      paragraph: {
        elements: [
          {
            endIndex: 29,
            textRun: {
              content: 'This sentence has a word in ',
              textStyle: {},
            },
            startIndex: 1,
          },
          {
            endIndex: 33,
            textRun: {
              content: 'bold',
              textStyle: {
                bold: true,
              },
            },
            startIndex: 29,
          },
          {
            startIndex: 33,
            textRun: {
              textStyle: {},
              content: ', ',
            },
            endIndex: 35,
          },
          {
            textRun: {
              textStyle: {
                italic: true,
              },
              content: 'italic',
            },
            startIndex: 35,
            endIndex: 41,
          },
          {
            startIndex: 41,
            textRun: {
              content: ', and ',
              textStyle: {},
            },
            endIndex: 47,
          },
          {
            startIndex: 47,
            endIndex: 57,
            textRun: {
              content: 'underlined',
              textStyle: {
                underline: true,
              },
            },
          },
          {
            textRun: {
              content: '. \n',
              textStyle: {},
            },
            startIndex: 57,
            endIndex: 60,
          },
        ],
        paragraphStyle: {
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'NORMAL_TEXT',
        },
      },
      endIndex: 60,
      startIndex: 1,
    },
    {
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
        elements: [
          {
            startIndex: 60,
            endIndex: 61,
            textRun: {
              textStyle: {},
              content: '\n',
            },
          },
        ],
      },
      endIndex: 61,
      startIndex: 60,
    },
    {
      startIndex: 61,
      paragraph: {
        paragraphStyle: {
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'NORMAL_TEXT',
        },
        elements: [
          {
            startIndex: 61,
            textRun: {
              textStyle: {},
              content: 'This sentence has a single ',
            },
            endIndex: 88,
          },
          {
            startIndex: 88,
            textRun: {
              content: 'word',
              textStyle: {
                foregroundColor: {
                  color: {
                    rgbColor: {
                      green: 0.33333334,
                      blue: 0.8,
                      red: 0.06666667,
                    },
                  },
                },
                link: {
                  url: 'https://tinynewsco.org',
                },
                underline: true,
              },
            },
            endIndex: 92,
          },
          {
            endIndex: 137,
            startIndex: 92,
            textRun: {
              content: ' linked to the tinynewsco website homepage. \n',
              textStyle: {},
            },
          },
        ],
      },
      endIndex: 137,
    },
    {
      startIndex: 137,
      endIndex: 138,
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
        elements: [
          {
            textRun: {
              content: '\n',
              textStyle: {},
            },
            endIndex: 138,
            startIndex: 137,
          },
        ],
      },
    },
    {
      endIndex: 150,
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          indentFirstLine: {
            unit: 'PT',
            magnitude: 18,
          },
          indentStart: {
            magnitude: 36,
            unit: 'PT',
          },
          direction: 'LEFT_TO_RIGHT',
        },
        bullet: {
          listId: 'kix.qqyukljg8mnr',
          textStyle: {
            underline: false,
          },
        },
        elements: [
          {
            endIndex: 150,
            textRun: {
              textStyle: {},
              content: 'list item 1\n',
            },
            startIndex: 138,
          },
        ],
      },
      startIndex: 138,
    },
    {
      paragraph: {
        elements: [
          {
            endIndex: 162,
            startIndex: 150,
            textRun: {
              textStyle: {},
              content: 'list item 2\n',
            },
          },
        ],
        bullet: {
          textStyle: {
            underline: false,
          },
          listId: 'kix.qqyukljg8mnr',
        },
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          indentFirstLine: {
            magnitude: 18,
            unit: 'PT',
          },
          indentStart: {
            magnitude: 36,
            unit: 'PT',
          },
          direction: 'LEFT_TO_RIGHT',
        },
      },
      startIndex: 150,
      endIndex: 162,
    },
    {
      startIndex: 162,
      endIndex: 177,
      paragraph: {
        elements: [
          {
            endIndex: 177,
            startIndex: 162,
            textRun: {
              content: 'Heading Size 1\n',
              textStyle: {},
            },
          },
        ],
        paragraphStyle: {
          headingId: 'h.t40hwwqf2an0',
          namedStyleType: 'HEADING_1',
          direction: 'LEFT_TO_RIGHT',
        },
      },
    },
    {
      startIndex: 177,
      paragraph: {
        elements: [
          {
            startIndex: 177,
            textRun: {
              textStyle: {},
              content: 'paragraph\n',
            },
            endIndex: 187,
          },
        ],
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
      },
      endIndex: 187,
    },
    {
      startIndex: 187,
      endIndex: 202,
      paragraph: {
        elements: [
          {
            endIndex: 202,
            startIndex: 187,
            textRun: {
              content: 'Heading Size 2\n',
              textStyle: {},
            },
          },
        ],
        paragraphStyle: {
          namedStyleType: 'HEADING_2',
          direction: 'LEFT_TO_RIGHT',
          headingId: 'h.zdu1t9xjbq6s',
        },
      },
    },
    {
      endIndex: 212,
      startIndex: 202,
      paragraph: {
        elements: [
          {
            textRun: {
              textStyle: {},
              content: 'paragraph\n',
            },
            startIndex: 202,
            endIndex: 212,
          },
        ],
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
      },
    },
    {
      endIndex: 214,
      paragraph: {
        elements: [
          {
            startIndex: 212,
            endIndex: 213,
            inlineObjectElement: {
              textStyle: {},
              inlineObjectId: 'kix.wr6s7brrno1m',
            },
          },
          {
            startIndex: 213,
            textRun: {
              textStyle: {},
              content: '\n',
            },
            endIndex: 214,
          },
        ],
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
      },
      startIndex: 212,
    },
  ];

  context('processDocumentContents', () => {
    it('returns an object with main image, an updated list of images, and formatted elements', () => {
      cy.wrap(
        processDocumentContents(
          elements,
          listInfo,
          inlineObjects,
          imageList,
          slug,
          oauthToken
        )
      )
        .should('be.an', 'object')
        .and('have.keys', [
          'mainImage',
          'updatedImageList',
          'formattedElements',
        ]);
    });

    it('formats text in a paragraph', () => {
      cy.wrap(
        processDocumentContents(
          elements,
          listInfo,
          inlineObjects,
          imageList,
          slug,
          oauthToken
        )
      ).then((result) => {
        // cy.log(JSON.stringify(result));
        let paragraph = result.formattedElements[0];

        expect(paragraph.type).to.eq('text');
        expect(paragraph.style).to.eq('NORMAL_TEXT');
        expect(paragraph.children[1].style.bold).to.be.true;
        expect(paragraph.children[3].style.italic).to.be.true;
        expect(paragraph.children[5].style.underline).to.be.true;
        // expect(paragraph.children[3].content).to.eq('symptoms');
      });
    });

    it('formats links', () => {
      cy.wrap(
        processDocumentContents(
          elements,
          listInfo,
          inlineObjects,
          imageList,
          slug,
          oauthToken
        )
      ).then((result) => {
        // cy.log(JSON.stringify(result));
        let paragraph = result.formattedElements[2];

        expect(paragraph.type).to.eq('text');
        expect(paragraph.style).to.eq('NORMAL_TEXT');
        expect(paragraph.children[1].style.underline).to.be.true;
        expect(paragraph.children[1].link).to.eq('https://tinynewsco.org');
        expect(paragraph.children[1].content).to.eq('word');
        // expect(paragraph.children[3].content).to.eq('symptoms');
      });
    });

    it('formats lists', () => {
      cy.wrap(
        processDocumentContents(
          elements,
          listInfo,
          inlineObjects,
          imageList,
          slug,
          oauthToken
        )
      ).then((result) => {
        // cy.log(JSON.stringify(result));
        let paragraph = result.formattedElements[4];

        expect(paragraph.type).to.eq('list');
        expect(paragraph.listType).to.eq('BULLET');
        expect(paragraph.items).to.have.length(2);
        expect(paragraph.items[0].children).to.have.length(1);
        expect(paragraph.items[0].children[0].content).to.eq('list item 1');
        expect(paragraph.items[1].children[0].content).to.eq('list item 2');
      });
    });

    it('formats headers', () => {
      cy.wrap(
        processDocumentContents(
          elements,
          listInfo,
          inlineObjects,
          imageList,
          slug,
          oauthToken
        )
      ).then((result) => {
        // cy.log(JSON.stringify(result));
        let paragraph = result.formattedElements[5];

        expect(paragraph.type).to.eq('text');
        expect(paragraph.style).to.eq('HEADING_1');
        expect(paragraph.children[0].content).to.eq('Heading Size 1');

        let paragraph2 = result.formattedElements[7];

        expect(paragraph2.type).to.eq('text');
        expect(paragraph2.style).to.eq('HEADING_2');
        expect(paragraph2.children[0].content).to.eq('Heading Size 2');
      });
    });
  });
});
