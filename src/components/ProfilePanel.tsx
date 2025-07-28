import { useNavigate } from "react-router-dom";
import { X, Edit3, Trophy, Coins, Shield, Plus, ArrowDownToLine, Vote, LogOut, FileText, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectCounts } from '@/hooks/useProjectCounts';
import { useActivities } from '@/hooks/useActivities';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onDisconnect: () => void;
}

const ProfilePanel = ({ isOpen, onClose, walletAddress, onDisconnect }: ProfilePanelProps) => {
  const navigate = useNavigate();
  const { data: projectCounts, isLoading: countsLoading } = useProjectCounts();
  const { data: activities, isLoading: activitiesLoading } = useActivities(10);
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (kind: string) => {
    switch (kind) {
      case 'posted_project':
        return <FileText className="w-3 h-3 text-blue-500" />;
      case 'pending_application':
        return <Users className="w-3 h-3 text-yellow-500" />;
      case 'accepted_application':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'rejected_application':
        return <X className="w-3 h-3 text-red-500" />;
      default:
        return <div className="w-2 h-2 bg-primary rounded-full" />;
    }
  };

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
                              NaN
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
                {countsLoading ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Skeleton className="h-8 w-12 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Posted</p>
                    </div>
                    <div>
                      <Skeleton className="h-8 w-12 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                    <div>
                      <Skeleton className="h-8 w-12 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{projectCounts?.posted || 0}</div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs"
                        onClick={() => navigate('/projects?tab=my-projects')}
                      >
                        View All
                      </Button>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{projectCounts?.active || 0}</div>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{projectCounts?.completed || 0}</div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {activitiesLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-start gap-3 p-2">
                        <Skeleton className="w-4 h-4 rounded-full mt-1" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))
                  ) : activities && activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                        {getActivityIcon(activity.kind)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-relaxed">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground text-sm">
                      No recent activity
                    </div>
                  )}
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