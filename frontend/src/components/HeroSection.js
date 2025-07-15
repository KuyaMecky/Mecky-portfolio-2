import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, Github, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const HeroSection = ({ data }) => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const roles = [
    'Full-Stack Developer',
    'ML Enthusiast',
    'Senior SEO Specialist',
    'Data Analyst'
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToNext = () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%)] bg-[length:60px_60px] opacity-10 animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-500/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-green-500/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image */}
          <div className={`relative mb-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary to-blue-600 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-6xl font-bold text-primary">
                {data.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full"></div>
          </div>

          {/* Name and Title */}
          <div className={`mb-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {data.name}
            </h1>
            <div className="text-xl md:text-2xl text-muted-foreground mb-2">
              <span className="inline-block">I'm a </span>
              <span className="inline-block font-semibold text-primary min-w-[200px] text-left">
                {roles[currentRole]}
              </span>
            </div>
          </div>

          {/* Location and Contact */}
          <div className={`mb-8 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <Badge variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {data.location}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {data.phone}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {data.email}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className={`mb-8 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`mb-12 transform transition-all duration-1000 delay-900 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                <Mail className="w-5 h-5 mr-2" />
                Get In Touch
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(data.github, '_blank')}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(data.linkedin, '_blank')}
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(data.portfolio, '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Portfolio
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button
              onClick={scrollToNext}
              className="mx-auto block text-muted-foreground hover:text-primary transition-colors animate-bounce"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;