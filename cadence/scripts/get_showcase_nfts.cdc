import "MetadataViews"
import "ArtSource"
import "ArtSourceShowcase"

pub struct Source {
  pub let sourceId: UInt64
  pub let artType: String
  pub let ownerAddress: Address
  pub let creatorAddress: Address
  pub let title: String
  pub let description: String
  pub let imageIpfsCid: String
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
    self.code = code
    self.version = version
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

pub fun main(from: Int, upTo: Int): [Source] {
    var res: [Source] = []

    let sources = ArtSourceShowcase.getSources(from: from, upTo: upTo)
    for source in sources {
        let collection = getAccount(source.owner)
            .getCapability(ArtSource.CollectionPublicPath)
            .borrow<&{ArtSource.CollectionPublic}>()

        if collection != nil {
            let nft = collection!.borrowArtSourcePublic(id: source.id)!
            let code = nft.getCode()
            res.append(Source(
                sourceId: nft.id,
                ownerAddress: source.owner,
                artType: nft.getArtType(),
                creatorAddress: nft.getCreatorAddress(),
                title: nft.getTitle(),
                description: nft.getDescription(),
                imageIpfsCid: nft.getImageIpfsCid(),
                code: code != nil ? code! : nft.getContractCode()!.getCode(),
                version: nft.getVersion(),
                createdAt: nft.getCreatedAt(),
                updatedAt: nft.getUpdatedAt()
            ))
        }
    }
    return res
}
