
import React from 'react';
import ClaimTokens from '../Components/ClaimToken';

const Claim = ({ provider }) => {
  return (
    <div>
      <h2>Claim Page</h2>
      <ClaimTokens provider={provider} />
    </div>
  );
};

export default Claim;
