# remitano-test

# backend

docker volume create postgres_data

docker run --name postgres_container -e POSTGRES_PASSWORD=admin -d -p 5432:5432 -v postgres_data:/var/lib/postgresql/data postgres