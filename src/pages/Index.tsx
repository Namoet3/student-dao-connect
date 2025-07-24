import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ProjectsSection from "@/components/ProjectsSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WalletStats from "@/components/WalletStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <section className="py-12 bg-gradient-subtle">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Platform Statistics
            </h2>
            <p className="text-muted-foreground">
              Real-time data from our growing community
            </p>
          </div>
          <WalletStats />
        </div>
      </section>
      <Features />
      <HowItWorks />
      <ProjectsSection />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
