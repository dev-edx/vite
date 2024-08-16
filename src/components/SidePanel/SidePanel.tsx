import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useConnectWallet } from '@web3-onboard/react';
interface CrossRequest {
  to: string;
  from: string;
  toChainId: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface CrossArrive {
  fromChainId: string;
  from: string;
  to: string;
  amount: string;
  transactionHash: string;
  blockTimestamp: string;
}

interface MainPanelProps {
  handleSideBar: () => void;
}

const SidePanel: React.FC<MainPanelProps> = ({ handleSideBar }) => {
  const [crossRequests, setCrossRequests] = useState<CrossRequest[]>([]);
  const [crossArrives, setCrossArrives] = useState<CrossArrive[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingArrives, setLoadingArrives] = useState(true);
  const [errorRequests, setErrorRequests] = useState<string | null>(null);
  const [errorArrives, setErrorArrives] = useState<string | null>(null);
  const [showRequests, setShowRequests] = useState(true);
  const [{ wallet }] = useConnectWallet();
  const user= wallet?.accounts[0].address
  useEffect(() => {
    const fetchCrossRequests = async () => {
      setLoadingRequests(true);
      setErrorRequests(null);

      const query = `
        query {
          crossRequests(where: { to: "${user}" }) {
            from
            to
            toChainId
            amount
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `;

      try {
        const response = await fetch(
          'https://api.studio.thegraph.com/query/72353/bridge/0',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          }
        );

        const result = await response.json();

        if (result.errors) {
          setErrorRequests('Error fetching data');
          console.error('Error fetching data:', result.errors);
        } else {
          const sortedRequests = result.data.crossRequests.sort(
            (a: CrossRequest, b: CrossRequest) =>
              Number(b.blockTimestamp) - Number(a.blockTimestamp)
          );
          setCrossRequests(sortedRequests);
        }
      } catch (error) {
        setErrorRequests('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoadingRequests(false);
      }
    };

    const fetchCrossArrives = async () => {
      setLoadingArrives(true);
      setErrorArrives(null);

      const query = `
        query {
          crossArrives(where: { from: "${user}" }) {  
            fromChainId
            from
            to
            amount
            transactionHash
            blockTimestamp
          }
        }
      `;

      try {
        const response = await fetch(
          'https://graphql.edexa.network/subgraphs/name/bridge_testnet-subgraph',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          }
        );

        const result = await response.json();

        if (result.errors) {
          setErrorArrives('Error fetching data');
          console.error('Error fetching data:', result.errors);
        } else {
          const sortedArrives = result.data.crossArrives.sort(
            (a: CrossArrive, b: CrossArrive) =>
              Number(b.blockTimestamp) - Number(a.blockTimestamp)
          );
          setCrossArrives(sortedArrives);
        }
      } catch (error) {
        setErrorArrives('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoadingArrives(false);
      }
    };

    fetchCrossRequests();
    fetchCrossArrives();
  }, []);

  function shortenAddress(address: string) {
    const firstPart = address.slice(0, 5);
    const lastPart = address.slice(-3);
    return `${firstPart}...${lastPart}`;
  }

  return (
    <div className="fixed z-40 h-screen max-h-screen" role="dialog">
      <div className="fixed inset-0 bg-dark opacity-80" />
      <div className="fixed inset-0 right-0 top-0 flex h-full w-full items-start justify-end">
        <div className="side-panel flex h-full w-screen max-w-[800px] flex-col border-l border-gray-dark bg-black pb-8 translate-x-0">
          <h2 className="sticky top-0 z-50 mx-4 flex flex-row justify-between bg-black pt-4 text-white pb-4">
            <button
              className="arb-hover"
              aria-label="Close side panel"
              onClick={() => {
                handleSideBar();
              }}
            >
              <X className="h-5 w-5 text-white ml-2" />
            </button>
          </h2>
          <div className="side-panel-content z-40 h-full px-4 pb-4">
            <div className="h-full overflow-hidden">
              <div className="mb-4 flex border-b border-white/30">
                <button
                  className={`text-white px-3 mr-2 border-b-2 arb-hover ${
                    showRequests ? 'border-white' : 'border-transparent'
                  }`}
                  onClick={() => setShowRequests(true)}
                >
                  <span className="text-xs md:text-base">Bridge requests</span>
                </button>
                <button
                  className={`text-white px-3 mr-2 border-b-2 arb-hover ${
                    !showRequests ? 'border-white' : 'border-transparent'
                  }`}
                  onClick={() => setShowRequests(false)}
                >
                  <span className="text-xs md:text-base">
                    Successful transactions
                  </span>
                </button>
              </div>
              <div className="h-full overflow-auto">
                {showRequests ? (
                  <div className="h-full" role="tabpanel">
                    {loadingRequests ? (
                      <div className="w-full flex flex-col items-center rounded bg-[#191919] p-4 text-center text-xs text-white">
                        Loading...
                      </div>
                    ) : errorRequests ? (
                      <div className="w-full flex flex-col items-center rounded bg-[#191919] p-4 text-center text-xs text-white">
                        Error: {errorRequests}
                      </div>
                    ) : crossRequests.length === 0 ? (
                      <div className="w-full flex flex-col items-center rounded bg-[#191919] p-4 text-center text-xs text-white">
                        Looks like no cross-request transactions here yet.
                      </div>
                    ) : (
                      <table className="w-full text-white text-sm border-separate">
                        <thead>
                          <tr>
                            <th>From</th>
                            {/* <th>To</th> */}
                            <th>To Chain</th>
                            <th>Amount(EDX)</th>
                            <th>Timestamp</th>
                            {/* <th>Transaction Hash</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {crossRequests.map((event, index) => (
                            <tr key={index}>
                              <td>{shortenAddress(event.from)}</td>
                              {/* <td>{shortenAddress(event.to)}</td> */}
                              <td>edeXa</td>
                              <td>{Number(event.amount)/10**18}</td>
                              <td>
                                {new Date(
                                  Number(event.blockTimestamp) * 1000
                                ).toLocaleString()}
                              </td>
                              <td>
                                <button className="text-white my-3 text-xs">
                                  <a
                                    href={`https://amoy.polygonscan.com/tx/${event.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View on Explorer
                                  </a>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <div className="h-full" role="tabpanel">
                    {loadingArrives ? (
                      <div className="w-full flex flex-col items-center rounded bg-[#191919] p-4 text-center text-xs text-white">
                        Loading...
                      </div>
                    ) : errorArrives ? (
                      <div className="w-full flex flex-col items-center rounded bg-[#191919] p-4 text-center text-xs text-white">
                        Error: {errorArrives}
                      </div>
                    ) : crossArrives.length === 0 ? (
                      <div className="w-full flex flex-col items-center rounded bg-[#191919] p-4 text-center text-xs text-white">
                        Looks like no cross-arrive transactions here yet.
                      </div>
                    ) : (
                      <table className="w-full text-white text-sm">
                        <thead>
                          <tr >
                            <th >To</th>
                            {/* <th>To</th> */}
                            <th>From Chain</th>
                            <th>Amount(EDX)</th>
                            <th>Timestamp</th>
                            {/* <th>Transaction Hash</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {crossArrives.map((event, index) => (
                            <tr key={index}>
                              <td >{shortenAddress(event.from)}</td>
                              {/* <td>{shortenAddress(event.to)}</td> */}
                             {event.fromChainId == '2147484614' ? <td>Amoy</td> : <td>{event.fromChainId}</td>}
                              <td>{Number(event.amount)/10**18}</td>
                              <td>
                                {new Date(
                                  Number(event.blockTimestamp) * 1000
                                ).toLocaleString()}
                              </td>
                              <td>
                              <button className="text-white my-3 text-xs">
                                  <a
                                    href={`https:explorer.testnet.edexa.network/tx/${event.transactionHash}?tab=logs`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View on Explorer
                                  </a>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
