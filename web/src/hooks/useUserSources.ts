import useFlowQuery from 'hooks/useFlowQuery';
import { sourcesPerPage } from 'config';
import { OrderDirection } from 'utils/types';
import { artSourceAddress, nonFungibleTokenAddress } from 'utils/flow';

interface UserSourcesQueryParams {
  address: string;
  fromIndex?: number;
  upToIndex?: number;
  orderDirection?: OrderDirection;
}

const userSourcesQuery = ({ fromIndex, upToIndex, orderDirection }: UserSourcesQueryParams) => `
import ArtSource from ${artSourceAddress}
import MetadataViews from ${nonFungibleTokenAddress}

pub struct Source {
  pub let sourceId: UInt64
  pub let artType: String
  pub let ownerAddress: Address
  pub let creatorAddress: Address
  pub let title: String
  pub let description: String
  pub let imageIpfsCid: String
  pub let artistName: String
  pub let code: String
  pub let version: UInt16
  pub let createdAt: UFix64
  pub let updatedAt: UFix64

  init(
    sourceId: UInt64,
    ownerAddress: Address,
    artType: String,
    creatorAddress: Address,
    title: String,
    description: String,
    imageIpfsCid: String,
    artistName: String,
    code: String,
    version: UInt16,
    createdAt: UFix64,
    updatedAt: UFix64
  ) {
    self.sourceId = sourceId
    self.ownerAddress = ownerAddress
    self.artType = artType
    self.creatorAddress = creatorAddress
    self.title = title
    self.description = description
    self.imageIpfsCid = imageIpfsCid
    self.artistName = artistName
    self.code = code
    self.version = version
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

pub fun main(address: Address):  [Source] {
    let account = getAccount(address)

    let collection = account
        .getCapability(ArtSource.CollectionPublicPath)
        .borrow<&{ArtSource.CollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

    var res: [Source] = []
    let ids = collection.getIDs()
    for id in ids {
        let nft = collection.borrowArtSourcePublic(id: id)!
        
        // TODO: replace to nft.getArtistName()
        let traits = (nft.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits)!
        var artistName = ""
        for trait in traits.traits {
            if trait.name == "artistName" {
                artistName = (trait.value as! String)!
            }
        }

        let code = nft.getCodes()[0].getCode()
        res.append(Source(
            sourceId: nft.id,
            ownerAddress: address,
            artType: nft.getArtType(),
            creatorAddress: nft.getCreatorAddress(),
            title: nft.getTitle(),
            description: nft.getDescription(),
            imageIpfsCid: nft.getImageIpfsCid(),
            artistName: artistName,
            code: code,
            version: nft.getVersion(),
            createdAt: nft.getCreatedAt(),
            updatedAt: nft.getUpdatedAt()
        ))
    }
    return res
}`;

const useUserSources = (params?: UserSourcesQueryParams) => {
  const address = params?.address || '';
  const upToIndex = params?.upToIndex || sourcesPerPage;
  const fromIndex = params?.fromIndex || 0;
  const orderDirection = params?.orderDirection || OrderDirection.DESC

  const { loading, error, data } = useFlowQuery(
    userSourcesQuery({ address, fromIndex, upToIndex, orderDirection }),
    (arg, t) => [
      arg(address, t.Address),
    ]
  );

  return {
    loading,
    error,
    data,
  }
}

export default useUserSources;
