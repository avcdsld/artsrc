import { FlowWalletConnector } from 'utils/types';
import * as fcl from '@onflow/fcl';
import { flowNetwork } from 'config';

const bloctoEndpoint = flowNetwork === 'mainnet' ? 'https://flow-wallet.blocto.app/authn' : 'https://flow-wallet-testnet.blocto.app/authn';
const walletDiscoveryEndpoint = flowNetwork === 'mainnet' ? 'https://fcl-discovery.onflow.org/authn' : 'https://fcl-discovery.onflow.org/testnet/authn';

class WalletConnector extends FlowWalletConnector {
  endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  connect(setAccount: Function = () => { }): Promise<void> | void {
    fcl.config({
      'accessNode.api': flowNetwork === 'mainnet' ? 'https://rest-mainnet.onflow.org' : 'https://rest-testnet.onflow.org',
      'discovery.wallet': this.endpoint,
      'app.detail.title': 'art/src',
      'app.detail.icon': 'https://sakutaro.on.fleek.co/favicon.ico', // TODO: update
      'fcl.network': flowNetwork,
    });
    return fcl.authenticate();
  }

  disconnect(): Promise<void> | void {
    return fcl.unauthenticate();
  }

  connectEagerly(): Promise<void> | void {
  }
}

export const bloctoConnector = new WalletConnector(bloctoEndpoint);

export const walletDiscoveryConnector = new WalletConnector(walletDiscoveryEndpoint);
