import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { contractABI2, contractAddress2 } from "../utils/constant2";
import "../App.css";

const ConnectWallet = ({ setProvider }) => {
  const [provider, setLocalProvider] = useState(null);
  const [contract, setContract] = useState(null); // State to store the contract instance
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const currentProvider = new ethers.providers.Web3Provider(connection);
    setLocalProvider(currentProvider);
    setProvider(currentProvider); // State update to store the provider
    setIsConnected(true); // Update connection status

    // Create an instance of your smart contract
    setContract(createContract(currentProvider));

    // Use eth_accounts RPC method to get the list of accounts
    const accounts = await currentProvider.send("eth_accounts", []);
    const firstAccount = accounts[0];
    setSelectedAddress(firstAccount);
  };

  const createContract = (currentProvider) => {
    // Replace 'contractAddress' and 'abi' with your actual contract address and ABI
    const ContractAddress = contractAddress2;
    const abi = contractABI2;

    return new ethers.Contract(ContractAddress, abi, currentProvider);
  };

  useEffect(() => {
    if (provider) {
      // Create an instance of your smart contract
      setContract(createContract(provider));
    }
  }, [provider]);

  return (
    <div className="connect-wallet-container">
  <button className="connect-wallet-button" onClick={connectWallet}>
    Connect Wallet
  </button>
  {isConnected && <p className="wallet-status">Wallet Connected!</p>}
  {selectedAddress && <p className="selected-address">Selected Address: {selectedAddress}</p>}
  {contract && <p className="contract-status">Contract Instance Ready!</p>}
</div>

  );
};

export default ConnectWallet;
