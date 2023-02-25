import * as fcl from '@onflow/fcl';

export const createSourceNFT = async (args: {
  artType: string;
  code: string;
  title: string;
  description: string;
  imageIpfsCid: string;
}) => {
  const txCode = `\
transaction(artType: UInt32, code: String, title: String, description: String, imageIpfsCid: String) {
    prepare(signer: AuthAccount) {
    }
}`;
  return await fcl.send([
    fcl.transaction(txCode),
    fcl.args([
      fcl.arg('1', fcl.t.UInt32),
      fcl.arg(args.code, fcl.t.String),
      fcl.arg(args.title, fcl.t.String),
      fcl.arg(args.description, fcl.t.String),
      fcl.arg(args.imageIpfsCid, fcl.t.String),
    ]),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.payer(fcl.authz),
    fcl.limit(9999),
  ]);
};

export const updateSourceNFT = async (args: {
  artType: string;
  code: string;
  title: string;
  description: string;
  imageIpfsCid: string;
}) => {
  const txCode = `\
transaction(artType: UInt32, code: String, title: String, description: String, imageIpfsCid: String) {
    prepare(signer: AuthAccount) {
    }
}`;
  return await fcl.send([
    fcl.transaction(txCode),
    fcl.args([
      fcl.arg('1', fcl.t.UInt32),
      fcl.arg(args.code, fcl.t.String),
      fcl.arg(args.title, fcl.t.String),
      fcl.arg(args.description, fcl.t.String),
      fcl.arg(args.imageIpfsCid, fcl.t.String),
    ]),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.payer(fcl.authz),
    fcl.limit(9999),
  ]);
};
