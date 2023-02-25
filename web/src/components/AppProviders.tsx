import { QueryClientProvider, QueryClient } from 'react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import theme from 'theme';
import { graphQLURL } from 'config';

const queryClient = new QueryClient();

const client = new ApolloClient({
  uri: graphQLURL,
  cache: new InMemoryCache(),
});

interface Props {
  children: React.ReactNode;
}

const AppProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
