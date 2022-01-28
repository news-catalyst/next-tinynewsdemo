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
          sectionType: 'CONTINUOUS',
          contentDirection: 'LEFT_TO_RIGHT',
          columnSeparatorStyle: 'NONE',
        },
      },
      endIndex: 1,
    },
    {
      startIndex: 1,
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
        elements: [
          {
            endIndex: 29,
            startIndex: 1,
            textRun: {
              textStyle: {},
              content: 'This sentence has a word in ',
            },
          },
          {
            textRun: {
              content: 'bold',
              textStyle: {
                bold: true,
              },
            },
            endIndex: 33,
            startIndex: 29,
          },
          {
            endIndex: 35,
            startIndex: 33,
            textRun: {
              content: ', ',
              textStyle: {},
            },
          },
          {
            endIndex: 41,
            startIndex: 35,
            textRun: {
              textStyle: {
                italic: true,
              },
              content: 'italic',
            },
          },
          {
            textRun: {
              textStyle: {},
              content: ', and ',
            },
            startIndex: 41,
            endIndex: 47,
          },
          {
            textRun: {
              content: 'underlined',
              textStyle: {
                underline: true,
              },
            },
            startIndex: 47,
            endIndex: 57,
          },
          {
            endIndex: 60,
            startIndex: 57,
            textRun: {
              textStyle: {},
              content: '. \n',
            },
          },
        ],
      },
      endIndex: 60,
    },
    {
      startIndex: 60,
      endIndex: 61,
      paragraph: {
        paragraphStyle: {
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'NORMAL_TEXT',
        },
        elements: [
          {
            startIndex: 60,
            textRun: {
              textStyle: {},
              content: '\n',
            },
            endIndex: 61,
          },
        ],
      },
    },
    {
      paragraph: {
        elements: [
          {
            endIndex: 88,
            startIndex: 61,
            textRun: {
              content: 'This sentence has a single ',
              textStyle: {},
            },
          },
          {
            textRun: {
              content: 'word',
              textStyle: {
                underline: true,
                foregroundColor: {
                  color: {
                    rgbColor: {
                      green: 0.33333334,
                      red: 0.06666667,
                      blue: 0.8,
                    },
                  },
                },
                link: {
                  url: 'https://tinynewsco.org',
                },
              },
            },
            endIndex: 92,
            startIndex: 88,
          },
          {
            startIndex: 92,
            endIndex: 137,
            textRun: {
              content: ' linked to the tinynewsco website homepage. \n',
              textStyle: {},
            },
          },
        ],
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
      },
      endIndex: 137,
      startIndex: 61,
    },
    {
      paragraph: {
        paragraphStyle: {
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'NORMAL_TEXT',
        },
        elements: [
          {
            textRun: {
              textStyle: {},
              content: '\n',
            },
            endIndex: 138,
            startIndex: 137,
          },
        ],
      },
      endIndex: 138,
      startIndex: 137,
    },
    {
      startIndex: 138,
      paragraph: {
        bullet: {
          listId: 'kix.qqyukljg8mnr',
          textStyle: {
            underline: false,
          },
        },
        elements: [
          {
            startIndex: 138,
            endIndex: 150,
            textRun: {
              textStyle: {},
              content: 'list item 1\n',
            },
          },
        ],
        paragraphStyle: {
          indentFirstLine: {
            magnitude: 18,
            unit: 'PT',
          },
          namedStyleType: 'NORMAL_TEXT',
          indentStart: {
            magnitude: 36,
            unit: 'PT',
          },
          direction: 'LEFT_TO_RIGHT',
        },
      },
      endIndex: 150,
    },
    {
      paragraph: {
        bullet: {
          textStyle: {
            underline: false,
          },
          listId: 'kix.qqyukljg8mnr',
        },
        paragraphStyle: {
          indentStart: {
            magnitude: 36,
            unit: 'PT',
          },
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'NORMAL_TEXT',
          indentFirstLine: {
            magnitude: 18,
            unit: 'PT',
          },
        },
        elements: [
          {
            textRun: {
              textStyle: {},
              content: 'list item 2\n',
            },
            endIndex: 162,
            startIndex: 150,
          },
        ],
      },
      startIndex: 150,
      endIndex: 162,
    },
    {
      paragraph: {
        elements: [
          {
            endIndex: 177,
            textRun: {
              textStyle: {},
              content: 'Heading Size 1\n',
            },
            startIndex: 162,
          },
        ],
        paragraphStyle: {
          headingId: 'h.t40hwwqf2an0',
          namedStyleType: 'HEADING_1',
          direction: 'LEFT_TO_RIGHT',
        },
      },
      startIndex: 162,
      endIndex: 177,
    },
    {
      startIndex: 177,
      paragraph: {
        elements: [
          {
            textRun: {
              content: 'paragraph\n',
              textStyle: {},
            },
            startIndex: 177,
            endIndex: 187,
          },
        ],
        paragraphStyle: {
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'NORMAL_TEXT',
        },
      },
      endIndex: 187,
    },
    {
      startIndex: 187,
      paragraph: {
        paragraphStyle: {
          direction: 'LEFT_TO_RIGHT',
          namedStyleType: 'HEADING_2',
          headingId: 'h.zdu1t9xjbq6s',
        },
        elements: [
          {
            endIndex: 202,
            textRun: {
              content: 'Heading Size 2\n',
              textStyle: {},
            },
            startIndex: 187,
          },
        ],
      },
      endIndex: 202,
    },
    {
      paragraph: {
        elements: [
          {
            startIndex: 202,
            endIndex: 212,
            textRun: {
              content: 'paragraph\n',
              textStyle: {},
            },
          },
        ],
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
      },
      startIndex: 202,
      endIndex: 212,
    },
    {
      endIndex: 213,
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
            endIndex: 213,
            startIndex: 212,
          },
        ],
      },
      startIndex: 212,
    },
    {
      startIndex: 213,
      endIndex: 249,
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
        elements: [
          {
            endIndex: 248,
            startIndex: 213,
            textRun: {
              textStyle: {
                underline: true,
                link: {
                  url: 'https://forms.gle/413sboQBCkw4p1PW6',
                },
                foregroundColor: {
                  color: {
                    rgbColor: {
                      blue: 0.8,
                      green: 0.33333334,
                      red: 0.06666667,
                    },
                  },
                },
              },
              content: 'https://forms.gle/413sboQBCkw4p1PW6',
            },
          },
          {
            endIndex: 249,
            textRun: {
              content: '\n',
              textStyle: {},
            },
            startIndex: 248,
          },
        ],
      },
    },
    {
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
        elements: [
          {
            startIndex: 249,
            textRun: {
              textStyle: {},
              content: '\n',
            },
            endIndex: 250,
          },
        ],
      },
      endIndex: 250,
      startIndex: 249,
    },
    {
      endIndex: 252,
      paragraph: {
        paragraphStyle: {
          namedStyleType: 'NORMAL_TEXT',
          direction: 'LEFT_TO_RIGHT',
        },
        elements: [
          {
            endIndex: 251,
            startIndex: 250,
            inlineObjectElement: {
              inlineObjectId: 'kix.wr6s7brrno1m',
              textStyle: {},
            },
          },
          {
            textRun: {
              content: '\n',
              textStyle: {},
            },
            startIndex: 251,
            endIndex: 252,
          },
        ],
      },
      startIndex: 250,
    },
  ];

  context('processDocumentContents', () => {
    beforeEach(() => {
      cy.intercept(
        'https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&continue=https://docs.google.com/forms/d/e/1FAIpQLSfVOl8qdT54E2r_T367YsRlka57bUY_fnjedMLezp1Tll9OQw/viewform?usp%3Dsend_form&followup=https://docs.google.com/forms/d/e/1FAIpQLSfVOl8qdT54E2r_T367YsRlka57bUY_fnjedMLezp1Tll9OQw/viewform?usp%3Dsend_form&ltmpl=forms',
        {
          statusCode: 200,
        }
      );
      cy.intercept(
        {
          https: true,
          method: 'GET',
          hostname: 'forms.gle',
          url: '/*',
        },
        (req) => {
          req.reply({
            headers: {
              Location:
                'https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&continue=https://docs.google.com/forms/d/e/1FAIpQLSfVOl8qdT54E2r_T367YsRlka57bUY_fnjedMLezp1Tll9OQw/viewform?usp%3Dsend_form&followup=https://docs.google.com/forms/d/e/1FAIpQLSfVOl8qdT54E2r_T367YsRlka57bUY_fnjedMLezp1Tll9OQw/viewform?usp%3Dsend_form&ltmpl=forms',
            },
            statusCode: 301,
            body: {
              name: 'Peter Pan',
            },
          });
        }
      ).as('googleForms');
    });

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

    it('formats google forms embed short links', () => {
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
        let el = result.formattedElements[10];

        expect(el.type).to.eq('embed');
        expect(el.link).to.eq(
          'https://docs.google.com/forms/d/e/1FAIpQLSfVOl8qdT54E2r_T367YsRlka57bUY_fnjedMLezp1Tll9OQw/viewform?usp=send_form'
        );
      });
    });
  });
});
