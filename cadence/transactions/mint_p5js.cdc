import "NonFungibleToken"
import "MetadataViews"
import "ArtSource"
import "ArtSourceCodes"
import "ArtSourceShowcase"

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
}
