import { useState, useEffect } from 'react';
import useSources from 'hooks/useSources';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Masonry from '@mui/lab/Masonry';
import { OrderDirection, Source } from 'utils/types';
import { useWindowSize } from 'hooks/useWindowSize';
import useTheme from '@mui/material/styles/useTheme';
import SourceSummary from './SourceSummary';
import Loading from './Loading';
import { sourcesPerPage } from 'config';
import { Pagination } from '@mui/material';

const SourceList = () => {
  const size = useWindowSize();
  const theme = useTheme();
  const [highestSourceId, setHighestSourceId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const fromIndex = currentPage * sourcesPerPage;
  const upToIndex = fromIndex + sourcesPerPage;
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(
    OrderDirection.DESC
  );
  const { loading, error, data } = useSources({
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
  const maxColumns = 2;
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant='h4' fontSize={[24, 24, 32]} p='0 1rem'>
          All Sources
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
            Showing {data ? Math.min(sourcesPerPage, data?.length) : '-'}
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ height: '480px', display: 'flex', alignItems: 'center' }}>
          <Loading />
        </Box>
      ) : error ? (
        <Alert severity='error'>Error loading sources</Alert>
      ) : data?.length > 0 ? (
        <Masonry columns={[1, 1, 2]} spacing={3} sx={{ margin: '32px 0' }}>
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

export default SourceList;
