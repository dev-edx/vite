import { useConnectWallet } from '@web3-onboard/react';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import poolABI from '../../abi/pool.json';
import tokenABI from '../../abi/token.json';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

let tokenAddress: string, poolAddress: string;

const TransferButton = () => {
  const [{ wallet }] = useConnectWallet();
  const [disableButton, setDisableButton] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [fee, setFee] = useState<BigNumber | null>(null);
  const [poolContract, setPoolContract] = useState<ethers.Contract | null>(
    null
  );
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
    null
  );
  const [approveError, setApproveError] = useState(false);
  const { amount } = useSelector((state: RootState) => state.amount);
  const { inSufficient } = useSelector((state: RootState) => state.sufficientBalance);
 const [awaitng, setAwaiting] = useState(false);

    async function getAdresses() {
      if (wallet?.provider) {
        const prov = new ethers.providers.Web3Provider(wallet.provider, 'any');
        const network = await prov.getNetwork();
        const chainID = network.chainId;
        if((chainID===1||chainID===80002||chainID===56||chainID===137) && !awaitng){
          setDisableButton(false);
        }
        switch (chainID) {         //yet to change address on diffrent chains only amoy is available now!
          case 1:
            tokenAddress = '0x5741E7ADc4657599f7F831e425c6C685D8dB3fB4';
            localStorage.setItem('tokenAddress', tokenAddress);
            poolAddress = '0x786ed31Aa96164822C5f045F8aD5e73C4c3f49fa';
            break;
          case 80002:
           
            tokenAddress = '0x5741E7ADc4657599f7F831e425c6C685D8dB3fB4';
            localStorage.setItem('tokenAddress', tokenAddress);
            poolAddress = "0x786ed31Aa96164822C5f045F8aD5e73C4c3f49fa";
            break;
          case 56:
            tokenAddress = '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E';
            localStorage.setItem('tokenAddress', tokenAddress);
            poolAddress = '0x786ed31Aa96164822C5f045F8aD5e73C4c3f49fa';
            break;
          case 137:
            tokenAddress = '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E';
            localStorage.setItem('tokenAddress', tokenAddress);
            poolAddress = '0x786ed31Aa96164822C5f045F8aD5e73C4c3f49fa';
            break;

          default:setDisableButton(true);
            break;
        }
      }
    }
    getAdresses();
  

  async function approve() {
    try {
     
      if (!amount) return;
      const tx = await tokenContract?.approve(
        poolAddress,
        ethers.utils.parseEther(amount?.toString()),
        {
            gasPrice: ethers.utils.parseUnits('70', 'gwei') // Set the gas price
        }
    );
    
      await tx?.wait();
      const tx2 = await tokenContract?.allowance(
        wallet?.accounts[0].address,
        poolAddress
      );
      const ALLOWANCE = Number(ethers.utils.formatEther(tx2));
      setAllowance(ALLOWANCE);
      setApproveError(false);
    } catch (error) {
      // console.log(error);
      setDisableButton(false);
      setApproveError(true);
      setAwaiting(false);
    }
  }


  const INIT = async () => {
    try{

     if (wallet?.provider) {
       const prov = new ethers.providers.Web3Provider(wallet.provider, 'any');
       const signer = prov.getSigner();
       const tContract = new ethers.Contract(tokenAddress, tokenABI, signer);
       setTokenContract(tContract);
       const pool = new ethers.Contract(poolAddress, poolABI, signer);
       setPoolContract(pool);
       const fee = await pool.estimateFee(1073741850, 8000000);
       const feeInWei = ethers.utils.parseUnits(fee.toString(), 'wei');
       setFee(feeInWei);
       localStorage.setItem('platformFee', fee.toString());
       if(!tContract) return;
       const tx2 = await tContract?.allowance(
         signer?.getAddress(),
         poolAddress
       );
       const ALLOWANCE = Number(ethers.utils.formatEther(tx2));
       setAllowance(ALLOWANCE);
       if (!amount) return;
       if(!(ALLOWANCE<amount)){}
       const gasEstimate = await pool.estimateGas.crossTo(
        1073741850,
        wallet?.accounts[0].address,
        ethers.utils.parseEther(amount?.toString()),
        {
         
        }
      );
      const gasPrice = await prov.getGasPrice();
      const gasFee = ethers.BigNumber.from(gasEstimate).mul(gasPrice);
      localStorage.setItem('gasFee', gasFee.toString());
       
     }}
     catch (error) {
       // console.log(error);
     }}


  useEffect(() => {
    INIT();
  }, [amount, wallet?.provider, wallet?.accounts[0].address]);

  useEffect(() => {
    INIT();

  },[])
  async function transfer() {
    setAwaiting(true);
    try {
     
      setDisableButton(true);
      const recipient = wallet?.accounts[0].address;
      if (!recipient) return;
      if (allowance < Number(amount)) {
        await approve();
      }
      if (approveError === true) return;
      const tx3 = await poolContract?.crossTo(
        1073741850,
        recipient,
        ethers.utils.parseEther(amount?.toString()),
        { value: BigNumber.from(fee),gasPrice: ethers.utils.parseUnits('70', 'gwei') }
      );
      await tx3?.wait();
      const tx2 = await tokenContract?.allowance(
        wallet?.accounts[0].address,
        poolAddress
      );
      const ALLOWANCE = Number(ethers.utils.formatEther(tx2));
      setAllowance(ALLOWANCE);
     
    } catch (error) {
      // console.log(error);
      setDisableButton(false);
      setAwaiting(false);
    }
    setDisableButton(false);
    setAwaiting(false);
  }

  return (
    <div className="transfer-panel-stats">
      <button
        onClick={() => {
          transfer();
        }}
        type="button"
        className="arb-hover relative rounded p-2 text-white disabled:cursor-not-allowed disabled:border disabled:border-white/10 disabled:bg-white/10 disabled:text-white/50 border-dark w-full border bg-eth-dark py-3 text-lg disabled:!border-white/10 disabled:!bg-white/10 lg:text-2xl"
        style={{
          borderColor: 'rgb(27, 74, 221)',
          backgroundColor: 'rgba(27, 74, 221, 0.4)',
        }}
        disabled={disableButton || inSufficient||amount==0||amount.toString()=="0"}
      >
        <div className="flex flex-row items-center space-x-3 justify-center">
          <span className="truncate">Move funds to edeXa</span>
        </div>
      </button>
    </div>
  );
};

export default TransferButton;
