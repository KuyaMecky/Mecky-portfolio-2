import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Building, TrendingUp, Users, Award } from 'lucide-react';

const ExperienceSection = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const getCompanyIcon = (company) => {
    if (company.includes('xFuture')) return '🚀';
    if (company.includes('Vertex')) return '💎';
    if (company.includes('Oriental')) return '🏮';
    if (company.includes('Wbridge')) return '🌉';
    return '💼';
  };

  const achievements = [
    { icon: TrendingUp, text: '150%+ organic traffic growth', color: 'text-green-500' },
    { icon: Users, text: 'Led team of 6 SEO professionals', color: 'text-blue-500' },
    { icon: Award, text: '40% increase in keyword rankings', color: 'text-purple-500' },
    { icon: Building, text: '5+ years of experience', color: 'text-orange-500' }
  ];

  return (
    <section id="experience" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My journey through various roles and the impact I've made
          </p>
        </div>

        {/* Key Achievements */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {achievements.map((achievement, index) => (
            <Card key={index} className="p-6 text-center border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{achievement.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Experience Timeline */}
        <div className={`max-w-6xl mx-auto transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Timeline Navigation */}
            <div className="lg:order-1">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                
                {data.map((job, index) => (
                  <div
                    key={index}
                    className={`relative mb-8 cursor-pointer transition-all duration-300 ${
                      activeIndex === index ? 'transform scale-105' : 'hover:transform hover:scale-102'
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      activeIndex === index 
                        ? 'bg-primary border-primary shadow-lg' 
                        : 'bg-background border-primary/50 hover:border-primary'
                    }`}></div>
                    
                    {/* Job Summary */}
                    <div className="ml-16">
                      <Card className={`p-4 border-2 transition-all duration-300 ${
                        activeIndex === index 
                          ? 'border-primary/50 shadow-lg bg-primary/5' 
                          : 'border-border hover:border-primary/30'
                      }`}>
                        <CardContent className="p-0">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{getCompanyIcon(job.company)}</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-primary mb-1">{job.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {job.period}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {job.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Details */}
            <div className="lg:order-2">
              <div className="sticky top-24">
                <Card className="p-8 border-2 border-primary/50 bg-gradient-to-br from-background to-primary/5">
                  <CardContent className="p-0">
                    {data[activeIndex] && (
                      <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-4xl">{getCompanyIcon(data[activeIndex].company)}</div>
                          <div>
                            <h3 className="text-2xl font-bold text-primary mb-1">
                              {data[activeIndex].title}
                            </h3>
                            <p className="text-lg text-muted-foreground mb-2">
                              {data[activeIndex].company}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {data[activeIndex].period}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {data[activeIndex].location}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
                          <p className="leading-relaxed">{data[activeIndex].description}</p>
                        </div>
                        
                        {/* Key Responsibilities */}
                        <div className="grid gap-3">
                          {data[activeIndex].description.split('.').filter(item => item.trim()).map((responsibility, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-muted-foreground">{responsibility.trim()}.</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Card className="max-w-md mx-auto p-6 border-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-0 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Ready to Collaborate?</h3>
              <p className="text-muted-foreground mb-4">
                Let's discuss how I can contribute to your team's success
              </p>
              <Button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300"
              >
                Get In Touch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;