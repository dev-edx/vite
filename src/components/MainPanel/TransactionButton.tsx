import { FileChartColumn, MoveRight } from 'lucide-react';

interface MainPanelProps {
  handleSideBar: () => void;
}

const TransactionButton: React.FC<MainPanelProps> = ({ handleSideBar }) => {
  return (
    <button
      type="button"
      className="arb-hover relative border text-sm disabled:cursor-not-allowed disabled:border disabled:border-white/10 disabled:bg-white/10 disabled:text-white/50 mb-3 mt-3 w-full rounded-none border-x-0 border-white/30 p-3 text-left sm:rounded sm:border md:mt-0 bg-gray-1 text-white/70"
      aria-label="Open Transaction History"
      onClick={handleSideBar}
    >
      <div className="flex flex-row items-center space-x-3 justify-start pr-4">
        <span>
          <div className="flex space-x-2">
            <FileChartColumn size={18} />
            <span>See transaction history</span>
          </div>
        </span>
      </div>
      <MoveRight
        className="absolute right-3 top-[50%] translate-y-[-50%] transition-transform duration-300"
        size={16}
      />
    </button>
  );
};

export default TransactionButton;
