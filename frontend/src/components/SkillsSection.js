import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Code, Database, Globe, Cloud, BarChart3, Palette, Search, Zap } from 'lucide-react';

const SkillsSection = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Web Development');
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

  const skillCategories = [
    { 
      name: 'Web Development', 
      icon: Code, 
      color: 'from-blue-500 to-purple-600',
      skills: data['Web Development'],
      proficiency: 95
    },
    { 
      name: 'Software Development', 
      icon: Database, 
      color: 'from-green-500 to-teal-600',
      skills: data['Software Development'],
      proficiency: 90
    },
    { 
      name: 'API & Backend', 
      icon: Globe, 
      color: 'from-orange-500 to-red-600',
      skills: data['API & Backend'],
      proficiency: 92
    },
    { 
      name: 'DevOps & Cloud', 
      icon: Cloud, 
      color: 'from-purple-500 to-pink-600',
      skills: data['DevOps & Cloud'],
      proficiency: 85
    },
    { 
      name: 'SEO & Analytics', 
      icon: Search, 
      color: 'from-indigo-500 to-blue-600',
      skills: data['SEO & Analytics'],
      proficiency: 98
    },
    { 
      name: 'Design & Multimedia', 
      icon: Palette, 
      color: 'from-pink-500 to-rose-600',
      skills: data['Design & Multimedia'],
      proficiency: 80
    }
  ];

  const topSkills = [
    { name: 'React/Next.js', level: 95, color: 'bg-blue-500' },
    { name: 'Python', level: 90, color: 'bg-green-500' },
    { name: 'SEO/SEM', level: 98, color: 'bg-purple-500' },
    { name: 'Node.js', level: 88, color: 'bg-orange-500' },
    { name: 'Machine Learning', level: 85, color: 'bg-red-500' },
    { name: 'Laravel/PHP', level: 92, color: 'bg-indigo-500' }
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience
          </p>
        </div>

        {/* Top Skills Overview */}
        <div className={`mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-2xl font-bold text-center mb-8 text-primary">Core Competencies</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {topSkills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-background rounded-lg border hover:shadow-lg transition-all duration-300">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress 
                    value={skill.level} 
                    className="h-2"
                    style={{ 
                      '--progress-background': skill.color.replace('bg-', ''),
                      backgroundColor: `var(--progress-background)` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {skillCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.name
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className={`${activeCategory === category.name ? 'block' : 'hidden'} animate-in fade-in-0 slide-in-from-bottom-4 duration-500`}
            >
              <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary">{category.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">Proficiency:</span>
                        <Progress value={category.proficiency} className="w-32 h-2" />
                        <span className="text-sm font-medium text-primary">{category.proficiency}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="p-3 text-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional Skills Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">15+</h3>
              <p className="text-muted-foreground">Programming Languages</p>
            </CardContent>
          </Card>
          
          <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">20+</h3>
              <p className="text-muted-foreground">Frameworks & Tools</p>
            </CardContent>
          </Card>
          
          <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">Projects Completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;