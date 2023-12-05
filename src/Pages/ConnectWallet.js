// ConnectWallet.js
import React from 'react';
import ConnectWalletComponent from '../Components/ConnectWallet';

const ConnectWallet = ({ setProvider }) => {
  return (

    <div>
      
      
      <ConnectWalletComponent setProvider={setProvider} />
    </div>
  );
};

export default ConnectWallet;
