docker rm -f threads

docker pull ashmann7/threads

docker run -d \
--network customNetwork \
-p 5300:5300 \
-e DSN="root:password@tcp(db:3306)/db" \
-e ADDR=":5300" \
--name threads \
ashmann7/threads

exit

