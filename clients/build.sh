npm run build

docker build -t ashmann7/etvclient .

docker push ashmann7/etvclient

ssh ec2-user@ec2-52-204-51-45.compute-1.amazonaws.com < deploy.sh