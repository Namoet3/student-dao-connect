import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  address: string;
  jwt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  switchAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First request permissions to force account chooser
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });

      // Then request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];

      // Get nonce from server
      const { data: nonceData, error: nonceError } = await supabase.functions.invoke('auth/nonce');
      
      if (nonceError) {
        throw new Error('Failed to get nonce');
      }

      const { nonce } = nonceData;

      // Create message to sign
      const message = `UniversityDAO wants you to sign in.\nWallet address: ${address}\nNonce: ${nonce}`;

      // Request signature from MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Verify signature with server
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('auth/verify', {
        body: {
          address,
          nonce,
          signature,
        },
      });

      if (verifyError) {
        throw new Error('Signature verification failed');
      }

      const { jwt } = verifyData;

      setUser({
        address: address.toLowerCase(),
        jwt,
      });

      toast({
        title: "Connected Successfully",
        description: `Welcome ${formatAddress(address)}!`,
      });

    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = connectWallet;
  const switchAccount = connectWallet;

  const logout = async () => {
    setUser(null);
    
    // Optionally request wallet lock (non-blocking)
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
      }
    } catch (error) {
      // This is expected to fail in some cases, that's okay
      console.log('Wallet lock request completed');
    }

    toast({
      title: "Disconnected",
      description: "You have been signed out successfully.",
    });
  };

  // Listen for wallet events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Wallet locked or disconnected
        if (user) {
          logout();
          toast({
            title: "Wallet Locked",
            description: "Wallet locked. Please reconnect.",
            variant: "destructive",
          });
        }
      }
    };

    const handleDisconnect = () => {
      if (user) {
        logout();
        toast({
          title: "Wallet Disconnected",
          description: "Wallet disconnected. Please reconnect.",
          variant: "destructive",
        });
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, [user]);

  // No auto-connection on app start - user must explicitly connect

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}