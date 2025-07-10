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

   # App
   PORT=3000

   # TypeORM (optional)
   DB_SYNC=true
   DB_LOGGING=false
   ```

3. **Start the services:**

   ```bash
   docker-compose up --build
   ```

4. The API will be available at `http://localhost:3000` (or your chosen `PORT`).

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

## 🛠️ Scripts

- `npm run start:dev` — Start the server in development mode
- `npm run build` — Build the project
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests

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
