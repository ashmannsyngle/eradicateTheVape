docker rm -f promarketdb

docker pull ashmann7/promarketdb

docker run -d \
--network customNetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 3306:3306 \
--name promarketdb \
-e MYSQL_ROOT_PASSWORD="password" \
-e MYSQL_DATABASE=promarketdb \
ashmann7/promarketdb:latest

exit

