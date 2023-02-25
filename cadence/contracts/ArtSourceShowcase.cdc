import "ArtSource"

pub contract ArtSourceShowcase {
    pub struct Source {
        pub let id: UInt64
        pub let owner: Address

        init(id: UInt64, owner: Address) {
            self.id = id
            self.owner = owner
        }
    }

    access(account) var sources: [Source]
    access(account) var exists: {UInt64: Bool}
    access(account) var max: Int
    access(account) var paused: Bool

    pub resource Admin {
        pub fun updateMax(max: Int) {
            ArtSourceShowcase.max = max
            while ArtSourceShowcase.sources.length > ArtSourceShowcase.max {
                let lastSource = ArtSourceShowcase.sources.removeLast()
                ArtSourceShowcase.exists.remove(key: lastSource.id)
            }
        }

        pub fun updatePaused(paused: Bool) {
            ArtSourceShowcase.paused = paused
        }

        pub fun clearSources() {
            ArtSourceShowcase.sources = []
            ArtSourceShowcase.exists = {}
        }
    }

    pub fun addSource(id: UInt64, collectionCapability: Capability<&ArtSource.Collection{ArtSource.CollectionPublic}>) {
        pre {
            !ArtSourceShowcase.paused: "Paused"
            !ArtSourceShowcase.exists.containsKey(id): "Already Existing"
            collectionCapability.borrow()?.borrowArtSourcePublic(id: id) != nil: "Not Found"
        }
        ArtSourceShowcase.sources.insert(at: 0, Source(id: id, owner: collectionCapability.address))
        ArtSourceShowcase.exists[id] = true
        if ArtSourceShowcase.sources.length > ArtSourceShowcase.max {
            let lastSource = ArtSourceShowcase.sources.removeLast()
            ArtSourceShowcase.exists.remove(key: lastSource.id)
        }
    }

    pub fun getSources(from: Int, upTo: Int): [Source] {
        if from >= ArtSourceShowcase.sources.length {
            return []
        }
        if upTo > ArtSourceShowcase.sources.length {
            return ArtSourceShowcase.sources.slice(from: from, upTo: ArtSourceShowcase.sources.length)
        }
        return ArtSourceShowcase.sources.slice(from: from, upTo: upTo)
    }

    init() {
        self.sources = []
        self.exists = {}
        self.max = 1000
        self.paused = false

        self.account.save(<- create Admin(), to: /storage/ArtSourceShowcaseAdmin)
    }
}
 