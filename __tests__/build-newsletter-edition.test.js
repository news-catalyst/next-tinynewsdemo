import { saveNewsletterEditions } from '/Users/pilardeharo/TNC_Code/next-tinynewsdemo/script/build-newsletter-editions.js';
import {getNewsletterEditions} from '/Users/pilardeharo/TNC_Code/next-tinynewsdemo/script/build-newsletter-editions.js'

describe('build-newsletter-editions', () => {
  it('logs published newsletters in saveNewsletterEditions', async () => {
    debugger;
    // Arrange: setup your test, variables, mocks, etc.
    let organizationId = '';
    let letterheadData = '';


    // TODO: mock the graphQL API call

    // Act: perform the action that you're testing
   await saveNewsletterEditions(organizationId, letterheadData);
    // Assert: verify it worked as expected
    expect(true).toEqual(true);
  });
});