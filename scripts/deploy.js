/**
 * The above JavaScript code deploys an OrganizationContract smart contract with the given name,
 * symbol, and initial supply.
 */
const hre = require("hardhat");

async function main() {

  const OrganizationContract = await hre.ethers.getContractFactory("OrganizationContract");


  const Organization = await OrganizationContract.deploy();
  await Organization.deployed();
  console.log("OrganizationContract deployed to:", Organization.address);

  const OrganizationToken = await hre.ethers.getContractFactory("OrganizationToken");

  
  const name = "SamToken";
  const symbol = "SAM";
  const initialSupply = ethers.utils.parseUnits('1000000', 18);

  const Token = await OrganizationToken.deploy(name, symbol, initialSupply);
  await Token.deployed();
  console.log("OrganizationToken deployed to:", Token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
