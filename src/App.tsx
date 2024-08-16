import './App.css';
import Header from './components/Header/Header';
import MainPanel from './components/MainPanel/MainPanel';
import SidePanel from './components/SidePanel/SidePanel';
import { useState } from 'react';


function App() {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const handleSideBar = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  

  return (
    <div className="relative flex flex-col sm:min-h-screen">
      
      <div className="flex flex-row">
        <main className="grow">
          <div>
            <Header />
            <MainPanel handleSideBar={handleSideBar} />
            {sidePanelOpen && <SidePanel handleSideBar={handleSideBar} />}
          </div>
        </main>
      </div>
    
    </div>
  );
}

export default App;
