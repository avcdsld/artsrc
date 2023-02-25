import "NonFungibleToken"
import "ArtSource"

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) == nil {
            signer.save(<- ArtSource.createEmptyCollection(), to: ArtSource.CollectionStoragePath)
            signer.link<&{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic}>(
                ArtSource.CollectionPublicPath,
                target: ArtSource.CollectionStoragePath
            )
        }

        let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
        let sourceNFT <- collectionRef.createSource(
            artType: "p5js",
            title: "testTitle",
            description: "testDescription",
            imageIpfsCid: "testImageIpfsCid",
            artistName: "testArtistName",
            code: "testCode",
            contractCode: nil
        )
        collectionRef.deposit(token: <- sourceNFT)
    }
}
