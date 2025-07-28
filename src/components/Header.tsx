import { Button } from "@/components/ui/button";
import { Wallet, Menu, Search, Bell, ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfilePanel from "./ProfilePanel";
import { useState } from "react";

const Header = () => {
  const { formatAddress } = useWallet();
  const { user, isLoading, login, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleWalletAction = async () => {
    if (user) {
      logout();
      setIsProfileOpen(false);
    } else {
      await login();
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">UD</span>
              </div>
              <span className="font-bold text-xl text-foreground">UniversityDAO</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link to="/for-students" className="text-muted-foreground hover:text-primary transition-colors">
                For Students
              </Link>
              <Link to="/for-employers" className="text-muted-foreground hover:text-primary transition-colors">
                For Employers
              </Link>
              <Link to="/roadmap" className="text-muted-foreground hover:text-primary transition-colors">
                Roadmap
              </Link>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How It Works
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="hero" className="gap-2">
                    <Wallet className="w-4 h-4" />
                    {formatAddress(user.address)}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleWalletAction}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="hero" 
                className="gap-2" 
                onClick={handleWalletAction}
                disabled={isLoading}
              >
                <Wallet className="w-4 h-4" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {user && (
        <ProfilePanel
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          walletAddress={user.address}
          onDisconnect={handleWalletAction}
        />
      )}
    </>
  );
};

export default Header;