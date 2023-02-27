import "ArtSource"

pub contract ArtSourceCodes {

    // Format for tying deployed Cadence contract code.
    pub struct ContractCode: ArtSource.ICode {
        pub let accountAddress: Address
        pub let contractName: String
        pub let extraMetadata: {String: AnyStruct}

        init(
            accountAddress: Address,
            contractName: String,
            authAccountForOwnershipChecking: &AuthAccount,
            extraMetadata: {String: AnyStruct}
        ) {
            post {
                authAccountForOwnershipChecking.address == accountAddress: "Invalid account"
                authAccountForOwnershipChecking.contracts.get(name: self.contractName) != nil: "Invalid contract ownership"
            }
            self.accountAddress = accountAddress
            self.contractName = contractName
            self.extraMetadata = extraMetadata
        }

        pub fun getCode(): String {
            return String.fromUTF8(getAccount(self.accountAddress).contracts.get(name: self.contractName)!.code)!
        }

        pub fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }

        pub fun createInstanceHook() {
            return
        }
    }

    // Format for tying p5.js creative code.
    pub struct P5JsCode: ArtSource.ICode {
        pub let code: String
        pub var extraMetadata: {String: AnyStruct}

        init(
            code: String,
            extraMetadata: {String: AnyStruct}
        ) {
            self.code = code
            self.extraMetadata = extraMetadata
        }

        pub fun getCode(): String {
            let blockId = self.extraMetadata["blockId"] as! String?
            let blockTimestamp = self.extraMetadata["blockTimestamp"] as! String?
            var embed = "const ARTSRC_BLOCK_ID = ".concat(blockId ?? "[]").concat(";\n")
            embed = embed.concat("const ARTSRC_BLOCK_TIMESTAMP = ").concat(blockTimestamp ?? "0").concat(";\n")
            return embed.concat(self.code)
        }

        pub fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }

        pub fun createInstanceHook() {
            let block = getCurrentBlock()
            self.extraMetadata.insert(key: "blockId", self.idToString(block.id))
            self.extraMetadata.insert(key: "blockTimestamp", block.timestamp.toString())
        }

        priv fun idToString(_ id: [UInt8; 32]): String {
            var res = "["
            for index, val in id {
                if index > 0 {
                    res = res.concat(",")
                }
                res = res.concat(val.toString())
            }
            res = res.concat("]")
            return res
        }
    }
}
