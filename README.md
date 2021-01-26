<h1 align="center">Online Whiteboard - Realtime Drawing</h1>

<p align="center">

<img src="https://img.shields.io/github/checks-status/capcatd/online_whiteboard/master?label=build">

<img src="https://img.shields.io/github/commit-activity/w/capcatd/online_whiteboard">

<img src="https://img.shields.io/github/repo-size/capcatd/online_whiteboard">

<img src="https://img.shields.io/github/license/capcatd/online_whiteboard">

</p>

<h2 align="center"><a  href="http://67.207.76.234">Live Demo</a></h2>

## Description

<p align="center">
  <img src="./demo.gif" width="90%">
</p>
Online whiteboard app that makes drawing, collaboration and sharing easy.

## How to use

### [DESKTOP, MOBILE]:

- Click (tap) and **move** mouse for drawing picture
- Choose brush color and width on toolbar block
- Click **Clear** button to delete all pictures from board
- Click **Share** button to generate link that you can share to friends and draw pictures together

## About the project.

### Frontend

- It's built with `React.js`, `Next.js(SSR, routes)` and `Redux(client storage)`
- Draw is implemented with default HTML5 tag - `<canvas>`
- All your pictures are stored as arrays of points. This approach uses less memory than built-in canvas functions

### Backend -> REST API server

- It's built with `Python 3.7`, micro-framework `Flask` and `PostgreSQL` as data storage
- The written code complies with the `PEP8` specification
- API has scalable structure where each folder is responsible for it's own part of the application logic
- I used `PostgreSQL` as Database because it allow to store JSON-data
- Made unit-tests with python library `pytest`. They are stored here: `/backend/api/tests`

### Backend -> Websockets server

- It's built with `Python 3.7` and `websockets` library
- The written code complies with the `PEP8` specification
- It has rooms that divide connected clients by `board_url` into groups
- It has validation for receiving messages that reject messages with invalid structure

### DevOps

- I used `Docker` to build a microservice application
- List of microservices you can see in file `docker-compose.prod.yml`
- I used `Kubernetes` to deploy production version (all configs you can see in `/k8s`)
- I used `pre-commit` to format python code and check it for mistakes

## Project setup

Run project (development):

```
docker-compose -f docker-compose.prod.yml -f docker-compose.dev.yml up --build
```

Run project (production):

```
# create secret key
python -c 'import os; print(os.urandom(24).hex())'

# setup environment variables
cp .env.example .env
nano .env

docker-compose -f docker-compose.prod.yml up --build
```

Run REST API tests (if container is up):

```
docker-compose -f docker-compose.prod.yml -f docker-compose.dev.yml exec api pytest
```

Run REST API tests (if container is down):

```
cd backend/api
pytest
```
