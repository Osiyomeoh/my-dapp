import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';

function ClaimTokens({ provider }) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const checkWhitelisted = async () => {
      if (!provider) {
        console.error('Wallet not connected');
        return;
      }

      try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress2, contractABI2, signer);
        const address = await signer.getAddress();
        const whitelisted = await contract.whitelist(address);
        setIsWhitelisted(whitelisted);
      } catch (error) {
        console.error('Error checking whitelist status:', error);
      }
    };

    checkWhitelisted();
  }, [provider]);

  const claimTokens = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    if (!isWhitelisted) {
      alert('Error: You are not whitelisted.');
      return;
    }

    try {
      setIsClaiming(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);
      const claimTokensTransaction = await contract.claimTokens();
      await claimTokensTransaction.wait();
      console.log('Tokens claimed successfully!');
      alert('Tokens claimed successfully!');
    } catch (error) {
      if (error.message.includes('Tokens are still locked')) {
        alert('Error: Tokens cannot be claimed at this time. Please wait until the vesting period has passed.');
      } else {
        console.error('Error claiming tokens:', error.message);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-lg">
      <button 
        onClick={claimTokens} 
        disabled={isClaiming || !isWhitelisted}
        className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                    ${isClaiming || !isWhitelisted ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}
                    transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105`}
      >
        {isClaiming ? 'Claiming Tokens...' : 'Claim Tokens'}
      </button>
      {isClaiming && <p className="mt-2 text-sm text-gray-600">Please wait while your transaction is being processed.</p>}
      {!isWhitelisted && <p className="mt-2 text-sm text-red-500">You are not whitelisted to claim tokens.</p>}
    </div>
  );
}
  
export default ClaimTokens;
