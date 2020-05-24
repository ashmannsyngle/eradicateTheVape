docker rm -f redisServer

docker run -d \
--network customNetwork \
-p 6379:6379 \
--name redisServer \
redis

exit