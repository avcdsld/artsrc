import { useState, useEffect } from 'react';
import useUserSources from 'hooks/useUserSources';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Masonry from '@mui/lab/Masonry';
import { OrderDirection, Source } from 'utils/types';
import { useWindowSize } from 'hooks/useWindowSize';
import useTheme from '@mui/material/styles/useTheme';
import SourceSummary from './SourceSummary';
import Loading from './Loading';
import { sourcesPerPage } from 'config';
import { Pagination } from '@mui/material';

interface Props {
  address: string;
}

const UserSources = ({ address }: Props) => {
  const size = useWindowSize();
  const theme = useTheme();
  const [highestSourceId, setHighestSourceId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const fromIndex = currentPage * sourcesPerPage;
  const upToIndex = sourcesPerPage;
  const [orderDirection] = useState<OrderDirection>(OrderDirection.DESC);
  const { loading, error, data } = useUserSources({
    address,
    fromIndex,
    upToIndex,
    orderDirection,
  });

  useEffect(() => {
    if (data?.length) {
      const sourceIds = data.map((source: Source) => Number(source.sourceId));
      const maxSourceId = Math.max(...sourceIds);
      if (maxSourceId > highestSourceId) {
        setHighestSourceId(maxSourceId);
      }
    }
  }, [data, highestSourceId]);

  let width = 280;
  const maxColumns = 3;
  if (size && !isNaN(size.width)) {
    width =
      size.width > theme.breakpoints.values.md
        ? ((Math.min(size.width, 1200) - 96) * 1) / maxColumns
        : size.width > theme.breakpoints.values.sm
        ? size.width - 64
        : size.width - 48;
  }

  return (
    <Box>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant='h4' fontSize={[24, 24, 32]} p='0 1rem'>
          Sources
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <FormControl fullWidth>
              <InputLabel variant='standard' htmlFor='uncontrolled-native'>
                Sort
              </InputLabel>
              <NativeSelect
                value={orderDirection}
                sx={{ fontSize: '14px' }}
                onChange={(e) => {
                  setCurrentPage(0);
                  setOrderDirection(e.target.value as OrderDirection);
                }}
              >
                <option value={OrderDirection.DESC}>Latest</option>
                <option value={OrderDirection.ASC}>Earliest</option>
              </NativeSelect>
            </FormControl>
          </Box>

          <Typography fontSize='14px' pt={2} ml={3}>
            Showing{' '}
            {data?.sources
              ? Math.min(sourcesPerPage, data?.sources?.length)
              : '-'}
          </Typography>
        </Box>
      </Box> */}

      {loading ? (
        <Box sx={{ height: '480px', display: 'flex', alignItems: 'center' }}>
          <Loading />
        </Box>
      ) : error ? (
        <Alert severity='error'>Error loading sources</Alert>
      ) : data?.length > 0 ? (
        <Masonry columns={[1, 1, 3]} spacing={2} sx={{ margin: '32px 0 48px' }}>
          {data &&
            data.map((source: Source) => (
              <SourceSummary
                key={source.sourceId}
                source={source}
                width={width}
                showDescription
              />
            ))}
        </Masonry>
      ) : data?.length === 0 ? (
        <Alert severity='info'>No sources found</Alert>
      ) : null}

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <Pagination
          count={Math.ceil(highestSourceId / sourcesPerPage)}
          color='primary'
          page={currentPage + 1}
          onChange={(event, page) => {
            window.scrollTo(0, 0);
            setCurrentPage(page - 1);
          }}
        />
      </Box>
    </Box>
  );
};

export default UserSources;
