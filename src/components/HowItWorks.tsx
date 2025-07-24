import { Building, Lock, GraduationCap, Shield, Coins } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Building,
      title: "Company Posts Project",
      description: "Companies post project requirements, budget, and timeline to the decentralized platform."
    },
    {
      icon: Lock,
      title: "Funds Locked",
      description: "Smart contract automatically locks project funds in escrow until completion criteria are met."
    },
    {
      icon: GraduationCap,
      title: "Student Delivers",
      description: "Selected student completes the work and submits deliverables through the platform."
    },
    {
      icon: Shield,
      title: "DAO Verifies",
      description: "Decentralized community validates work quality and completion against project requirements."
    },
    {
      icon: Coins,
      title: "Payment Released",
      description: "Smart contract automatically releases payment and reputation tokens upon verification."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple steps to start your professional journey and earn while building your career.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto text-white text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-primary-light"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;