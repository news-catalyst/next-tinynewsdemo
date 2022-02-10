# How to launch a copy of production Hasura

This document describes how to replicate the existing production Hasura instance - which includes the postgres database and graphql API - in another Hasura instance.

I followed along with the official Hasura documentation [Local Dev to Staging to getting Production-Ready with Hasura! 🚀](https://hasura.io/blog/moving-from-local-development-staging-production-with-hasura/).

## Steps

1. Change into the [hasura](https://github.com/news-catalyst/hasura/) repo locally and ensure you have the [hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html#install-hasura-cli) installed and working.

2. Run this command to setup the initial migration script using pg_dump as an "up" migration:

`hasura migrate create init-schema --from-server --endpoint <hasura-project-url> --admin-secret <admin-secret>`

3. Find the migration timestamp by finding the file named something similar to `1627564572630_init-schema` in the directory `migrations/default` and copying the numeric prefix.

4. Mark the new init migration as executed (without actually executing it!) in the production database to avoid it being run in the future:

`hasura migrate apply --endpoint <hasura-project-url> --admin-secret <admin-secret> --version 1627564572630 --skip-execution`

5. Run this command to make sure the latest production metadata is also exported to the filesystem:

`hasura metadata reload --endpoint <hasura-project-url> --admin-secret <admin-secret> && hasura metadata export --endpoint <hasura-project-url> --admin-secret <admin-secret>`

6. Launch a new Hasura project [on the Hasura projects list page](https://cloud.hasura.io/projects)

7. Navigate to the Data tab in Hasura and Create Heroku Database. (NOTE: as an alternative, you can launch a postgres database in AWS under RDS.)

8. This process (Hasura -> launch db -> Heroku) should fill in the necessary env vars for the instance db connectivity, specifically the `HASURA_GRAPHQL_DATABASE_URL` var.

9. Copy the webhook related vars from production Hasura and recreate in the new instance (`HASURA_GRAPHQL_AUTH_HOOK` => `https://huf7758ged.execute-api.us-east-1.amazonaws.com/prod/webhook`)

10. Also be sure to grab the GraphQL endpoint URL for the new Hasura instance

11. Run these commands to apply the migration and metadata to the new Hasura instance:

```
hasura migrate apply --version <init-version-number-from-step-3> --endpoint <new-hasura-project-url> --database-name default --admin-secret <new-admin-secret>
hasura metadata apply --endpoint <new-hasura-project-url> --admin-secret <new-admin-secret>
```

12. Check the output of the last command for any inconsistent metadata and fix any problems.

13. Use the TNC admin hasura collection in Postman to request a data-only dump from the production instance. Save the output to a file (`pg_dump_production_{todays_date}.sql`)

14. Copy the postgres connection URI and run this command from terminal:

`psql <connection-uri-string> < pg_dump_production_{todays_date}.sql`
