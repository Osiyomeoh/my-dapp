import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const goToClaimPage = () => {
    navigate('/claim'); 
  };
  const resetFields = () => {
    setName('');
    setSymbol('');
    setAmount(0);
    setAdminAddress('');
    setWhitelistAddress('');
    setStakeholderAddress('');
    setStakeholderAmount(0);
    setStakeholderReleaseTime('');
  };

 
  useEffect(() => {
    if (!provider) return;

    const fetchPastEvents = async () => {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const organizationRegisteredFilter = contract.filters.OrganizationRegistered();
      const adminAddedFilter = contract.filters.AdminAdded();
      const adminRemovedFilter = contract.filters.AdminRemoved();
      const whitelistUpdatedFilter = contract.filters.WhitelistUpdated();

      const pastOrganizationRegisteredEvents = await contract.queryFilter(
        organizationRegisteredFilter,
      );

      const pastAdminAddedEvents = await contract.queryFilter(adminAddedFilter);

      const pastAdminRemovedEvents = await contract.queryFilter(adminRemovedFilter);

      const pastWhitelistUpdatedEvents = await contract.queryFilter(whitelistUpdatedFilter);

      pastOrganizationRegisteredEvents.forEach((event) => {
        const { args } = event;
        const { name, symbol, initialSupply } = args;
        onOrganizationRegistered(name, symbol, initialSupply);
      });

      pastAdminAddedEvents.forEach((event) => {
        const { args } = event;
        const { admin } = args;
        onAdminAdded(admin);
      });

      pastAdminRemovedEvents.forEach((event) => {
        const { args } = event;
        const { admin } = args;
        onAdminRemoved(admin);
      });

      pastWhitelistUpdatedEvents.forEach((event) => {
        const { args } = event;
        const { user, status } = args;
        onWhitelistUpdated(user, status);
      });
    };

    // Subscribe to future events
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

    const organizationRegisteredFilter = contract.filters.OrganizationRegistered();
    const adminAddedFilter = contract.filters.AdminAdded();
    const adminRemovedFilter = contract.filters.AdminRemoved();
    const whitelistUpdatedFilter = contract.filters.WhitelistUpdated();

    const onOrganizationRegistered = (name, symbol, initialSupply) => {
      setEvents((prevEvents) => [
        ...prevEvents,
        `Organization registered: ${name} (${symbol}) - Supply: ${initialSupply}`,
      ]);
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

    fetchPastEvents(); // Fetch past events when component mounts

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

      resetFields();
      console.log('Organization registered successfully!');
      alert('Organization registered successfully!');
    } catch (error) {
      console.error('Error registering organization:', error.message);
      alert(`Error registering organization: ${error.message}`);
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

      resetFields();
      console.log('Admin added successfully!');
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error.message);
      alert(`Error adding admin: ${error.message}`);
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

      resetFields();
      console.log('Admin removed successfully!');
      alert('Admin removed successfully!');
    } catch (error) {
      console.error('Error removing admin:', error.message);
      alert(`Error removing admin: ${error.message}`);
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

      resetFields();
      console.log('Address added to whitelist successfully!');
      alert('Address added to whitelist successfully!');
    } catch (error) {
      console.error('Error adding to whitelist:', error.message);
      alert(`Error adding to whitelist: ${error.message}`);
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

      resetFields();
      console.log('Address removed from whitelist successfully!');
      alert('Address removed from whitelist successfully!');
    } catch (error) {
      console.error('Error removing from whitelist:', error.message);
      alert(`Error removing from whitelist: ${error.message}`);
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
      resetFields();
      console.log('Stakeholder added successfully!');
      alert('Stakeholder added successfully!');
    } catch (error) {
      console.error('Error adding stakeholder:', error.message);
      alert(`Error adding stakeholder: ${error.message}`);
    }
  };

  
  return (
    <div className="register-organization-container">
    <div className="register-section card">
      <h3>Organization Registration:</h3>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization Name" />
      <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Token Symbol" />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Initial Supply" />
      <button onClick={registerOrganization}>Register Organization</button>
    </div>

    <div className="register-section card">
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

      <div className="register-section card">
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

      <div className="register-section card">
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

     

      <div className="register-section card">
        <h3>Events:</h3>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
      <div className="register-section card">
        <button onClick={goToClaimPage}>Go to Claim Page</button>
      </div>
    
    </div>
  );
}

export default RegisterOrganization;
