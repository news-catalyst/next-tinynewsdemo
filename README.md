This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This app runs the front-end published sites for all tiny news organizations, using a single multi-tenant "platforms" project in Vercel, with data served through a GraphQL API from Hasura, along with a dynamic TinyCMS for organization-specific site configuration.

## What's in here?

- **\_\_mocks\_\_**: Basic boilerplate for tests
- **\_\_tests\_\_**: All UI and Hasura API unit tests
- **.github**: Github actions for Google Analytics importing and
- **cached**: A folder for keeping cached API responses. Kept intentionally empty in version control.
- **components**: All of the reusable React components used across the next.js frontend
- **content**: Markdown-based content used on the frontend.
- **cypress**: Test infrastructure for Cypress, which runs integration tests.
- **data**: Obsolete.
- **hasura**: A git submodule controlling our Hasura instances.
- **lib**: Code that interacts with our GraphQL API and other third-party APIs, such as Letterhead.
- **pages**: Page-level components used to build the site structure in next.js
- **public**: Various static files that need to get served publicly.
- **script**: Command-line scripts used for various tasks, like bootstrapping new organizations.
- **styles**: Extra styles that don't conform well to using Tailwind.

## How this works

We based the structure of this applciation on the Vercel [platforms starter kit](https://github.com/vercel/platforms). This means we build most of the site as part of the `pages/_sites/[site]` folder. We then use `pages/_middleware.js` to route incoming requests to the correct site. See the platforms starter kit linked above for more documentation on how this works.

Within this project we also build the API endpoints for interacting with Google Docs. You can find this at `pages/api/sidebar`. The [Google Apps Script](https://github.com/news-catalyst/google-app-scripts/) project interacts with these API endpoints in order to preview, publish and unpublish documents.

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

And then initialize git-flow in your local checkout:

```bash
cd next-tinynewsdemo
git checkout stable
git flow init
```

You'll be prompted for a few settings - answer as noted here:

```
Branch name for production releases: stable
Branch name for "next release" development: main
```

Accept the default answers for all remaining questions by hitting `<enter>`:

```
How to name your supporting branch prefixes?
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
```

And you're done!

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

We store our global environment settings in a [separate private repo](https://github.com/news-catalyst/tnc-org-envs/blob/main/.env.local) on GitHub. We use [symbolic linking]('https://linuxize.com/post/how-to-create-symbolic-links-in-linux-using-the-ln-command/') so that this repo remains up-to-date with that environment variable file.

First, clone the [environment variables repo](https://github.com/news-catalyst/tnc-org-envs).

Switch to the next-tinynewsdemo repo. Then create a new linked file by running `ln -s ../tnc-org-envs/.env.local .env.local`. This will create a new file in next-tinynewsdemo called `.env.local`.

Any values that differ between the tiny news orgs are found in the `settings` database table in Hasura. For development on your laptop, you'll want to make sure you're pointing at the **staging** database, which is called heroic-snapper, because that's the random name Hasura gave us for that stack and I missed the chance to rename it.

**Step 5**

Run the site in development mode: `npm run dev`

To build the site and serve from the static files:

```bash
npm run build && npm run start
```

If you want to debug server-side code, follow [these](https://nextjs.org/docs/advanced-features/debugging#server-side-code) instructions from Next.js.

**Step 6**

Open [http://next-tinynewsdemo.localhost:3000](http://next-tinynewsdemo.localhost:3000) with your browser.

We switch between the different organizations' websites by changing the subdomain on localhost. "next-tinynewsdemo" is the testing "Oaklyn Observer" news organization subdomain.

## Bootstrap a new org

The [latest instructions on how to launch a new organisation are in a Google Doc](https://docs.google.com/document/d/1sSvtRTYkk2PoixMrWPT3FSM6qO_5zseqdCXv4LmP7Rc/edit?usp=sharing) and subject to change; please reference that for info.

## Generate WXR

**NOTE**: This code does not work since migrating to the Vercel Platforms structure.

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

## Running unit tests

This project uses Jest to for unit testing. To run all unit tests, run `npm run test`.

If you want to run all tests in a single file, use `npm run test -- <File_Name>`.

If you'd like to run a single test, use `npm run test -- <File_Name> -t <Your-Test-Name>`.

For more information, see the [Jest documentation](https://jestjs.io/docs/cli#using-with-npm-scripts).

## Running integration tests

This project uses Cypress for integration testing. To run Cypress tests, follow these steps:

1. Make sure your Add the following snippet to the end of cypress.config.js file has the code snippet below. This will ensure that Cypress can connect to your local instance.
   ```
   hosts: {
       '*.localhost': '127.0.0.1',
   },
   ```
2. In one terminal window, run `npm run dev` to start up the local front-end app.
3. In another terminal window, run `npm run cypress:open` to open the cypress test runner window, which will then let you run one or all test files.

## Setup the test environment

Run the following where you have the Hasura repo checked out:

```
hasura migrate create init -from-server --admin-secret $PRODUCTION_ADMIN_SECRET
hasura migrate apply --endpoint $TESTING_HASURA_API_ENDPOINT --admin-secret $TESTING_ADMIN_SECRET --version $VERSION_GENERATED_FROM_ABOVE_COMMAND --database-name default
hasura metadata export --admin-secret $PRODUCTION_ADMIN_SECRET
hasura metadata apply --endpoint $TESTING_HASURA_API_ENDPOINT --admin-secret $TESTING_ADMIN_SECRET
```
You can get the value of $PRODUCTION_ADMIN_SECRET by logging into hasura and copying the admin secret for the project. 

If you have to repopulate the testing database with the basic data required for the webhook to work, run the following command from where you have this repo checked out:

```
yarn bootstrap:tests -n "Test Org" -s test-org -l en-US
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Git Flow

To start working on a new feature, checkout the latest from `main` and use git flow to create the new feature branch.

```bash
git checkout main
git pull origin main
git flow feature start feature_branch_name
```

Example: `git flow feature start tinycms-auth`

Make your code commits as usual. When the changes are ready for review and you want to open a PR:

```bash
git flow feature publish feature_branch_name
```

Then open a PR as usual on GitHub.

To start a release (for production) checkout the latest from `main` and use git flow to create the new release branch:

```bash
git checkout main
git pull origin main
git flow release start 0.1.1
```

Then write up some quick release notes in CHANGELOG.md for the new version number and commit the changes.

To finish the release:

```bash
git flow release finish '0.1.1'
```

If you have to fix something in production ASAP, and the main branch has changes that aren't ready to go live, you'll want to do a **hotfix**, checkout the latest from `stable` and use git flow to create the new feature branch:

```bash
git checkout stable
git pull origin stable
git flow hotfix start hotfix_branch_name
```

Example: `git flow hotfix start fix-this-nasty-bug`

Code away, fix the bug, commit the changes, and then:

```bash
git flow hotfix finish hotfix_branch_name
```

You will then need to manually push your hotfix to the stable and main branches individually.

```
git checkout stable
git status // check that your hotfix changes are here
git push
git checkout main
git status // check that your hotfix changes are here
git push
```

For help, type: `git flow` for a list of topics; `git flow feature help` for example will provide info on subcommands available around feature branches. [This](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) page may also be useful for understanding GitFlow under the hood.
