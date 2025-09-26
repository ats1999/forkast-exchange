# forkast-exchange

`forkast-exchange` is an implementation of a typical stock/crypto exchange system built using modern technologies. It demonstrates an order `matching` engine, `real-time` event streaming using Kafka, Redis, and NestJS. It leverages NestJS, Kafka, and RxJS to achieve low-latency streaming.

## Tech Stack

- NestJs
- Kafka
- Redis
- PostgreSQL
- Prisma ORM

## Architecture

### Core Components

#### Order Book Keeper Service

- Maintains live buy and sell order books for each symbol.
- Update PostgreSQL on order update
- Keeps incremental snapshots (orderBookSnapShotId) to efficiently stream changes.
- Exposes REST and SSE endpoints for retrieving and streaming order book updates.

#### Order Matching Engine

- Matches incoming buy and sell orders based on price-time priority.
- Emits trades to downstream services using kafka whenever a match occurs.
- Optimized for high-frequency matching and fault tolerant using durable kafka logs.

#### Order Management Service

- Allows users to create orders (BUY/SELL)
- Get orders using pagination
- Cancel order [TODO]

### Flow of Orders

- A user submits an order through the API to order management service.
- Order management service validates the request and publishes an event to `orders.new` kafka topic.
- Order Matching Engine, receives new orders from `orders.new`
- Order Matching Engine, stores order details in memory and publishes two conditional event - Publishes incoming order from `orders.new` topic directly to `orders.exchange` topic, for updating PostgreSQL - Try to match incoming order, it publishes a `Trade` event into `orders.exchange` topic, if there is any match (Partial/Full).

  > The reason, new order and trade event are being published into `orders.exchange` is to preserve order of updates. We use symbol id as partition key. We need to ensure that order is the first event that should be saved into db before trade.

- Order book keeper service subscribe to `orders.exchange` topic. It first create in orders in PostgreSQL in batch of 100 orders. Then it updates in-memory order book, which can be them consumed using HTTP/SSE.

## Setup

- Clone Repo and Checkout to repo root
- do `npm i`
- Install kafka - https://kafka.apache.org/quickstart on default port 9092, or change the env variable `KAFKA_BROKERS`
- Instal redis on default port 6379, or change the env variable `REDIS_URL`
- Install PostgreSQL - https://www.postgresql.org/download on default port 5432, or change the env variable `DATABASE_URL`.
- Create database `forkast_exchange`
- Create tables by using `psql -d forkast_exchange -f schema.sql`, supply user/name password if required
- Dump users and symbols data for testing, `psql -d forkast_exchange -f init.sql`, supply user/name password if required

Start Servers

- Order Matching Engine - `npm run start:engine:dev`, will start server on port 3000
- Order Management Service - `npm run start:oms:dev`, will start server on port 3001
- Order Book Keeper Service - `npm run start:bookkeeper:dev`, will start server on port 3002

## APIs

Documentation -> https://documenter.getpostman.com/view/17357775/2sB3QDuY5t

## Other details

- A list of users and stock symbols have been populated inside db from `init.sql`. If not, check `Dump users and symbols data for testing` in above steps.
- Using HTTP basic auth for simplicity. It requires user id and password, for every user, user's email is id as well as password.
  - See postman documentation for example, and check https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication for more details
