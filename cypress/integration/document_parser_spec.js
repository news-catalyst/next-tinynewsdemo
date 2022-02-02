import { processDocumentContents } from '../../lib/document';
import TinyS3 from '../../lib/tiny_s3';

describe('document parser', () => {
  let slug = 'foo';
  let oauthToken = 'foobar';
  let listInfo = {};
  let inlineObjects = {};
  let imageList = {};
  let elements = [];

  context('processDocumentContents with lists', () => {
    beforeEach(() => {
      listInfo = { 'kix.ljsexdhhyabi': 'BULLET' };
      elements = [
        {
          endIndex: 1,
          sectionBreak: {
            sectionStyle: {
              sectionType: 'CONTINUOUS',
              contentDirection: 'LEFT_TO_RIGHT',
              columnSeparatorStyle: 'NONE',
            },
          },
        },
        {
          endIndex: 24,
          startIndex: 1,
          paragraph: {
            paragraphStyle: {
              headingId: 'h.hhs5zo7h173j',
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'HEADING_2',
            },
            elements: [
              {
                textRun: {
                  content: 'Editorial Independence\n',
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Libre Franklin',
                      weight: 400,
                    },
                    bold: true,
                  },
                },
                startIndex: 1,
                endIndex: 24,
              },
            ],
          },
        },
        {
          paragraph: {
            elements: [
              {
                startIndex: 24,
                textRun: {
                  content:
                    'Our organization seeks to create and maintain a diverse portfolio of revenue streams in the interest of our long term sustainability and capacity. We maintain boundaries between our editorial practices and business interests to protect the integrity of our work and ethically serve our audiences. No form of financial support including grants, donations, sponsorships or advertising influences editorial decisions and our coverage is not an endorsement of any donor, sponsor or advertiser.\n',
                  textStyle: {
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                    weightedFontFamily: {
                      weight: 400,
                      fontFamily: 'Domine',
                    },
                  },
                },
                endIndex: 514,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          endIndex: 514,
          startIndex: 24,
        },
        {
          endIndex: 515,
          paragraph: {
            elements: [
              {
                startIndex: 514,
                endIndex: 515,
                textRun: {
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                  },
                  content: '\n',
                },
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          startIndex: 514,
        },
        {
          startIndex: 515,
          endIndex: 766,
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                endIndex: 766,
                startIndex: 515,
                textRun: {
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                  },
                  content:
                    'No person covered by this policy can be in the business of lobbying or creating content on behalf of a political candidate, politician or lobbying entity nor can they work for a state, local, or municipal government entity or be a member of Congress.\n',
                },
              },
            ],
          },
        },
        {
          endIndex: 773,
          paragraph: {
            elements: [
              {
                startIndex: 766,
                endIndex: 773,
                textRun: {
                  content: 'Ethics\n',
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Libre Franklin',
                      weight: 400,
                    },
                    bold: true,
                  },
                },
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              headingId: 'h.prvumh39ta63',
              namedStyleType: 'HEADING_2',
            },
          },
          startIndex: 766,
        },
        {
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                endIndex: 868,
                startIndex: 773,
                textRun: {
                  content:
                    'We center ethical practices and harm prevention in the course of doing our work. We follow the ',
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                  },
                },
              },
              {
                textRun: {
                  content: 'Society of Professional Journalists Code of Ethics',
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
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                    bold: true,
                    link: {
                      url: 'https://www.spj.org/ethicscode.asp',
                    },
                    underline: true,
                    fontSize: {
                      unit: 'PT',
                      magnitude: 12,
                    },
                  },
                },
                startIndex: 868,
                endIndex: 918,
              },
              {
                startIndex: 918,
                endIndex: 920,
                textRun: {
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                  },
                  content: ':\n',
                },
              },
            ],
          },
          endIndex: 920,
          startIndex: 773,
        },
        {
          startIndex: 920,
          endIndex: 921,
          paragraph: {
            elements: [
              {
                textRun: {
                  textStyle: {
                    fontSize: {
                      unit: 'PT',
                      magnitude: 12,
                    },
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                  },
                  content: '\n',
                },
                startIndex: 920,
                endIndex: 921,
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
        },
        {
          paragraph: {
            paragraphStyle: {
              indentStart: {
                unit: 'PT',
                magnitude: 36,
              },
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
              indentFirstLine: {
                magnitude: 18,
                unit: 'PT',
              },
            },
            bullet: {
              textStyle: {
                backgroundColor: {
                  color: {
                    rgbColor: {
                      red: 1,
                      blue: 1,
                      green: 1,
                    },
                  },
                },
                fontSize: {
                  magnitude: 12,
                  unit: 'PT',
                },
                weightedFontFamily: {
                  weight: 400,
                  fontFamily: 'Domine',
                },
              },
              listId: 'kix.ljsexdhhyabi',
            },
            elements: [
              {
                textRun: {
                  textStyle: {
                    backgroundColor: {
                      color: {
                        rgbColor: {
                          red: 1,
                          blue: 1,
                          green: 1,
                        },
                      },
                    },
                    weightedFontFamily: {
                      weight: 400,
                      fontFamily: 'Domine',
                    },
                    fontSize: {
                      unit: 'PT',
                      magnitude: 12,
                    },
                  },
                  content:
                    'oEthical journalism should be accurate and fair. Journalists should be honest and courageous in gathering, reporting and interpreting information.\n',
                },
                endIndex: 1068,
                startIndex: 921,
              },
            ],
          },
          startIndex: 921,
          endIndex: 1068,
        },
        {
          paragraph: {
            bullet: {
              textStyle: {
                fontSize: {
                  unit: 'PT',
                  magnitude: 12,
                },
                backgroundColor: {
                  color: {
                    rgbColor: {
                      blue: 1,
                      green: 1,
                      red: 1,
                    },
                  },
                },
                weightedFontFamily: {
                  fontFamily: 'Domine',
                  weight: 400,
                },
              },
              listId: 'kix.ljsexdhhyabi',
            },
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
              indentFirstLine: {
                magnitude: 18,
                unit: 'PT',
              },
              indentStart: {
                unit: 'PT',
                magnitude: 36,
              },
            },
            elements: [
              {
                textRun: {
                  content:
                    'Ethical journalism treats sources, subjects, colleagues and members of the public as human beings deserving of respect.',
                  textStyle: {
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                    backgroundColor: {
                      color: {
                        rgbColor: {
                          red: 1,
                          green: 1,
                          blue: 1,
                        },
                      },
                    },
                    weightedFontFamily: {
                      weight: 400,
                      fontFamily: 'Domine',
                    },
                  },
                },
                endIndex: 1187,
                startIndex: 1068,
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                  },
                },
                endIndex: 1188,
                startIndex: 1187,
              },
            ],
          },
          startIndex: 1068,
          endIndex: 1188,
        },
        {
          startIndex: 1188,
          paragraph: {
            elements: [
              {
                textRun: {
                  textStyle: {
                    backgroundColor: {
                      color: {
                        rgbColor: {
                          green: 1,
                          red: 1,
                          blue: 1,
                        },
                      },
                    },
                    weightedFontFamily: {
                      weight: 400,
                      fontFamily: 'Domine',
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                  },
                  content:
                    'The highest and primary obligation of ethical journalism is to serve the public.\n',
                },
                endIndex: 1269,
                startIndex: 1188,
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
              indentFirstLine: {
                magnitude: 18,
                unit: 'PT',
              },
              indentStart: {
                unit: 'PT',
                magnitude: 36,
              },
            },
            bullet: {
              listId: 'kix.ljsexdhhyabi',
              textStyle: {
                fontSize: {
                  magnitude: 12,
                  unit: 'PT',
                },
                backgroundColor: {
                  color: {
                    rgbColor: {
                      red: 1,
                      blue: 1,
                      green: 1,
                    },
                  },
                },
                weightedFontFamily: {
                  weight: 400,
                  fontFamily: 'Domine',
                },
              },
            },
          },
          endIndex: 1269,
        },
        {
          startIndex: 1269,
          endIndex: 1377,
          paragraph: {
            elements: [
              {
                textRun: {
                  content:
                    'Ethical journalism means taking responsibility for one’s work and explaining one’s decisions to the public.',
                  textStyle: {
                    backgroundColor: {
                      color: {
                        rgbColor: {
                          blue: 1,
                          red: 1,
                          green: 1,
                        },
                      },
                    },
                    fontSize: {
                      magnitude: 12,
                      unit: 'PT',
                    },
                    weightedFontFamily: {
                      fontFamily: 'Domine',
                      weight: 400,
                    },
                  },
                },
                endIndex: 1376,
                startIndex: 1269,
              },
              {
                endIndex: 1377,
                startIndex: 1376,
                textRun: {
                  content: '\n',
                  textStyle: {
                    weightedFontFamily: {
                      weight: 400,
                      fontFamily: 'Domine',
                    },
                    fontSize: {
                      unit: 'PT',
                      magnitude: 12,
                    },
                  },
                },
              },
            ],
            bullet: {
              listId: 'kix.ljsexdhhyabi',
              textStyle: {
                backgroundColor: {
                  color: {
                    rgbColor: {
                      blue: 1,
                      green: 1,
                      red: 1,
                    },
                  },
                },
                weightedFontFamily: {
                  weight: 400,
                  fontFamily: 'Domine',
                },
                fontSize: {
                  magnitude: 12,
                  unit: 'PT',
                },
              },
            },
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              indentStart: {
                magnitude: 36,
                unit: 'PT',
              },
              indentFirstLine: {
                unit: 'PT',
                magnitude: 18,
              },
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          startIndex: 1377,
          paragraph: {
            elements: [
              {
                endIndex: 1389,
                textRun: {
                  content: 'Corrections\n',
                  textStyle: {
                    weightedFontFamily: {
                      fontFamily: 'Libre Franklin',
                      weight: 400,
                    },
                    bold: true,
                  },
                },
                startIndex: 1377,
              },
            ],
            paragraphStyle: {
              headingId: 'h.c2jjrjxnl60g',
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'HEADING_2',
            },
          },
          endIndex: 1389,
        },
      ];
    });

    it('can handle problematic blank lines / bad formatting', () => {
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
        const listEl = result.formattedElements.find(
          (el) => el.type === 'list'
        );
        expect(listEl.listType).to.eq('BULLET');
        expect(listEl.items).to.have.length(4);
        expect(listEl.items[0].children).to.have.length(1);
        expect(listEl.items[0].children[0].content).to.eq(
          'oEthical journalism should be accurate and fair. Journalists should be honest and courageous in gathering, reporting and interpreting information.'
        );
        expect(listEl.items[1].children).to.have.length(1);

        expect(listEl.items[1].children[0].content).to.eq(
          'Ethical journalism treats sources, subjects, colleagues and members of the public as human beings deserving of respect.'
        );
        expect(listEl.items[2].children).to.have.length(1);

        expect(listEl.items[2].children[0].content).to.eq(
          'The highest and primary obligation of ethical journalism is to serve the public.'
        );
        expect(listEl.items[3].children).to.have.length(1);

        expect(listEl.items[3].children[0].content).to.eq(
          'Ethical journalism means taking responsibility for one’s work and explaining one’s decisions to the public.'
        );
      });
    });
  });
  context('processDocumentContents', () => {
    beforeEach(() => {
      elements = [
        {
          sectionBreak: {
            sectionStyle: {
              sectionType: 'CONTINUOUS',
              columnSeparatorStyle: 'NONE',
              contentDirection: 'LEFT_TO_RIGHT',
            },
          },
          endIndex: 1,
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
                  content: 'This sentence has a word in ',
                  textStyle: {},
                },
                endIndex: 29,
                startIndex: 1,
              },
              {
                startIndex: 29,
                endIndex: 33,
                textRun: {
                  content: 'bold',
                  textStyle: {
                    bold: true,
                  },
                },
              },
              {
                startIndex: 33,
                endIndex: 35,
                textRun: {
                  textStyle: {},
                  content: ', ',
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
                  textStyle: {
                    underline: true,
                  },
                  content: 'underlined',
                },
                startIndex: 47,
                endIndex: 57,
              },
              {
                endIndex: 60,
                textRun: {
                  content: '. \n',
                  textStyle: {},
                },
                startIndex: 57,
              },
            ],
          },
          startIndex: 1,
          endIndex: 60,
        },
        {
          endIndex: 61,
          startIndex: 60,
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
                  content: '\n',
                  textStyle: {},
                },
              },
            ],
          },
        },
        {
          endIndex: 137,
          paragraph: {
            elements: [
              {
                startIndex: 61,
                endIndex: 88,
                textRun: {
                  textStyle: {},
                  content: 'This sentence has a single ',
                },
              },
              {
                startIndex: 88,
                endIndex: 92,
                textRun: {
                  textStyle: {
                    underline: true,
                    link: {
                      url: 'https://tinynewsco.org',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          green: 0.33333334,
                          blue: 0.8,
                          red: 0.06666667,
                        },
                      },
                    },
                  },
                  content: 'word',
                },
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
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          startIndex: 61,
        },
        {
          endIndex: 138,
          startIndex: 137,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                startIndex: 137,
                endIndex: 138,
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
              },
            ],
          },
        },
        {
          endIndex: 150,
          startIndex: 138,
          paragraph: {
            elements: [
              {
                textRun: {
                  content: 'list item 1\n',
                  textStyle: {},
                },
                endIndex: 150,
                startIndex: 138,
              },
            ],
            bullet: {
              textStyle: {
                underline: false,
              },
              listId: 'kix.qqyukljg8mnr',
            },
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
              indentFirstLine: {
                magnitude: 18,
                unit: 'PT',
              },
              indentStart: {
                unit: 'PT',
                magnitude: 36,
              },
            },
          },
        },
        {
          endIndex: 162,
          startIndex: 150,
          paragraph: {
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
            bullet: {
              listId: 'kix.qqyukljg8mnr',
              textStyle: {
                underline: false,
              },
            },
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
              indentStart: {
                magnitude: 36,
                unit: 'PT',
              },
              indentFirstLine: {
                unit: 'PT',
                magnitude: 18,
              },
            },
          },
        },
        {
          endIndex: 177,
          startIndex: 162,
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
              namedStyleType: 'HEADING_1',
              direction: 'LEFT_TO_RIGHT',
              headingId: 'h.t40hwwqf2an0',
            },
          },
        },
        {
          startIndex: 177,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                textRun: {
                  textStyle: {},
                  content: 'paragraph\n',
                },
                endIndex: 187,
                startIndex: 177,
              },
            ],
          },
          endIndex: 187,
        },
        {
          paragraph: {
            elements: [
              {
                startIndex: 187,
                endIndex: 202,
                textRun: {
                  textStyle: {},
                  content: 'Heading Size 2\n',
                },
              },
            ],
            paragraphStyle: {
              headingId: 'h.zdu1t9xjbq6s',
              namedStyleType: 'HEADING_2',
              direction: 'LEFT_TO_RIGHT',
            },
          },
          endIndex: 202,
          startIndex: 187,
        },
        {
          endIndex: 212,
          startIndex: 202,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                textRun: {
                  content: 'paragraph\n',
                  textStyle: {},
                },
                endIndex: 212,
                startIndex: 202,
              },
            ],
          },
        },
        {
          startIndex: 212,
          endIndex: 213,
          paragraph: {
            elements: [
              {
                startIndex: 212,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                endIndex: 213,
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
        },
        {
          startIndex: 213,
          paragraph: {
            elements: [
              {
                endIndex: 248,
                startIndex: 213,
                textRun: {
                  content: 'https://forms.gle/413sboQBCkw4p1PW6',
                  textStyle: {
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          blue: 0.8,
                          green: 0.33333334,
                          red: 0.06666667,
                        },
                      },
                    },
                    link: {
                      url: 'https://forms.gle/413sboQBCkw4p1PW6',
                    },
                    underline: true,
                  },
                },
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                endIndex: 249,
                startIndex: 248,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          endIndex: 249,
        },
        {
          startIndex: 249,
          endIndex: 250,
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                endIndex: 250,
                startIndex: 249,
              },
            ],
          },
        },
        {
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                startIndex: 250,
                textRun: {
                  textStyle: {
                    link: {
                      url:
                        'https://twitter.com/metmuseum/status/1487459721737035779',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          blue: 0.8,
                          red: 0.06666667,
                          green: 0.33333334,
                        },
                      },
                    },
                    underline: true,
                  },
                  content:
                    'https://twitter.com/metmuseum/status/1487459721737035779',
                },
                endIndex: 306,
              },
              {
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 306,
                endIndex: 307,
              },
            ],
          },
          endIndex: 307,
          startIndex: 250,
        },
        {
          endIndex: 308,
          startIndex: 307,
          paragraph: {
            elements: [
              {
                endIndex: 308,
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 307,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          startIndex: 308,
          endIndex: 337,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 336,
                textRun: {
                  content: 'https://youtu.be/xo_mTFHFy3A',
                  textStyle: {
                    link: {
                      url: 'https://youtu.be/xo_mTFHFy3A',
                    },
                    underline: true,
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                },
                startIndex: 308,
              },
              {
                endIndex: 337,
                startIndex: 336,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
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
                startIndex: 337,
                endIndex: 338,
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
              },
            ],
          },
          startIndex: 337,
          endIndex: 338,
        },
        {
          paragraph: {
            elements: [
              {
                endIndex: 378,
                startIndex: 338,
                textRun: {
                  textStyle: {
                    link: {
                      url: 'https://www.instagram.com/p/CZW7N3ts_Uj/',
                    },
                    underline: true,
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                  content: 'https://www.instagram.com/p/CZW7N3ts_Uj/',
                },
              },
              {
                endIndex: 379,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 378,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          endIndex: 379,
          startIndex: 338,
        },
        {
          endIndex: 380,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 380,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 379,
              },
            ],
          },
          startIndex: 379,
        },
        {
          startIndex: 381,
          endIndex: 440,
          paragraph: {
            elements: [
              {
                endIndex: 440,
                startIndex: 381,
                textRun: {
                  content:
                    'https://www.facebook.com/metmuseum/posts/10158951358637635',
                  textStyle: {
                    underline: true,
                    link: {
                      url:
                        'https://www.facebook.com/metmuseum/posts/10158951358637635',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                },
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 381,
                endIndex: 440,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          endIndex: 441,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 441,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 382,
              },
            ],
          },
          startIndex: 382,
        },
        {
          startIndex: 383,
          endIndex: 442,
          paragraph: {
            elements: [
              {
                endIndex: 442,
                startIndex: 383,
                textRun: {
                  content:
                    'https://www.tiktok.com/@metmuseum/video/7055762098449861935',
                  textStyle: {
                    underline: true,
                    link: {
                      url:
                        'https://www.tiktok.com/@metmuseum/video/7055762098449861935',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                },
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 383,
                endIndex: 442,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          endIndex: 443,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 443,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 384,
              },
            ],
          },
          startIndex: 384,
        },
        {
          startIndex: 385,
          endIndex: 444,
          paragraph: {
            elements: [
              {
                endIndex: 444,
                startIndex: 385,
                textRun: {
                  content:
                    'https://open.spotify.com/playlist/37i9dQZF1EQnqst5TRi17F?si=6800f9f9f78048ff',
                  textStyle: {
                    underline: true,
                    link: {
                      url:
                        'https://open.spotify.com/playlist/37i9dQZF1EQnqst5TRi17F?si=6800f9f9f78048ff',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                },
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 385,
                endIndex: 444,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          endIndex: 445,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 445,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 386,
              },
            ],
          },
          startIndex: 386,
        },
        {
          startIndex: 388,
          endIndex: 446,
          paragraph: {
            elements: [
              {
                endIndex: 446,
                startIndex: 388,
                textRun: {
                  content: 'https://vimeo.com/661633547',
                  textStyle: {
                    underline: true,
                    link: {
                      url: 'https://vimeo.com/661633547',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                },
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 388,
                endIndex: 446,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          endIndex: 447,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 447,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 389,
              },
            ],
          },
          startIndex: 389,
        },
        {
          startIndex: 390,
          endIndex: 448,
          paragraph: {
            elements: [
              {
                endIndex: 448,
                startIndex: 390,
                textRun: {
                  content:
                    'https://podcasts.apple.com/us/podcast/we-need-to-talk-about-covid-part-2-a-conversation/id1200361736?i=1000549512881',
                  textStyle: {
                    underline: true,
                    link: {
                      url:
                        'https://podcasts.apple.com/us/podcast/we-need-to-talk-about-covid-part-2-a-conversation/id1200361736?i=1000549512881',
                    },
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          red: 0.06666667,
                          green: 0.33333334,
                          blue: 0.8,
                        },
                      },
                    },
                  },
                },
              },
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 390,
                endIndex: 448,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          paragraph: {
            elements: [
              {
                inlineObjectElement: {
                  textStyle: {},
                  inlineObjectId: 'kix.al6se8yfh2hr',
                },
                startIndex: 439,
                endIndex: 440,
              },
              {
                inlineObjectElement: {
                  textStyle: {},
                  inlineObjectId: 'kix.k1t9pkul79ya',
                },
                endIndex: 441,
                startIndex: 440,
              },
              {
                startIndex: 441,
                endIndex: 442,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
          endIndex: 442,
          startIndex: 439,
        },
        {
          startIndex: 442,
          endIndex: 443,
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
                endIndex: 443,
                startIndex: 442,
              },
            ],
          },
        },
      ];
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
          hostname: 'lh6.googleusercontent.com',
          url: '/*',
        },
        (req) => {
          req.reply({
            statusCode: 200,
            fixture: 'upload.png',
            headers: {
              'content-type': 'image/png',
              'cache-control': 'public, max-age=0',
            },
          });
        }
      ).as('googleDocsImage');

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

      cy.stub(TinyS3, 'upload').returns({
        s3Url:
          'https://assets.tinynewsco.org/oaklyn-test/category-slug/article-slug/imagekix123.png',
        height: 640,
        width: 480,
      });
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

    it('formats headings', () => {
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

    it('formats social media embed links', () => {
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
        let tweet = result.formattedElements[12];
        expect(tweet.type).to.eq('embed');
        expect(tweet.link).to.eq(
          'https://twitter.com/metmuseum/status/1487459721737035779'
        );

        let youtube = result.formattedElements[14];
        expect(youtube.type).to.eq('embed');
        expect(youtube.link).to.eq('https://youtu.be/xo_mTFHFy3A');

        let insta = result.formattedElements[16];
        expect(insta.type).to.eq('embed');
        expect(insta.link).to.eq('https://www.instagram.com/p/CZW7N3ts_Uj/');

        let fb = result.formattedElements[18];
        expect(fb.type).to.eq('embed');
        expect(fb.link).to.eq(
          'https://www.facebook.com/metmuseum/posts/10158951358637635'
        );

        let tt = result.formattedElements[20];
        expect(tt.type).to.eq('embed');
        expect(tt.link).to.eq(
          'https://www.tiktok.com/@metmuseum/video/7055762098449861935'
        );

        let spotify = result.formattedElements[24];
        expect(spotify.type).to.eq('embed');
        expect(spotify.link).to.eq(
          'https://open.spotify.com/playlist/37i9dQZF1EQnqst5TRi17F?si=6800f9f9f78048ff'
        );

        let vimeo = result.formattedElements[26];
        expect(vimeo.type).to.eq('embed');
        expect(vimeo.link).to.eq('https://vimeo.com/661633547');

        let apple = result.formattedElements[28];
        expect(apple.type).to.eq('embed');
        expect(apple.link).to.eq(
          'https://podcasts.apple.com/us/podcast/we-need-to-talk-about-covid-part-2-a-conversation/id1200361736?i=1000549512881'
        );
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

    it('formats image nodes', () => {
      elements = [
        {
          endIndex: 1,
          sectionBreak: {
            sectionStyle: {
              sectionType: 'CONTINUOUS',
              contentDirection: 'LEFT_TO_RIGHT',
              columnSeparatorStyle: 'NONE',
            },
          },
        },
        {
          endIndex: 60,
          paragraph: {
            elements: [
              {
                textRun: {
                  content: 'This sentence has a word in ',
                  textStyle: {},
                },
                endIndex: 29,
                startIndex: 1,
              },
              {
                endIndex: 33,
                textRun: {
                  textStyle: {
                    bold: true,
                  },
                  content: 'bold',
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
                endIndex: 41,
                textRun: {
                  textStyle: {
                    italic: true,
                  },
                  content: 'italic',
                },
                startIndex: 35,
              },
              {
                startIndex: 41,
                textRun: {
                  textStyle: {},
                  content: ', and ',
                },
                endIndex: 47,
              },
              {
                textRun: {
                  textStyle: {
                    underline: true,
                  },
                  content: 'underlined',
                },
                endIndex: 57,
                startIndex: 47,
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
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
          startIndex: 1,
        },
        {
          startIndex: 60,
          endIndex: 61,
          paragraph: {
            elements: [
              {
                endIndex: 61,
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 60,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          startIndex: 61,
          endIndex: 137,
          paragraph: {
            elements: [
              {
                endIndex: 88,
                textRun: {
                  content: 'This sentence has a single ',
                  textStyle: {},
                },
                startIndex: 61,
              },
              {
                endIndex: 92,
                textRun: {
                  textStyle: {
                    underline: true,
                    foregroundColor: {
                      color: {
                        rgbColor: {
                          blue: 0.8,
                          red: 0.06666667,
                          green: 0.33333334,
                        },
                      },
                    },
                    link: {
                      url: 'https://tinynewsco.org',
                    },
                  },
                  content: 'word',
                },
                startIndex: 88,
              },
              {
                endIndex: 137,
                textRun: {
                  content: ' linked to the tinynewsco website homepage. \n',
                  textStyle: {},
                },
                startIndex: 92,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          startIndex: 137,
          endIndex: 138,
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 137,
                endIndex: 138,
              },
            ],
          },
        },
        {
          paragraph: {
            elements: [
              {
                textRun: {
                  content: 'list item 1\n',
                  textStyle: {},
                },
                endIndex: 150,
                startIndex: 138,
              },
            ],
            paragraphStyle: {
              indentStart: {
                magnitude: 36,
                unit: 'PT',
              },
              direction: 'LEFT_TO_RIGHT',
              indentFirstLine: {
                unit: 'PT',
                magnitude: 18,
              },
              namedStyleType: 'NORMAL_TEXT',
            },
            bullet: {
              textStyle: {
                underline: false,
              },
              listId: 'kix.qqyukljg8mnr',
            },
          },
          startIndex: 138,
          endIndex: 150,
        },
        {
          paragraph: {
            elements: [
              {
                endIndex: 162,
                startIndex: 150,
                textRun: {
                  content: 'list item 2\n',
                  textStyle: {},
                },
              },
            ],
            bullet: {
              listId: 'kix.qqyukljg8mnr',
              textStyle: {
                underline: false,
              },
            },
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              indentStart: {
                magnitude: 36,
                unit: 'PT',
              },
              indentFirstLine: {
                magnitude: 18,
                unit: 'PT',
              },
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          endIndex: 162,
          startIndex: 150,
        },
        {
          endIndex: 177,
          startIndex: 162,
          paragraph: {
            elements: [
              {
                textRun: {
                  content: 'Heading Size 1\n',
                  textStyle: {},
                },
                endIndex: 177,
                startIndex: 162,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              headingId: 'h.t40hwwqf2an0',
              namedStyleType: 'HEADING_1',
            },
          },
        },
        {
          startIndex: 177,
          endIndex: 187,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 187,
                textRun: {
                  content: 'paragraph\n',
                  textStyle: {},
                },
                startIndex: 177,
              },
            ],
          },
        },
        {
          endIndex: 202,
          paragraph: {
            elements: [
              {
                startIndex: 187,
                endIndex: 202,
                textRun: {
                  textStyle: {},
                  content: 'Heading Size 2\n',
                },
              },
            ],
            paragraphStyle: {
              namedStyleType: 'HEADING_2',
              direction: 'LEFT_TO_RIGHT',
              headingId: 'h.zdu1t9xjbq6s',
            },
          },
          startIndex: 187,
        },
        {
          endIndex: 212,
          startIndex: 202,
          paragraph: {
            elements: [
              {
                endIndex: 212,
                textRun: {
                  textStyle: {},
                  content: 'paragraph\n',
                },
                startIndex: 202,
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
        },
        {
          endIndex: 213,
          startIndex: 212,
          paragraph: {
            elements: [
              {
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 212,
                endIndex: 213,
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
        },
        {
          startIndex: 213,
          endIndex: 249,
          paragraph: {
            elements: [
              {
                startIndex: 213,
                textRun: {
                  content: 'https://forms.gle/413sboQBCkw4p1PW6',
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
                      url: 'https://forms.gle/413sboQBCkw4p1PW6',
                    },
                    underline: true,
                  },
                },
                endIndex: 248,
              },
              {
                endIndex: 249,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
                startIndex: 248,
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
        },
        {
          endIndex: 250,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                startIndex: 249,
                endIndex: 250,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
              },
            ],
          },
          startIndex: 249,
        },
        {
          startIndex: 250,
          endIndex: 252,
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                startIndex: 250,
                inlineObjectElement: {
                  textStyle: {},
                  inlineObjectId: 'kix.al6se8yfh2hr',
                },
                endIndex: 251,
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
        },
        {
          endIndex: 254,
          paragraph: {
            elements: [
              {
                inlineObjectElement: {
                  textStyle: {},
                  inlineObjectId: 'kix.wr6s7brrno1m',
                },
                endIndex: 253,
                startIndex: 252,
              },
              {
                endIndex: 254,
                startIndex: 253,
                textRun: {
                  textStyle: {},
                  content: '\n',
                },
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          startIndex: 252,
        },
      ];
      listInfo = { 'kix.qqyukljg8mnr': 'BULLET' };
      imageList = {
        'kix.wr6s7brrno1m':
          'https://assets.tinynewsco.org/oaklyn/cypress-test-doc/imagekix.wr6s7brrno1m.png',
      };
      inlineObjects = {
        'kix.wr6s7brrno1m': {
          inlineObjectProperties: {
            embeddedObject: {
              marginTop: { magnitude: 9, unit: 'PT' },
              size: {
                height: { unit: 'PT', magnitude: 565 },
                width: { unit: 'PT', magnitude: 468 },
              },
              marginRight: { magnitude: 9, unit: 'PT' },
              embeddedObjectBorder: {
                width: { unit: 'PT' },
                color: { color: { rgbColor: {} } },
                propertyState: 'NOT_RENDERED',
                dashStyle: 'SOLID',
              },
              marginLeft: { magnitude: 9, unit: 'PT' },
              imageProperties: {
                contentUri:
                  'https://lh6.googleusercontent.com/JP5ZiNvFX5lNOTGXft_CafIyGEtGDPE0MIjNFY9EBwad-hD9WzBN5n1aQ54Hrt0gBqLR0uVJW0_sP8N89sxJ42gJuslj7USCOAOhbCule4TGNHwen0HvWpOHuAuy-d5prEODJ9scUqMnoDAuBw',
                cropProperties: {},
              },
              marginBottom: { unit: 'PT', magnitude: 9 },
            },
          },
          objectId: 'kix.wr6s7brrno1m',
        },
      };

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
        let el = result.formattedElements[result.formattedElements.length - 2];
        expect(el.type).to.eq('image');
        expect(el.children[0].imageId).to.eq('kix.wr6s7brrno1m');
        expect(el.children[0].height).to.eq(640);
        expect(el.children[0].width).to.eq(480);
        expect(el.children[0].imageUrl).to.eq(
          'https://assets.tinynewsco.org/oaklyn-test/category-slug/article-slug/imagekix123.png'
        );
      });
    });

    it('handles specially formatted text', () => {
      elements = [
        {
          paragraph: {
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
            elements: [
              {
                endIndex: 213,
                startIndex: 212,
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
              },
            ],
          },
          endIndex: 213,
          startIndex: 212,
        },
        {
          endIndex: 226,
          startIndex: 213,
          paragraph: {
            elements: [
              {
                endIndex: 226,
                startIndex: 213,
                textRun: {
                  textStyle: {},
                  content: 'FORMAT START\n',
                },
              },
            ],
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
          },
        },
        {
          endIndex: 241,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                endIndex: 241,
                textRun: {
                  textStyle: {},
                  content: 'some lines of \n',
                },
                startIndex: 226,
              },
            ],
          },
          startIndex: 226,
        },
        {
          startIndex: 241,
          paragraph: {
            elements: [
              {
                endIndex: 256,
                textRun: {
                  content: '        poetry\n',
                  textStyle: {},
                },
                startIndex: 241,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          endIndex: 256,
        },
        {
          endIndex: 270,
          paragraph: {
            elements: [
              {
                endIndex: 270,
                textRun: {
                  content: 'should appear\n',
                  textStyle: {},
                },
                startIndex: 256,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          startIndex: 256,
        },
        {
          startIndex: 270,
          endIndex: 279,
          paragraph: {
            elements: [
              {
                endIndex: 279,
                textRun: {
                  content: ' – here.\n',
                  textStyle: {},
                },
                startIndex: 270,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
        },
        {
          endIndex: 290,
          paragraph: {
            paragraphStyle: {
              namedStyleType: 'NORMAL_TEXT',
              direction: 'LEFT_TO_RIGHT',
            },
            elements: [
              {
                startIndex: 279,
                textRun: {
                  content: 'FORMAT END\n',
                  textStyle: {},
                },
                endIndex: 290,
              },
            ],
          },
          startIndex: 279,
        },
        {
          startIndex: 290,
          paragraph: {
            elements: [
              {
                textRun: {
                  content: '\n',
                  textStyle: {},
                },
                startIndex: 290,
                endIndex: 291,
              },
            ],
            paragraphStyle: {
              direction: 'LEFT_TO_RIGHT',
              namedStyleType: 'NORMAL_TEXT',
            },
          },
          endIndex: 291,
        },
      ];

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
        // for (let l = 0; l < result.formattedElements.length; l++) {
        //   let el = result.formattedElements[l];
        //   cy.log(JSON.stringify(el));
        // }

        // example doc elements had 4 lines of poetry between the two FORMAT START & END markers
        const specialEls = result.formattedElements.filter(
          (el) => el.style === 'FORMATTED_TEXT'
        );
        expect(specialEls).to.have.length(4);
      });
    });
  });
});
