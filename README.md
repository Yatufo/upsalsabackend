#### Install 3rd party Software
* [Docker](https://www.docker.com/)
* [Node](https://nodejs.org/en/download/)

#### Install dependencies.

From the root folder:

```npm install```

This will also resolve the client dependencies and do other setup tasks, check package.json.
It will start the mongo docker container.


[OPTIONAL] Define your mongo database url connection:

```
export MONGO_CONNECTION=mongodb://api:api@ds053794.mongolab.com:53794/upsalsa-dev
```


Start initialization

```./run.sh init``` only initializes the *localhost:27017* dev database

This will import the necessary data to the DEVELOPMENT database.

#### Start the Server.

```npm start```

By default everything runs in DEVELOPMENT mode, if you want to have PRODUCTION setup change the

```export DEPLOY_ENVIRONMENT=prod``` or ```export DEPLOY_ENVIRONMENT=dev``` respectively


#### Docker

To create the docker image:

```
docker build -t upsalsa/upsalsa-api .
docker build -t upsalsa/nginx       ./nginx/
```

To run in develop the only thing that changes is the db

#### Using the api

```
curl -i -v -X POST 'http://salsa.local:3002/api/locations' \
-H "Content-Type: application/json" \
-H 'Cookie: __atssc=facebook%3B1; _gat=1; _ga=GA1.2.1315962730.1446769217; __atuvc=7%7C46%2C13%7C47%2C2%7C48%2C8%7C49; __atuvs=56677ebae985d91a005' \
-d '{
  "id": "bailacongustomontreal",
  "name": "Baila Con Gusto",
  "address": "9 Ste-Catherine Est (coin St-Laurent), 2e, Montreal, Quebec",
  "url": "https://www.facebook.com/bailacongustomontreal",
  "phone": "5144393990",
  "coordinates": {
    "latitude": 45.51002356779,
    "longitude": -73.563711227797
  }
}'
```
