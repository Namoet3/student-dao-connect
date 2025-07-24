import { Button } from "@/components/ui/button";
import { Wallet, Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isConnected, isConnecting, account, connectWallet, disconnectWallet, formatAddress, error } = useWallet();
  const { toast } = useToast();

  const handleWalletAction = async () => {
    if (isConnected) {
      disconnectWallet();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });
    } else {
      await connectWallet();
      if (error) {
        toast({
          title: "Connection Failed",
          description: error,
          variant: "destructive",
        });
      }
    }
  };

  return (
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
          
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Wallet className="w-4 h-4" />
                  {formatAddress(account!)}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleWalletAction}>
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="hero" 
              className="gap-2" 
              onClick={handleWalletAction}
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;