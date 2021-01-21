docker build -t ashmann7/etvdb .

docker push ashmann7/etvdb

ssh ec2-user@ec2-54-172-17-114.compute-1.amazonaws.com < deploy.sh

