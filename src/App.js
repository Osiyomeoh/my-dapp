import React, { useState } from 'react';
import ConnectWallet from './Components/ConnectWallet';
import RegisterOrganization from './Components/RegisterOrganisation';

import ClaimTokens from './Components/ClaimToken';

function App() {
    const [provider, setProvider] = useState(null);

    return (
        <div className="App">
            <ConnectWallet setProvider={setProvider} />
            {provider && (
                <>
                    <RegisterOrganization provider={provider} />
                    <ClaimTokens provider={provider} />
                </>
            )}
        </div>
    );
}

export default App;
