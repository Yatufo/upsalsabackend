#!/bin/bash

# to export the data the command mongoexport should be used like the next example
# mongoexport -h localhost:27017 -c categories -d upsalsa
COL_BLUE="\x1b[34;01m"
COL_RESET="\x1b[39;49;00m"
echo "######################################################################"
echo -e $COL_BLUE"IMPORTANT Message: "$COL_RESET"Press ENTER when the DATABASE is READY to import"
echo "######################################################################"
read -p "" -n1 -s

echo "START Importing"


echo "Importing categories: "
mongoimport -h localhost:27017 -c categories --file init/categories.json

echo "Importing locations: "
node init/LocationsImportFromCSV.js

echo "FINISHED Importing"


# mongoimport -h ds031641.mongolab.com:31641 -c categories -d heroku_app31647259 --file routes/init/categories.json -u admin -p
# mongoimport -h ds031641.mongolab.com:31641 -c locations -d heroku_app31647259 --file routes/init/locations.json -u admin -p
