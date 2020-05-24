docker build -t ashmann7/eradicatethevapedb .

docker push ashmann7/eradicatethevapedb

ssh ec2-user@ec2-54-82-153-19.compute-1.amazonaws.com < deploy.sh

