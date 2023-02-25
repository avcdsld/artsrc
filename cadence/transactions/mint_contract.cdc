import "NonFungibleToken"
import "ArtSource"

transaction(
    artType: String,
    title: String,
    description: String,
    imageIpfsCid: String,
    artistName: String,
    contractAccountAddress: Address,
    contractName: String
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
            code: nil,
            contractCode: ArtSource.ContractCode(
                accountAddress: contractAccountAddress,
                contractName: contractName,
                authAccountForOwnershipChecking: &signer as &AuthAccount
            )
        )
        collectionRef.deposit(token: <- sourceNFT)
    }
}
