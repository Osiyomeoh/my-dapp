import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI2, contractAddress2 } from "../utils/constant2";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertComponent from "./ShowAlert";

function RegisterOrganization({ provider }) {
  const [stakeholderAddress, setStakeholderAddress] = useState("");
  const [stakeholderAmount, setStakeholderAmount] = useState(0);
  const [adminAddress, setAdminAddress] = useState("");
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [displayedOrganizationName, setDisplayedOrganizationName] =
    useState("");
  const [displayedTokenDetails, setDisplayedTokenDetails] = useState({
    address: "",
    name: "",
  });

  const [vestingReleaseDateTime, setVestingReleaseDateTime] = useState("");
  const navigate = useNavigate();
  const [stakeholderType, setStakeholderType] = useState("community");
  const [isRegisteredAddress, setIsRegisteredAddress] = useState(false);

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenInitialSupply, setTokenInitialSupply] = useState(0);
  const [organizationName, setOrganizationName] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [organizationAddress, setOrganizationAddress] = useState("");
  const showAlert = (message, type = "info") => {
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


    setOrganizationAddress(normalizedAddress);
  };
  const handleStakeholderAddressChange = (e) => {
    const inputAddress = e.target.value;
    const normalAddress = ethers.utils.getAddress(inputAddress);

    setStakeholderAddress(normalAddress);
  };



  const goToClaimPage = () => {
    navigate("/claim");
  };
  const resetFields = () => {
    setOrganizationName("");
    setOrganizationAddress("");
    setTokenName("");
    setTokenSymbol("");
    setTokenInitialSupply(0);
    setAdminAddress("");
    setWhitelistAddress("");
    setStakeholderAddress("");
    setStakeholderAmount(0);
    setVestingReleaseDateTime(null);
    setStakeholderType("community");
  };

  const registerOrganization = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      showAlert("Wallet not connected", "error");
      return;
    }

    if (!organizationAddress || !organizationName) {
      showAlert("Organization address and name are required", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const registerTransaction = await contract.registerOrganization(
        organizationAddress,
        organizationName
      );
      await registerTransaction.wait();

      resetFields();
      console.log("Organization registered successfully!");
      showAlert("Organization registered successfully!");
    } catch (error) {
      console.error("Error registering organization:", error.message);
      showAlert(`Error registering organization: ${error.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const createToken = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      showAlert("Wallet not connected", "error");
      return;
    }

    if (!tokenName || !tokenSymbol || tokenInitialSupply <= 0) {
      showAlert("All token details are required", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const createTokenTransaction = await contract.createOrganizationToken(
        tokenName,
        tokenSymbol,
        ethers.utils.parseUnits(tokenInitialSupply.toString(), 18)
      );
      await createTokenTransaction.wait();

      showAlert("Token created successfully!");

      setTokenName("");
      setTokenSymbol("");
      setTokenInitialSupply(0);
    } catch (error) {
      console.error("Error creating token:", error.message);
      showAlert(`Error creating token: ${error.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const addAdmin = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const addAdminTransaction = await contract.addAdmin(adminAddress);
      await addAdminTransaction.wait();

      resetFields();
      console.log("Admin added successfully!");
      showAlert("Admin added successfully!");
    } catch (error) {
      console.error("Error adding admin:", error.message);
      showAlert(`Error adding admin: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeAdmin = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const removeAdminTransaction = await contract.removeAdmin(adminAddress);
      await removeAdminTransaction.wait();

      resetFields();
      console.log("Admin removed successfully!");
      showAlert("Admin removed successfully!");
    } catch (error) {
      console.error("Error removing admin:", error.message);
      showAlert(`Error removing admin: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const addToWhitelist = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const addToWhitelistTransaction = await contract.addToWhitelist(
        whitelistAddress
      );
      await addToWhitelistTransaction.wait();

      resetFields();
      console.log("Address added to whitelist successfully!");
      showAlert(
        "Address added to whitelist successfully!",
        'success',
        () => window.location.reload()
      );

    } catch (error) {
      console.error("Error adding to whitelist:", error.message);
      showAlert(`Error adding to whitelist: ${error.message}`, () => window.location.reload());
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFromWhitelist = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const removeFromWhitelistTransaction = await contract.removeFromWhitelist(
        whitelistAddress
      );
      await removeFromWhitelistTransaction.wait();

      resetFields();
      console.log("Address removed from whitelist successfully!");
      showAlert("Address removed from whitelist successfully!", () => window.location.reload());
    } catch (error) {
      console.error("Error removing from whitelist:", error.message);
      showAlert(`Error removing from whitelist: ${error.message}`, () => window.location.reload());
    } finally {
      setIsProcessing(false);
    }
  };


  useEffect(() => {
    let contract;
    let interval;

    const setupContract = async () => {
      contract = new ethers.Contract(contractAddress2, contractABI2, provider);


      contract.on("OrganizationRegistered", (organizationAddress, _name) => {
        console.log("OrganizationRegistered event:", organizationAddress);
        setOrganizationAddress(organizationAddress);
      });

      contract.on(
        "StakeholderAdded",
        (
          stakeholderAddress,
          _vestingAmount,
          _vestingReleaseTime,
          _stakeholderType
        ) => {
          console.log("StakeholderAdded event:", stakeholderAddress);
          setStakeholderAddress(stakeholderAddress);
        }
      );
    };
    const fetchOrganizationName = async (address) => {
      if (!address) return;
      console.log("Fetching organization name for:", address);
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        provider
      );
      try {
        const name = await contract.getOrganizationName(address);
        console.log("Organization name:", name);
        setDisplayedOrganizationName(name);
      } catch (error) {
        console.error("Error fetching organization name:", error);
        showAlert("Error fetching organization name: " + error.message, "error");
      }
    };

    const fetchTokenDetails = async (address) => {
      if (!address) return;
      console.log("Fetching token details for:", address);
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        provider
      );
      try {
        const [tokenAddress, tokenName] =
          await contract.getOrganizationTokenDetails(address);
        console.log("Token address:", tokenAddress, "Token name:", tokenName);
        setDisplayedTokenDetails({ address: tokenAddress, name: tokenName });
      } catch (error) {
        console.error("Error fetching token details:", error);
        showAlert("Error fetching token details: " + error.message, "error");
      }
    };

    const getConnectedAddress = async () => {
      try {
        const signer = provider.getSigner();
        return await signer.getAddress();
      } catch (error) {
        console.error("Error getting connected address:", error);
        return null;
      }
    };
    const isOrganizationRegistered = async (address) => {
      if (!address) return false;
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        provider
      );
      const isRegistered = await contract.registeredOrganizations(address);
      setIsRegisteredAddress(isRegistered);
      return isRegistered;
    };


    const hasTokenCreated = async (address) => {
      if (!address) return false;
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        provider
      );
      const tokenCreated = await contract.tokenCreated(address);
      return tokenCreated;
    };


    const isStakeholderAdded = async (address) => {
      if (!address) return false;
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        provider
      );
      const stakeholderInfo = await contract.stakeholders(address);
      return stakeholderInfo.vestingAmount > 0;
    };

    const fetchData = async () => {
      const connectedAddress = await getConnectedAddress();
      if (connectedAddress) {
        const isRegistered = await isOrganizationRegistered(connectedAddress);
        if (isRegistered) {
          fetchOrganizationName(connectedAddress);
          const tokenCreated = await hasTokenCreated(connectedAddress);
          if (tokenCreated) {
            fetchTokenDetails(connectedAddress);
          }
        }
      }

      if (
        stakeholderAddress &&
        (await isStakeholderAdded(stakeholderAddress))
      ) {

      }
    };

    setupContract();
    fetchData();

    interval = setInterval(fetchData, 10000);

    return () => {
      if (contract) {
        contract.removeAllListeners("OrganizationRegistered");
        contract.removeAllListeners("StakeholderAdded");
      }
      clearInterval(interval);
    };
  }, [provider, stakeholderAddress]);




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
    if (
      !(
        vestingReleaseDateTime instanceof Date && !isNaN(vestingReleaseDateTime)
      )
    ) {
      showAlert("Invalid release date and time");
      return false;
    }

    return true;
  };

  const addStakeholder = async () => {
    if (!provider) {
      console.error("Wallet not connected");
      return;
    }
    if (!validateInputs()) {
      return;
    }
    setIsProcessing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const releaseTime = Math.floor(
        new Date(vestingReleaseDateTime).getTime() / 1000
      );

      const addStakeholderTransaction = await contract.addStakeholder(
        stakeholderAddress,
        stakeholderAmount,
        releaseTime,
        stakeholderType
      );

      await addStakeholderTransaction.wait();
      resetFields();
      console.log("Stakeholder added successfully!");
      showAlert(
        `Stakeholder added successfully for organization: ${organizationName}`
      );

    } catch (error) {

    } finally {
      setIsProcessing(false);
    }
  };





  return (
    <div className="register-organization-container max-w-4xl mx-auto p-4">
      {alertInfo.show && (
        <AlertComponent
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={closeAlert}
        />
      )}
      {(isRegisteredAddress && <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Organization Details For Connected Address</h2>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-medium">Organization Name:</span> {displayedOrganizationName}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-medium">Token Address:</span> {displayedTokenDetails.address}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Token Name:</span> {displayedTokenDetails.name}
        </p>
      </div>)}

      <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-500">
          Organization Registration:
        </h3>

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

        <button
          onClick={registerOrganization}
          disabled={isProcessing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isProcessing ? "Processing..." : "Register Organization"}
        </button>
      </div>
      <div className="create-token-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-500">
          Create Organization Token:
        </h3>

        <input
          type="text"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder="Token Name"
          className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
        />
        <input
          type="text"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          placeholder="Token Symbol"
          className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-white text-gray-700"
        />
        <input
          type="number"
          value={tokenInitialSupply}
          onChange={(e) => setTokenInitialSupply(e.target.value)}
          placeholder="Initial Supply"
          className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700"
        />
        <button
          onClick={createToken}
          disabled={isProcessing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isProcessing ? "Processing..." : "Create Token"}
        </button>
      </div>

      {
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">
            Stakeholder Operations:
          </h3>
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
            {isProcessing ? "Processing..." : "Add Stakeholder"}
          </button>
        </div>
      }

      {
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">
            Admin Operations:
          </h3>
          <input
            type="text"
            value={adminAddress}
            onChange={(e) => setAdminAddress(e.target.value)}
            placeholder="Admin Address"
            className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700" // Added margin bottom
          />

          <button
            onClick={addAdmin}
            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {" "}
            {isProcessing ? "Processing..." : " Add Admin"}
          </button>
          <button
            onClick={removeAdmin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isProcessing ? "Processing..." : " Remove Admin"}
          </button>
        </div>
      }

      {
        <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">
            Whitelist Operations:
          </h3>
          <input
            type="text"
            value={whitelistAddress}
            onChange={(e) => setWhitelistAddress(e.target.value)}
            placeholder="Address to Whitelist"
            className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700" // Added margin bottom
          />

          <button
            onClick={addToWhitelist}
            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {" "}
            {isProcessing ? "Processing..." : "Add to Whitelist"}{" "}
          </button>
          <button
            onClick={removeFromWhitelist}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isProcessing ? "Processing..." : "Remove to Whitelist"}
          </button>
        </div>
      }

      <div className="register-section card bg-gray-700 p-4 rounded-lg shadow-md mt-4 text-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={goToClaimPage}
        >
          Go to Claim Page
        </button>
      </div>
    </div>
  );
}

export default RegisterOrganization;
