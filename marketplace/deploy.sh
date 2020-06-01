docker rm -f marketplace

docker pull ashmann7/marketplace

docker run -d \
--network customNetwork \
-p 5200:5200 \
-e DSN="root:password@tcp(db:3306)/db" \
-e ADDR=":5200" \
--name marketplace \
ashmann7/marketplace

exit

