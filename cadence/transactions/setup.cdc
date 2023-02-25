import "NonFungibleToken"
import "ArtSource"

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) != nil {
            return
        }
        signer.save(<- ArtSource.createEmptyCollection(), to: ArtSource.CollectionStoragePath)
        signer.link<&{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic}>(
            ArtSource.CollectionPublicPath,
            target: ArtSource.CollectionStoragePath
        )
    }
}
