import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI2, contractAddress2 } from '../utils/constant2';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AlertComponent from './ShowAlert';

function RegisterOrganization({ provider }) {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState(0);
  const [stakeholderAddress, setStakeholderAddress] = useState('');
  const [stakeholderAmount, setStakeholderAmount] = useState(0);
  const [adminAddress, setAdminAddress] = useState('');
  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [events, setEvents] = useState([]);
  const [vestingReleaseDateTime, setVestingReleaseDateTime] = useState('');
  const navigate = useNavigate();
  const [stakeholderType, setStakeholderType] = useState('community');
  const [organizationName, setOrganizationName] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });



  const [organizationAddress, setOrganizationAddress] = useState('');

  const showAlert = (message, type = 'info') => {
    setAlertInfo({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertInfo({ ...alertInfo, show: false });
  };

 

  const handleOrganizationNameChange = (e) => {
    setOrganizationName(e.target.value);
  };
  
  const handleOrganizationAddressChange = (e) => {
    const inputAddress = e.target.value;
    const normalizedAddress = ethers.utils.getAddress(inputAddress);

    // Update the state with the normalized address
    setOrganizationAddress(normalizedAddress);
  };
  const handleStakeholderAddressChange = (e) => {
    const inputAddress = e.target.value;
    const normalAddress = ethers.utils.getAddress(inputAddress);

    setStakeholderAddress(normalAddress);
  }

  const goToClaimPage = () => {
    navigate('/claim'); 
  };
  const resetFields = () => {
    setSymbol('');
    setOrganizationName('');
    setOrganizationAddress('');
    setAmount(0);
    setAdminAddress('');
    setWhitelistAddress('');
    setStakeholderAddress('');
    setStakeholderAmount(0);
    setVestingReleaseDateTime('');
    setStakeholderType('community'); // Reset stakeholderType to its initial value
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
      const stakeholderAddedFilter = contract.filters.StakeholderAdded();


      const pastOrganizationRegisteredEvents = await contract.queryFilter(
        organizationRegisteredFilter,
      );

      const pastAdminAddedEvents = await contract.queryFilter(adminAddedFilter);

      const pastAdminRemovedEvents = await contract.queryFilter(adminRemovedFilter);

      const pastWhitelistUpdatedEvents = await contract.queryFilter(whitelistUpdatedFilter);
      const pastStakeholderAddedEvents = await contract.queryFilter(stakeholderAddedFilter);


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
      
      pastStakeholderAddedEvents.forEach((event) => {
        const { args } = event;
        const { stakeholder, amount, releaseTime, stakeholderType } = args;
        onStakeholderAdded(stakeholder, amount, releaseTime, stakeholderType);
      });
    
    };

    

    // Subscribe to future events
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

    const organizationRegisteredFilter = contract.filters.OrganizationRegistered();
    const adminAddedFilter = contract.filters.AdminAdded();
    const adminRemovedFilter = contract.filters.AdminRemoved();
    const whitelistUpdatedFilter = contract.filters.WhitelistUpdated();
    const stakeholderAddedFilter = contract.filters.StakeholderAdded();


    const onOrganizationRegistered = (name, symbol, initialSupply) => {
      const newEvent = `Organization registered: ${name} (${symbol}) - Supply: ${initialSupply}`;
      if (!events.includes(newEvent)) {
        setEvents(prevEvents => [...prevEvents, newEvent]);
      }
    };
    
    const onAdminAdded = (admin) => {
      const newEvent = `Admin added: ${admin}`;
      if (!events.includes(newEvent)) {
        setEvents(prevEvents => [...prevEvents, newEvent]);
      }
    };
    
    const onAdminRemoved = (admin) => {
      const newEvent = `Admin removed: ${admin}`;
      if (!events.includes(newEvent)) {
        setEvents(prevEvents => [...prevEvents, newEvent]);
      }
    };
    
    const onWhitelistUpdated = (user, status) => {
      const newEvent = `Whitelist updated for ${user}: ${status ? 'Added' : 'Removed'}`;
      if (!events.includes(newEvent)) {
        setEvents(prevEvents => [...prevEvents, newEvent]);
      }
    };
    
    const convertUnixToDateString = (unixTimestamp) => {
      if (!unixTimestamp) return 'N/A';
      const date = new Date(unixTimestamp * 1000);
      return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    };
    
    const onStakeholderAdded = (stakeholder, amount, releaseTime, stakeholderType) => {
      const formattedAmount = amount ? amount.toString() : 'N/A';
      const formattedDate = convertUnixToDateString(releaseTime);
    
      const newEvent = `Stakeholder added: ${stakeholder} - Amount: ${formattedAmount} - Release Time: ${formattedDate} - Type: ${stakeholderType}`;
      if (!events.includes(newEvent)) {
        setEvents(prevEvents => [...prevEvents, newEvent]);
      }
    };
  
    
    

    contract.on(organizationRegisteredFilter, onOrganizationRegistered);
    contract.on(adminAddedFilter, onAdminAdded);
    contract.on(adminRemovedFilter, onAdminRemoved);
    contract.on(whitelistUpdatedFilter, onWhitelistUpdated);
    contract.on(stakeholderAddedFilter, onStakeholderAdded);
    

    fetchPastEvents(); // Fetch past events when component mounts

    return () => {
      contract.off(organizationRegisteredFilter, onOrganizationRegistered);
      contract.off(adminAddedFilter, onAdminAdded);
      contract.off(adminRemovedFilter, onAdminRemoved);
      contract.off(whitelistUpdatedFilter, onWhitelistUpdated);
      contract.off(stakeholderAddedFilter, onStakeholderAdded);
    };
  }, [provider, events]);

  const registerOrganization = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const registerTransaction = await contract.registerOrganization(
        organizationAddress,
        organizationName,
        symbol,
        amount
      );
      await registerTransaction.wait();

      resetFields();
      console.log('Organization registered successfully!');
      showAlert('Organization registered successfully!');
    } catch (error) {
      console.error('Error registering organization:', error.message);
      showAlert(`Error registering organization: ${error.message}`);
    }finally {
      setIsProcessing(false);
  }
  };


  const addAdmin = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const addAdminTransaction = await contract.addAdmin(adminAddress);
      await addAdminTransaction.wait();

      resetFields();
      console.log('Admin added successfully!');
      showAlert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error.message);
      showAlert(`Error adding admin: ${error.message}`);
    }finally {
      setIsProcessing(false); // End transaction processing
  }
  };

  const removeAdmin = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const removeAdminTransaction = await contract.removeAdmin(adminAddress);
      await removeAdminTransaction.wait();

      resetFields();
      console.log('Admin removed successfully!');
      showAlert('Admin removed successfully!');
    } catch (error) {
      console.error('Error removing admin:', error.message);
      showAlert(`Error removing admin: ${error.message}`);
    }finally {
      setIsProcessing(false); // End transaction processing
  }
  };

  const addToWhitelist = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const addToWhitelistTransaction = await contract.addToWhitelist(whitelistAddress);
      await addToWhitelistTransaction.wait();

      resetFields();
      console.log('Address added to whitelist successfully!');
      showAlert('Address added to whitelist successfully!');
    } catch (error) {
      console.error('Error adding to whitelist:', error.message);
      showAlert(`Error adding to whitelist: ${error.message}`);
    }finally {
      setIsProcessing(false); // End transaction processing
  }
  };

  const removeFromWhitelist = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);

      const removeFromWhitelistTransaction = await contract.removeFromWhitelist(whitelistAddress);
      await removeFromWhitelistTransaction.wait();

      resetFields();
      console.log('Address removed from whitelist successfully!');
      showAlert('Address removed from whitelist successfully!');
    } catch (error) {
      console.error('Error removing from whitelist:', error.message);
      showAlert(`Error removing from whitelist: ${error.message}`);
    }finally {
      setIsProcessing(false); // End transaction processing
  }
  };


 

  const validateInputs = () => {
    // Validate stakeholderAddress
    if (!ethers.utils.isAddress(stakeholderAddress)) {
      showAlert("Invalid stakeholder address");
      return false;
    }
  
    // Validate stakeholderAmount
    if (isNaN(stakeholderAmount) || stakeholderAmount <= 0) {
      showAlert("Invalid stakeholder amount");
      return false;
    }
  
    // Validate vestingReleaseDateTime
    if (!(vestingReleaseDateTime instanceof Date && !isNaN(vestingReleaseDateTime))) {
      showAlert("Invalid release date and time");
      return false;
    }
  
    
    return true;
  };

  const addStakeholder = async () => {
    if (!provider) {
      console.error('Wallet not connected');
      return;
    }
  if (!validateInputs()) {
    return;
  }
  setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress2, contractABI2, signer);
  
      
        const releaseTime = Math.floor(new Date(vestingReleaseDateTime).getTime() / 1000);
  
        const addStakeholderTransaction = await contract.addStakeholder(
          stakeholderAddress,
          stakeholderAmount,
          releaseTime,
          stakeholderType
        );
  
        await addStakeholderTransaction.wait();
        resetFields();
        console.log('Stakeholder added successfully!');
        showAlert(`Stakeholder added successfully for organization: ${organizationName}`);
      
    } catch (error) {
      console.error('Error adding stakeholder:', error.message);
      showAlert(`Error adding stakeholder: ${error.message}`);
    }finally {
      setIsProcessing(false); // End transaction processing
  }
  };
  
  

  
  return (
    <div className="register-organization-container max-w-4xl mx-auto p-4">
        {alertInfo.show && <AlertComponent message={alertInfo.message} type={alertInfo.type} onClose={closeAlert} />}

      { (
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-500 text-blue-500">Organization Registration:</h3>
        <input
        type="text"
        value={organizationAddress}
        onChange={handleOrganizationAddressChange} 
        placeholder="Organization Address"
        className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
        />
      <input
        type="text"
        value={organizationName}
        onChange={handleOrganizationNameChange}
        placeholder="Organization Name"
        className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
        />
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Token Symbol"
        className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
        />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Initial Supply"
        className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700" // Added margin bottom
          />
      <button 
                    onClick={registerOrganization} 
                    disabled={isProcessing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {isProcessing ? 'Processing...' : 'Register Organization'}
                </button>
        </div>
      )}

      { (
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
             <h3 className="text-lg font-semibold mb-4 text-blue-500">Stakeholder Operations:</h3>
    <input
      type="text"
      value={stakeholderAddress}
      onChange={handleStakeholderAddressChange}
      placeholder="Stakeholder Address"
      className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
    />
    <input
      type="number"
      value={stakeholderAmount}
      onChange={(e) => setStakeholderAmount(e.target.value)}
      placeholder="Amount"
      className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
    />
    <DatePicker
      selected={vestingReleaseDateTime}
      onChange={(date) => setVestingReleaseDateTime(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="MMMM d, yyyy h:mm aa"
      placeholderText="Select Date and Time"
      className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
    />
    <div className="mb-4">
      <label
        htmlFor="stakeholderType"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Stakeholder Type:
      </label>
      <select
        id="stakeholderType"
        value={stakeholderType}
        onChange={(e) => setStakeholderType(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
      >
        <option value="community">Community</option>
        <option value="investors">Investors</option>
        <option value="pre-sale">Pre-sale Buyers</option>
        <option value="founders">Founders</option>
      </select>
    </div>
    <button
      onClick={addStakeholder}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
     {isProcessing ? 'Processing...' : 'Add Stakeholder'} 
    </button>
  </div>
      )}

      { (
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">Admin Operations:</h3>
          <input
            type="text"
            value={adminAddress}
            onChange={(e) => setAdminAddress(e.target.value)}
            placeholder="Admin Address"
            className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700" // Added margin bottom
            />

          <button onClick={addAdmin}className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          > {isProcessing ? 'Processing...' : ' Add Admin'}</button>
          <button onClick={removeAdmin}className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >{isProcessing ? 'Processing...' : ' Remove Admin'}</button>
        </div>
      )}

      { (
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">Whitelist Operations:</h3>
          <input
          type="text"
          value={whitelistAddress}
          onChange={(e) => setWhitelistAddress(e.target.value)}
          placeholder="Address to Whitelist"
          className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700" // Added margin bottom
          />

        <button onClick={addToWhitelist}className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          > {isProcessing ? 'Processing...' : 'Add to Whitelist'} </button>
        <button onClick={removeFromWhitelist}className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >{isProcessing ? 'Processing...' : 'Remove to Whitelist'}</button>
        </div>
      )}

  
<div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-500">Events:</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-gray-200 bg-gray-800 text-left">Event Details</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="hover:bg-gray-600">
                <td className="border-b border-gray-600 p-4 pl-8 text-white">{event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4 text-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={goToClaimPage}>
          Go to Claim Page
        </button>
      </div>
    
    </div>
  );
}
  
 
 

export default RegisterOrganization;
