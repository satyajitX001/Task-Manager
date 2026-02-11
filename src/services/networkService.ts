import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatusListener = (isOnline: boolean) => void;

const resolveIsOnline = (state: NetInfoState): boolean =>
  Boolean(state.isConnected && state.isInternetReachable !== false);

class NetworkService {
  async isOnline(): Promise<boolean> {
    const currentState = await NetInfo.fetch();
    return resolveIsOnline(currentState);
  }

  subscribe(listener: NetworkStatusListener): () => void {
    const unsubscribe = NetInfo.addEventListener((state) => {
      listener(resolveIsOnline(state));
    });

    return unsubscribe;
  }
}

export const networkService = new NetworkService();
