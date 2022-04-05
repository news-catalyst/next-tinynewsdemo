This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This app runs the front-end published sites for all tiny news organizations, using a single multi-tenant "platforms" project in Vercel, with data served through a GraphQL API from Hasura, along with a dynamic TinyCMS for organization-specific site configuration.

## Getting Started

**Step 0**

We use [git-flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) to make processes around feature development, staging deployment, stable production releases, and production hotfixes easier. You're likely on a Mac, in which case you can use [Homebrew](https://brew.sh/) to set it up easily:

```bash
brew install git-flow
```

See the note at the end of this README for how to work with git-flow.

**Step 1**

Clone this project:

```bash
git clone git@github.com:news-catalyst/next-tinynewsdemo.git
```

**Step 2**

Change into the project directory:

```bash
cd next-tinynewsdemo
```

**Step 3**

Install dependencies:

```bash
npm install
```

**Step 4**

Set up an environment file for global settings:

We store our global environment settings in a separate private repo on GitHub. Copy [the file `.env.local`](https://github.com/news-catalyst/tnc-org-envs/blob/main/.env.local) to a file in this project's directory called `.env.local`. Any values that differ between the tiny news orgs are found in the `settings` database table in Hasura.

For development on your laptop, you'll want to make sure you're pointing at the **staging** database, which is called heroic-snapper, because that's the random name Hasura gave us for that stack and I missed the chance to rename it.

**Step 5**

Run the site in development mode: `npm run dev`

To build the site and serve from the static files:

```bash
npm run build && npm run start
```

**Step 6**

Open [http://next-tinynewsdemo.localhost:3000](http://next-tinynewsdemo.localhost:3000) with your browser.

We switch between the different organizations' websites by changing the subdomain on localhost. "next-tinynewsdemo" is the testing "Oaklyn Observer" news organization subdomain.

## Bootstrap a new org

The [latest instructions on how to launch a new organisation are in a Google Doc](https://docs.google.com/document/d/1sSvtRTYkk2PoixMrWPT3FSM6qO_5zseqdCXv4LmP7Rc/edit?usp=sharing) and subject to change; please reference that for info.

## Generate WXR

Once you have the latest code, make sure you install dependencies for the WXR generator module - do this if you run into a babel-related error:

```
cd node_modules/wxr-generator
npm install
```

This might instruct you to install babel command line tools; I did this, then switched back to the top directory and was able to run the generator without a problem.

Then change back to the top-level directory. Make sure you have the site you'd like to export running locally. To generate for a different site, `script/switch $orgSlug` to change your current `.env.local`, then start up the site.

Finally, execute `npm run wordpress` to generate the WXR file for each locale.

To test using [Local WordPress](https://localwp.com/):

- generate the WXR files (`npm run wordpress`)
- start up your local WP site
- open the WP Admin
- navigate to Tools > Import > WordPress "Run Importer" > Browse for the WXR XML file
- map existing authors to incoming authors, if prompted
- review Media Library
- review All Posts

## Run tests

In one terminal window, run `npm run dev:test` to start up the local front-end app in test mode. This will start the server using the appropriate hasura API url and test organization slug.

In another terminal window, run `npm run cypress:open` to open the cypress test runner window, which will then let you run one or all test files.

## Setup the test environment

Run these where you have the Hasura repo checked out:

```
hasura migrate create init --sql-from-server --admin-secret $PRODUCTION_ADMIN_SECRET
hasura migrate apply --endpoint $TESTING_HASURA_API_ENDPOINT --admin-secret $TESTING_ADMIN_SECRET --version $VERSION_GENERATED_FROM_ABOVE_COMMAND --database-name default
hasura metadata export --admin-secret $PRODUCTION_ADMIN_SECRET
hasura metadata apply --endpoint $TESTING_HASURA_API_ENDPOINT --admin-secret $TESTING_ADMIN_SECRET
```

If you have to repopulate the testing database with the basic data required for the webhook to work, run the following command from where you have this repo checked out:

```
yarn bootstrap:tests -n "Test Org" -s test-org -l en-US
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Git Flow

To start working on a new feature:

```bash
git flow feature start feature_branch_name
```

Example: `git flow feature start tinycms-auth`

Make your code commits as usual. When the changes are ready for review and you want to open a PR:

```bash
git flow feature publish feature_branch_name
```

Then open a PR as usual on GitHub.

To start a release (for production):

```bash
git flow release start 0.1.1
```

Then write up some quick release notes in CHANGELOG.md for the new version number and commit the changes.

To finish the release:

```bash
git flow release finish '0.1.1'
```

If you have to fix something in production ASAP, and the main branch has changes that aren't ready to go live, you'll want to do a **hotfix**:

```bash
git flow hotfix start hotfix_branch_name
```

Example: `git flow hotfix start fix-this-nasty-bug`

Code away, fix the bug, commit the changes, and then:

```bash
git flow hotfix finish hotfix_branch_name
```

For help, type: `git flow` for a list of topics; `git flow feature help` for example will provide info on subcommands available around feature branches.
