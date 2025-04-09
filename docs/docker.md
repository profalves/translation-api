# Docker

## 📋 Table of Contents

- [Docker](#docker)
  - [Running container](#running-container)
  - [Testing the API](#testing-the-api)
  - [To use Docker Compose (optional)](#to-use-docker-compose-optional)
  - [Maintenance](#maintenance)
    - [Clean unnamed and unused images](#clean-unnamed-and-unused-images)
    - [Generate new image with name](#generate-new-image-with-name)
    - [Verification](#verification)
  - [Manage containers](#manage-containers)
  - [Troubleshooting](#troubleshooting)
    - [Port Error Handlers](#port-error-handlers)
  - [Bonus: Useful commands](#bonus-useful-commands)

Our project is containerized using Docker for consistent deployment across environments. Below is the `Dockerfile` configuration we use, optimized for Node.js applications with the latest stable Alpine-based image:

```dockerfile
# New recommended version
FROM node:20-alpine

WORKDIR /app

# Install updated npm first
RUN npm install -g npm@latest

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
```

Explanation:

- Using node:20-alpine (latest version)
- Updating npm before installing dependencies
- (Optional) Add flags `--legacy-peer-deps` and `--force` after `npm install` command to resolve conflicts

> If authentication is needed (not our case):
>
> ```dockerfile
> # Only if using private packages
> ARG NPM_TOKEN
> RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc && \
>   npm install && \
>   rm -f .npmrc
> ```

To build again:

```bash
# Clean Docker cache
docker builder prune -af

# Build new image
docker build --no-cache -t translation-api .
```

## Running container

Here's the complete step-by-step to run the container after creating the image:

1. First check available images:

```bash
docker images
```

You should see something like:

```
REPOSITORY        TAG       IMAGE ID       CREATED         SIZE
translation-api   latest    a1b2c3d4e5f6   5 minutes ago   250MB
```

2. Run basic container:

```bash
docker run -d --name translation-container -p 3000:3000 translation-api
```

> Parameter explanation:
>
> - -d: Runs in background (detached mode)
> - --name: Defines a name for the container
> - -p 3000:3000: Maps host port (first number) to container port (second number)
> - translation-api: Image name

3. Check if container is running:

```bash
docker ps
```

4. If you need to pass environment variables:

```bash
docker run -d --name translation-container \
  -p 3000:3000 \
  -e PORT=3000 \
  translation-api
```

5. To see container logs:

```bash
docker logs translation-container
```

6. If you need to stop the container:

```bash
docker stop translation-container
```

7. To start a stopped container again:

```bash
docker start translation-container
```

8. If you want to remove the container:

```bash
docker rm translation-container
```

9. To run in interactive mode (useful for debugging):

```bash
docker run -it --rm -p 3000:3000 translation-api sh
```

## Testing the API:

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "good morning"}'
```

Expected response example:

```json
{
  "translation": "bom dia",
  "pronunciation": "/ɡʊd ˈmɔːrnɪŋ/",
  "examples": [
    "Good morning! Did you sleep well?",
    "She wished me a good morning as I entered the office.",
    "Every good morning starts with a cup of coffee."
  ]
}
```

> **Important tip**: If you modified the default port in the `.env` file or using `-e PORT=`, adjust the port mapping in the docker run command:
>
> ```bash
> docker run -d --name translation-container -p 4000:4000 -e PORT=4000 translation-api
> ```

## To use Docker Compose (optional):

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  translation-api:
    image: translation-api
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Maintenance

### Clean unnamed and unused images

Step by step:

```bash
# List all images (including unnamed)
docker images

# Stop and remove containers using orphaned images
docker ps -a | grep '<none>' | awk '{print $1}' | xargs docker stop
docker ps -a | grep '<none>' | awk '{print $1}' | xargs docker rm

# Remove unnamed images (dangling)
docker image prune -f

# Remove all unused images (optional)
docker image prune -a -f
```

### Generate new image with name

Run build with `-t` tag:

```bash
docker build -t translation-api:1.0.0 .
```

Explanation:

- `-t`: Defines image name and tag
- `translation-api`: Image name
- `1.0.0`: Tag (version)
- `.`: Build context (current directory)

### Verification

```bash
docker images | grep translation-api
```

Expected result:

```
translation-api    1.0.0    a1b2c3d4e5f6   2 minutes ago   368MB
```

## Manage containers

Running container with image recently built:

```bash
docker run -d --name translation-container -p 3000:3000 translation-api:1.0.0
```

> Note: If you want to use the latest image, just use `translation-api` without the tag.

Stop and remove the container:

```bash
docker stop translation-container
docker rm translation-container
```

> Note: If you want to remove the container without stopping it first, use `docker rm -f translation-container`.

To list and manage Docker containers, use these commands:

1. List running containers:

```bash
docker ps
```

Example output:

```
CONTAINER ID   NAME                    STATUS         PORTS                    IMAGE
a1b2c3d4e5f6   translation-container   Up 2 minutes   0.0.0.0:3000->3000/tcp   translation-api:latest
```

2. List all containers (including stopped ones):

```bash
docker ps -a
```

3. Detailed list with custom format:

```bash
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
```

4. Filter by name:

```bash
docker ps -a --filter "name=translation-container"
```

5. See only container IDs:

```bash
docker ps -aq
```

6. Remove stopped containers:

```bash
docker container prune
```

## Troubleshooting

Possible root causes:

- Corrupted Docker cache
- npm/node version issues
- Temporary NPM registry issue

Test with this command first:

```bash
docker run -it --rm node:20-alpine npm install express axios dotenv
```

> If it works, your modified Dockerfile should work too.

If the problem persists:

- Check your network/firewall
- Try with different network
- Test with different node versions in Dockerfile

For this specific project, since all dependencies are public, the solution with node:20-alpine and additional flags should resolve some issues.

#### Port Error Handlers

The error occurs when port `3000` is already being used by another process/container. Let's solve it in steps:

#### Step-by-step solution:

Stop and remove conflicting containers:

```bash
# Stop the container if it is running
docker stop translation-container

# Remove the container
docker rm translation-container

# Check if other containers are using the port
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

Kill local processes using the port (if necessary):

```bash
# Linux/Mac
sudo lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Run with an alternative port:

```bash
docker run -d --name translation-container -p 4000:3000 translation-api
```

Or free port 3000 and try again:

```bash
docker run -d --name translation-container -p 3000:3000 translation-api
```

#### If the error persists:

Check local applications:

```bash
# Node.js
ps aux | grep node

# Other services
sudo netstat -tulpn | grep :3000
```

Restart Docker (extreme case):

```bash
# Linux
sudo systemctl restart docker

# Windows/Mac
Restart Docker Desktop
```

Complete corrected example:

```bash
# 1. Remove conflicting containers
docker rm -f translation-container

# 2. Run with port verification
docker run -d \
  --name translation-container \
  -p 3000:3000 \
  translation-api

# 3. Check the logs
docker logs translation-container
```

> Important to verify:
>
> - Your Node.js app is configured to use the port defined in `PORT` (3000 by default)
> - No other service is running on the host machine (such as another container, local server, etc.)

#### Definitive alternative:

Change the port in `.env` and in the command:

```bash
# In .env
PORT=4000

# Build
docker build -t translation-api .

# Run
docker run -d --name translation-container -p 4000:4000 translation-api
```

## Bonus: Useful commands

Remove specific image:

```bash
docker rmi 943de9a3c649 -f
```

Build with multiple tags:

```bash
docker build -t translation-api:latest -t translation-api:1.0.0 .
```

List filtered images:

```bash
docker images --filter=reference='translation-api*'
```

Complete Docker cleanup:

```bash
docker system prune -a --volumes
```

Recommended complete flow:

```bash
# 1. Cleanup
docker system prune -a -f

# 2. Build with name
docker build -t translation-api:latest .

# 3. Verification
docker images
```

View logs of a specific container:

```bash
docker logs translation-container
```

Inspect container details:

```bash
docker inspect translation-container
```

Stop/Start containers:

```bash
docker stop translation-container
docker start translation-container
```

Remove specific container:

```bash
docker rm translation-container
```

Remember to replace translation-container with the name or ID of your container when necessary! 😊

[Back to Top](#docker)

[Back to README](../README.MD)
