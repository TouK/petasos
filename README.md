# Petasos

New, better frontend for [Hermes](https://github.com/allegro/hermes) message broker.

## Run locally

Petasos calls Hermes Management API. You can install Hermes locally by following the [docs](https://hermes-pubsub.readthedocs.io) 
or on the Kubernetes cluster with [Helm chart](https://artifacthub.io/packages/helm/touk/hermes).

Set up the environmental variables:
 - `HERMES_MANAGEMENT_DEFAULT`: URL to the Hermes Management API
 - `HERMES_FRONTEND_DEFAULT`: URL to the Hermes Frontend API
 
Then run:
```
npm ci
npm start
```

Application will be available at [localhost:7890](http://localhost:7890)

## Advanced settings

In the production mode, it is also possible to build the Hermes Management and Frontend modules 
URLs based on the current URL. In order to do so, the following environmental variables should be defined:
 - `HERMES_DOMAIN_PATTERN`: URL will be matched against this regular expression
 - `HERMES_DOMAIN_MATCH_GROUP_ID`: id of the capturing group which will be used to construct the URLs (`prefix`)
 - `HERMES_MANAGEMENT_ENDING`: used to build the Hermes Management URL `{prefix}-{HERMES_MANAGEMENT_ENDING}`
 - `HERMES_FRONTEND_ENDING`: used to build the Hermes Frontend URL `{prefix}-{HERMES_FRONTEND_ENDING}`

If any of the variables is not defined, or the regex match fails, URLs fall back to the 
`HERMES_MANAGEMENT_DEFAULT` and `HERMES_FRONTEND_DEFAULT` values.
