import "NonFungibleToken"
import "MetadataViews"
import "ArtSource"
import "ArtSourceInstance"

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) == nil {
            signer.save(<- ArtSource.createEmptyCollection(), to: ArtSource.CollectionStoragePath)
            signer.link<&ArtSource.Collection{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic, MetadataViews.ResolverCollection}>(
                ArtSource.CollectionPublicPath,
                target: ArtSource.CollectionStoragePath
            )
        }
        if signer.borrow<&ArtSourceInstance.Collection>(from: ArtSourceInstance.CollectionStoragePath) == nil {
            signer.save(<- ArtSourceInstance.createEmptyCollection(), to: ArtSourceInstance.CollectionStoragePath)
            signer.link<&ArtSourceInstance.Collection{NonFungibleToken.CollectionPublic, ArtSourceInstance.CollectionPublic}>(
                ArtSourceInstance.CollectionPublicPath,
                target: ArtSourceInstance.CollectionStoragePath
            )
        }
    }
}
