# ft_transcendance
a 42 school fullstack project

# Description

# Run

Run together: `docker-compose up`
Run and build together: `docker-compose up --build`

Run separatly:
To run the frontend:    `docker-compose up (--build) frontend`
To run the backend:     `docker-compose up (--build) backend`
To run the database:   `docker-compose up (--build) db`
To run the pgadmin:     `docker-compose up (--build) pgadmin`

# Docker
## Containers
- frontend
- backend
- database
- pgadmin

- Images name always have the form pong_<name>_img


# BACKEND
## Docker(file)
- The frontend and backend containers are based on image: `node:16.2.0-alpine3.13`

## packages

### Concurently
    With --kill-others switch, all commands are killed if one dies


# pgadmin
dockerhub: https://hub.docker.com/r/dpage/pgadmin4/
website: https://www.pgadmin.org/

<!-- REVIEW need to add packages-lock.json to .gitignore -->