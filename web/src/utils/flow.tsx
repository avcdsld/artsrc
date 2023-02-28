import * as fcl from '@onflow/fcl';
import { flowNetwork } from 'config';

export const nonFungibleTokenAddress =
  flowNetwork === 'mainnet' ? '0x1d7e57aa55817448' : '0x631e88ae7f1d7c20';
export const artSourceAddress =
  flowNetwork === 'mainnet' ? 'TODO:' : '0x14a6943e1eebd98a';
export const artSourceCodesAddress =
  flowNetwork === 'mainnet' ? 'TODO:' : '0x14a6943e1eebd98a';
export const artSourceShowcaseAddress =
  flowNetwork === 'mainnet' ? 'TODO:' : '0x14a6943e1eebd98a';

export const createSourceNFT = async (args: {
  artType: string;
  title: string;
  description: string;
  imageIpfsCid: string;
  artistName: string;
  code: string;
}) => {
  const txCode = `\
import NonFungibleToken from ${nonFungibleTokenAddress}
import MetadataViews from ${nonFungibleTokenAddress}
import ArtSource from ${artSourceAddress}
import ArtSourceCodes from ${artSourceCodesAddress}
import ArtSourceShowcase from ${artSourceShowcaseAddress}

transaction(
    artType: String,
    title: String,
    description: String,
    imageIpfsCid: String,
    artistName: String,
    code: String
) {
    prepare(signer: AuthAccount) {
        if signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) == nil {
            signer.save(<- ArtSource.createEmptyCollection(), to: ArtSource.CollectionStoragePath)
            signer.link<&ArtSource.Collection{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic, MetadataViews.ResolverCollection}>(
                ArtSource.CollectionPublicPath,
                target: ArtSource.CollectionStoragePath
            )
        }

        let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
        let id = collectionRef.createSource(
            artType: artType,
            title: title,
            description: description,
            imageIpfsCid: imageIpfsCid,
            artistName: artistName,
            codes: <- [
                <- ArtSourceCodes.createP5JsCode(
                    code: code,
                    extraMetadata: {}
                )
            ]
        )

        let collectionCapability = signer.getCapability<&ArtSource.Collection{ArtSource.CollectionPublic}>(ArtSource.CollectionPublicPath)
        ArtSourceShowcase.addSource(id: id, collectionCapability: collectionCapability)
    }
}`;
  return await fcl.send([
    fcl.transaction(txCode),
    fcl.args([
      fcl.arg(args.artType, fcl.t.String),
      fcl.arg(args.title, fcl.t.String),
      fcl.arg(args.description, fcl.t.String),
      fcl.arg(args.imageIpfsCid, fcl.t.String),
      fcl.arg(args.artistName, fcl.t.String),
      fcl.arg(args.code, fcl.t.String),
    ]),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.payer(fcl.authz),
    fcl.limit(9999),
  ]);
};

export const createSourceNFTForContractCode = async (args: {
  artType: string;
  title: string;
  description: string;
  imageIpfsCid: string;
  artistName: string;
  contractAccountAddress: string;
  contractName: string;
}) => {
  const txCode = `\
import NonFungibleToken from ${nonFungibleTokenAddress}
import MetadataViews from ${nonFungibleTokenAddress}
import ArtSource from ${artSourceAddress}
import ArtSourceCodes from ${artSourceCodesAddress}
import ArtSourceShowcase from ${artSourceShowcaseAddress}

transaction(
  artType: String,
  title: String,
  description: String,
  imageIpfsCid: String,
  artistName: String,
  contractAccountAddress: Address,
  contractName: String
) {
  prepare(signer: AuthAccount) {
      if signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) == nil {
          signer.save(<- ArtSource.createEmptyCollection(), to: ArtSource.CollectionStoragePath)
          signer.link<&ArtSource.Collection{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic, MetadataViews.ResolverCollection}>(
              ArtSource.CollectionPublicPath,
              target: ArtSource.CollectionStoragePath
          )
      }

      let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
      let id = collectionRef.createSource(
          artType: artType,
          title: title,
          description: description,
          imageIpfsCid: imageIpfsCid,
          artistName: artistName,
          codes: <- [
              <- ArtSourceCodes.createContractCode(
                  accountAddress: contractAccountAddress,
                  contractName: contractName,
                  authAccountForOwnershipChecking: &signer as &AuthAccount,
                  extraMetadata: {}
              )
          ]
      )

      let collectionCapability = signer.getCapability<&ArtSource.Collection{ArtSource.CollectionPublic}>(ArtSource.CollectionPublicPath)
      ArtSourceShowcase.addSource(id: id, collectionCapability: collectionCapability)
  }
}`;
  return await fcl.send([
    fcl.transaction(txCode),
    fcl.args([
      fcl.arg(args.artType, fcl.t.String),
      fcl.arg(args.title, fcl.t.String),
      fcl.arg(args.description, fcl.t.String),
      fcl.arg(args.imageIpfsCid, fcl.t.String),
      fcl.arg(args.artistName, fcl.t.String),
      fcl.arg(args.contractAccountAddress, fcl.t.Address),
      fcl.arg(args.contractName, fcl.t.String),
    ]),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.payer(fcl.authz),
    fcl.limit(9999),
  ]);
};

export const updateSourceNFT = async (args: {
  sourceId: string;
  title: string;
  description: string;
  imageIpfsCid: string;
  artistName: string;
  code: string;
}) => {
  const txCode = `\
import NonFungibleToken from ${nonFungibleTokenAddress}
import ArtSource from ${artSourceAddress}
import ArtSourceCodes from ${artSourceCodesAddress}

transaction(
    id: UInt64,
    title: String,
    description: String,
    imageIpfsCid: String,
    artistName: String,
    code: String
) {
    prepare(signer: AuthAccount) {
        let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
        let nftRef = collectionRef.borrowArtSource(id: id)!
        nftRef.update(
            title: title,
            description: description,
            imageIpfsCid: imageIpfsCid,
            artistName: artistName,
            codes: <- [
                <- ArtSourceCodes.createP5JsCode(
                    code: code,
                    extraMetadata: {}
                )
            ]
        )
    }
}`;
  return await fcl.send([
    fcl.transaction(txCode),
    fcl.args([
      fcl.arg(args.sourceId, fcl.t.UInt64),
      fcl.arg(args.title, fcl.t.String),
      fcl.arg(args.description, fcl.t.String),
      fcl.arg(args.imageIpfsCid, fcl.t.String),
      fcl.arg(args.artistName, fcl.t.String),
      fcl.arg(args.code, fcl.t.String),
    ]),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.payer(fcl.authz),
    fcl.limit(9999),
  ]);
};
