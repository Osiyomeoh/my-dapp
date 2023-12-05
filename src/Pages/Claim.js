import React from 'react';
import ClaimTokens from '../Components/ClaimToken';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Claim = ({ provider }) => {
  const navigate = useNavigate();

  // Function to handle navigation to the home page
  const navigateHome = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Claim Your Tokens</h2>
      <ClaimTokens provider={provider} />
      <div className="text-center mt-4">
        <button 
          onClick={navigateHome} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Claim;
