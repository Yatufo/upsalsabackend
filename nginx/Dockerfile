FROM nginx
MAINTAINER Alex <alex@upsalsa.com>

RUN apt-get update && apt-get install -y nano htop git nginx
COPY nginx.conf     /etc/nginx/nginx.conf
COPY entrypoint.sh  /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
