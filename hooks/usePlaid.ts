import { useQuery } from '@tanstack/react-query';
import type { ConnectionStatus } from '@/types/plaid';

export function usePlaidConnection() {
  return useQuery<ConnectionStatus>({
    queryKey: ['plaidConnection'],
    queryFn: async () => {
      const response = await fetch('/api/plaid/status');
      if (!response.ok) {
        throw new Error('Failed to fetch connection status');
      }
      return response.json();
    },
  });
}