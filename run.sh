#!/bin/bash

initialize() {
  ./init/init.sh
}
COL_BLUE="\x1b[34;01m"
COL_RESET="\x1b[39;49;00m"

start() {
   if [ "$DEPLOY_ENVIRONMENT" = "prod" ]
   then
     echo "######################################################################"
     echo -e $COL_BLUE"Starting the server in PRODUCTION mode"$COL_RESET""
     echo "######################################################################"
     node server.js
   else
     echo "######################################################################"
     echo -e $COL_BLUE"Starting the server in DEVELOPMENT mode"$COL_RESET""
     echo "######################################################################"
     nodemon server.js
   fi
}

stop() {
    pkill -f "nodemon server.js"
    pkill -f "grunt watch"
    pkill -f "docker stop backend_mongo"
}

case "$1" in
    "")      start ;;
    start)   start ;;
    stop)    stop ;;
    init)    initialize ;;
    restart) stop; start ;;
    *) echo "usage: $0 start|stop|restart" >&2
       exit 1
       ;;
esac
