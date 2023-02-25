import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { walletState } from 'states/walletState';
import * as fcl from '@onflow/fcl';
import { flowNetwork } from 'config';

export function useWallet(): {
  isActive: boolean;
  account: { loggedIn: boolean; addr: string; } | undefined,
} {
  const [account, setAccount] = useRecoilState(walletState);

  useState(() => {
    fcl.config({
      'accessNode.api': flowNetwork === 'mainnet' ? 'https://rest-mainnet.onflow.org' : 'https://rest-testnet.onflow.org',
      'discovery.wallet': flowNetwork === 'mainnet' ? 'https://fcl-discovery.onflow.org/authn' : 'https://fcl-discovery.onflow.org/testnet/authn',
      'app.detail.title': 'art/src',
      'app.detail.icon': 'https://sakutaro.on.fleek.co/favicon.ico', // TODO: update
      'fcl.network': flowNetwork,
    });
    fcl.currentUser().subscribe((currentUser: any) => setAccount({ ...currentUser }));
  });

  return {
    isActive: (account && !!account.addr),
    account
  };
}
