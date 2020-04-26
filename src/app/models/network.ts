import { NetworkType } from '@airgap/beacon-sdk';

// tslint:disable-next-line: no-namespace
export namespace Network {
  export function values(): string[] {
    return Object.values(NetworkType).filter(
      (value) => typeof value === 'string'
    ) as string[];
  }

  export function getUrl(network: NetworkType): string {
    return getNetwork(network).rpcUrl;
  }

  export function getNetwork(network: NetworkType) {
    return {
      [NetworkType.MAINNET]: {
        type: NetworkType.MAINNET,
        name: 'Mainnet',
        rpcUrl: 'https://api.tez.ie/rpc/mainnet',
      },
      [NetworkType.CARTHAGENET]: {
        type: NetworkType.CARTHAGENET,
        name: 'Carthagenet',
        rpcUrl: 'https://api.tez.ie/rpc/carthagenet',
      },
    }[network];
  }
}
