GOOS=linux go build

docker build -t ashmann7/etvgateway .

go clean

docker push ashmann7/etvgateway

ssh ec2-user@ec2-54-172-17-114.compute-1.amazonaws.com < deploy.sh