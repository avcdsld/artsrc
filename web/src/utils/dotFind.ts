import * as fcl from '@onflow/fcl';

const network = process.env.FLOW_NETWORK || 'testnet';
const dotFindAddress = '0x35717efbbce11c74'; // Testnet. Mainnet: 0x097bafa4e0b48eef

export const resolveDotFindName = async (address: string): Promise<string | null> => {
  try {
    fcl.config().put(
      "accessNode.api",
      network === "mainnet" ? "https://rest-mainnet.onflow.org" : "https://rest-testnet.onflow.org"
    );
    const name = await fcl.query({
      cadence: `\
import FIND from ${dotFindAddress}

pub fun main(address: Address) :  String? {
    return FIND.reverseLookup(address)
}`,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
      ],
    });
    return name;
  } catch (error) {
    console.error('Error resolving .find name for address', error)
    return null;
  }
}
