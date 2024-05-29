# remitano-test
# Overview
  - This project is user was logined and share a Youtube Url and another user will receive this URL was shared.
  - Key features:
    - Login: Login with email & password
    - Signup: create a user with email & password
    - Logout
    - Get list notifications of another users was shared
    - Have a Message when an user share a Youtube URL
    - User can input the Youtube URL and share this URL
  - Software required:
    - Node - version 18
    - Backend: 
      - Postgres - 16:3
      - Docker Compose - 3.7
      - Typeorm
      - Socket.IO
      - SWC for building source
    - Frontend:
      - React version 18
      - Socket IO Client
# Cloning source & setup build:
  - git clone https://github.com/phhoangviet/remitano-test
  - cd remitano-test/frontend and remitano-test/backend then run yarn or npm install
  - clone content in file .env.example to .env
# How to run source FE:
    - cd frontend/
    - RUN: yarn  // for install dependencies
    - RUN: yarn start
    // Note: FE must run on port 3000
# How to run source BE without Docker:
 -  Run this CMD to run Database docker:
    - docker volume create postgres_data
    - docker run --network=backend --name postgres_container -e POSTGRES_PASSWORD=admin -d -p 5432:5432 -v postgres_data_1:/var/lib/postgresql/data postgres
    - Update env file in backend  with value
      - POSTGRES_USER = postgres
      - POSTGRES_PASSWORD = admin
      - POSTGRES_HOST = localhost
      - POSTGRES_PORT = 5432
      - POSTGRES_DATABASE = postgres
  - Run backend source
    - cd to backend folder
    - RUN: yarn dev
# How to run source BE with Docker for Backend:
    - cd to remitano-test/ which locate the docker-compose.yml
    # run backend server via Docker. ONLY Allow CORS for localhost:3000
    - Run: docker-compose up -d