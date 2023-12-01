import React, { useState, useEffect, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';
import '../App.css';
import { Link } from 'react-router-dom';

const ConnectWallet = ({ setProvider }) => {
  const [provider, setLocalProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [whitelisted, setWhitelisted] = useState(false);
  const [canClaim, setCanClaim] = useState(false);

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
    alert(`Wallet connected successfully!\nAddress: ${firstAccount}`);
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
    // Check claim eligibility when component mounts or when selectedAddress changes
    if (selectedAddress) {
      checkClaimStatus(selectedAddress);
    }
  }, [selectedAddress, checkClaimStatus]);

  return (
    <div className="navbar">
      {!isConnected && (
        <Link to="/" className="connect-wallet-button disconnected" onClick={connectWallet}>
          Connect Wallet
        </Link>
      )}
      {isConnected && (
        <div>
          <p className="connected">Wallet Connected!</p>
          <button className="disconnect-wallet-button" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
          <p>Status: {whitelisted ? 'Whitelisted' : 'Not Whitelisted'}</p>
          {whitelisted && canClaim && (
            <Link to="/claim" className="claim-button">
              Claim Tokens
            </Link>
          )}
        </div>
      )}
      {selectedAddress && <p className="selected-address">Selected Address: {selectedAddress}</p>}
      {contract && <p className="contract-status">Contract Instance Ready!</p>}
    </div>
  );
};

export default ConnectWallet;
