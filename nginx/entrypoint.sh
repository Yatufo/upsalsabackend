#!/bin/bash
sed -i 's/FRONTEND_SERVER/'"$FRONTEND_SERVER"'/g' /etc/nginx/nginx.conf
sed -i 's/PRERENDER_TOKEN/'"$PRERENDER_TOKEN"'/g' /etc/nginx/nginx.conf
echo "sleeping while the dependencies load https://github.com/docker/compose/issues/374"
sleep 15;
nginx -g "daemon off;"
