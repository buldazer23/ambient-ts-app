// export const chains = {
//     '0x5': {
//         name: 'goerli',
//         dex: '0xfafcd1f5530827e7398b6d3c509f450b1b24a209',
//         query: '0x9ea4b2f9b1572ed3ac46b402d9ba9153821033c6'
//     }
// };

const goerliData = {
    name: 'goerli',
    dex: '0xfafcd1f5530827e7398b6d3c509f450b1b24a209',
    query: '0x9ea4b2f9b1572ed3ac46b402d9ba9153821033c6'
}

export const chains = new Map().set('goerli', goerliData);