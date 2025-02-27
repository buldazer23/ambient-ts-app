import { lookupChain } from '@crocswap-libs/sdk/dist/context';
import { scrollSepoliaETH, scrollSepoliaUSDC } from '../defaultTokens';
import { NetworkIF } from '../../types/NetworkIF';
import { TopPool } from './TopPool';
import { Provider } from '@ethersproject/providers';
import { GCGO_TESTNET_URL } from '../gcgo';

const wagmiChain = {
    id: 534351,
    name: 'Scroll Sepolia',
    network: 'scroll-sepolia',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia-rpc.scroll.io/'],
        },
        public: {
            http: ['https://sepolia-rpc.scroll.io/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Scrollscan',
            url: 'https://sepolia.scrollscan.dev',
        },
    },
    testnet: true,
};

export const scrollSepolia: NetworkIF = {
    chainId: '0x8274f',
    graphCacheUrl: GCGO_TESTNET_URL,
    evmRpcUrl: 'https://sepolia-rpc.scroll.io/',
    wagmiChain,
    shouldPollBlock: true,
    marketData: '0x1',
    defaultPair: [scrollSepoliaETH, scrollSepoliaUSDC],
    topPools: [
        new TopPool(
            scrollSepoliaETH,
            scrollSepoliaUSDC,
            lookupChain('0x8274f').poolIndex,
        ),
    ],
    getGasPriceInGwei: async (provider?: Provider) => {
        if (!provider) return 0;
        return (await provider.getGasPrice()).toNumber() * 1e-9;
    },
};
