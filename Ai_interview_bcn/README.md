# AI Interview — Spring Boot Backend

A Spring Boot backend powering the AI Mock Interview application with Firebase authentication, Gemini AI for question generation, and Supabase for data storage.

## 🗂️ Project Structure

```
Ai_interview_bcn/
├── .env                          ← Secret keys (never commit!)
├── .gitignore
├── pom.xml
├── mvnw.cmd                      ← Maven wrapper (Windows)
└── src/main/
    ├── java/com/aiinterview/
    │   ├── AiInterviewApplication.java   ← Main entry point (loads .env)
    │   ├── config/
    │   │   ├── FirebaseConfig.java       ← Firebase Admin SDK setup
    │   │   ├── GeminiConfig.java         ← Gemini API WebClient
    │   │   ├── SupabaseConfig.java       ← Supabase WebClient (secret key)
    │   │   ├── CorsConfig.java           ← CORS settings
    │   │   └── SecurityConfig.java       ← Spring Security + Firebase filter
    │   ├── security/
    │   │   └── FirebaseTokenFilter.java  ← Verifies Firebase ID tokens
    │   ├── service/
    │   │   ├── GeminiService.java        ← AI question generation & evaluation
    │   │   └── SupabaseService.java      ← Database CRUD via Supabase REST
    │   └── controller/
    │       ├── AuthController.java       ← POST /api/auth/verify
    │       ├── InterviewController.java  ← POST /api/interviews/*
    │       └── HealthController.java     ← GET /api/health, /api/dashboard/*
    └── resources/
        ├── application.properties
        └── firebase-service-account.json ← Download from Firebase Console!
```

## ⚙️ Setup Steps

### 1. Fill in the `.env` file

Open `.env` and replace the placeholder values:

```env
FIREBASE_PROJECT_ID=ai-interview-5d5c5
FIREBASE_API_KEY=SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
GEMINI_API_KEY=your_actual_gemini_key   ← Get from Google AI Studio
SUPABASE_URL=https://xxxx.supabase.co  ← From Supabase project settings
SUPABASE_SECRET_KEY=SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
```

### 2. Download Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings → Service Accounts
3. Click **"Generate new private key"** → Download JSON
4. Save it as: `src/main/resources/firebase-service-account.json`

### 3. Set up Supabase URL

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project → Project Settings → API
3. Copy the **Project URL** and paste it in `.env` as `SUPABASE_URL`

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Paste it in `.env` as `GEMINI_API_KEY`

### 5. Run the Backend

```powershell
# Windows (using Maven wrapper)
.\mvnw.cmd spring-boot:run

# Or if Maven is installed globally
mvn spring-boot:run
```

Server starts at: **http://localhost:8080**

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ Public | Health check |
| POST | `/api/auth/verify` | ❌ Public | Verify Firebase token |
| POST | `/api/interviews/start` | ✅ Required | Start interview + get questions |
| POST | `/api/interviews/{id}/answer` | ✅ Required | Submit answer for evaluation |
| POST | `/api/interviews/{id}/finish` | ✅ Required | Finish interview session |
| GET | `/api/dashboard/stats` | ✅ Required | Get user dashboard stats |
| GET | `/api/dashboard/recent` | ✅ Required | Get recent interviews |

## 🔑 Key Management

| Key | Where | Used In |
|-----|-------|---------|
| `FIREBASE_API_KEY` | Both `.env` files | Frontend (auth) + Backend (admin SDK) |
| `GEMINI_API_KEY` | Backend `.env` only | GeminiService — AI questions/evaluation |
| `SUPABASE_ANON_KEY` (publishable) | Frontend `.env` only | React client-side queries |
| `SUPABASE_SECRET_KEY` | Backend `.env` only | Backend privileged DB access |
