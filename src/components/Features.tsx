import { Shield, Zap, Globe, Coins, Star, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Smart contracts ensure transparent payments and secure project management with zero manipulation risk."
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Automated payment release upon project completion verification through decentralized consensus."
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access international projects and collaborate with companies worldwide without geographical barriers."
    },
    {
      icon: Coins,
      title: "Token Rewards",
      description: "Earn reputation tokens and cryptocurrency rewards for successful project completion and quality work."
    },
    {
      icon: Star,
      title: "Reputation System",
      description: "Build an immutable reputation score that follows you throughout your career journey."
    },
    {
      icon: Users,
      title: "DAO Governance",
      description: "Participate in platform decisions and contribute to the evolution of the ecosystem through voting."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose UniversityDAO?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of student employment with cutting-edge blockchain technology and transparent governance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;