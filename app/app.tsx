'use client';

import { usePlaidLink } from 'react-plaid-link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePlaidConnection } from '@/hooks/usePlaid';
import type { PlaidAccount } from '@/types/plaid';
import { plaidClient } from '@/lib/plaid';

export default function Home() {
  // const queryClient = plaidClient
  const { data: connectionStatus, isLoading: isLoadingStatus } = usePlaidConnection();
  
  const { data: linkTokenData, isLoading: isLoadingToken } = useQuery({
    queryKey: ['linkToken'],
    queryFn: async () => {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to create link token');
      }
      return response.json();
    },
    // Only fetch if not connected
    enabled: !connectionStatus?.connected,
  });

  const { mutate: exchangeToken } = useMutation({
    mutationFn: async (public_token: string) => {
      const response = await fetch('/api/auth/get-public-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      if (!response.ok) {
        throw new Error('Failed to exchange token');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch connection status
      queryClient.invalidateQueries({ queryKey: ['plaidConnection'] });
    },
  });

  const { open, ready } = usePlaidLink({
    token: linkTokenData?.link_token,
    onSuccess: (public_token, metadata) => {
      exchangeToken(public_token);
    },
  });

  if (isLoadingStatus) {
    return <div>Loading connection status...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bank Connection</h1>
      
      {connectionStatus?.connected ? (
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded">
            <h2 className="text-lg font-semibold text-green-800">
              Connected to {connectionStatus.institution?.name}
            </h2>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Your Accounts</h3>
            {connectionStatus.accounts?.map((account: PlaidAccount) => (
              <div key={account.id} className="border p-4 rounded">
                <p className="font-medium">{account.name}</p>
                <p className="text-gray-600">****{account.mask}</p>
                <p className="text-green-600">
                  ${account.balances.available.toFixed(2)} available
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4">Connect your bank account to get started</p>
          <button
            onClick={() => open()}
            disabled={!ready || isLoadingToken}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoadingToken ? 'Loading...' : 'Connect a bank account'}
          </button>
        </div>
      )}
    </div>
  );
}