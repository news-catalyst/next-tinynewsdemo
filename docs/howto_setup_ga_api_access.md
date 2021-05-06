# how to setup GA API access

1. enable the analytics api in the project we're using for the sidebar and google drive api config (webiny sidebar publishing, see script/credentials.json for info): https://console.cloud.google.com/flows/enableapi?apiid=analytics&credential=client_key
2. [click through credentials](https://console.cloud.google.com/apis/credentials?project=webiny-sidebar-publishing), choose to use existing project credentials (as in the email & private key in credentials.json)
3. [add a user to GA account](https://analytics.google.com/analytics/web/#/a166777432p271440392/admin/suiteusermanagement/account) using the service account email from credentials.json - make sure to give it edit, collaborate and read & analyze permissions
4. add the analytics scopes to the script (bootstrap.js): 
  ```
  ["https://www.googleapis.com/auth/analytics", "https://www.googleapis.com/auth/analytics.edit"]
  ```
5. add the overall GA Account ID to the env: `GA_ACCOUNT_ID=XX`
6. run ` yarn bootstrap -e EMAIL -l en-US -n "The ORG NAME" -s SLUG -u https://DOMAIN.vercel.app` to setup the new org with GA

## setting up for GA data loading into hasura

1. enable the reporting (v4) API in the project: https://console.cloud.google.com/flows/enableapi?apiid=analyticsreporting.googleapis.com&credential=client_key
2. click through credentials: https://console.cloud.google.com/apis/credentials/wizard?api=analyticsreporting.googleapis.com&project=webiny-sidebar-publishing (choose to use the existing creds)
