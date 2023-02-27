import "NonFungibleToken"
import "ArtSource"
import "ArtSourceCodes"

transaction(
    id: UInt64,
    title: String,
    description: String,
    imageIpfsCid: String,
    artistName: String,
    code: String
) {
    prepare(signer: AuthAccount) {
        let collectionRef = signer.borrow<&ArtSource.Collection>(from: ArtSource.CollectionStoragePath) ?? panic("Not found")
        let nftRef = collectionRef.borrowArtSource(id: id)!
        nftRef.update(
            title: title,
            description: description,
            imageIpfsCid: imageIpfsCid,
            artistName: artistName,
            codes: [
                ArtSourceCodes.P5JsCode(
                    code: code,
                    extraMetadata: {}
                )
            ]
        )
    }
}
