import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Account {
  address: string;
  lastConnected: string;
  name?: string;
}

export const useAccounts = () => {
  const [savedAccounts, setSavedAccounts] = useState<Account[]>([]);
  const { user } = useAuth();

  // Load saved accounts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('universitydao_accounts');
    if (saved) {
      try {
        const accounts = JSON.parse(saved);
        setSavedAccounts(accounts);
      } catch (error) {
        console.error('Failed to parse saved accounts:', error);
      }
    }
  }, []);

  // Save current account when user changes
  useEffect(() => {
    if (user) {
      const currentAccount: Account = {
        address: user.address,
        lastConnected: new Date().toISOString(),
      };

      setSavedAccounts(prev => {
        const existing = prev.find(acc => acc.address.toLowerCase() === user.address.toLowerCase());
        let updated;
        
        if (existing) {
          // Update existing account's last connected time
          updated = prev.map(acc => 
            acc.address.toLowerCase() === user.address.toLowerCase() 
              ? { ...acc, lastConnected: currentAccount.lastConnected }
              : acc
          );
        } else {
          // Add new account
          updated = [...prev, currentAccount];
        }

        // Keep only last 10 accounts, sorted by most recent
        const sorted = updated
          .sort((a, b) => new Date(b.lastConnected).getTime() - new Date(a.lastConnected).getTime())
          .slice(0, 10);

        localStorage.setItem('universitydao_accounts', JSON.stringify(sorted));
        return sorted;
      });
    }
  }, [user]);

  const removeAccount = (address: string) => {
    setSavedAccounts(prev => {
      const updated = prev.filter(acc => acc.address.toLowerCase() !== address.toLowerCase());
      localStorage.setItem('universitydao_accounts', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAccountName = (address: string, name: string) => {
    setSavedAccounts(prev => {
      const updated = prev.map(acc =>
        acc.address.toLowerCase() === address.toLowerCase()
          ? { ...acc, name }
          : acc
      );
      localStorage.setItem('universitydao_accounts', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    savedAccounts,
    removeAccount,
    updateAccountName,
  };
};
