import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GraduationCap, DollarSign, Trophy, Users, TrendingUp, Building } from "lucide-react";

const ForStudents = () => {
  const studentBenefits = [
    {
      icon: DollarSign,
      title: "Earn While Learning",
      description: "Gain real income through project work and internships while building your portfolio and gaining hands-on experience."
    },
    {
      icon: Trophy,
      title: "Build Your Reputation",
      description: "Earn reputation tokens and NFT-based achievement certificates that validate your skills and project successes."
    },
    {
      icon: Building,
      title: "Work with Real Companies",
      description: "Access opportunities with SMEs, startups, and research-oriented teams looking for fresh talent and innovative solutions."
    },
    {
      icon: Users,
      title: "Peer-to-Peer Learning",
      description: "Connect with fellow students, access mentorship matching, and participate in collaborative learning spaces."
    },
    {
      icon: TrendingUp,
      title: "Career Advancement",
      description: "High-reputation students get access to exclusive internship and job placement opportunities."
    },
    {
      icon: GraduationCap,
      title: "Skill Development",
      description: "Access learning modules to prove skills in your field and participate in token-rewarded hackathons and competitions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              For Students
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Transform your university experience into a professional journey. Earn income, build your portfolio, and connect with industry leaders through our decentralized platform.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <p className="text-2xl font-bold text-white mb-2">7 Million Students</p>
              <p className="text-white/80">Ready to join the future of work</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Students Choose UniversityDAO
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gain hands-on experience, build portfolios, earn income, and transition into professional life with transparency and trust.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentBenefits.map((benefit, index) => (
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

export default ForStudents;