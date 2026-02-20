const walletAddress = '0x505Ce514Ff1e02d3Af1474C3684adC98A9F5Fa22';

export const supportConfig = {
  mercadoPago: {
    label: 'Invitame un café ☕',
    url: 'https://cafecito.app/ernesto-albarez',
  },
  crypto: {
    polygon: {
      label: 'Polygon (Recomendado - fees bajos)',
      tokens: {
        usdc: { network: 'Polygon', address: walletAddress },
        usdt: { network: 'Polygon', address: walletAddress },
      },
    },
    ethereum: {
      label: 'Ethereum (ERC-20)',
      tokens: {
        usdc: { network: 'Ethereum', address: walletAddress },
        usdt: { network: 'Ethereum', address: walletAddress },
      },
    },
  },
};