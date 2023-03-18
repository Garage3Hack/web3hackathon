import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { arbitrum, avalanche, bsc, fantom, gnosis, mainnet, optimism, polygon, hardhat } from 'wagmi/chains'
import Head from "next/head";
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';

// 1. Set project id
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PJID

export const shibuya = {
  id: 81,
  name: 'Shibuya Network',
  network: 'Shibuya-network',
  nativeCurrency: {
    decimals: 18,
    name: 'shibuya',
    symbol: 'SBY',
  },
  rpcUrls: {
    default: { http: ['https://evm.shibuya.astar.network/'] },
    public: { http: ['https://evm.shibuya.astar.network/'] },
  },
  blockExplorers: {
    default: {
      name: 'Shibuya Explorer',
      url: 'https://shibuya.subscan.io',
    },
  },
  testnet: true,
}

// 2. Configure wagmi client
const chains = [shibuya, hardhat]

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider
})

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains)

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
const App = ({ Component, pageProps }: AppProps) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <>
    <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </Head>
    {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}

export default App