/**
 * The above JavaScript code deploys an OrganizationContract smart contract with the given name,
 * symbol, and initial supply.
 */
const hre = require("hardhat");

async function main() {

  const OrganizationContract = await hre.ethers.getContractFactory("OrganizationContract");

  
  const name = "SamToken";
  const symbol = "SAM";
  const initialSupply = ethers.utils.parseUnits('1000000', 18);




  const Organization = await OrganizationContract.deploy(name, symbol, initialSupply);
  await Organization.deployed();
  console.log("OrganizationContract deployed to:", Organization.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
