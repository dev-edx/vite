import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const Summary = () => {
  const { amount } = useSelector((state: RootState) => state.amount);

  return (
    <div className="mb-8 flex flex-col text-white">
      <span className="mb-3 text-xl">Summary</span>
      <div className="mb-3 flex flex-col space-y-3">
        <div className="grid grid-cols-[260px_auto] items-center text-sm font-light">
          <span className="text-left">You will pay in gas fees:</span>
          <span className="font-medium">
            <span className="tabular-nums">
              {(
                Number(localStorage.getItem('gasFee')) / 10 ** 18 +
                Number(localStorage.getItem('platformFee')) / 10 ** 18
              ).toFixed(3)}{' '}
              ETH
              {/* <span className="tabular-nums">($2.04)</span> */}
            </span>
          </span>
        </div>
        <div className="grid grid-cols-[260px_auto] items-center text-sm font-light">
          <span className="text-left">You will receive on edeXa:</span>
          <span className="font-medium">
            <span className="tabular-nums">
              {amount || 0} EDX
              <span className="tabular-nums"></span>
            </span>
          </span>
        </div>
        <div className="grid grid-cols-[260px_auto] items-center text-sm font-light">
          <span className="text-l" style={{ fontWeight: 800,fontStyle:'italic'}}>Average time for bridge </span>
          <span className="font-medium">
            <span className="tabular-nums">
            7~11 min
              <span className="tabular-nums"></span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
