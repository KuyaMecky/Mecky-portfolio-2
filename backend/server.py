from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

# Import models and services
from .models import (
    ContactMessageCreate, ContactMessageResponse, 
    GitHubRepoWithLanguages, GitHubUser, GitHubAPIResponse,
    PortfolioData, PersonalInfo, SkillCategory, Experience
)
from .services.github_service import GitHubService
from .services.contact_service import ContactService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
github_service = GitHubService(db)
contact_service = ContactService(db)

# Create the main app without a prefix
app = FastAPI(title="Michael Tallada Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Original endpoints
@api_router.get("/")
async def root():
    return {"message": "Michael Tallada Portfolio API"}

# GitHub endpoints
@api_router.get("/github/user", response_model=GitHubUser)
async def get_github_user():
    """Get GitHub user information"""
    user = await github_service.get_user_info()
    if not user:
        raise HTTPException(status_code=404, detail="GitHub user not found")
    return user

@api_router.get("/github/repositories", response_model=List[GitHubRepoWithLanguages])
async def get_github_repositories(limit: int = 10, sort: str = "updated"):
    """Get GitHub repositories with language information"""
    if limit > 50:
        raise HTTPException(status_code=400, detail="Limit cannot exceed 50")
    
    repos = await github_service.get_repositories(limit=limit, sort=sort)
    return repos

@api_router.get("/github/featured", response_model=List[GitHubRepoWithLanguages])
async def get_featured_repositories():
    """Get featured repositories (pinned or most starred)"""
    repos = await github_service.get_featured_repositories()
    return repos

@api_router.get("/github/stats")
async def get_github_stats():
    """Get GitHub repository statistics"""
    stats = await github_service.get_repository_stats()
    return stats

# Contact endpoints
@api_router.post("/contact", response_model=ContactMessageResponse)
async def create_contact_message(message: ContactMessageCreate, request: Request):
    """Create a new contact message"""
    client_ip = request.client.host
    response = await contact_service.create_contact_message(message, client_ip)
    return response

@api_router.get("/contact/messages")
async def get_contact_messages(limit: int = 50, skip: int = 0):
    """Get contact messages (admin endpoint)"""
    messages = await contact_service.get_contact_messages(limit=limit, skip=skip)
    return messages

@api_router.get("/contact/stats")
async def get_contact_stats():
    """Get contact message statistics"""
    stats = await contact_service.get_contact_stats()
    return stats

# Portfolio data endpoint
@api_router.get("/portfolio")
async def get_portfolio_data():
    """Get complete portfolio data"""
    try:
        # Get GitHub data
        github_user = await github_service.get_user_info()
        github_repos = await github_service.get_featured_repositories()
        
        # Static portfolio data (from resume)
        personal_info = PersonalInfo(
            name="Michael Tallada",
            title="Full-Stack Developer | ML Enthusiast | Senior SEO | Data Analyst",
            location="General Trias, Cavite",
            phone="0909 400 3145",
            email="Tallada88@gmail.com",
            github="https://github.com/KuyaMecky",
            linkedin="https://www.linkedin.com/in/michael-tallada/",
            portfolio="https://mecky-portfolio.vercel.app/",
            summary="Versatile and performance-driven IT professional with over 5 years of experience in full-stack web development, SEO/SEM, machine learning, and data analytics. Specialized in technical SEO, scalable systems architecture, and optimized user-centric interfaces."
        )
        
        skills = [
            SkillCategory(name="Web Development", skills=[
                "ReactJS", "NextJS", "PHP", "JavaScript", "Vue", "Vite", "WordPress", "Laravel", "Django", "Bootstrap", "ASP.NET", "VB", "Xamarin", "Cordova"
            ], proficiency=95),
            SkillCategory(name="Software Development", skills=[
                "Java", "C++", "C#", "Kotlin", "Python", "Android Studio", "Machine Learning", "Deep Learning", "Data Structures", "Algorithms"
            ], proficiency=90),
            SkillCategory(name="API & Backend", skills=[
                "Node.js", "RESTful APIs", "MySQL", "Postman", "Curl", "Sanity", "JWT Authentication"
            ], proficiency=92),
            SkillCategory(name="DevOps & Cloud", skills=[
                "Docker", "Nginx", "VPS (AApanel)", "Git", "GitHub", "GitLab", "CI/CD Pipelines", "Cloudflare", "Azure DevOps"
            ], proficiency=85),
            SkillCategory(name="SEO & Analytics", skills=[
                "Google Analytics", "Search Console", "Ahrefs", "Semrush", "Dev Console", "AdSense", "Bing Webmaster Tool", "Keyword Research", "Technical SEO"
            ], proficiency=98),
            SkillCategory(name="Design & Multimedia", skills=[
                "Adobe Photoshop", "Adobe Premiere", "Sony Vegas", "Blender", "SketchUp", "AutoCAD", "3DMax"
            ], proficiency=80)
        ]
        
        experience = [
            Experience(
                title="Search Engine Optimization Specialist",
                company="xFuture",
                location="France",
                period="Apr 2025 – July 2025",
                description="Orchestrating global SEO strategies that increased keyword rankings by 40% YoY. Performing advanced competitor analysis, CTR optimization, and site audits."
            ),
            Experience(
                title="Senior SEO Specialist",
                company="Vertex Inc.",
                location="Makati, Philippines",
                period="Feb 2025 – May 2025",
                description="Leading cross-functional SEO/UX projects to drive measurable improvements in CRO and SERP visibility. Introduced structured data and schema implementation across product pages."
            ),
            Experience(
                title="SEO Team Leader",
                company="New Oriental Club",
                location="China",
                period="March 2024 – Feb 2025",
                description="Executed advanced content strategies in line with Google's evolving algorithms. Boosted domain authority by 25+ through ethical backlink outreach campaigns."
            ),
            Experience(
                title="Full Stack Developer",
                company="Wbridge Manpower Corp",
                location="Philippines",
                period="Jan 2024 – Feb 2025",
                description="Developed responsive SPAs using ReactJS, NextJS, Sass, and Vite with performance-first architecture. Engineered custom WordPress themes and integrated 3rd-party APIs, improving load time by 30%."
            ),
            Experience(
                title="SEO Team Lead",
                company="Wbridge Manpower Corp",
                location="Philippines",
                period="Jun 2024 – Feb 2025",
                description="Directed a team of 6 SEO professionals to double site traffic and improve bounce rate by 20%. Executed backlink strategies, technical audits, and search intent-focused content marketing."
            )
        ]
        
        portfolio_data = PortfolioData(
            personal=personal_info,
            skills=skills,
            experience=experience,
            projects=github_repos
        )
        
        return portfolio_data
        
    except Exception as e:
        logging.error(f"Error getting portfolio data: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching portfolio data")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
