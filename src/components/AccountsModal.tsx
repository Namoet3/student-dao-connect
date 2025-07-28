import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/useAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, Trash2, Plus, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface AccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountsModal = ({ isOpen, onClose }: AccountsModalProps) => {
  const { savedAccounts, removeAccount, updateAccountName } = useAccounts();
  const { user, login, logout } = useAuth();
  const { formatAddress } = useWallet();
  const { toast } = useToast();
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSwitchAccount = async (targetAddress: string) => {
    if (user?.address.toLowerCase() === targetAddress.toLowerCase()) {
      toast({
        title: "Already Connected",
        description: "This account is already connected.",
      });
      return;
    }

    try {
      // First logout current account
      logout();
      
      // Request wallet to switch to specific account
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        // Check if the target account is available
        const targetFound = accounts.find((acc: string) => 
          acc.toLowerCase() === targetAddress.toLowerCase()
        );
        
        if (!targetFound) {
          toast({
            title: "Account Not Available",
            description: "Please make sure this account is available in your wallet and try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Trigger new login which will sign with current wallet account
      await login();
      onClose();
    } catch (error) {
      console.error('Failed to switch account:', error);
      toast({
        title: "Switch Failed",
        description: "Failed to switch account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNewAccount = async () => {
    try {
      await login();
      onClose();
    } catch (error) {
      console.error('Failed to add new account:', error);
    }
  };

  const handleRemoveAccount = (address: string) => {
    removeAccount(address);
    toast({
      title: "Account Removed",
      description: "Account has been removed from your saved accounts.",
    });
  };

  const handleStartEdit = (address: string, currentName?: string) => {
    setEditingAccount(address);
    setEditName(currentName || '');
  };

  const handleSaveEdit = () => {
    if (editingAccount) {
      updateAccountName(editingAccount, editName.trim());
      setEditingAccount(null);
      setEditName('');
      toast({
        title: "Name Updated",
        description: "Account name has been updated.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Account</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {savedAccounts.length > 0 ? (
            <div className="space-y-2">
              {savedAccounts.map((account) => {
                const isActive = user?.address.toLowerCase() === account.address.toLowerCase();
                const isEditing = editingAccount === account.address;
                
                return (
                  <div key={account.address} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Account name"
                            className="h-8"
                            autoFocus
                          />
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-sm">
                            {account.name || `Account ${savedAccounts.indexOf(account) + 1}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatAddress(account.address)}
                          </div>
                          {isActive && (
                            <div className="text-xs text-primary font-medium">Active</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleStartEdit(account.address, account.name)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        {!isActive && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSwitchAccount(account.address)}
                              className="gap-1"
                            >
                              <Wallet className="h-4 w-4" />
                              Switch
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveAccount(account.address)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No saved accounts found
            </div>
          )}
          
          <Button 
            onClick={handleAddNewAccount}
            className="w-full gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add New Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};