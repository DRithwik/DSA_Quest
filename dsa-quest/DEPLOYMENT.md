# DSA-QUEST Deployment Guide

## 1. Prerequisites
- **Docker & Docker Compose**: Installed and running.
- **Node.js 18+**: For local development.
- **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/).
- **PostgreSQL & MongoDB**: (Optional if not using Docker).

## 2. Infrastructure Setup

### Local Docker Orchestration (Recommended)
1.  **Clone the Project**: `git clone <repo-url> dsa-quest`
2.  **Configure Environment**:
    Create a `.env` in the root (or backend folder) with your `GEMINI_API_KEY`.
3.  **Boot System**:
    ```bash
    docker-compose up --build
    ```
    This starts PG, MongoDB, Redis, Backend, and Frontend.

### Manual Backend Setup
1.  Navigate to `backend/`.
2.  Install dependencies: `npm install`
3.  Run Prisma migrations: `npx prisma db push`
4.  Start server: `npm run dev`

### Manual Frontend Setup
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev`

## 3. Production Deployment (Cloud)

### Recommended: Kubernetes (EKS/GKE)
- Use the provided `docker-compose` as a basis for Helm charts.
- **Critical Security**: Ensure the `backend` service has access to the Docker socket (`/var/run/docker.sock`) if running the sandbox on the same node, OR use a remote execution service like AWS Lambda / GCP Cloud Run for code execution.

### CI/CD Pipeline
- **Linting**: `npm run lint`
- **Unit Testing**: `npm run test`
- **Build**: `npm run build`
- **Containerize**: Push images to AWS ECR or Docker Hub.

## 4. Troubleshooting
- **Docker Sandbox Errors**: Ensure your user has permissions to access the docker socket (`sudo chmod 666 /var/run/docker.sock`).
- **AI Feedback latency**: Using `gemini-1.5-flash` is recommended for lower latency compared to `gemini-1.5-pro`.
- **Matchmaking Persistence**: Ensure Redis is running and the `REDIS_URL` is correctly set.

---
**Build with ❤️ by Antigravity**
