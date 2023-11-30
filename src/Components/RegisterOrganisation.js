import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';

function RegisterOrganization({ provider }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState(0);
  const [stakeholderAddress, setStakeholderAddress] = useState('');
  const [stakeholderAmount, setStakeholderAmount] = useState(0);
  const [stakeholderReleaseTime, setStakeholderReleaseTime] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!provider) return;
  
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress2, contractABI2, signer);
  
    const organizationRegisteredFilter = contract.filters.OrganizationRegistered();
    const adminAddedFilter = contract.filters.AdminAdded();
    const adminRemovedFilter = contract.filters.AdminRemoved();
    const whitelistUpdatedFilter = contract.filters.WhitelistUpdated();
  
    const onOrganizationRegistered = (name, symbol, initialSupply) => {
      setEvents((prevEvents) => [...prevEvents, `Organization registered: ${name} (${symbol}) - Supply: ${initialSupply}`]);
    };
  
    const onAdminAdded = (admin) => {
      setEvents((prevEvents) => [...prevEvents, `Admin added: ${admin}`]);
    };
  
    const onAdminRemoved = (admin) => {
      setEvents((prevEvents) => [...prevEvents, `Admin removed: ${admin}`]);
    };
  
    const onWhitelistUpdated = (user, status) => {
      setEvents((prevEvents) => [...prevEvents, `Whitelist updated for ${user}: ${status ? 'Added' : 'Removed'}`]);
    };
  
    contract.on(organizationRegisteredFilter, onOrganizationRegistered);
    contract.on(adminAddedFilter, onAdminAdded);
    contract.on(adminRemovedFilter, onAdminRemoved);
    contract.on(whitelistUpdatedFilter, onWhitelistUpdated);
  
    // Emit events on window load
    window.addEventListener('load', () => {
      // Triggering a dummy function to emit events after a delay (e.g., 3 seconds)
      setTimeout(() => {
        onOrganizationRegistered();
        onAdminAdded();
        onAdminRemoved();
        onWhitelistUpdated();
      }, 3000); // 3000 milliseconds (3 seconds)
    });
  
    return () => {
      contract.off(organizationRegisteredFilter, onOrganizationRegistered);
      contract.off(adminAddedFilter, onAdminAdded);
      contract.off(adminRemovedFilter, onAdminRemoved);
      contract.off(whitelistUpdatedFilter, onWhitelistUpdated);
    };
  }, [provider]);
  

  const registerOrganization = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const registerTransaction = await contract.registerOrganization(name, symbol, amount);
      await registerTransaction.wait();

      console.log('Organization registered successfully!');
    } catch (error) {
      console.error('Error registering organization:', error.message);
    }
  };

  const addAdmin = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const addAdminTransaction = await contract.addAdmin(adminAddress);
      await addAdminTransaction.wait();

      console.log('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error.message);
    }
  };

  const removeAdmin = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const removeAdminTransaction = await contract.removeAdmin(adminAddress);
      await removeAdminTransaction.wait();

      console.log('Admin removed successfully!');
    } catch (error) {
      console.error('Error removing admin:', error.message);
    }
  };

  const addToWhitelist = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const addToWhitelistTransaction = await contract.addToWhitelist(whitelistAddress);
      await addToWhitelistTransaction.wait();

      console.log('Address added to whitelist successfully!');
    } catch (error) {
      console.error('Error adding to whitelist:', error.message);
    }
  };

  const removeFromWhitelist = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const removeFromWhitelistTransaction = await contract.removeFromWhitelist(whitelistAddress);
      await removeFromWhitelistTransaction.wait();

      console.log('Address removed from whitelist successfully!');
    } catch (error) {
      console.error('Error removing from whitelist:', error.message);
    }
  };

  const addStakeholder = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      // Convert stakeholderReleaseTime to Unix timestamp
      const releaseTime = Math.floor(new Date(stakeholderReleaseTime).getTime() / 1000);

      const addVestingTransaction = await contract.addVesting(
        stakeholderAddress,
        stakeholderAmount,
        releaseTime
      );

      await addVestingTransaction.wait();

      console.log('Stakeholder added successfully!');
    } catch (error) {
      console.error('Error adding stakeholder:', error.message);
    }
  };

  
  return (
    <div>
      <div>
        <h3>Organization Registration:</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization Name" />
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Token Symbol" />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Initial Supply" />
        <button onClick={registerOrganization}>Register Organization</button>
      </div>

      <div>
        <h3>Admin Operations:</h3>
        <input
          type="text"
          value={adminAddress}
          onChange={(e) => setAdminAddress(e.target.value)}
          placeholder="Admin Address"
        />
        <button onClick={addAdmin}>Add Admin</button>
        <button onClick={removeAdmin}>Remove Admin</button>
      </div>

      <div>
        <h3>Whitelist Operations:</h3>
        <input
          type="text"
          value={whitelistAddress}
          onChange={(e) => setWhitelistAddress(e.target.value)}
          placeholder="Address to Whitelist"
        />
        <button onClick={addToWhitelist}>Add to Whitelist</button>
        <button onClick={removeFromWhitelist}>Remove from Whitelist</button>
      </div>

      <div>
        <h3>Stakeholder Operations:</h3>
        <input
          type="text"
          value={stakeholderAddress}
          onChange={(e) => setStakeholderAddress(e.target.value)}
          placeholder="Stakeholder Address"
        />
        <input
          type="number"
          value={stakeholderAmount}
          onChange={(e) => setStakeholderAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="datetime-local"
          value={stakeholderReleaseTime}
          onChange={(e) => setStakeholderReleaseTime(e.target.value)}
          placeholder="Release Time"
        />
        <button onClick={addStakeholder}>Add Stakeholder</button>
      </div>

     

      <div>
        <h3>Events:</h3>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RegisterOrganization;
