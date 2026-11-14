# Clover Moments

Clover Moments is a private full-stack memories application built for collecting and organizing photos, videos, notes, music, audio recordings, and special days.

The project includes a React frontend, an Express backend, MongoDB Atlas for data storage, Google Drive integration for media files, Docker-based deployment, AWS infrastructure, and CI/CD support.

---

## Live URLs

Frontend:

```txt
https://www.clovermoments.store
```

Backend API:

```txt
https://api.clovermoments.store
```

Health check:

```txt
https://api.clovermoments.store/api/health
```

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT authentication
- httpOnly cookie auth
- Google Drive API

### Infrastructure & Deployment

- Docker
- Docker Compose
- AWS EC2
- AWS S3
- AWS CloudFront
- AWS ACM
- AWS Budget
- Terraform
- GitHub Actions
- Caddy reverse proxy
- Hostinger DNS

---

## Project Structure

```txt
memories-app/
  backend/
    src/
      config/
      middlewares/
      models/
      routes/
      scripts/
      utils/
    Dockerfile
    package.json

  frontend/
    src/
      api/
      components/
      layouts/
      pages/
      utils/
    Dockerfile
    nginx.conf
    package.json

  docker-compose.yml
  README.md
```

---

## Features

- Authentication with JWT and httpOnly cookies
- Dashboard with memory summaries
- Photo gallery
- Video gallery
- Notes page
- Music page with external links
- Audio recordings page
- Special days page
- Favorites page
- Admin panel for creating, editing, and deleting memories
- Google Drive media proxy through the backend
- Responsive UI
- Production deployment with AWS and Docker

---

## Local Development

### Backend Setup

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5050
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GOOGLE_REDIRECT_URI=http://localhost:5050/oauth2callback
GOOGLE_MEMORIES_ROOT_FOLDER_ID=your_google_drive_folder_id
```

The backend also requires the following Google OAuth files:

```txt
backend/credentials.json
backend/token.json
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5050
```

Health check:

```txt
http://localhost:5050/api/health
```

---

### Frontend Setup

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5050
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Docker Development

The project can be run with Docker Compose.

From the project root:

```bash
docker compose up --build
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5050
```

Health check:

```txt
http://localhost:5050/api/health
```

---

## Production Deployment

The production setup uses:

```txt
Frontend:
CloudFront -> S3

Backend:
api.clovermoments.store -> EC2 -> Caddy -> Docker backend container

Database:
MongoDB Atlas

Media:
Google Drive API

DNS:
Hostinger DNS
```

### Production URLs

```txt
Frontend:
https://www.clovermoments.store

Backend:
https://api.clovermoments.store
```

### Backend Production Environment

On the EC2 instance, the backend uses:

```env
PORT=5050
NODE_ENV=production
FRONTEND_URL=https://www.clovermoments.store
GOOGLE_REDIRECT_URI=https://api.clovermoments.store/oauth2callback
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MEMORIES_ROOT_FOLDER_ID=your_google_drive_folder_id
```

Required backend secret files on EC2:

```txt
backend/.env
backend/credentials.json
backend/token.json
```

---

## AWS Infrastructure

AWS resources are managed with Terraform in a separate infrastructure repository.

Created resources include:

- EC2 instance for backend
- Elastic IP for backend
- Security group
- S3 bucket for frontend static files
- CloudFront distribution
- ACM certificate for frontend domain
- AWS Budget alarm
- Key pair for EC2 access

DNS is managed manually through Hostinger.

Current DNS structure:

```txt
www.clovermoments.store -> CloudFront
api.clovermoments.store -> EC2 Elastic IP
```

---

## CI/CD

The project is intended to use GitHub Actions.

### Frontend Deployment Flow

When code is pushed to the main branch:

```txt
GitHub Actions
  -> install frontend dependencies
  -> build React/Vite app
  -> upload dist/ to S3
  -> invalidate CloudFront cache
```

Required GitHub repository secrets:

```txt
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
VITE_API_BASE_URL
S3_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
```

Example values:

```txt
AWS_REGION=eu-central-1
VITE_API_BASE_URL=https://api.clovermoments.store
S3_BUCKET_NAME=clovermoments-store-frontend
CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id
```

### Backend Deployment Flow

Backend deployment is planned to work through GitHub Actions and SSH:

```txt
GitHub Actions
  -> connect to EC2 over SSH
  -> pull latest code
  -> rebuild backend container
  -> restart backend and Caddy
```

Required secrets for backend deployment:

```txt
EC2_HOST
EC2_USER
EC2_SSH_KEY
```

---

## Important Security Notes

The following files must never be committed:

```txt
backend/.env
frontend/.env
backend/credentials.json
backend/token.json
backend/cookies.txt
node_modules/
dist/
```

These are ignored through `.gitignore` and `.dockerignore`.

Google OAuth credentials and tokens are mounted or copied manually to the deployment environment.

---

## Useful Commands

### Check backend logs on EC2

```bash
cd ~/apps/memories-app
docker compose -f docker-compose.yml -f docker-compose.caddy.yml logs -f backend
```

### Check Caddy logs on EC2

```bash
cd ~/apps/memories-app
docker compose -f docker-compose.yml -f docker-compose.caddy.yml logs -f caddy
```

### Restart backend on EC2

```bash
cd ~/apps/memories-app
docker compose -f docker-compose.yml -f docker-compose.caddy.yml restart backend
```

### Recreate backend container after environment changes

```bash
cd ~/apps/memories-app
docker compose -f docker-compose.yml -f docker-compose.caddy.yml up -d --force-recreate backend
```

### Test backend health

```bash
curl https://api.clovermoments.store/api/health
```

### Test local backend health

```bash
curl http://localhost:5050/api/health
```

---

## Notes

This is a personal project focused on learning and practicing:

- Full-stack application development
- React and Node.js architecture
- Docker-based deployment
- AWS infrastructure
- Terraform
- CI/CD with GitHub Actions
- Production domain, DNS, SSL, and reverse proxy configuration

The project is still under active development.
