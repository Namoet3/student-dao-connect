import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, Award, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle">
      <div className="container grid lg:grid-cols-2 gap-12 items-center py-20">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Decentralized
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Student Work </span>
              Platform
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Connect with real-world opportunities, build your portfolio, and earn while learning through blockchain-powered transparency and trust.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="gradient" size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              Browse Projects
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">NaN</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">NaN</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">NaN</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">NaN</div>
              <div className="text-sm text-muted-foreground">Paid Out</div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={heroImage} 
              alt="Students working on blockchain projects" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-primary rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-light rounded-full opacity-30 blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;