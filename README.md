# 🚀 Portfolio Deployment Guide

## 📋 **Current Architecture**
- **Frontend**: React (port 3000) - Can deploy to Vercel
- **Backend**: FastAPI (port 8001) - Needs separate deployment
- **Database**: MongoDB - Needs cloud hosting

## 🎯 **Deployment Options**

### **Option 1: Split Deployment (Recommended)**

#### **Step 1: Deploy Backend to Railway**
1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub repository
3. **Create New Project**: Select your portfolio repo
4. **Configure Backend**:
   ```bash
   # Create railway.json in backend folder
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT"
     }
   }
   ```

#### **Step 2: Setup MongoDB Atlas**
1. **Create Account**: Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose free tier
3. **Get Connection String**: Copy the connection URL
4. **Whitelist IPs**: Add 0.0.0.0/0 for Railway

#### **Step 3: Configure Environment Variables in Railway**
```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/portfolio
DB_NAME=portfolio
GITHUB_TOKEN=your_github_token_optional
```

#### **Step 4: Deploy Frontend to Vercel**
1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Connect GitHub**: Import your repository
3. **Configure Build Settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install`

#### **Step 5: Update Frontend Environment Variables in Vercel**
```bash
REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
```

---

### **Option 2: Full-Stack Railway Deployment**

#### **Step 1: Prepare for Railway**
1. **Create Dockerfile** in root:
```dockerfile
# Multi-stage build for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Python backend
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

# Copy backend files
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./static

# Start command
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "$PORT"]
```

2. **Update server.py** to serve frontend:
```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Add after app creation
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse("static/index.html")
```

---

### **Option 3: Vercel with Backend Functions**

#### **Convert Backend to Vercel Functions**
1. **Create /api folder** in root
2. **Convert each endpoint** to separate function files
3. **Example**: `/api/github.py`
```python
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/github/repositories")
async def get_repos():
    # Your GitHub logic here
    return {"repos": []}

handler = Mangum(app)
```

4. **Create vercel.json**:
```json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.9"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

---

## 🔧 **Recommended Quick Deployment**

### **1. Railway (Easiest for Full-Stack)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **2. Render (Free Tier Available)**
1. Connect GitHub repository
2. Select "Web Service"
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`

### **3. Heroku (Classic Option)**
```bash
# Install Heroku CLI
heroku create your-portfolio-app
heroku config:set MONGO_URL=your_mongodb_url
git push heroku main
```

---

## 📝 **Environment Variables Needed**

### **Backend (.env)**
```bash
MONGO_URL=mongodb+srv://...
DB_NAME=portfolio
GITHUB_TOKEN=ghp_xxx (optional, for higher rate limits)
SMTP_SERVER=smtp.gmail.com (for contact emails)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

### **Frontend (.env)**
```bash
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

---

## 🚨 **Common Issues & Solutions**

### **CORS Issues**
Update `server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **GitHub API Rate Limiting**
Get a GitHub token:
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Create token with `public_repo` scope
3. Add to environment variables

### **MongoDB Connection Issues**
- Ensure IP whitelist includes your deployment platform
- Use MongoDB Atlas for cloud hosting
- Check connection string format

---

## 🎯 **My Recommendation**

**For Your Portfolio**: Use **Railway** for the full-stack deployment:
1. **Simplest setup** - handles both frontend and backend
2. **Free tier available** - perfect for portfolios
3. **GitHub integration** - automatic deployments
4. **MongoDB Atlas** - free cloud database
5. **Custom domain** - professional look
