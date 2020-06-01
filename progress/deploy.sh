docker rm -f progress

docker pull ashmann7/progress

docker run -d \
--network customNetwork \
-p 5400:5400 \
-e DSN="root:password@tcp(db:3306)/db?parseTime=true" \
-e ADDR=":5400" \
--name progress \
ashmann7/progress

exit

