import Summary from './Summary';
import TransferButton from './TransferButton';
import DataTransfer from './DataTransfer';
import TransactionButton from './TransactionButton';

interface MainPanelProps {
  handleSideBar: () => void;
}

const MainPanel: React.FC<MainPanelProps> = ({ handleSideBar }) => {
  return (
    <div className="main-panel mx-auto flex w-full flex-col sm:max-w-[600px] sm:pb-12 sm:pt-6">
      <TransactionButton handleSideBar={handleSideBar} />
      <div className="mb-7 flex flex-col border-y border-white/30 bg-gray-1 p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.2)] sm:rounded sm:border">
        <DataTransfer />
        <Summary />
        <TransferButton />
      </div>
    </div>
  );
};

export default MainPanel;
