import { ArrowUpDown, ChevronDown, ChevronUp, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CommonDiv from '../Common/CommonDiv';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
import tokenABI from '../../abi/token.json';
import { useDispatch, useSelector } from 'react-redux';
import { setAmount } from '../../store/reducers/AmountSlice';
import { RootState } from '../../store';
import { setInSufficient } from '../../store/reducers/SufficientSlice';
const tokenAddress = '0x5741E7ADc4657599f7F831e425c6C685D8dB3fB4';

const DataTransfer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [{ wallet }] = useConnectWallet();
  const [tokenBalance, setTokenBalance] = useState('0');
  const [edxBalance, setEdxBalance] = useState('0');
  const [gas, setGas] = useState(0);
  const [isTestnetOn, setIsTestnetOn] = useState(true);
  const dispatch = useDispatch();
  const { amount } = useSelector((state: RootState) => state.amount);
  const { inSufficient } = useSelector(
    (state: RootState) => state.sufficientBalance
  );

  // const toggleSwitch = () => {
  //   setIsTestnetOn(!isTestnetOn);
  // };

  console.log('setIsTestnetOn', setIsTestnetOn)

  const handleModalClose = () => {
    setModalOpen(!modalOpen);
  };

  const networkParams_ethereum = {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://ethereum-rpc.publicnode.com'],
    blockExplorerUrls: ['https://etherscan.io'],
  };

  const networkParams_AMOY = {
    chainId: '0x13882',
    chainName: 'Polygon Amoy',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/polygon_amoy'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
  };

  const networkParams_BSC = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'Binance coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.bnbchain.org'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  };

  // const networkParams_edexaMainnet = {
  //   chainId: '0x1530',
  //   chainName: 'Edexa Mainnet',
  //   nativeCurrency: {
  //     name: 'EDEXA',
  //     symbol: 'EDX',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://mainnet.edexa.network/rpc'],
  //   blockExplorerUrls: ['https://explorer.edexa.network'],
  // };

  // const networkParams_edexaTestnet = {
  //   chainId: '0x7cb',
  //   chainName: 'Edexa Testnet',
  //   nativeCurrency: {
  //     name: 'EDEXA',
  //     symbol: 'EDX',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://testnet.edexa.com/rpc'],
  //   blockExplorerUrls: ['https://explorer.testnet.edexa.network'],
  // };

  const networkParams_polygon = {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.edexa.network/rpc'],
    blockExplorerUrls: ['https://explorer.edexa.network'],
  };

  async function checkNetwork(networkName: string) {
    if (!wallet) return;
    const prov = new ethers.providers.Web3Provider(wallet?.provider, 'any');
    const network = await prov.getNetwork();
    const networkId = network.chainId;

    if (networkName === 'Ethereum' && networkId !== 1) {
      try {
        // Try to switch to the network
        await wallet?.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
        console.log('Network switched successfully');
      } catch (switchError: any) {
        if (switchError?.code === 4902 || switchError?.code === 5000) {
          try {
            // Try to add the network
            await wallet?.provider.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams_ethereum],
            });
            console.log('Network added successfully');
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        } else {
          console.error('Failed to switch network:', switchError);
        }
      }
    }

    if (networkName === 'Polygon' && networkId !== 137) {
      try {
        await wallet?.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
        console.log('Network switched successfully');
      } catch (switchError: any) {
        if (switchError.code === 4902 || switchError.code === 5000) {
          try {
            await wallet?.provider.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams_polygon],
            });
            console.log('Network added successfully');
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        } else {
          console.error('Failed to switch network:', switchError);
        }
      }
    }

    if (networkName === 'AMOY' && networkId !== 80002) {
      try {
        await wallet?.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13882' }],
        });
        console.log('Network switched successfully');
      } catch (switchError: any) {
        console.log(switchError);
        if (switchError.code === 4902 || switchError.code === 5000) {
          try {
            await wallet?.provider.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams_AMOY],
            });
            console.log('Network added successfully');
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        }
      }
    }

    if (networkName === 'BSC' && networkId !== 56) {
      try {
        await wallet?.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
        console.log('Network switched successfully');
      } catch (switchError: any) {
        if (switchError.code === 4902 || switchError.code === 5000) {
          try {
            await wallet?.provider.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams_BSC],
            });
            console.log('Network added successfully');
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        }
      }
    }
  }

  const setMax = async () => {
    dispatch(setAmount(tokenBalance));
    dispatch(setInSufficient(false));
  };

  const getCoinBalance = async () => {
    if (!wallet) return;
    try {
      const provider = new ethers.providers.Web3Provider(
        wallet?.provider,
        'any'
      );
      const signer = provider.getSigner();
      const user = await signer.getAddress();
      if (!tokenAddress) return;
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const bal = await tokenContract.balanceOf(user);
      const formattedBal = ethers.utils.formatEther(bal.toString());
      // Trim to 4 decimal places without rounding
      const trimmedBal = formattedBal.split(".")[0] + "." + (formattedBal.split(".")[1] || "").substring(0, 4);
      setTokenBalance(trimmedBal);
      return Number(ethers.utils.formatEther(bal));
    } catch (error) {
      setTokenBalance('0');
      setAmount('');
    }
  };

  const getEdxBalance = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://io-dataseed1.testnet.edexa.io-market.com/rpc'
      );
      if (wallet &&provider) {
        const edxBal = await provider.getBalance(wallet.accounts[0].address);
        setEdxBalance(
          Number(ethers.utils.formatEther(edxBal)).toFixed(3).toString()
        );
      }
    } catch (error) {
      // console.error('Failed to get EDX balance:', error);
    }
  };

useEffect(()=>{
  getEdxBalance();
  getCoinBalance();

})
 
  async function estimateGasFee() {
    try {
      const gasFee = localStorage.getItem('gasFee');
      if (!gasFee) return;
      const gs = (Number(gasFee) / 10 ** 18).toFixed(3);
      setGas(Number(gs));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    estimateGasFee();
  }, []);

  const handleCurrentChainName = (chainName: string) => {
    let name;
    if (chainName === '0x1') {
      name = 'Ethereum Mainnet';
    } else if (chainName === '0x13882') {
      name = 'Polygon Amoy';
    } else if (chainName === '0x38') {
      name = 'Binance Smart Chain Mainnet';
    } else if (chainName === '0x89') {
      name = 'Polygon Mainnet';
    } else {
      name = 'Unknown Chain';
    }
    return name;
  };

  return (
    <div className="flex flex-col pb-6 lg:gap-y-1">
      <div>
        <div
          className="relative rounded border transition-colors duration-400"
          style={{
            backgroundColor: 'rgba(69, 74, 117, 0.4)',
            borderColor: 'rgb(69, 74, 117)',
          }}
        >
          <div
            className="absolute left-0 top-0 h-full w-full bg-[-2px_0] bg-no-repeat bg-origin-content p-3 opacity-50"
            style={{
              backgroundSize: 'auto 138px',
              backgroundImage:
                'url(https://bridge.arbitrum.io/images/EthereumLogo.svg)',
            }}
          ></div>
          <div className="relative space-y-3.5 bg-contain bg-no-repeat p-3 sm:flex-row">
            <div className="flex flex-row flex-wrap items-center justify-between gap-1 gap-y-2.5 whitespace-nowrap">
              <div className="relative w-max">
                <button
                  className="arb-hover flex w-max items-center gap-1 md:gap-2 rounded px-3 py-2 text-sm text-white outline-none md:text-2xl"
                  aria-expanded={`${modalOpen ? 'true' : 'false'}`}
                  type="button"
                  onClick={handleModalClose}
                  id="headlessui-popover-button-:r4:"
                  style={{
                    backgroundColor: 'rgb(69, 74, 117)',
                  }}
                >
                  <span className="max-w-[220px] truncate text-sm leading-[1.1] md:max-w-[250px] md:text-xl">
                    {wallet?.chains?.[0]?.id
                      ? `From: ${handleCurrentChainName(
                          wallet?.chains?.[0]?.id
                        )}`
                      : `From: Ethereum`}
                  </span>
                  {modalOpen ? (
                    <ChevronUp className="transition-transform duration-200 rotate-0" />
                  ) : (
                    <ChevronDown className="transition-transform duration-200 rotate-0" />
                  )}
                </button>
                <div
                  className={`fixed left-0 top-0 z-50 sm:absolute sm:top-[54px] ${
                    modalOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-1'
                  }`}
                  style={{
                    display: `${modalOpen ? '' : 'none'}`,
                  }}
                >
                  <div
                    className="h-screen bg-bg-gray-1 text-white border-gray-dark border w-screen sm:h-auto sm:w-auto sm:min-w-[448px] sm:gap-3 sm:rounded sm:shadow-modal"
                    data-headlessui-state="open"
                    tabIndex={-1}
                  >
                    <div
                      className="flex h-full flex-col px-5 py-4"
                      style={{
                        backgroundColor: '#181918',
                      }}
                    >
                      <div className="flex flex-row items-center justify-between pb-4">
                        <span className="text-xl">Select Network</span>
                        <button className="arb-hover">
                          <X
                            className="h-7 w-7 text-gray-7 lg:h-5 lg:w-5"
                            onClick={handleModalClose}
                          />
                        </button>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                          <div
                            className="sm:shadow-search-panel h-[calc(100vh_-_190px)] overflow-hidden rounded border border-gray-dark bg-black/30 sm:h-[400px]"
                            style={{ position: 'relative' }}
                          >
                            <div
                              style={{
                                overflow: 'visible',
                                height: '0px',
                                width: '0px',
                              }}
                            >
                              <div
                                aria-label="grid"
                                aria-readonly="true"
                                role="grid"
                                tabIndex={0}
                                style={{
                                  boxSizing: 'border-box',
                                  direction: 'ltr',
                                  position: 'relative',
                                  overflow: 'auto',
                                  width: '394px',
                                }}
                              >
                                <div
                                  style={{
                                    width: 'auto',
                                    height: '1150px',
                                    maxWidth: '394px',
                                    maxHeight: '1150px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                  }}
                                >
                                  <div
                                    className="px-4 py-3"
                                    style={{
                                      height: '45px',
                                      left: '0px',
                                      position: 'absolute',
                                      top: '0px',
                                      width: '100%',
                                    }}
                                  >
                                    <p className="text-sm text-white/70">
                                      {isTestnetOn
                                        ? 'TESTNET CHAINS'
                                        : 'CORE CHAINS'}
                                    </p>
                                  </div>
                                  {isTestnetOn ? (
                                    <button
                                      onClick={() => checkNetwork('AMOY')}
                                      type="button"
                                      aria-label="Switch to AMOY"
                                      className="flex h-[90px] w-full items-center gap-4 px-4 py-2 text-lg transition-[background] duration-200 hover:bg-white/10 bg-white/10"
                                      style={{
                                        height: '90px',
                                        left: '0px',
                                        position: 'absolute',
                                        top: '45px',
                                        width: '100%',
                                      }}
                                    >
                                      <div
                                        className="flex shrink-0 items-center justify-center rounded-full h-[32px] w-[32px] p-[6px]"
                                        style={{
                                          backgroundColor:
                                            'rgba(69, 74, 117, 0.2)',
                                        }}
                                      >
                                        <img
                                          alt="AMOY logo"
                                          loading="lazy"
                                          width="20"
                                          height="20"
                                          className="h-full w-auto"
                                          src="https://bridge.arbitrum.io/images/EthereumLogo.svg"
                                          style={{ color: 'transparent' }}
                                        />
                                      </div>
                                      <div className="flex flex-col items-start gap-1">
                                        <span className="truncate leading-[1.1]">
                                          AMOY
                                        </span>
                                        <p className="whitespace-pre-wrap text-left text-xs leading-[1.15] text-white/70"></p>
                                        <p className="text-[10px] leading-none text-white/50">
                                          AMOY is the native gas token
                                        </p>
                                      </div>
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => checkNetwork('Ethereum')}
                                        type="button"
                                        aria-label="Switch to Ethereum"
                                        className="flex h-[90px] w-full items-center gap-4 px-4 py-2 text-lg transition-[background] duration-200 hover:bg-white/10 bg-white/10"
                                        style={{
                                          height: '90px',
                                          left: '0px',
                                          position: 'absolute',
                                          top: '45px',
                                          width: '100%',
                                        }}
                                      >
                                        <div
                                          className="flex shrink-0 items-center justify-center rounded-full h-[32px] w-[32px] p-[6px]"
                                          style={{
                                            backgroundColor:
                                              'rgba(69, 74, 117, 0.2)',
                                          }}
                                        >
                                          <img
                                            alt="Ethereum logo"
                                            loading="lazy"
                                            width="20"
                                            height="20"
                                            className="h-full w-auto"
                                            src="https://bridge.arbitrum.io/images/EthereumLogo.svg"
                                            style={{ color: 'transparent' }}
                                          />
                                        </div>
                                        <div className="flex flex-col items-start gap-1">
                                          <span className="truncate leading-[1.1]">
                                            Ethereum
                                          </span>
                                          <p className="text-[10px] leading-none text-white/50">
                                            ETH is the native gas token
                                          </p>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => checkNetwork('Polygon')}
                                        type="button"
                                        aria-label="Switch to Polygon"
                                        className="flex h-[90px] w-full items-center gap-4 px-4 py-2 text-lg transition-[background] duration-200 hover:bg-white/10"
                                        style={{
                                          height: '90px',
                                          left: '0px',
                                          position: 'absolute',
                                          top: '135px',
                                          width: '100%',
                                        }}
                                      >
                                        <div
                                          className="flex shrink-0 items-center justify-center rounded-full h-[32px] w-[32px] p-[6px]"
                                          style={{
                                            backgroundColor:
                                              'rgba(27, 74, 221, 0.2)',
                                          }}
                                        >
                                          <img
                                            alt="Polygon logo"
                                            loading="lazy"
                                            width="20"
                                            height="20"
                                            className="h-full w-auto"
                                            src="https://bridge.arbitrum.io/images/EthereumLogo.svg"
                                            style={{ color: 'transparent' }}
                                          />
                                        </div>
                                        <div className="flex flex-col items-start gap-1">
                                          <span className="truncate leading-[1.1]">
                                            Polygon
                                          </span>
                                          <p className="whitespace-pre-wrap text-left text-xs leading-[1.15] text-white/70"></p>
                                          <p className="text-[10px] leading-none text-white/50">
                                            MATIC is the native gas token
                                          </p>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => checkNetwork('BSC')}
                                        type="button"
                                        aria-label="Switch to Binance"
                                        className="flex h-[90px] w-full items-center gap-4 px-4 py-2 text-lg transition-[background] duration-200 hover:bg-white/10"
                                        style={{
                                          height: '90px',
                                          left: '0px',
                                          position: 'absolute',
                                          top: '225px',
                                          width: '100%',
                                        }}
                                      >
                                        <div
                                          className="flex shrink-0 items-center justify-center rounded-full h-[32px] w-[32px] p-[6px]"
                                          style={{
                                            backgroundColor:
                                              'rgba(27, 74, 221, 0.2)',
                                          }}
                                        >
                                          <img
                                            alt="Binance logo"
                                            loading="lazy"
                                            width="20"
                                            height="20"
                                            className="h-full w-auto"
                                            src="https://bridge.arbitrum.io/images/EthereumLogo.svg"
                                            style={{ color: 'transparent' }}
                                          />
                                        </div>
                                        <div className="flex flex-col items-start gap-1">
                                          <span className="truncate leading-[1.1]">
                                            Binance
                                          </span>
                                          <p className="whitespace-pre-wrap text-left text-xs leading-[1.15] text-white/70"></p>
                                          <p className="text-[10px] leading-none text-white/50">
                                            BNB is the native gas token
                                          </p>
                                        </div>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between pb-2">
                            <label className="cursor-pointer relative">
                              <div className="toggle-switch flex flex-col text-white/70 duration-200 hover:text-white">
                                <div className="flex items-center gap-3 relative group">
                                  <div className="relative group">
                                    <button
                                      className={`relative inline-flex h-3 w-7 items-center rounded-full transition-colors ${
                                        isTestnetOn ? 'bg-white' : 'bg-white/50'
                                      }`}
                                      id="headlessui-switch-:rj:"
                                      role="switch"
                                      type="button"
                                      aria-checked={isTestnetOn}
                                      // onClick={toggleSwitch}
                                      aria-labelledby="headlessui-label-:rk:"
                                    >
                                      <span
                                        className={`inline-block h-[10px] w-[10px] transform rounded-full transition-transform translate-x-4 ${
                                          isTestnetOn
                                            ? 'testnet-toggle-off'
                                            : 'testnet-toggle-on'
                                        }`}
                                      />
                                    </button>
                                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                      Only test net available for now!
                                    </span>
                                  </div>
                                  <label
                                    className="heading mr-4 cursor-pointer text-sm"
                                    id="headlessui-label-:rk:"
                                  >
                                    Testnet mode {isTestnetOn ? 'ON' : 'OFF'}
                                  </label>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CommonDiv />
              <div className="flex flex-col flex-nowrap items-end break-all text-sm tracking[.25px] text-white sm:text-lg">
                <p>
                  <span className="font-light">Balance: </span>
                  <span aria-label="ETH balance amount on parentChain">
                    {tokenBalance} ETT
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row rounded border bg-black/40 shadow-2 border-white/30 text-white">
                <div className="relative">
                  <button
                    className="arb-hover h-full w-max rounded-bl rounded-tl px-3 py-3 text-white"
                    type="button"
                    aria-expanded="false"
                    id="headlessui-popover-button-:r8:"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-light sm:text-3xl">
                        ETT
                        <span style={{ fontSize: '15px' }}>(ERC20)</span>
                      </span>
                      {/* <ChevronDown className="text-gray-6 transition-transform duration-200 rotate-0" /> */}
                    </div>
                  </button>
                  <div
                    className="fixed left-0 top-0 z-20 sm:absolute sm:top-[76px] sm:max-w-[466px]"
                    hidden
                    style={{ display: 'none' }}
                  ></div>
                </div>
                <CommonDiv />
                <div className="flex grow flex-row items-center justify-center border-l border-white/30">
                <input
                  style={inSufficient ? { color: 'red' } : {}}
                  value={amount}
                  placeholder="Enter amount"
                  className="h-full w-full bg-transparent px-3 text-xl font-light placeholder:text-gray-dark sm:text-3xl"
                  onChange={(e) => {
                    dispatch(setInSufficient(false));
                    let value = e.target.value;

                    // Handle empty input (allow deletion of all characters)
                    if (value === '') {
                      dispatch(setAmount(''));
                      return;
                    }

                    // Prepend '0' if the input starts with a decimal point
                    if (value.startsWith('.')) {
                      value = '0' + value;
                    }

                    // Regex to validate input
                    const regex = /^(0|[1-9]\d*)(\.\d{0,5})?$/;

                    if (regex.test(value)) {
                      dispatch(setAmount(value));
                    }

                    // Check if the amount exceeds the token balance
                    if (Number(value) > Number(tokenBalance)) {
                      dispatch(setInSufficient(true));
                    }
                  }}
                />


                  {inSufficient && (
                    <p className="text-red-500 text-xs font-light ml-2.5">
                      Insufficient balance
                    </p>
                  )}
                  <button
                    style={{ marginRight: '10px', marginLeft: '10px' }}
                    className="flex w-full flex-row items-center justify-start gap-3 px-[12px] py-[7px] transition-[background] duration-300 ui-open:bg-white/20 ui-not-open:bg-transparent ui-not-open:hover:bg-white/20 sm:w-max sm:rounded sm:border sm:px-2 sm:py-1 sm:border-gray-1 sm:ui-not-open:bg-gray-1 sm:ui-not-open:hover:bg-white/10"
                    type="button"
                    aria-label="Account Header Button"
                    aria-expanded="false"
                    onClick={setMax}
                  >
                    <span className="flex flex-col text-justify text-base leading-extra-tight text-gray-4 sm:text-white">
                      max
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white/30 p-2 text-right text-xs font-light text-white opacity-80">
              <div className="flex w-1/2 flex-row items-center gap-1">
                <span className="text-left">Network gas fee</span>
                <div className="w-max">
                  <Info size={12} />
                </div>
              </div>
              <div className="flex w-1/2 justify-between">
                <span className="text-right">{gas} MATIC</span>
                <span className="tabular-nums">
                  ${(Number(gas) * 0.48).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="z-[1] flex h-4 w-full items-center justify-center lg:h-1">
        <button
          className="group relative flex h-7 w-7 items-center justify-center rounded bg-gray-1 p-1"
          aria-label="Switch Networks"
        >
          <div
            className="absolute left-0 right-0 top-0 m-auto h-[7.5px] w-full rounded-t border-x border-t transition-[border-color] duration-200 lg:h-[10px]"
            style={{
              borderColor: 'rgb(69, 74, 117)',
            }}
          ></div>
          <ArrowUpDown
            className="h-8 w-8 stroke-1 text-white transition duration-300 group-hover:rotate-180 group-hover:opacity-80"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 right-0 m-auto h-[7.5px] w-full rounded-b border-x border-b transition-[border-color] duration-200"
            style={{
              borderColor: 'rgb(27, 74, 221)',
            }}
          ></div>
        </button>
      </div>
      <div>
        <div
          className="relative rounded border transition-colors duration-400"
          style={{
            backgroundColor: 'rgba(69, 74, 117, 0.4)',
            borderColor: 'rgb(69, 74, 117)',
          }}
        >
          <div
            className="absolute left-0 top-0 h-full w-full bg-[-2px_0] bg-no-repeat bg-origin-content p-3 opacity-50"
            style={{
              backgroundSize: 'auto 58px',
              backgroundImage:
                'url(https://bridge.arbitrum.io/images/ArbitrumOneLogo.svg)',
            }}
          ></div>
          <div className="relative space-y-3.5 bg-contain bg-no-repeat p-3 sm:flex-row">
            <div className="flex flex-row flex-wrap items-center justify-between gap-1 gap-y-2.5 whitespace-nowrap">
              <div className="relative">
                <button
                  className="arb-hover flex w-max items-center gap-1 rounded px-3 py-2 text-sm text-white md:gap-2 md:text-xl"
                  type="button"
                  id="headlessui-listbox-button-:rd:"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                  style={{
                    backgroundColor: 'rgb(27, 74, 221)',
                  }}
                >
                  <span className="max-w-[220px] truncate leading-extra-tight md:max-w-[250px]">
                    To : edeXa
                  </span>
                  <ChevronDown className="transition-transform duration-200 rotate-0" />
                </button>
              </div>
              <div className="flex flex-col flex-nowrap items-end break-all text-sm tracking-[.25px] text-white sm:text-lg">
                <p>
                  <span className="font-light">Balance: </span>
                  <span aria-label="ETH balance amount on childChain">
                    {edxBalance} EDX
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white/30 p-2 text-right text-xs font-light text-white opacity-80">
              <div className="flex w-1/2 flex-row items-center gap-1">
                <span className="text-left">Bridge fee on Wanchain </span>
                <div className="w-max">
                  <Info size={12} />
                </div>
              </div>
              <div className="flex w-1/2 justify-between">
                <span className="text-right">
                  {(
                    Number(localStorage.getItem('platformFee')) /
                    10 ** 18
                  ).toFixed(3)}
                  &nbsp; MATIC
                </span>
                <span className="tabular-nums" style={{ textWrap: 'nowrap' }}>
                  $
                  {(
                    (Number(localStorage.getItem('platformFee')) / 10 ** 18) *
                    0.48
                  ).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTransfer;
