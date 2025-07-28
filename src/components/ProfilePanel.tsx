import { useNavigate } from "react-router-dom";
import { X, Edit3, Trophy, Coins, Shield, Plus, ArrowDownToLine, Vote, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onDisconnect: () => void;
}

const ProfilePanel = ({ isOpen, onClose, walletAddress, onDisconnect }: ProfilePanelProps) => {
  const navigate = useNavigate();
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const recentActivities = [
    { action: "Applied to Project: DeFi Analytics Dashboard", date: "2 hours ago" },
    { action: "Funded Project: Smart Contract Audit", date: "1 day ago" },
    { action: "Left review for Student Alex Chen", date: "3 days ago" },
    { action: "Completed: NFT Marketplace Frontend", date: "1 week ago" },
    { action: "Posted Project: Blockchain Education Platform", date: "2 weeks ago" },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b bg-gradient-primary">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4 mt-2">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${walletAddress}`} />
                <AvatarFallback className="bg-white/10 text-white">
                  {walletAddress.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">
                  {formatAddress(walletAddress)}
                </h2>
                <p className="text-white/80 text-sm">UniversityDAO Member</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              847
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Based on completed projects, reviews, and DAO participation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-xs text-muted-foreground">Reputation</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="font-semibold">NaN</span>
                    </div>
                    <p className="text-xs text-muted-foreground">DAO Tokens</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">NaN ETH</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Escrow</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">5</div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <Button variant="link" className="p-0 h-auto text-xs">
                      View All
                    </Button>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">0</div>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">0</div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={() => navigate('/projects/new')}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs">Post Project</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <ArrowDownToLine className="w-5 h-5" />
                    <span className="text-xs">Withdraw</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 col-span-2">
                    <Vote className="w-5 h-5" />
                    <span className="text-xs">View DAO Proposals</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="border-t p-6 space-y-4">
            <Button
              variant="ghost"
              onClick={onDisconnect}
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              © 2024 UniversityDAO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;