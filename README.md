# AI Mock Interview Application

An AI-powered Mock Interview application featuring a Spring Boot backend (Java 22, Firebase, Gemini AI, Supabase) and a React frontend.

---

## 🚀 Quick Start with Docker & Docker Compose

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Environment Setup

Configure backend environment variables in `Ai_interview_bcn/.env`:

```env
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_API_KEY=your_firebase_api_key
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

And place your `firebase-service-account.json` in `Ai_interview_bcn/src/main/resources/firebase-service-account.json`.

---

### 2. Build and Run Containerized Application

From the project root directory, run:

```bash
# Build and start all services in detached mode
docker compose up --build -d
```

Access the application:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Backend Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

---

### 3. Stop Containers

```bash
docker compose down
```

---

## 🛠️ Individual Container Deployment

### Backend Container (`Ai_interview_bcn`)

```bash
cd Ai_interview_bcn

# Build Docker image
docker build -t ai-interview-backend .

# Run container
docker run -d -p 8080:8080 --env-file .env --name ai-interview-backend ai-interview-backend
```

### Frontend Container (`aiinterview`)

```bash
cd aiinterview

# Build Docker image (with custom API URL if needed)
docker build --build-arg REACT_APP_API_BASE_URL=http://localhost:8080/api -t ai-interview-frontend .

# Run container
docker run -d -p 3000:80 --name ai-interview-frontend ai-interview-frontend
```

---

## 📁 Repository Overview

```
.
├── docker-compose.yml         # Root Docker Compose configuration
├── README.md                  # Project & Deployment documentation
├── Ai_interview_bcn/          # Spring Boot Backend (Java 22)
│   ├── Dockerfile             # Multi-stage Java 22 Maven build
│   ├── .dockerignore
│   └── src/
└── aiinterview/               # React Frontend
    ├── Dockerfile             # Multi-stage Node.js + Nginx build
    ├── nginx.conf             # Production Nginx SPA configuration
    ├── .dockerignore
    └── src/
```
