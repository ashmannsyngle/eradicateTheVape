docker rm -f etvclient

docker pull ashmann7/etvclient

docker run -d \
-p 443:443 \
-p 80:80 \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
--name etvclient \
ashmann7/etvclient

exit