import React from 'react';
import RegisterOrganization from '../Components/RegisterOrganisation';

const Register = ({ provider }) => {
  return (
    <div>
      <h2>Register Page</h2>
      <RegisterOrganization provider={provider} />
    </div>
  );
};

export default Register;
