import { Button } from "@/components/ui/button";
import { Wallet, Menu, Search, ChevronDown, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsBell } from "@/components/NotificationsBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfilePanel from "../ProfilePanel";
import { AccountsModal } from "../AccountsModal";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MainHeader = () => {
  const { formatAddress } = useWallet();
  const { user, isLoading, login, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const location = useLocation();

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

  const handleAccountsClick = () => {
    setIsAccountsOpen(true);
  };

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => cn(
    "text-muted-foreground hover:text-primary transition-colors",
    isActivePath(path) && "text-primary border-b-2 border-primary"
  );

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
              <Link to="/projects" className={navLinkClass("/projects")}>
                Projects
              </Link>
              <Link to="/for-students" className={navLinkClass("/for-students")}>
                For Students
              </Link>
              <Link to="/for-employers" className={navLinkClass("/for-employers")}>
                For Employers
              </Link>
              <Link to="/roadmap" className={navLinkClass("/roadmap")}>
                Roadmap
              </Link>
              <a href="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
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
            
            {user && <NotificationsBell />}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="hero" className="gap-2">
                    <Wallet className="w-4 h-4" />
                    {formatAddress(user.address)}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="z-50 min-w-[180px] bg-background border border-border shadow-lg"
                >
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAccountsClick}>
                    <Users className="w-4 h-4 mr-2" />
                    Accounts
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

      <AccountsModal
        isOpen={isAccountsOpen}
        onClose={() => setIsAccountsOpen(false)}
      />
    </>
  );
};

export default MainHeader;