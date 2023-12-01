// ConnectWallet.js
import React from 'react';
import ConnectWalletComponent from '../Components/ConnectWallet';

const ConnectWallet = ({ setProvider }) => {
  return (
    <div>
      <h2>Sam Dapp</h2>
      <ConnectWalletComponent setProvider={setProvider} />
    </div>
  );
};

export default ConnectWallet;
