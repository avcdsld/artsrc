import * as fcl from '@onflow/fcl';

const network = process.env.FLOW_NETWORK || 'testnet';
const flownsAddress = '0xb05b2abb42335e88'; // Testnet. Mainnet: 0x233eb012d34b0070

export const resolveFlownsName = async (address: string): Promise<string | null> => {
  try {
    fcl.config().put(
      "accessNode.api",
      network === "mainnet" ? "https://rest-mainnet.onflow.org" : "https://rest-testnet.onflow.org"
    );
    const name = await fcl.query({
      cadence: `\
import Flowns from ${flownsAddress}
import Domains from ${flownsAddress}

pub fun main(address: Address): String? {
    let account = getAccount(address)
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  
    if collectionCap.check() != true {
      return nil
    }
  
    var flownsName = ""
    let collection = collectionCap.borrow()!
    let ids = collection.getIDs()
    flownsName = collection.borrowDomain(id: ids[0])!.getDomainName()
    for id in ids {
      let domain = collection.borrowDomain(id: id)!
      let isDefault = domain.getText(key: "isDefault")
      if isDefault == "true" {
        flownsName = domain.getDomainName()
        break
      }
    }
  
    return flownsName
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
