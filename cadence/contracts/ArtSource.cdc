import "NonFungibleToken"
import "MetadataViews"

pub contract ArtSource: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    // TODO: add events

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let CollectionPrivatePath: PrivatePath
    pub var totalSupply: UInt64

    pub struct ContractCode {
        pub let accountAddress: Address
        pub let contractName: String

        init(
            accountAddress: Address,
            contractName: String,
            authAccountForOwnershipChecking: &AuthAccount
        ) {
            post {
                authAccountForOwnershipChecking.address == accountAddress: "Invalid account"
                authAccountForOwnershipChecking.contracts.get(name: self.contractName) != nil: "Invalid contract ownership"
            }
            self.accountAddress = accountAddress
            self.contractName = contractName
        }

        pub fun getCode(): String {
            return String.fromUTF8(getAccount(self.accountAddress).contracts.get(name: self.contractName)!.code)!
        }
    }

    pub resource interface NFTPublic {
        pub let id: UInt64
        pub fun getViews(): [Type]
        pub fun resolveView(_ view: Type): AnyStruct?

        pub fun getArtType(): String
        pub fun getCreatorAddress(): Address
        pub fun getTitle(): String
        pub fun getDescription(): String
        pub fun getImageIpfsCid(): String
        pub fun getCode(): String?
        pub fun getContractCode(): ContractCode?
        pub fun getVersion(): UInt16
        pub fun getCreatedAt(): UFix64
        pub fun getUpdatedAt(): UFix64
    }

    pub resource NFT: NFTPublic, NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let artType: String /* TODO: change to Enum or Interface */
        pub let creatorAddress: Address
        access(account) var title: String
        access(account) var description: String
        access(account) var imageIpfsCid: String
        access(account) var artistName: String
        access(account) var code: String?
        access(account) var contractCode: ContractCode?
        access(account) var version: UInt16
        access(account) var createdAt: UFix64
        access(account) var updatedAt: UFix64

        init(
            artType: String,
            creatorAddress: Address,
            title: String,
            description: String,
            imageIpfsCid: String,
            artistName: String,
            code: String?,
            contractCode: ContractCode?
        ) {
            ArtSource.totalSupply = ArtSource.totalSupply + 1
            self.id = ArtSource.totalSupply
            self.artType = artType
            self.creatorAddress = creatorAddress
            self.title = title
            self.description = description
            self.imageIpfsCid = imageIpfsCid
            self.artistName = artistName
            self.code = code
            self.contractCode = contractCode
            self.version = 1
            let currentBlock = getCurrentBlock()
            self.createdAt = currentBlock.timestamp
            self.updatedAt = currentBlock.timestamp
        }

        pub fun update(
            title: String?,
            description: String?,
            imageIpfsCid: String?,
            artistName: String?,
            code: String?,
            contractCode: ContractCode?
        ) {
            var updated = false
            if title != nil && title! != self.title {
                self.title = title!
                updated = true
            }
            if description != nil && description! != self.description {
                self.description = description!
                updated = true
            }
            if imageIpfsCid != nil && imageIpfsCid! != self.imageIpfsCid {
                self.imageIpfsCid = imageIpfsCid!
                updated = true
            }
            if artistName != nil && artistName! != self.artistName {
                self.artistName = artistName!
                updated = true
            }
            if code != nil && code! != self.code {
                self.code = code!
                updated = true
            }
            if code != nil && code! != self.code {
                self.code = code!
                updated = true
            }
            if updated {
                self.version = self.version + 1
                self.updatedAt = getCurrentBlock().timestamp
            }
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
                        storagePath: ArtSource.CollectionStoragePath,
                        publicPath: ArtSource.CollectionPublicPath,
                        providerPath: ArtSource.CollectionPrivatePath,
                        publicCollection: Type<&ArtSource.Collection{ArtSource.CollectionPublic}>(),
                        publicLinkedType: Type<&ArtSource.Collection{ArtSource.CollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&ArtSource.Collection{ArtSource.CollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Provider, MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <- ArtSource.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    // TODO:
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(url: ""),
                        mediaType: "image/png"
                    )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "ArtSource",
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
                    traits.append(MetadataViews.Trait(name: "code", value: self.code != nil ? self.code! : self.contractCode != nil ? self.contractCode!.getCode() : "", displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "version", value: self.version, displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "createdAt", value: self.createdAt.toString(), displayType: nil, rarity: nil))
                    traits.append(MetadataViews.Trait(name: "updatedAt", value: self.updatedAt.toString(), displayType: nil, rarity: nil))
                    return MetadataViews.Traits(traits)
            }
            return nil
        }

        pub fun getArtType(): String {
            return self.artType
        }

        pub fun getCreatorAddress(): Address {
            return self.creatorAddress
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

        pub fun getCode(): String? {
            return self.code
        }

        pub fun getContractCode(): ContractCode? {
            return self.contractCode
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
        pub fun borrowArtSourcePublic(id: UInt64): &AnyResource{ArtSource.NFTPublic}? {
            post {
                (result == nil) || (result?.id == id): "Cannot borrow ArtSource reference: the ID of the returned reference is incorrect"
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
            let token <- token as! @ArtSource.NFT
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
 
        pub fun borrowArtSourcePublic(id: UInt64): &AnyResource{ArtSource.NFTPublic}? {
            if self.ownedNFTs[id] != nil {
                return (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?) as! &AnyResource{ArtSource.NFTPublic}?
            }
            return nil
        }

        pub fun borrowArtSource(id: UInt64): &ArtSource.NFT? {
            if self.ownedNFTs[id] != nil {
                return (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?) as! &ArtSource.NFT?
            }
            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)! as! &ArtSource.NFT
            return nft as &AnyResource{MetadataViews.Resolver}
        }

        // a.k.a mintNFT
        pub fun createSource(
            artType: String,
            title: String,
            description: String,
            imageIpfsCid: String,
            artistName: String,
            code: String?,
            contractCode: ContractCode?
        ): @ArtSource.NFT {
            return <- create NFT(
                artType: artType,
                creatorAddress: self.owner!.address,
                title: title,
                description: description,
                imageIpfsCid: imageIpfsCid,
                artistName: artistName,
                code: code,
                contractCode: contractCode
            )
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
        self.CollectionStoragePath = /storage/ArtSourceCollection
        self.CollectionPublicPath = /public/ArtSourceCollection
        self.CollectionPrivatePath = /private/ArtSourceCollection

        self.account.save(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&ArtSource.Collection{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )
        emit ContractInitialized()
    }
}
