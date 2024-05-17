# OneFront - React Boilerplate

This boilerplate is a foundational React application template designed for use on a single platform, serving as a starting point to build various types of web applications tailored to the company's needs.

To learn more about OneFront, visit: [OneFront Docs](https://development.teamsystem.com/docs/default/system/one-front).

## Table of Contents

- [OneFront - React Boilerplate](#onefront---react-boilerplate)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Project Architecture](#project-architecture)
    - [Tools](#tools)
    - [Host Ports](#host-ports)
    - [Structure](#structure)
  - [Services](#services)
    - [Proxy Service](#proxy-service)
  - [Useful links](#useful-links)

## Quick Start

1. Make sure you have `docker`, `docker-compose` and `npm` or `bun` installed on your system
2. Clone or fork this repository if you haven't already
3. Setup your docker environment for pulling from the company Harbor: [Docker Guide](https://development.teamsystem.com/docs/default/system/one-front/environment-setup/#docker-login)
4. Delete between `.npmrc` and `.bunfig.toml` the one that you will not use.
5. Setup your `.env` file starting from `.env.example`: [Environment Guide](https://development.teamsystem.com/docs/default/system/one-front/environment-setup/#env)
6. Open a Linux/WSL terminal and run `make boot`
7. Start the frontend app `make react`
8. Open your browser at [http://localhost:3000](http://localhost:3000) to use the app

Once you're done working on the project, run `make down` to gracefully terminate it.

👉 Run `make help` to explore the project's APIs, and take a look at the `Makefile` and `docker-compose.yaml` to dive into it.

## Project Architecture

- Docker is used to isolate and deploy the services involved
- Makefile is used to automate lifecycle and development tasks

### Tools

- [Docker & Docker-Compose](https://docs.docker.com/compose/)
- [Vite](https://vitejs.dev/)
- [Makefile](https://biosphere.teamsystem.com/oneplatform/onefront/adrs/-/tree/main/makefile-project-api)

### Host Ports

- Services
  - `4010`: Proxy Service
- Apps
  - `3000`: React App

### Structure

- **/src** - contains the source code of your app, based on Create React App and implements the OneFront SDK.
- **/mocks** - contains code which lets users work independently without a backend or external services involved.

## Services

### Proxy Service

> Reference: [Proxy Service Developer Portal](https://development.teamsystem.com/docs/default/system/one-front/proxy-service/)

The service which proxies requests from the SPA (app) to any backend service known by the service registry.

## Useful links

- How to use local mocks: [Guide](https://development.teamsystem.com/docs/default/system/one-front/tutorials/proxy-service/mock-js/)
- CORS and Proxy Sidecar ADR: [Info](https://development.teamsystem.com/docs/default/system/one-front/tutorials/proxy-service/mock-sidecar/)
