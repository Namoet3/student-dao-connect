// This hook is deprecated - use useAuth instead
// Keeping for backward compatibility but functionality moved to AuthContext

export const useWallet = () => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    formatAddress,
  };
};