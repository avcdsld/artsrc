import { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { resolveDotFindName } from 'utils/dotFind';
import { resolveFlownsName } from 'utils/flowns';

interface AddressProps {
  address: string;
  color?: string;
  both?: boolean | null;
  forDetailPage?: boolean | null;
}

const Address = ({ address, both, forDetailPage, color }: AddressProps) => {
  const [dotFindName, setDotFindName] = useState<string | null>('');
  const [flownsName, setFlownsName] = useState<string | null>('');

  const resolveName = useCallback(async () => {
    try {
      const dotFindName = await resolveDotFindName(address);
      if (dotFindName) {
        setDotFindName(dotFindName + '.find');
      }
      const flownsName = await resolveFlownsName(address);
      if (flownsName) {
        setFlownsName(flownsName + '.fn');
      }
    } catch (error) {
      console.log('Error resolving ens', error);
    }
  }, [address]);

  useEffect(() => {
    resolveName();
  });

  return address !== null ? (
    <>
      {both ? (
        <>
          {dotFindName || flownsName ? (
            <>
              <Typography variant='body1'>
                <span>{address}</span>
              </Typography>
              <Typography variant='h5'>
                <span>{dotFindName || flownsName}</span>
              </Typography>
            </>
          ) : (
            <Typography variant='h5'>
              <span>{address}</span>
            </Typography>
          )}
        </>
      ) : forDetailPage ? (
        <Link href={`/user/${address}`} underline='hover' sx={{ color }}>
          <span>{dotFindName || flownsName || address}</span>
        </Link>
      ) : (
        <Link href={`/user/${address}`} sx={{ color: 'white' }}>
          <span>{dotFindName || flownsName || address}</span>
        </Link>
      )}
    </>
  ) : null;
};

export default Address;
