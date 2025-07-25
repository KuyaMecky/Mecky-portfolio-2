import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Github, ExternalLink, Star, GitFork, Eye, Calendar, TrendingUp } from 'lucide-react';

const ProjectsSection = ({ data, githubStats }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects', count: data.length },
    { id: 'web', label: 'Web Development', count: data.filter(p => p.tech.some(t => ['React', 'Vue', 'Laravel', 'PHP', 'JavaScript'].includes(t))).length },
    { id: 'ml', label: 'Machine Learning', count: data.filter(p => p.tech.some(t => ['Python', 'TensorFlow', 'PyTorch', 'Jupyter'].includes(t))).length },
    { id: 'tools', label: 'Tools & Utilities', count: data.filter(p => p.tech.some(t => ['Node.js', 'CLI', 'API', 'MongoDB'].includes(t))).length }
  ];

  const getProjectCategory = (project) => {
    if (project.tech.some(tech => ['Python', 'TensorFlow', 'PyTorch', 'Jupyter', 'scikit-learn'].includes(tech))) {
      return 'ml';
    }
    if (project.tech.some(tech => ['React', 'Vue', 'Laravel', 'PHP', 'JavaScript', 'HTML', 'CSS'].includes(tech))) {
      return 'web';
    }
    return 'tools';
  };

  const filteredProjects = filter === 'all' 
    ? data 
    : data.filter(project => getProjectCategory(project) === filter);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-blue-500',
      'Java': 'bg-red-500',
      'TypeScript': 'bg-blue-600',
      'PHP': 'bg-purple-500',
      'C++': 'bg-blue-700',
      'HTML': 'bg-orange-500',
      'CSS': 'bg-blue-400',
      'Vue': 'bg-green-500',
      'React': 'bg-cyan-500',
      'Laravel': 'bg-red-600',
      'Node.js': 'bg-green-600',
      'MongoDB': 'bg-green-700',
      'MySQL': 'bg-blue-800',
      'Docker': 'bg-blue-600',
      'Git': 'bg-gray-600'
    };
    return colors[language] || 'bg-gray-500';
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my technical expertise and creative problem-solving
          </p>
        </div>

        {/* GitHub Stats */}
        {githubStats && Object.keys(githubStats).length > 0 && (
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Card className="p-4 text-center border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-primary mb-1">{githubStats.total_repos || 0}</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </CardContent>
            </Card>
            <Card className="p-4 text-center border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-yellow-500 mb-1">{githubStats.total_stars || 0}</div>
                <div className="text-sm text-muted-foreground">Stars</div>
              </CardContent>
            </Card>
            <Card className="p-4 text-center border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-blue-500 mb-1">{githubStats.total_forks || 0}</div>
                <div className="text-sm text-muted-foreground">Forks</div>
              </CardContent>
            </Card>
            <Card className="p-4 text-center border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-green-500 mb-1">{Object.keys(githubStats.languages || {}).length}</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Categories */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                filter === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <span className="font-medium">{category.label}</span>
              <Badge variant={filter === category.id ? "secondary" : "outline"} className="ml-1">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                index % 2 === 0 ? 'animate-in slide-in-from-left-8' : 'animate-in slide-in-from-right-8'
              }`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <CardContent className="p-0">
                {/* Project Image/Preview */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-white/30 group-hover:text-white/50 transition-all duration-300">
                      {project.name.split(' ')[0].slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-primary/90 flex items-center justify-center gap-4 transition-all duration-300 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => window.open(project.github, '_blank')}
                      className="transform hover:scale-105 transition-all duration-200"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    {project.live && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => window.open(project.live, '_blank')}
                        className="transform hover:scale-105 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </Button>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {project.stars !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{project.stars}</span>
                        </div>
                      )}
                      {project.forks !== undefined && (
                        <div className="flex items-center gap-1">
                          <GitFork className="w-4 h-4 text-blue-500" />
                          <span>{project.forks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                    {project.description}
                  </p>
                  
                  {/* Update Info */}
                  {project.updated && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {formatDate(project.updated)}</span>
                    </div>
                  )}
                  
                  {/* Technology Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 4).map((tech, techIndex) => (
                      <Badge 
                        key={techIndex} 
                        variant="outline" 
                        className={`text-xs hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 ${getLanguageColor(tech)} text-white border-0`}
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.tech.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tech.length - 4} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(project.github, '_blank')}
                      className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    {project.live && (
                      <Button 
                        size="sm" 
                        onClick={() => window.open(project.live, '_blank')}
                        className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GitHub Profile Link */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Card className="max-w-md mx-auto p-6 border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-0 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">View More Projects</h3>
              <p className="text-muted-foreground mb-4">
                Check out my GitHub profile for more projects and contributions
              </p>
              <Button 
                onClick={() => window.open('https://github.com/KuyaMecky', '_blank')}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300"
              >
                <Github className="w-4 h-4 mr-2" />
                Visit GitHub Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;