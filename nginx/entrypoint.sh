#!/bin/bash
sed -i 's/FRONTEND_SERVER/'"$FRONTEND_SERVER"'/g' /etc/nginx/nginx.conf
nginx -g "daemon off;"
