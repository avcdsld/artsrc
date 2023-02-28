import "NonFungibleToken"
import "ArtSource"
import "ArtSourceCodes"

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) == nil {
            signer.save(<- ArtSource.createEmptyCollection(), to: ArtSource.CollectionStoragePath)
            signer.link<&ArtSource.Collection{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic, MetadataViews.ResolverCollection}>(
                ArtSource.CollectionPublicPath,
                target: ArtSource.CollectionStoragePath
            )
        }

        let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
        collectionRef.createSource(
            artType: "p5js",
            title: "testTitle",
            description: "testDescription",
            imageIpfsCid: "testImageIpfsCid",
            artistName: "testArtistName",
            codes: <- [
                <- ArtSourceCodes.createP5JsCode(
                    code: "testCode",
                    extraMetadata: {}
                )
            ]
        )
    }
}
