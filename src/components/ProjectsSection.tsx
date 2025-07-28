import React from "react";
import { Button } from "@/components/ui/button";
import { LegacyProjectCard } from "./LegacyProjectCard";
import { ArrowRight } from "lucide-react";

const ProjectsSection = () => {
  const featuredProjects = [
    {
      title: "Smart Contract Development for DeFi Platform",
      company: "BlockchainCorp",
      description: "We need an experienced Solidity developer to create and audit smart contracts for our new DeFi lending platform. This project involves creating secure, gas-optimized contracts with comprehensive testing.",
      budget: "$2,500 - $5,000",
      duration: "2-3 weeks",
      location: "Remote",
      skills: ["Solidity", "Smart Contracts", "DeFi", "Ethereum"],
      rating: 4.9,
      proposals: 12
    },
    {
      title: "React Frontend for University Management System",
      company: "EduTech Solutions",
      description: "Build a modern React dashboard for university administrators to manage student enrollment, courses, and grades. Must include responsive design and real-time data updates.",
      budget: "$1,500 - $3,000",
      duration: "3-4 weeks",
      location: "Hybrid",
      skills: ["React", "TypeScript", "Tailwind CSS", "API Integration"],
      rating: 4.8,
      proposals: 18
    },
    {
      title: "Market Research for Sustainable Tech Startup",
      company: "GreenTech Ventures",
      description: "Conduct comprehensive market research on renewable energy solutions for university campuses. Includes competitor analysis, market sizing, and trend identification.",
      budget: "$800 - $1,500",
      duration: "2 weeks",
      location: "Remote",
      skills: ["Market Research", "Data Analysis", "Report Writing", "Sustainability"],
      rating: 4.7,
      proposals: 8
    },
    {
      title: "Mobile App UI/UX Design for Student Community",
      company: "Campus Connect",
      description: "Design intuitive user interfaces for a mobile app connecting university students. Focus on modern design principles, accessibility, and user engagement.",
      budget: "$1,000 - $2,500",
      duration: "2-3 weeks",
      location: "Remote",
      skills: ["UI/UX Design", "Figma", "Mobile Design", "User Research"],
      rating: 4.9,
      proposals: 15
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exciting opportunities from top companies looking for talented students.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <LegacyProjectCard key={index} {...project} />
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;