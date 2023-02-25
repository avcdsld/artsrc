import "NonFungibleToken"
import "ArtSource"
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
            signer.link<&{NonFungibleToken.CollectionPublic, ArtSource.CollectionPublic}>(
                ArtSource.CollectionPublicPath,
                target: ArtSource.CollectionStoragePath
            )
        }

        let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
        let sourceNFT <- collectionRef.createSource(
            artType: artType,
            title: title,
            description: description,
            imageIpfsCid: imageIpfsCid,
            artistName: artistName,
            code: code,
            contractCode: nil
        )
        let id = sourceNFT.id
        collectionRef.deposit(token: <- sourceNFT)

        let collectionCapability = signer.getCapability<&ArtSource.Collection{ArtSource.CollectionPublic}>(ArtSource.CollectionPublicPath)
        ArtSourceShowcase.addSource(id: id, collectionCapability: collectionCapability)
    }
}
