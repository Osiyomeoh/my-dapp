import React, { useState, useEffect, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';
import '../App.css';

const ConnectWallet = ({ setProvider }) => {
  const [provider, setLocalProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [whitelisted, setWhitelisted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [endTime, setEndTime] = useState(null);

  const checkWhitelistStatus = useCallback(async (address) => {
    try {
      const isWhitelisted = await contract.isWhitelisted(address);
      return isWhitelisted;
    } catch (error) {
      console.error('Error checking whitelist status:', error.message);
      return false;
    }
  }, [contract]);

  const connectWallet = async () => {
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

    // Check whitelisting status
    const isWhitelisted = await checkWhitelistStatus(firstAccount);
    setWhitelisted(isWhitelisted);

    // Set up a timer to update every 10 seconds
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime + 300; // 5 minutes (300 seconds)
    setEndTime(endTime);

    // const intervalId = setInterval(() => {
    //   const remainingTime = endTime - Math.floor(Date.now() / 1000);
    //   setTimer(remainingTime > 0 ? remainingTime : 0);
    // }, 1000);

    // Show alert when wallet is connected
    alert(`Wallet connected successfully!\nAddress: ${firstAccount}`);
  };

  const disconnectWallet = () => {
    clearInterval(timer);
    setLocalProvider(null);
    setProvider(null);
    setIsConnected(false);
    setSelectedAddress(null);
    setContract(null);
    setWhitelisted(false);
    setEndTime(null);

    // Additional logic for disconnecting, if needed
    alert('Wallet disconnected successfully!');
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
    const checkAndSetWhitelistStatus = async () => {
      if (selectedAddress) {
        const isWhitelisted = await checkWhitelistStatus(selectedAddress);
        setWhitelisted(isWhitelisted);
      }
    };

    checkAndSetWhitelistStatus();
  }, [selectedAddress, checkWhitelistStatus]);

  return (
    <div className="navbar">
      {!isConnected && (
        <a className="connect-wallet-button disconnected" onClick={connectWallet}>
          Connect Wallet
        </a>
      )}
      {isConnected && (
        <div>
          <p className="connected">Wallet Connected!</p>
          <button className="disconnect-wallet-button" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
          <p>Status: {whitelisted ? 'Whitelisted' : 'Not Whitelisted'}</p>
          <p>Timer: {timer} seconds</p>
        </div>
      )}
      {selectedAddress && <p className="selected-address">Selected Address: {selectedAddress}</p>}
      {contract && <p className="contract-status">Contract Instance Ready!</p>}
    </div>
  );
};

export default ConnectWallet;
