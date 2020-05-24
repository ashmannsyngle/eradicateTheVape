docker rm -f db

docker pull ashmann7/etvdb

docker run -d \
--network customNetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 3306:3306 \
--name db \
-e MYSQL_ROOT_PASSWORD="password" \
-e MYSQL_DATABASE=db \
ashmann7/etvdb:latest

exit

