import useFlowQuery from 'hooks/useFlowQuery';
import { sourcesPerPage } from 'config';
import { OrderDirection } from 'utils/types';

interface UserSourcesQueryParams {
  address: string;
  fromIndex?: number;
  upToIndex?: number;
  orderDirection?: OrderDirection;
}

const userSourcesQuery = ({ fromIndex, upToIndex, orderDirection }: UserSourcesQueryParams) => `
pub struct Source {
  pub let sourceId: UInt32
  pub let ownerAddress: Address
  pub let title: String
  pub let description: String
  pub let imageIpfsCid: String

  init(
    sourceId: UInt32,
    ownerAddress: Address,
    title: String,
    description: String,
    imageIpfsCid: String
  ) {
    self.sourceId = sourceId
    self.ownerAddress = ownerAddress
    self.title = title
    self.description = description
    self.imageIpfsCid = imageIpfsCid
  }
}

pub fun main(address: Address): [Source] {
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
      sourceId: 1,
      ownerAddress: address,
      title: "testTitle",
      description: "testDescription",
      imageIpfsCid: "bafkreiagpejktaadbu4ib6yuwm23kvia2m46276zkwirppb2bkokavqp4m"
    )
  ]
}`;

const useUserSources = (params?: UserSourcesQueryParams) => {
  const address = params?.address || '';
  const upToIndex = params?.upToIndex || sourcesPerPage;
  const fromIndex = params?.fromIndex || 0;
  const orderDirection = params?.orderDirection || OrderDirection.DESC

  const { loading, error, data } = useFlowQuery(
    userSourcesQuery({ address, fromIndex, upToIndex, orderDirection }),
    (arg, t) => [
      arg(address, t.Address),
    ]
  );

  return {
    loading,
    error,
    data,
  }
}

export default useUserSources;
