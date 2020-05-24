docker rm -f accountsdb

docker pull ashmann7/accountsdb

docker run -d \
--network customNetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 3306:3306 \
--name accountsdb \
-e MYSQL_ROOT_PASSWORD="password" \
-e MYSQL_DATABASE=accountsdb \
ashmann7/accountsdb:latest

exit

