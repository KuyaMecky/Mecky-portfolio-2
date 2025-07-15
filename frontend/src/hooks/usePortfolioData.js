import { useState, useEffect } from 'react';
import { portfolioAPI, githubAPI } from '../services/api';
import { mockData } from '../data/mock';

export const usePortfolioData = () => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubStats, setGithubStats] = useState({});

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real data from backend
      const portfolioData = await portfolioAPI.getPortfolioData();
      const stats = await githubAPI.getStats();

      if (portfolioData) {
        // Transform the data to match our frontend structure
        const transformedData = {
          personal: portfolioData.personal,
          skills: portfolioData.skills.reduce((acc, skill) => {
            acc[skill.name] = skill.skills;
            return acc;
          }, {}),
          experience: portfolioData.experience,
          projects: portfolioData.projects.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || 'No description available',
            tech: repo.languages?.map(lang => lang.language) || [repo.language].filter(Boolean),
            github: repo.html_url,
            live: repo.homepage || null,
            image: "/api/placeholder/400/250",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            updated: repo.updated_at,
            created: repo.created_at
          })),
          certifications: mockData.certifications, // Keep static data
          education: mockData.education // Keep static data
        };

        setData(transformedData);
        setGithubStats(stats);
      } else {
        // Fallback to mock data if API fails
        console.warn('Using mock data as fallback');
        setData(mockData);
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message);
      // Use mock data as fallback
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchPortfolioData();
  };

  return {
    data,
    loading,
    error,
    githubStats,
    refreshData
  };
};