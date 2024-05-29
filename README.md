# remitano-test
    - cd remitano-test/
    # frontend

    # backend

    # run docker database
    - create network
      - docker network create -d bridge backend
    - first run if your volume existed skip this line:
      - docker volume create postgres_data
    - run container:
      - docker run --network=backend --name postgres_container -e POSTGRES_PASSWORD=admin -d -p 5432:5432 -v postgres_data_1:/var/lib/postgresql/data postgres
    - Build backend source
      - docker build -t backend-test backend/
      - docker run --network=backend --name=backend  --env-file ./backend/.env.production -d -it -p 8080:8080 backend-test