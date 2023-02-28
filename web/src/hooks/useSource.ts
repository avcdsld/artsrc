import useFlowQuery from 'hooks/useFlowQuery';
import { artSourceAddress, nonFungibleTokenAddress } from 'utils/flow';

interface SourceQueryParams {
  ownerAddress: string;
  sourceId: string;
}

const sourceQuery = ({ ownerAddress, sourceId }: SourceQueryParams) => {
  if (!ownerAddress || !sourceId) {
    return '';
  }

  return `\
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

pub fun main(address: Address, id: UInt64): [Source] {
    let account = getAccount(address)

    let collection = account
        .getCapability(ArtSource.CollectionPublicPath)
        .borrow<&{ArtSource.CollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

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
    return [
        Source(
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
        )
    ]
}`;
};

const useSource = (params?: SourceQueryParams) => {
  const ownerAddress = params?.ownerAddress || '';
  const sourceId = params?.sourceId || '';

  const { loading, error, data } = useFlowQuery(
    sourceQuery({ ownerAddress, sourceId }),
    (arg, t) => {
      return [
        arg(ownerAddress, t.Address),
        arg(sourceId, t.UInt64),
      ];
    }
  );

  return {
    loading,
    error,
    data: data.length > 0 ? data[0] : null,
  }
}

export default useSource;
