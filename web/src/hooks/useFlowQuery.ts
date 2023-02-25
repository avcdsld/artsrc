import { useState } from 'react';
import * as fcl from '@onflow/fcl';

const network = process.env.FLOW_NETWORK || 'testnet';

const useFlowQuery = (
  script: string,
  args: (arg: any, t: any) => any[],
): {
  loading: boolean;
  error: boolean;
  data: any[];
} => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // const fetchBalance = async () => {
  //   try {
  //     const b = await tokenContract?.balanceOf(account || '');
  //     setBalance(b);
  //   } catch(error) {
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  useState(async () => {
    if (!script) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      fcl
        .config()
        .put(
          "accessNode.api",
          network === "mainnet" ? "https://rest-mainnet.onflow.org" : "https://rest-testnet.onflow.org"
        );
      const sources = await fcl.query({ cadence: script, args });
      setData(sources);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    error,
    data,
  };
}

export default useFlowQuery;