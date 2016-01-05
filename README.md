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
-H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Vwc2Fsc2EuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTUzMTI3ODA4MjEzMDIxIiwiYXVkIjoiek5oWTV3ZXNXbzhpVk1zZFJZYk02VlZYemVNanRzMHgiLCJleHAiOjE0NTIwNjQwNzIsImlhdCI6MTQ1MjAyODA3Mn0.y71Wn9JKWwOcJWexzTVkli-0v7spAmVLOldLL6jJhaY' \
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

### Delete location

```
curl -i -v -X DELETE 'http://salsa.local:6666/api/locations/568c36d5542281c61092a91b' \
-H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Vwc2Fsc2EuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTUzMTI3ODA4MjEzMDIxIiwiYXVkIjoiek5oWTV3ZXNXbzhpVk1zZFJZYk02VlZYemVNanRzMHgiLCJleHAiOjE0NTIwNjQwNzIsImlhdCI6MTQ1MjAyODA3Mn0.y71Wn9JKWwOcJWexzTVkli-0v7spAmVLOldLL6jJhaY'
```
