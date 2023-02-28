import "ArtSource"

pub contract ArtSourceCodes {

    // Resource for tying deployed Cadence contract code.
    pub resource ContractCode: ArtSource.ICode {
        pub let accountAddress: Address
        pub let contractName: String
        pub let extraMetadata: {String: AnyStruct}
        pub let isCodeInstance: Bool

        init(
            accountAddress: Address,
            contractName: String,
            authAccountForOwnershipChecking: &AuthAccount?,
            extraMetadata: {String: AnyStruct},
            isCodeInstance: Bool

        ) {
            post {
                isCodeInstance || authAccountForOwnershipChecking!.address == accountAddress: "Invalid account"
                isCodeInstance || authAccountForOwnershipChecking!.contracts.get(name: self.contractName) != nil: "Invalid contract ownership"
            }
            self.accountAddress = accountAddress
            self.contractName = contractName
            self.extraMetadata = extraMetadata
            self.isCodeInstance = isCodeInstance
        }

        pub fun getCode(): String {
            return String.fromUTF8(getAccount(self.accountAddress).contracts.get(name: self.contractName)!.code)!
        }

        pub fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }

        pub fun createInstance(): @{ArtSource.ICode} {
            return <- create ContractCode(
                accountAddress: self.accountAddress,
                contractName: self.contractName,
                authAccountForOwnershipChecking: nil,
                extraMetadata: self.extraMetadata,
                isCodeInstance: true
            )
        }
    }

    pub fun createContractCode(
        accountAddress: Address,
        contractName: String,
        authAccountForOwnershipChecking: &AuthAccount,
        extraMetadata: {String: AnyStruct}
    ): @ContractCode {
        return <- create ContractCode(
            accountAddress: accountAddress,
            contractName: contractName,
            authAccountForOwnershipChecking: authAccountForOwnershipChecking,
            extraMetadata: extraMetadata,
            isCodeInstance: false
        )
    }

    // Resource for tying p5.js creative code.
    pub resource P5JsCode: ArtSource.ICode {
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

        pub fun createInstance(): @{ArtSource.ICode} {
            let block = getCurrentBlock()
            self.extraMetadata.insert(key: "blockId", self.idToString(block.id))
            self.extraMetadata.insert(key: "blockTimestamp", block.timestamp.toString())
            return <- create P5JsCode(
                code: self.code,
                extraMetadata: self.extraMetadata
            )
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

    pub fun createP5JsCode(
        code: String,
        extraMetadata: {String: AnyStruct}
    ): @P5JsCode {
        return <- create P5JsCode(
            code: code,
            extraMetadata: extraMetadata
        )
    }
}
