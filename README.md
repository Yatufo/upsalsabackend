#### Install 3rd party Software
* [MondoDB](https://www.mongodb.org/)
* [Node](https://nodejs.org/en/download/)

#### Install dependencies.

From the root folder:

```npm install```

This will also resolve the client dependencies and do other setup tasks, check package.json.



#### Initialize the database.

Define your mongo database url connection:

```
export MONGO_CONNECTION=mongodb://api:api@ds053794.mongolab.com:53794/upsalsa-dev
```
or
```
export MONGO_CONNECTION=mongodb://localhost:27017
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

docker build -t upsalsa/upsalsa-api .

To run in develop the only thing that changes is the db

```
docker run -d --name upsalsa-api
-e "DEPLOY_ENVIRONMENT=prod"
 -e "MONGO_CONNECTION=$MONGO_CONNECTION"
 -p 3002:5000 upsalsa/upsalsa-api
```
