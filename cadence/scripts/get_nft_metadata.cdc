import "ArtSource"
import "MetadataViews"

pub struct NFT {
    pub let owner: Address
    pub let display: MetadataViews.Display
    pub let editions: MetadataViews.Editions
    pub let externalURL: MetadataViews.ExternalURL
    pub let nftCollectionDisplay: MetadataViews.NFTCollectionDisplay
    pub let serial: MetadataViews.Serial
    pub let traits: MetadataViews.Traits

    init(
        owner: Address,
        display: MetadataViews.Display,
        editions: MetadataViews.Editions,
        externalURL: MetadataViews.ExternalURL,
        nftCollectionDisplay: MetadataViews.NFTCollectionDisplay,
        serial: MetadataViews.Serial,
        traits: MetadataViews.Traits,
    ) {
        self.owner = owner
        self.display = display
        self.editions = editions
        self.externalURL = externalURL
        self.nftCollectionDisplay = nftCollectionDisplay
        self.serial = serial
        self.traits = traits
    }
}

pub fun main(address: Address, id: UInt64): NFT {
    let account = getAccount(address)

    let collection = account
        .getCapability(ArtSource.CollectionPublicPath)
        .borrow<&{ArtSource.CollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

    let nft = collection.borrowArtSourcePublic(id: id)!
    let display = nft.resolveView(Type<MetadataViews.Display>())!
    let editions = nft.resolveView(Type<MetadataViews.Editions>())!
    let externalURL = nft.resolveView(Type<MetadataViews.ExternalURL>())!
    let nftCollectionDisplay = nft.resolveView(Type<MetadataViews.NFTCollectionDisplay>())!
    let serial = nft.resolveView(Type<MetadataViews.Serial>())!
    let traits = nft.resolveView(Type<MetadataViews.Traits>())!

    return NFT(
        owner: nft.owner!.address,
        display: (display as! MetadataViews.Display?)!,
        editions: (editions as! MetadataViews.Editions?)!,
        externalURL: (externalURL as! MetadataViews.ExternalURL?)!,
        nftCollectionDisplay: (nftCollectionDisplay as! MetadataViews.NFTCollectionDisplay?)!,
        serial: (serial as! MetadataViews.Serial?)!,
        traits: (traits as! MetadataViews.Traits?)!,
    )
}
