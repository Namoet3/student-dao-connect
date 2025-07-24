import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Users, TrendingUp } from 'lucide-react';

interface WalletStats {
  totalConnections: number;
  uniqueWallets: number;
  recentConnections: number;
}

const WalletStats = () => {
  const [stats, setStats] = useState<WalletStats>({
    totalConnections: 0,
    uniqueWallets: 0,
    recentConnections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletStats = async () => {
      try {
        // Get total connections (sum of all connection_count)
        const { data: totalData, error: totalError } = await supabase
          .from('wallet_connections')
          .select('connection_count');

        if (totalError) {
          console.error('Error fetching total connections:', totalError);
          return;
        }

        const totalConnections = totalData?.reduce((sum, row) => sum + row.connection_count, 0) || 0;

        // Get unique wallets count
        const { count: uniqueWallets, error: uniqueError } = await supabase
          .from('wallet_connections')
          .select('*', { count: 'exact', head: true });

        if (uniqueError) {
          console.error('Error fetching unique wallets:', uniqueError);
          return;
        }

        // Get recent connections (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { count: recentConnections, error: recentError } = await supabase
          .from('wallet_connections')
          .select('*', { count: 'exact', head: true })
          .gte('last_connected_at', yesterday.toISOString());

        if (recentError) {
          console.error('Error fetching recent connections:', recentError);
          return;
        }

        setStats({
          totalConnections,
          uniqueWallets: uniqueWallets || 0,
          recentConnections: recentConnections || 0,
        });
      } catch (error) {
        console.error('Error fetching wallet stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletStats();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalConnections.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">All-time wallet connections</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Wallets</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueWallets.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Different wallet addresses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentConnections.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Connections in last 24h</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletStats;