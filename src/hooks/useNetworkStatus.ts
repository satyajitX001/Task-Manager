import { useEffect, useState } from 'react';

import { networkService } from '../services/networkService';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrapNetworkState = async () => {
      const currentStatus = await networkService.isOnline();

      if (isMounted) {
        setIsOnline(currentStatus);
      }
    };

    void bootstrapNetworkState();

    const unsubscribe = networkService.subscribe((nextStatus) => {
      setIsOnline(nextStatus);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return isOnline;
}
