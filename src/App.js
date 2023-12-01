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
          {/* Your other routes go here */}
          {provider && (
            <>
              {/* Ensure that the path matches the one you're navigating to */}
              <Route path="/" element={<Register provider={provider} />} />
              <Route path="/claim" element={<Claim provider={provider} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
