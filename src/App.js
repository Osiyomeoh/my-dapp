// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConnectWallet from './Pages/ConnectWallet';
import Register from './Pages/Register';
import Claim from './Pages/Claim';

function App() {
  const [provider, setProvider] = useState(null);

  return (
    <Router>
      <div className="App">
      <ConnectWallet setProvider={setProvider} />
        <Routes>
         
          {provider && (
            <>
              <Route path="/register" element={<Register provider={provider} />} />
              <Route path="/claim" element={<Claim provider={provider} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
