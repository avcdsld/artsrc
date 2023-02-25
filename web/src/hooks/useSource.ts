import useFlowQuery from 'hooks/useFlowQuery';

interface SourceQueryParams {
  ownerAddress: string;
  sourceId: string;
}

const sourceQuery = ({ ownerAddress, sourceId }: SourceQueryParams) => {
  if (!ownerAddress || !sourceId) {
    return '';
  }

  return `\
pub struct Source {
  pub let sourceId: UInt32
  pub let ownerAddress: Address
  pub let title: String
  pub let description: String
  pub let imageIpfsCid: String
  pub let code: String

  init(
    sourceId: UInt32,
    ownerAddress: Address,
    title: String,
    description: String,
    imageIpfsCid: String,
    code: String
  ) {
    self.sourceId = sourceId
    self.ownerAddress = ownerAddress
    self.title = title
    self.description = description
    self.imageIpfsCid = imageIpfsCid
    self.code = code
  }
}

pub fun main(ownerAddress: Address, sourceId: UInt32): [Source] {
  // var res: [String] = []
  // let collection = getAccount(address)
  //     .getCapability(MessageCard.CollectionPublicPath)
  //     .borrow<&{MessageCard.CollectionPublic}>()
  // if collection != nil {
  //     let ids = collection!.getIDs()
  //     for id in ids {
  //         let nft = collection!.borrowMessageCard(id: id)!
  //         let traits = (nft.resolveView(Type<MetadataViews.Traits>())!) as! MetadataViews.Traits
  //         let svg = traits.traits[1].value as! String
  //         res.append(svg)
  //     }
  //     return res
  // }
  return [
    Source(
      sourceId: sourceId,
      ownerAddress: ownerAddress,
      title: "testTitle",
      description: "testDescription",
      imageIpfsCid: "bafkreiagpejktaadbu4ib6yuwm23kvia2m46276zkwirppb2bkokavqp4m",
      code: "function setup() {\\n  createCanvas(windowWidth, windowHeight)\\n  background(100)\\n  }\\n}"
    )
  ]
}`;
};

const useSource = (params?: SourceQueryParams) => {
  const ownerAddress = params?.ownerAddress || '';
  const sourceId = params?.sourceId || '';

  const { loading, error, data } = useFlowQuery(
    sourceQuery({ ownerAddress, sourceId }),
    (arg, t) => {
      return [
        arg(ownerAddress, t.Address),
        arg(sourceId, t.UInt32),
      ];
    }
  );

  return {
    loading,
    error,
    data: data.length > 0 ? data[0] : null,
  }
}

export default useSource;
