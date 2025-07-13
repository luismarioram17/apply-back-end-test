# apply-back-end-test

Technical assessment for ApplyDigital

---

## 🚀 Getting Started

This project uses [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/) as its main stack, and is ready to run with Docker.

### Prerequisites

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/)
- (Optional) Node.js & npm if you want to run locally without Docker

### 🐳 Running with Docker

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd apply-back-end-test
   ```

2. **Create a `.env` file in the root directory with the following variables:**

   ```env
   # PostgreSQL
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=apply_db
   POSTGRES_PORT=5432
   DB_LOGGING=false
   DB_SYNC=true

   # App
   PORT=3000

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1h

   # CONTENTFUL
   CONTENTFUL_SPACE_ID=<contentful SPACE_ID>
   CONTENTFUL_ACCESS_TOKEN=<contentful ACCESS_TOKEN>
   CONTENTFUL_ENVIRONMENT=<contentful ENVIRONMENT>
   CONTENTFUL_PRODUCT_CONTENT_TYPE=<contentful PRODUCT_CONTENT_TYPE>
   ```

3. **Start the services:**

   ```bash
   docker-compose up --build
   ```

4. The API will be available at `http://localhost:3000` (or your chosen `PORT`).

### 📖 API Documentation (Swagger)

Once the server is running, you can access the automatically generated Swagger UI for API documentation and testing at:

```
http://localhost:3000/api
```

This provides a full overview of all endpoints, request/response schemas, and allows you to interact with the API directly from your browser.

### 🧑‍💻 Running Locally (without Docker)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file as described above.

3. Build the project:

   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm run start:dev
   ```

### 🌱 Seeding Users

After the database is running, you can seed initial users (admin and user) with:

```bash
npm run seed:users
```

This will create two users with hashed passwords in the database.

> **Note:** The normally the provision of users would come from an Identity provider, like google accounts, AWS or Azure, but for simplicity they were provided to the database.

## 🛠️ Scripts

- `npm run start:dev` — Start the server in development mode (with hot reload)
- `npm run start` — Start the server in production mode
- `npm run start:debug` — Start the server in debug mode
- `npm run start:prod` — Start the compiled server (from dist)
- `npm run build` — Build the project
- `npm run format` — Format code with Prettier
- `npm run lint` — Lint and fix code with ESLint
- `npm run test` — Run unit tests
- `npm run test:watch` — Run unit tests in watch mode
- `npm run test:cov` — Run unit tests with coverage
- `npm run test:debug` — Run unit tests in debug mode
- `npm run test:e2e` — Run end-to-end tests
- `npm run seed:users` — Seed the database with initial users
- `npm run install:docker` — Run npm install inside the Docker container
- `npm run husky:init` — Initialize Husky for git hooks
- `npm run prepare` — Prepare Husky for git hooks

## ⚙️ Environment Variables

| Variable          | Description              | Default  |
| ----------------- | ------------------------ | -------- |
| POSTGRES_USER     | PostgreSQL username      | postgres |
| POSTGRES_PASSWORD | PostgreSQL password      | postgres |
| POSTGRES_DB       | PostgreSQL database name | apply_db |
| POSTGRES_PORT     | PostgreSQL port          | 5432     |
| PORT              | App port                 | 3000     |
| DB_SYNC           | TypeORM auto schema sync | true     |
| DB_LOGGING        | TypeORM logging          | false    |

## 📂 Project Structure

- `src/` — Main source code (modules, controllers, services)
- `test/` — End-to-end tests
- `docker-compose.yml` — Docker Compose setup
- `Dockerfile` — Docker build instructions

---
