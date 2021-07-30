# ft_transcendance
a 42 school fullstack project

# Description

# Run

Run together: `docker-compose up`
Build and run together: `docker-compose up --build`

Run separatly:
To run the frontend:    `docker-compose up (--build) frontend`
To run the backend:     `docker-compose up (--build) backend`
To run the database:   `docker-compose up (--build) db`
To run the pgadmin:     `docker-compose up (--build) pgadmin`

To have node_modules in local run: 
    `docker cp pong_front_cnt:/app/node_modules/ ./frontend/srcs/`
    `docker cp pong_back_cnt:/app/node_modules/ ./backend/srcs/`

# Docker
## Containers
- pong_front_cnt
- pong+back_cnt
- pong_db_cnt
- pong_pgadmin_cnt



# BACKEND
## Docker(file)
- The frontend and backend containers are based on image: `node:16.2.0-alpine3.13`

## packages
- typeorm-seeding: `https://github.com/w3tecch/typeorm-seeding`

### Concurently
    With --kill-others switch, all commands are killed if one dies

## Scripts

- seed:run   
# pgadmin
dockerhub: https://hub.docker.com/r/dpage/pgadmin4/
website: https://www.pgadmin.org/
