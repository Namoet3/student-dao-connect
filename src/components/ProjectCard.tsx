import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Star, MapPin } from "lucide-react";

interface ProjectCardProps {
  title: string;
  company: string;
  description: string;
  budget: string;
  duration: string;
  location: string;
  skills: string[];
  rating: number;
  proposals: number;
}

const ProjectCard = ({ 
  title, 
  company, 
  description, 
  budget, 
  duration, 
  location, 
  skills, 
  rating, 
  proposals 
}: ProjectCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-muted-foreground">{rating}</span>
          </div>
        </div>
        <CardDescription className="text-primary font-medium">
          {company}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-foreground font-medium">{budget}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {proposals} proposals
        </span>
        <Button variant="hero" size="sm">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;