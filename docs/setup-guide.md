# 🛠️ Setup Guide

This guide walks you through setting up a local development environment for **OpenPrep AI**.

---

## 📋 Prerequisites

Ensure you have the following installed on your local development machine:
* [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
* [npm](https://www.npmjs.com/) (v9.x or higher)
* [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster connection string)
* [Docker & Docker Compose](https://www.docker.com/) (Optional, for running with containers)

---

## 🔑 Environment Variables

You need to set up environment variables for both the backend and frontend.

### 🔌 Backend Environment Variables (`backend/.env`)
Create a file named `.env` in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/openprep-ai
JWT_SECRET=your_super_secret_jwt_key_change_me
GEMINI_API_KEY=your_gemini_api_key_here
```
> [!NOTE]
> If `GEMINI_API_KEY` is omitted or left as default, the backend will automatically fallback to returning detailed pre-configured mock data for planning, analysis, and quizzes so you can develop offline.

### 🎨 Frontend Environment Variables (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ⚙️ Manual Local Installation

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Initialize the development database (ensure your local MongoDB service is running):
   ```bash
   # Windows command prompt / powershell:
   net start MongoDB
   ```
4. Start the Node.js development server:
   ```bash
   npm run dev
   ```
The backend server runs at `http://localhost:5000`.

### 2. Setup Frontend
1. Open a new terminal session and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite client dev server:
   ```bash
   npm run dev
   ```
The frontend application will boot at `http://localhost:5173`. Open this URL in your web browser.

---

## 🐳 Running with Docker

If you prefer to run the entire stack containerized, you can use the configured `docker-compose.yml` file.

### Steps
1. Navigate to the project root directory containing `docker-compose.yml`.
2. Ensure you have created the backend environment configuration in `backend/.env`.
3. Spin up the container services:
   ```bash
   docker-compose up --build
   ```
This command downloads the necessary images, boots an isolated MongoDB service container, and builds the frontend and backend service instances.

### Port Mappings
* **React Frontend**: accessible at `http://localhost:5173`
* **Node.js Express Backend**: accessible at `http://localhost:5000`
* **MongoDB Database Instance**: internally mapped and exposed at port `27017`

To shut down all running containers, run:
```bash
docker-compose down
```
