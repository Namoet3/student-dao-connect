import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Users, DollarSign, Target, Shield, TrendingUp } from "lucide-react";

const ForEmployers = () => {
  const employerBenefits = [
    {
      icon: Zap,
      title: "Flexible Project Outsourcing",
      description: "Offload small-scale projects, research tasks, or design work flexibly to talented university students and recent graduates."
    },
    {
      icon: Users,
      title: "Access Fresh Talent",
      description: "Discover new talents and innovative project ideas from motivated students across engineering, design, data science, and more."
    },
    {
      icon: DollarSign,
      title: "Cost-Effective Solutions",
      description: "Reduce operational costs while supporting student development through competitive project-based payments and token rewards."
    },
    {
      icon: Target,
      title: "Quality Assurance",
      description: "DAO verification system ensures work quality and completion standards are met before payment release."
    },
    {
      icon: Shield,
      title: "Secure Escrow System",
      description: "Smart contracts automatically lock and release funds based on project completion, ensuring security and transparency."
    },
    {
      icon: TrendingUp,
      title: "Innovation & Growth",
      description: "Foster innovation and entrepreneurship by investing in startups and supporting the development of new projects."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Employers Choose UniversityDAO
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leverage blockchain technology for transparent, efficient, and secure project outsourcing to university talent.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employerBenefits.map((benefit, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForEmployers;