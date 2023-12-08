import React, { useState, useEffect, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';
import '../index.css';
import { Link } from 'react-router-dom';
import AlertComponent from './ShowAlert';

const ConnectWallet = ({ setProvider }) => {
  const [provider, setLocalProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [whitelisted, setWhitelisted] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [releaseTime, setReleaseTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'info') => {
    setAlertInfo({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertInfo({ ...alertInfo, show: false });
  };
const fetchStakeholderReleaseTime = useCallback(async (address) => {
  try {
    const stakeholderInfo = await contract.stakeholders(address);
    setReleaseTime(stakeholderInfo.vestingReleaseTime.toNumber());
  } catch (error) {
    console.error('Error fetching release time:', error.message);
  }
}, [contract]);

useEffect(() => {
  if (selectedAddress && contract) {
    fetchStakeholderReleaseTime(selectedAddress);
  }
}, [selectedAddress, contract, fetchStakeholderReleaseTime]);

useEffect(() => {
  const timer = setTimeout(() => {
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const timeRemaining = releaseTime - currentTime;
    if (timeRemaining > 0) {
      setTimeLeft(timeRemaining);
    } else {
      setTimeLeft(0);
      // Assuming the claim eligibility is based on the countdown
      setCanClaim(true);
    }
  }, 1000);

  return () => clearTimeout(timer);
}, [releaseTime, timeLeft]);


  const checkWhitelistStatus = useCallback(async (address) => {
    try {
      const isWhitelisted = await contract.whitelist(address);
      return isWhitelisted;
    } catch (error) {
      console.error('Error checking whitelist status:', error.message);
      return false;
    }
  }, [contract]);

  const checkClaimStatus = useCallback(async (address) => {
    try {
      const isWhitelisted = await checkWhitelistStatus(address);
      setWhitelisted(isWhitelisted);
      // Set claim eligibility based on whitelisting status
      setCanClaim(isWhitelisted);
    } catch (error) {
      console.error('Error checking claim status:', error.message);
    }
  }, [checkWhitelistStatus]);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const currentProvider = new ethers.providers.Web3Provider(connection);
      setLocalProvider(currentProvider);
      setProvider(currentProvider);
      setIsConnected(true);
  
      setContract(createContract(currentProvider));
  
      const accounts = await currentProvider.send('eth_accounts', []);
      const firstAccount = accounts[0];
      setSelectedAddress(firstAccount);
  
      // Check claim eligibility when wallet is connected
      await checkClaimStatus(firstAccount);
  
      // Show alert when wallet is connected
      showAlert(`Wallet connected successfully!\nAddress: ${firstAccount}`);
    } catch (error) {
      console.error('Wallet connection cancelled or failed:', error);
      showAlert('Wallet connection cancelled or failed.', 'error');
    }
  };
  

  const shortenAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

 
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert('Address copied to clipboard!');
  };

  const disconnectWallet = () => {
    setLocalProvider(null);
    setProvider(null);
    setIsConnected(false);
    setSelectedAddress(null);
    setContract(null);
    setWhitelisted(false);
    setCanClaim(false);

    // Additional logic for disconnecting, if needed
    showAlert('Wallet disconnected successfully!');
  };

  const createContract = (currentProvider) => {
    const ContractAddress = contractAddress2;
    const abi = contractABI2;

    return new ethers.Contract(ContractAddress, abi, currentProvider);
  };

  useEffect(() => {
    if (provider) {
      setContract(createContract(provider));
    }
  }, [provider]);

  useEffect(() => {
    // Check claim eligibility when component mounts or when selectedAddress changes
    if (selectedAddress) {
      checkClaimStatus(selectedAddress);
    }
  }, [selectedAddress, checkClaimStatus]);

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 text-white">
{alertInfo.show && <AlertComponent message={alertInfo.message} type={alertInfo.type} onClose={closeAlert} />}
    <div className="flex-1">
      {!isConnected && (
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={connectWallet}>
          Connect Wallet
        </Link>
      )}
      {isConnected && (
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={disconnectWallet}>
          Disconnect Wallet
        </button>
      )}
    </div>

    {isConnected && (
  <div className="flex-1 flex flex-col items-center">
    <p className="text-green-400">Wallet Connected!</p>
    <p>Status: <span className={whitelisted ? 'text-green-500' : 'text-red-500'}>{whitelisted ? 'Whitelisted' : 'Not Whitelisted'}</span></p>
    {timeLeft > 0 ? (
      <p>Time until release: {timeLeft} seconds</p>
    ) : (
      whitelisted && canClaim && (
        <Link to="/claim" className="mt-4 bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-bold py-2 px-4 rounded">
          Claim Tokens
        </Link>
      )
    )}
  </div>
)}

    <div className="flex-1 text-right">
      {selectedAddress && (
        <button className="text-sm text-blue-500 hover:text-blue-700" onClick={() => copyToClipboard(selectedAddress)}>
          {shortenAddress(selectedAddress)}
        </button>
      )}
      {contract && <p className="text-sm text-gray-300">Contract Instance Ready!</p>}
    </div>
  </div>
);
      }


export default ConnectWallet;