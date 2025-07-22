import { Button } from "@/components/ui/button";
import { Wallet, Menu, Search, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">UD</span>
            </div>
            <span className="font-bold text-xl text-foreground">UniversityDAO</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Browse Projects
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Post Project
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-64 px-3 py-2 border border-input rounded-md text-sm bg-background"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button variant="hero" className="gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;