import React, {  } from 'react';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';

function ClaimTokens({ provider }) {
    const claimTokens = async () => {
        if (!provider) {
          console.error('Wallet not connected');
          return;
        }
    
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress2, contractABI2, signer);
    
          const claimTokensTransaction = await contract.claimTokens();
          await claimTokensTransaction.wait();
    
          console.log('Tokens claimed successfully!');
        } catch (error) {
          console.error('Error claiming tokens:', error.message);
        }
      };
    

    return (
        <button onClick={claimTokens}>Claim Tokens</button>
    );
}

export default ClaimTokens;
