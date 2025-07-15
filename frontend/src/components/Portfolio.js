import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';
import ContactSection from './ContactSection';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { healthAPI } from '../services/api';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState(null);
  const { data, loading, error, githubStats } = usePortfolioData();

  useEffect(() => {
    // Check backend health
    const checkBackendHealth = async () => {
      const health = await healthAPI.checkHealth();
      setBackendHealth(health);
    };
    
    checkBackendHealth();
    
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  if (isLoading || loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading Portfolio...</p>
          {backendHealth && (
            <p className="text-sm text-muted-foreground mt-2">
              Backend Status: {backendHealth.status}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-2">
              Using cached data due to API error
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation activeSection={activeSection} />
      
      <main>
        <HeroSection data={data.personal} />
        <AboutSection data={data.personal} />
        <SkillsSection data={data.skills} />
        <ProjectsSection data={data.projects} githubStats={githubStats} />
        <ExperienceSection data={data.experience} />
        <ContactSection data={data.personal} />
      </main>

      {/* Backend Status Indicator (dev mode) */}
      {process.env.NODE_ENV === 'development' && backendHealth && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            backendHealth.status === 'healthy' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            API: {backendHealth.status}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;