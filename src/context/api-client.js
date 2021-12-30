import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client'

function ClientProvider(props) {
  const client = new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={client} {...props}></ApolloProvider>
}

export {ClientProvider}
