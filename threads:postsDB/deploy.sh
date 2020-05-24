docker rm -f postsdb

docker pull ashmann7/postsdb

docker run -d \
--network customNetwork \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 3306:3306 \
--name postsdb \
-e MYSQL_ROOT_PASSWORD="password" \
-e MYSQL_DATABASE=postsdb \
ashmann7/postsdb:latest

exit

