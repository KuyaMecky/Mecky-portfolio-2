import httpx
import asyncio
import json
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..models import GitHubRepo, GitHubUser, GitHubLanguage, GitHubRepoWithLanguages, GitHubAPIResponse
import logging

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.base_url = "https://api.github.com"
        self.username = "KuyaMecky"
        self.cache_duration = timedelta(hours=1)  # Cache for 1 hour
        
    async def get_user_info(self) -> Optional[GitHubUser]:
        """Get GitHub user information"""
        try:
            # Check cache first
            cached_data = await self._get_cached_data("user_info")
            if cached_data:
                return GitHubUser(**cached_data)
            
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/users/{self.username}")
                response.raise_for_status()
                data = response.json()
                
                # Cache the data
                await self._cache_data("user_info", data)
                
                return GitHubUser(**data)
                
        except Exception as e:
            logger.error(f"Error fetching GitHub user info: {str(e)}")
            return None
    
    async def get_repositories(self, limit: int = 10, sort: str = "updated") -> List[GitHubRepoWithLanguages]:
        """Get user repositories with language information"""
        try:
            # Check cache first
            cache_key = f"repos_{limit}_{sort}"
            cached_data = await self._get_cached_data(cache_key)
            if cached_data:
                return [GitHubRepoWithLanguages(**repo) for repo in cached_data]
            
            async with httpx.AsyncClient() as client:
                # Get repositories
                response = await client.get(
                    f"{self.base_url}/users/{self.username}/repos",
                    params={
                        "sort": sort,
                        "per_page": limit,
                        "type": "owner"
                    }
                )
                response.raise_for_status()
                repos_data = response.json()
                
                # Get languages for each repository
                repos_with_languages = []
                for repo_data in repos_data:
                    if not repo_data.get('fork', False):  # Skip forked repos
                        repo = GitHubRepo(**repo_data)
                        languages = await self._get_repo_languages(client, repo.full_name)
                        repo_with_languages = GitHubRepoWithLanguages(
                            **repo_data,
                            languages=languages
                        )
                        repos_with_languages.append(repo_with_languages)
                
                # Cache the data
                await self._cache_data(cache_key, [repo.dict() for repo in repos_with_languages])
                
                return repos_with_languages
                
        except Exception as e:
            logger.error(f"Error fetching GitHub repositories: {str(e)}")
            return []
    
    async def get_featured_repositories(self) -> List[GitHubRepoWithLanguages]:
        """Get featured repositories (pinned or most starred)"""
        try:
            # Try to get pinned repositories first
            pinned_repos = await self._get_pinned_repositories()
            if pinned_repos:
                return pinned_repos
            
            # If no pinned repos, get most starred repos
            all_repos = await self.get_repositories(limit=20, sort="updated")
            
            # Filter and sort by stars
            featured_repos = sorted(
                [repo for repo in all_repos if repo.stargazers_count > 0 or repo.description],
                key=lambda x: x.stargazers_count,
                reverse=True
            )[:6]
            
            return featured_repos
            
        except Exception as e:
            logger.error(f"Error fetching featured repositories: {str(e)}")
            return []
    
    async def _get_pinned_repositories(self) -> List[GitHubRepoWithLanguages]:
        """Get pinned repositories using GraphQL API"""
        try:
            query = '''
            query {
                user(login: "%s") {
                    pinnedItems(first: 6, types: REPOSITORY) {
                        nodes {
                            ... on Repository {
                                id
                                name
                                description
                                url
                                stargazerCount
                                forkCount
                                primaryLanguage {
                                    name
                                }
                                languages(first: 10) {
                                    edges {
                                        node {
                                            name
                                        }
                                        size
                                    }
                                }
                                createdAt
                                updatedAt
                            }
                        }
                    }
                }
            }
            ''' % self.username
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.github.com/graphql",
                    json={"query": query},
                    headers={"Authorization": f"Bearer {self._get_github_token()}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Process GraphQL response and convert to our model
                    # This is a simplified version - you'd need to implement full conversion
                    return []
                else:
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching pinned repositories: {str(e)}")
            return []
    
    async def _get_repo_languages(self, client: httpx.AsyncClient, full_name: str) -> List[GitHubLanguage]:
        """Get language statistics for a repository"""
        try:
            response = await client.get(f"{self.base_url}/repos/{full_name}/languages")
            response.raise_for_status()
            languages_data = response.json()
            
            if not languages_data:
                return []
            
            total_bytes = sum(languages_data.values())
            languages = []
            
            for language, bytes_count in languages_data.items():
                percentage = (bytes_count / total_bytes) * 100 if total_bytes > 0 else 0
                languages.append(GitHubLanguage(
                    language=language,
                    bytes=bytes_count,
                    percentage=round(percentage, 1)
                ))
            
            return sorted(languages, key=lambda x: x.percentage, reverse=True)
            
        except Exception as e:
            logger.error(f"Error fetching languages for {full_name}: {str(e)}")
            return []
    
    async def _get_cached_data(self, key: str) -> Optional[Dict[Any, Any]]:
        """Get cached data from database"""
        try:
            cached_item = await self.db.github_cache.find_one({"key": key})
            if cached_item:
                if datetime.utcnow() < cached_item["expires_at"]:
                    return cached_item["data"]
                else:
                    # Remove expired cache
                    await self.db.github_cache.delete_one({"key": key})
            return None
        except Exception as e:
            logger.error(f"Error getting cached data: {str(e)}")
            return None
    
    async def _cache_data(self, key: str, data: Any) -> None:
        """Cache data in database"""
        try:
            expires_at = datetime.utcnow() + self.cache_duration
            await self.db.github_cache.update_one(
                {"key": key},
                {
                    "$set": {
                        "key": key,
                        "data": data,
                        "cached_at": datetime.utcnow(),
                        "expires_at": expires_at
                    }
                },
                upsert=True
            )
        except Exception as e:
            logger.error(f"Error caching data: {str(e)}")
    
    def _get_github_token(self) -> Optional[str]:
        """Get GitHub token from environment variables"""
        import os
        return os.getenv("GITHUB_TOKEN")
    
    async def get_repository_stats(self) -> Dict[str, Any]:
        """Get overall repository statistics"""
        try:
            repos = await self.get_repositories(limit=100)
            
            stats = {
                "total_repos": len(repos),
                "total_stars": sum(repo.stargazers_count for repo in repos),
                "total_forks": sum(repo.forks_count for repo in repos),
                "languages": {},
                "most_starred": None,
                "most_recent": None
            }
            
            # Language statistics
            for repo in repos:
                for lang in repo.languages:
                    if lang.language not in stats["languages"]:
                        stats["languages"][lang.language] = 0
                    stats["languages"][lang.language] += lang.bytes
            
            # Most starred repository
            if repos:
                stats["most_starred"] = max(repos, key=lambda x: x.stargazers_count)
                stats["most_recent"] = max(repos, key=lambda x: x.updated_at)
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting repository stats: {str(e)}")
            return {}