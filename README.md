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


### Create location

```
curl -i -v -X POST 'http://salsa.local:6666/api/locations' \
-H "Content-Type: application/json" \
-H 'Authorization: Bearer {{token}}' \
-d '{
  "id": "mounayasalsa",
  "name": "Mounaya Salsa",
  "address": "7474 St-Hubert, Montreal, Quebec",
  "url": "https://www.facebook.com/Mounaya-Salsa-456106474457520/",
  "phone": "4388753767",
  "coordinates": {
    "latitude": 45.542519,
    "longitude": -73.617538
  }
}'
```
### Update location

```
curl -i -v -X PUT 'http://salsa.local:6666/api/locations/568c3f24f9479d11176fa6b0' \
-H "Content-Type: application/json" \
-H 'Authorization: Bearer {{token}}' \
-d '{
  "id": "id",
  "name": "name",
  "address": "address",
  "url": "url",
  "phone": "phone",
  "coordinates": {
    "latitude": 0,
    "longitude": 1
  }
}'
```
### Delete location

```
curl -i -v -X DELETE 'http://salsa.local:6666/api/locations/568c36d5542281c61092a91b' \
-H 'Authorization: Bearer {{token}}'
```


### Create Event

```
curl 'http://salsa.local:6666/api/events' \
-H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json;charset=UTF-8' \
--data-binary '{
  "location": {
    "id": "airdetango",
    "name": "Air de tango",
    "address": "4324 St Laurent 2nd floor, Montreal, QC H2W 1Z3 ",
    "url": "http://airdetango.com/",
    "phone": "5142788781",
    "coordinates": {
      "latitude": 45.519077,
      "longitude": -73.584084
    }
  },
  "description": "#advanced asdfas",
  "categories": ["advanced"],
  "images": [],
  "imageUrl": "images/w640-h400-cscale/images/locations/montreal.jpg",
  "start": {
    "dateTime": "2016-01-23T19:00:00.000Z"
  },
  "recurrence": {
    "rule": "FREQ=DAILY;COUNT=2;BYDAY=TU,WE;DTSTART=20160123T190000Z"
  },
  "end": {
    "dateTime": "2016-01-23T20:00:00.000Z"
  },
  "name": "asdfasdfa"
}'
```
