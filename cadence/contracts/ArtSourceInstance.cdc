import "NonFungibleToken"
import "MetadataViews"
import "ArtSource"

pub contract ArtSourceInstance: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    // TODO: add eventss

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let CollectionPrivatePath: PrivatePath
    pub var totalSupply: UInt64

    pub resource interface NFTPublic {
        pub let id: UInt64
        pub fun getViews(): [Type]
        pub fun resolveView(_ view: Type): AnyStruct?

        pub fun getCreatorAddress(): Address
        pub fun getArtType(): String
        pub fun getTitle(): String
        pub fun getDescription(): String
        pub fun getImageIpfsCid(): String
        pub fun getCodes(): [{ArtSource.ICode}]
        pub fun getVersion(): UInt16
        pub fun getCreatedAt(): UFix64
        pub fun getUpdatedAt(): UFix64
    }

    pub resource NFT: NFTPublic, NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let sourceID: UInt64
        pub let creatorAddress: Address
        pub let artType: String
        pub let title: String
        pub let description: String
        pub let imageIpfsCid: String
        pub let artistName: String
        pub let codes: [{ArtSource.ICode}]
        pub let version: UInt16
        pub let createdAt: UFix64
        pub let updatedAt: UFix64

        init(
            sourceID: UInt64,
            creatorAddress: Address,
            artType: String,
            title: String,
            description: String,
            imageIpfsCid: String,
            artistName: String,
            codes: [{ArtSource.ICode}],
            version: UInt16,
            createdAt: UFix64,
            updatedAt: UFix64
        ) {
            ArtSourceInstance.totalSupply = ArtSourceInstance.totalSupply + 1
            self.id = ArtSourceInstance.totalSupply
            
            self.sourceID = sourceID
            self.creatorAddress = creatorAddress
            self.artType = artType
            self.title = title
            self.description = description
            self.imageIpfsCid = imageIpfsCid
            self.artistName = artistName
            self.codes = codes
            self.version = version
            self.createdAt = createdAt
            self.updatedAt = updatedAt
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.Traits>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.title,
                        description: self.description,
                        thumbnail: MetadataViews.IPFSFile(cid: self.imageIpfsCid, path: nil)
                    )
                case Type<MetadataViews.Editions>():
                    // TODO:
                    return MetadataViews.Editions([MetadataViews.Edition(name: self.title, number: 1, max: 1)])
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(self.id)
                case Type<MetadataViews.Royalties>():
                    // TODO:
                    return nil
                case Type<MetadataViews.ExternalURL>():
                    // TODO:
                    return MetadataViews.ExternalURL("")
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: ArtSourceInstance.CollectionStoragePath,
                        publicPath: ArtSourceInstance.CollectionPublicPath,
                        providerPath: ArtSourceInstance.CollectionPrivatePath,
                        publicCollection: Type<&ArtSourceInstance.Collection{ArtSourceInstance.CollectionPublic}>(),
                        publicLinkedType: Type<&ArtSourceInstance.Collection{ArtSourceInstance.CollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&ArtSourceInstance.Collection{ArtSourceInstance.CollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Provider, MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <- ArtSourceInstance.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    // TODO:
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(url: ""),
                        mediaType: "image/png"
                    )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "ArtSourceInstance",
                        description: "",
                        externalURL: MetadataViews.ExternalURL(""),
                        squareImage: media,
                        bannerImage: media,
                        socials: {}
                    )
                case Type<MetadataViews.Traits>():
                    let traits: [MetadataViews.Trait] = []
                    traits.append(MetadataViews.Trait(name: "artType", value: self.artType, displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "creatorAddress", value: self.creatorAddress.toString(), displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "title", value: self.title, displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "description", value: self.description, displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "imageIpfsCid", value: self.imageIpfsCid, displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "artistName", value: self.artistName, displayType: nil, rarity: nil))
                    for index, code in self.codes {
                        var name = "code"
                        if index > 0 {
                            name.concat(index.toString())
                        }
                        traits.append(MetadataViews.Trait(name: name, value: code.getCode(), displayType: nil, rarity: nil))
                    }
                    traits.append(MetadataViews.Trait(name: "version", value: self.version, displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "createdAt", value: self.createdAt.toString(), displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "updatedAt", value: self.updatedAt.toString(), displayType: nil, rarity: nil))
                    return MetadataViews.Traits(traits)
            }
            return nil
        }

        pub fun getCreatorAddress(): Address {
            return self.creatorAddress
        }

        pub fun getArtType(): String {
            return self.artType
        }

        pub fun getTitle(): String {
            return self.title
        }

        pub fun getDescription(): String {
            return self.description
        }

        pub fun getImageIpfsCid(): String {
            return self.imageIpfsCid
        }

        pub fun getCodes(): [{ArtSource.ICode}] {
            return self.codes
        }

        pub fun getVersion(): UInt16 {
            return self.version
        }

        pub fun getCreatedAt(): UFix64 {
            return self.createdAt
        }

        pub fun getUpdatedAt(): UFix64 {
            return self.updatedAt
        }
    }

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowArtSourceInstancePublic(id: UInt64): &AnyResource{ArtSourceInstance.NFTPublic}? {
            post {
                (result == nil) || (result?.id == id): "Cannot borrow ArtSourceInstance reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ArtSourceInstance.NFT
            let id: UInt64 = token.id
            self.ownedNFTs[id] <-! token
            emit Deposit(id: id, to: self.owner?.address)
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }
 
        pub fun borrowArtSourceInstancePublic(id: UInt64): &AnyResource{ArtSourceInstance.NFTPublic}? {
            if self.ownedNFTs[id] != nil {
                return (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?) as! &AnyResource{ArtSourceInstance.NFTPublic}?
            }
            return nil
        }

        pub fun borrowArtSourceInstance(id: UInt64): &ArtSourceInstance.NFT? {
            if self.ownedNFTs[id] != nil {
                return (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?) as! &ArtSourceInstance.NFT?
            }
            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)! as! &ArtSourceInstance.NFT
            return nft as &AnyResource{MetadataViews.Resolver}
        }

        // Mint an instanceNFT from a sourceNFT
        pub fun createInstance(
            sourceNFT: &ArtSource.NFT
        ): UInt64 {
            pre {
                sourceNFT.maxNumOfInstances == nil || sourceNFT.numOfInstances < sourceNFT.maxNumOfInstances!: "Cannot create an instance"
            }
            sourceNFT.incrementNumOfInstances()
            let codes = sourceNFT.getCodes()
            for code in codes {
                code.createInstanceHook()
            }
            let instanceNFT <- create NFT(
                sourceID: sourceNFT.id,
                creatorAddress: sourceNFT.creatorAddress,
                artType: sourceNFT.artType,
                title: sourceNFT.title,
                description: sourceNFT.description,
                imageIpfsCid: sourceNFT.imageIpfsCid,
                artistName: sourceNFT.artistName,
                codes: codes,
                version: sourceNFT.version,
                createdAt: sourceNFT.createdAt,
                updatedAt: sourceNFT.updatedAt
            )
            let id = instanceNFT.id
            self.deposit(token: <- instanceNFT)
            return id
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    init() {
        self.totalSupply = 0
        self.CollectionStoragePath = /storage/ArtSourceInstanceCollection
        self.CollectionPublicPath = /public/ArtSourceInstanceCollection
        self.CollectionPrivatePath = /private/ArtSourceInstanceCollection

        self.account.save(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&ArtSourceInstance.Collection{NonFungibleToken.CollectionPublic, ArtSourceInstance.CollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )
        emit ContractInitialized()
    }
}
