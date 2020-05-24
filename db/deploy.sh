docker rm -f db

docker pull ashmann7/eradicatethevapedb

docker run -d \
--network customNetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 3306:3306 \
--name db \
-e MYSQL_ROOT_PASSWORD="password" \
-e MYSQL_DATABASE=mysqlstoredb \
ashmann7/eradicatethevapedb:latest

exit

