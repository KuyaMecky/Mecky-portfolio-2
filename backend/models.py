from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# GitHub Repository Models
class GitHubRepo(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    clone_url: str
    homepage: Optional[str] = None
    language: Optional[str] = None
    languages_url: str
    stargazers_count: int
    watchers_count: int
    forks_count: int
    open_issues_count: int
    size: int
    created_at: str
    updated_at: str
    pushed_at: str
    topics: List[str] = []
    archived: bool = False
    disabled: bool = False
    visibility: str = "public"

class GitHubLanguage(BaseModel):
    language: str
    bytes: int
    percentage: float

class GitHubRepoWithLanguages(GitHubRepo):
    languages: List[GitHubLanguage] = []

class GitHubUser(BaseModel):
    login: str
    id: int
    avatar_url: str
    html_url: str
    name: Optional[str] = None
    company: Optional[str] = None
    blog: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    twitter_username: Optional[str] = None
    public_repos: int
    public_gists: int
    followers: int
    following: int
    created_at: str
    updated_at: str

# Contact Form Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"  # new, read, replied
    ip_address: Optional[str] = None

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=254)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)

class ContactMessageResponse(BaseModel):
    success: bool
    message: str
    contact_id: Optional[str] = None

# Portfolio Data Models
class SkillCategory(BaseModel):
    name: str
    skills: List[str]
    proficiency: int

class Experience(BaseModel):
    title: str
    company: str
    location: str
    period: str
    description: str
    achievements: List[str] = []

class PersonalInfo(BaseModel):
    name: str
    title: str
    location: str
    phone: str
    email: str
    github: str
    linkedin: str
    portfolio: str
    summary: str

class PortfolioData(BaseModel):
    personal: PersonalInfo
    skills: List[SkillCategory]
    experience: List[Experience]
    projects: List[GitHubRepoWithLanguages]
    
# GitHub API Response Models
class GitHubAPIResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    cached: bool = False
    cache_expires: Optional[datetime] = None