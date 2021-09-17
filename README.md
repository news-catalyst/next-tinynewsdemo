This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

**Step 1**

Clone this project:

```bash
git clone git@github.com:news-catalyst/next-tinynewsdemo.git
```

**Step 2**

CD into the project:

```bash
cd next-tinynewsdemo
```

**Step 3**

Install dependencies:

```bash
yarn
```

**Step 4**

To start up a new tiny news org, set up an environment file (see below) then bootstrap the initial content with `yarn bootstrap`.

**Step 5 - Pre-Start Notes**

Regular start ups, especially in dev, see the following...

Clear out any old cache files, rebuild the cache and run the development server:

```bash
yarn clear && yarn populate && yarn dev
```

**Step 6**

To build the site and serve from the static files:

```bash
yarn clear && yarn populate && yarn build && yarn start
```

**Step 7**

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

Copy the file `.env.local-template` to a file called `.env.local` and fill in all of the environment variables.

To switch between environments - aka, tiny news organizations - use the `script/switch` command:

```
$ script/switch $name
$ script/switch oaklyn
```

Note: these commands expect `.env.local-$name` to exist in order to work.

## Bootstrap a new org

The [latest instructions on how to launch a new organisation are in a Google Doc](https://docs.google.com/document/d/1sSvtRTYkk2PoixMrWPT3FSM6qO_5zseqdCXv4LmP7Rc/edit?usp=sharing) and subject to change; please reference that for info.

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
