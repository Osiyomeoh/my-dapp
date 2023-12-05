import React from 'react';
import RegisterOrganization from '../Components/RegisterOrganisation';

const Register = ({ provider }) => {
  return (
    <div>
      <RegisterOrganization provider={provider} />
    </div>
  );
};

export default Register;
