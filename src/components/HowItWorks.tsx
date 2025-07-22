import { FileText, UserCheck, CheckCircle, Coins } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Browse & Apply",
      description: "Discover projects that match your skills and submit proposals with your portfolio."
    },
    {
      icon: UserCheck,
      title: "Get Selected",
      description: "Companies review applications and select the best candidates through our matching algorithm."
    },
    {
      icon: CheckCircle,
      title: "Complete Work",
      description: "Deliver high-quality work within deadlines using our collaborative workspace tools."
    },
    {
      icon: Coins,
      title: "Earn Rewards",
      description: "Receive instant payments and reputation tokens upon successful project completion."
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
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