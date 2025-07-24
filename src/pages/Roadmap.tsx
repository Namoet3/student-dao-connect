import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Circle, Clock } from "lucide-react";

const Roadmap = () => {
  const roadmapPhases = [
    {
      phase: "MVP",
      title: "Minimum Viable Product",
      status: "completed",
      timeline: "Q1 2024",
      features: [
        "Simple project posting and application modules",
        "Locked payment & delivery confirmation workflow",
        "Initial reputation metric tracking",
        "Basic smart contract infrastructure",
        "User registration and profile creation"
      ]
    },
    {
      phase: "Expansion",
      title: "Platform Growth",
      status: "in-progress",
      timeline: "Q2-Q3 2024",
      features: [
        "Mobile notifications and real-time chat",
        "Mentorship matching interface",
        "AI-based candidate-project matching algorithm",
        "NFT-based achievement certificates",
        "Learning modules for skill verification",
        "Campus ambassador program launch"
      ]
    },
    {
      phase: "Maturation",
      title: "Full Ecosystem",
      status: "planned",
      timeline: "Q4 2024 & Beyond",
      features: [
        "Multi-currency support and regional expansion",
        "Internship and job placement modules",
        "DAO voting for conflict resolution",
        "University partnerships program",
        "Peer-to-peer learning spaces",
        "Staking and reward mechanisms",
        "Token-rewarded hackathons and competitions"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "in-progress":
        return <Clock className="w-8 h-8 text-primary" />;
      case "planned":
        return <Circle className="w-8 h-8 text-muted-foreground" />;
      default:
        return <Circle className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50";
      case "in-progress":
        return "border-primary bg-primary/5";
      case "planned":
        return "border-muted-foreground bg-muted";
      default:
        return "border-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Roadmap
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our journey to revolutionize student work and internship opportunities through blockchain technology and decentralized governance.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {roadmapPhases.map((phase, index) => (
              <div key={index} className="relative">
                {/* Timeline Line */}
                {index < roadmapPhases.length - 1 && (
                  <div className="absolute left-4 top-16 w-0.5 h-full bg-gradient-to-b from-primary to-muted-foreground"></div>
                )}
                
                <div className={`relative flex items-start gap-6 mb-12 p-6 rounded-lg border-2 ${getStatusColor(phase.status)}`}>
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-2">
                    {getStatusIcon(phase.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                        {phase.phase}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {phase.timeline}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {phase.title}
                    </h3>
                    
                    <div className="space-y-2">
                      {phase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <p className="text-muted-foreground">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Roadmap;