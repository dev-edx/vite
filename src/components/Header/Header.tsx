import { useEffect, useState } from 'react';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { useConnectWallet, init } from '@web3-onboard/react';

const wcInitOptions = {
  projectId: 'd51c28bf5c14789d90946e35be2dab5a', //wallet connect ID
  requiredChains: [1],
  optionalChains: [17000, 1995, 5424, 80002],
  dappUrl: 'http://bridge.edexa.com',
};

const injected = injectedModule();

const walletConnect = walletConnectModule(wcInitOptions);

// Prompt the user to add the missing chanel

const wallets = [injected, walletConnect];
const chains = [
  // {
  //   id: '0x1530',
  //   token: 'EDX',
  //   label: 'edeXa Mainnet',
  //   rpcUrl: 'https://mainnet.edexa.com/rpc',
  //   icon: 'https://edexa-general.s3.ap-south-1.amazonaws.com/XLogo.png'

  // },
  // {
  //   id: '0x7cb',
  //   token: 'EDX',
  //   label: 'edeXa Testnet',
  //   rpcUrl: 'https://edexa-general.s3.ap-south-1.amazonaws.com/XLogo.png'
  // },
  {
    id: '0x13882',
    token: 'MATIC',
    label: 'Polygon Amoy Testnet',
    rpcUrl: 'https://rpc.ankr.com/polygon_amoy',
    icon: 'https://amoy.polygonscan.com/assets/poly/images/svg/logos/chain-light.svg?v=24.7.4.1',
  },
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    icon: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  },
  {
    id: '0x89',
    token: 'MATIC',
    label: 'Polygon Mainnet',
    rpcUrl: 'https://polygon.drpc.org	',
    icon: 'https://amoy.polygonscan.com/assets/poly/images/svg/logos/chain-light.svg?v=24.7.4.1',
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance Smart Chain-Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    icon: 'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg?v=24.8.1.0',
  },
];
// const accountCenter = {
//   desktop: {
//     minimal: false,
//     enabled: true,
//     position: 'topRight',
//   },
//   mobile: {
//     enabled: true,
//     position: 'topRight',
//     minimal: false,
//   },
// };

const connect = {
  autoConnectLastWallet: true,
};

const appMetadata = {
  name: 'edeXa Bridge',
  icon: 'https://edexa-general.s3.ap-south-1.amazonaws.com/XLogo.png',
  logo: '<svg></svg>',
  description:
    'A bridge to transfer your edx Tokens on other EVM chain to edeXa network',
  gettingStartedGuide: 'https://edexa.com/',
  explore: 'https://edexa.com/edexa-blockchain/',
  recommendedInjectedWallets: [
    {
      name: 'MetaMask',
      url: 'https://metamask.io',
    },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
  ],
  // Optional
  agreement: {
    version: '1.0.0',
    termsUrl: 'https://www.blocknative.com/terms-conditions',
    privacyUrl: 'https://www.blocknative.com/privacy-policy',
  },
};

// const notify= {
//       enabled: true,
//       position: 'bottomRight',
// }

init({
  wallets,
  chains,
  appMetadata,
  connect,
  theme: 'system',
  apiKey: '616d347d-4efd-4d3a-88d6-e1b9f8d56852',
});

const Header = () => {
  const [{ wallet }, connect] = useConnectWallet();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (wallet?.accounts[0]?.address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [wallet]);

  return (
    <div>
      {!isConnected && (
        <header className="sticky top-0 z-10 flex h-12 w-full justify-center bg-black/70 px-4 backdrop-blur sm:relative sm:h-16 sm:px-6 sm:backdrop-blur-none [body.menu-open_&]:fixed sm:bg-transparent">
          <div className="flex w-full items-center justify-end gap-2 text-white">
            <div className="hidden sm:flex">
              <div className="relative w-full px-4 sm:w-max sm:p-0">
                <button
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  className="flex w-full flex-row items-center justify-start gap-3 px-[12px] py-[7px] transition-[background] duration-300 ui-open:bg-white/20 ui-not-open:bg-transparent ui-not-open:hover:bg-white/20 sm:w-max sm:rounded sm:border sm:px-2 sm:py-1 sm:border-gray-1 sm:ui-not-open:bg-gray-1 sm:ui-not-open:hover:bg-white/10"
                  type="button"
                  aria-label="Account Header Button"
                  aria-expanded="false"
                  onClick={() => connect()}
                >
                  <span className="flex flex-col text-justify text-base leading-extra-tight text-gray-4 sm:text-white">
                    CONNECT
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
    </div>
  );
};

export default Header;
