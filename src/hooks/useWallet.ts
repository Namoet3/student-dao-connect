import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WalletState {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const saveWalletConnection = async (walletAddress: string) => {
    try {
      // First, try to get existing wallet connection
      const { data: existingConnection, error: fetchError } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching wallet connection:', fetchError);
        return;
      }

      if (existingConnection) {
        // Update existing connection
        const { error: updateError } = await supabase
          .from('wallet_connections')
          .update({
            last_connected_at: new Date().toISOString(),
            connection_count: existingConnection.connection_count + 1,
            user_agent: navigator.userAgent,
          })
          .eq('wallet_address', walletAddress.toLowerCase());

        if (updateError) {
          console.error('Error updating wallet connection:', updateError);
        }
      } else {
        // Insert new connection
        const { error: insertError } = await supabase
          .from('wallet_connections')
          .insert({
            wallet_address: walletAddress.toLowerCase(),
            user_agent: navigator.userAgent,
          });

        if (insertError) {
          console.error('Error inserting wallet connection:', insertError);
        }
      }
    } catch (error) {
      console.error('Error saving wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.'
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletState({
          account: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null,
        });
        
        // Save wallet connection to database
        await saveWalletConnection(accounts[0]);
      }
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            setWalletState(prev => ({
              ...prev,
              account: accounts[0],
              isConnected: true,
            }));
            
            // Save wallet connection to database on reconnection
            await saveWalletConnection(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
            isConnected: true,
          }));
          
          // Save wallet connection to database
          await saveWalletConnection(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}