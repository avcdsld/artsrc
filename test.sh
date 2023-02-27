flow transactions send ./cadence/transactions/setup.cdc --signer default

flow transactions send ./cadence/test/mint_p5js.cdc --signer default

flow transactions send ./cadence/transactions/mint_p5js.cdc \
    p5js testTitle testDescription testImageIpfsCid testArtistName testCode \
    --signer default

flow transactions send ./cadence/transactions/mint_contract.cdc \
    cadence testTitle testDescription testImageIpfsCid testArtistName \
    0xf3fcd2c1a78f5eee ArtSource \
    --signer default

flow transactions send ./cadence/transactions/update_p5js.cdc \
    2 testTitle2 testDescription2 testImageIpfsCid testArtistName testCode2 \
    --signer default

flow scripts execute ./cadence/scripts/get_nft_metadata.cdc f3fcd2c1a78f5eee 2

flow scripts execute ./cadence/scripts/get_nft_metadata.cdc f3fcd2c1a78f5eee 3

flow scripts execute ./cadence/scripts/get_user_nfts.cdc f3fcd2c1a78f5eee

flow scripts execute ./cadence/scripts/get_showcase_nfts.cdc 0 8
