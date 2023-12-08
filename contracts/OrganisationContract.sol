// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./OrganisationToken.sol";

contract OrganizationContract  {
    address public owner;
    mapping(address => bool) public admins;
    mapping(address => bool) public registeredOrganizations;
    mapping(address => bool) public whitelist;
    mapping(address => bool) public tokenCreated;

    struct StakeholderInfo {
        uint256 vestingAmount;
        uint256 vestingReleaseTime;
        string stakeholderType;
    }

    mapping(address => StakeholderInfo) public stakeholders;
    mapping(address => string) public organizationNames;
    mapping(address => address) public organizationToToken;


    event WhitelistUpdated(address indexed user, bool status);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event TokensClaimed(address indexed claimant, uint256 amount);
    event OrganizationRegistered(address indexed organization, string name);
    event StakeholderAdded(address indexed stakeholder, uint256 vestingAmount, uint256 vestingReleaseTime, string stakeholderType);
    event TokenCreated(address tokenAddress, string name, string symbol, uint256 initialSupply);

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }

    modifier onlyRegisteredOrganization() {
        require(registeredOrganizations[msg.sender], "Not a registered organization");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Address not whitelisted");
        _;
    }

    modifier onlyAllowedRoles() {
        require(registeredOrganizations[msg.sender] || admins[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRegisteredOrgOrWhitelisted() {
        require(
            registeredOrganizations[msg.sender] || whitelist[msg.sender],
            "Not a registered organization or stakeholder"
        );
        _;
    }

    function registerOrganization(
        address organizationAddress,
        string memory _name
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");

        organizationNames[organizationAddress] = _name;
        registeredOrganizations[organizationAddress] = true;
        emit OrganizationRegistered(organizationAddress, _name);
    }

    function createOrganizationToken(string memory name, string memory symbol, uint256 initialSupply) public onlyAllowedRoles {
        require(!tokenCreated[msg.sender], "Organization has already created a token");
    
        OrganizationToken newToken = new OrganizationToken(name, symbol, initialSupply);
        tokenCreated[msg.sender] = true;
        organizationToToken[msg.sender] = address(newToken); // Record the token address
        emit TokenCreated(address(newToken), name, symbol, initialSupply);
    }
    

    function addToWhitelist(address user) external onlyAllowedRoles{
        whitelist[user] = true;
        emit WhitelistUpdated(user, true);
    }

    function removeFromWhitelist(address user) external onlyAllowedRoles {
        whitelist[user] = false;
        emit WhitelistUpdated(user, false);
    }

    function addAdmin(address newAdmin) external onlyOwner {
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    function removeAdmin(address adminToRemove) external onlyOwner {
        require(adminToRemove != owner, "Cannot remove owner as admin");
        admins[adminToRemove] = false;
        emit AdminRemoved(adminToRemove);
    }

    function addStakeholder(
        address stakeholder,
        uint256 vestingAmount,
        uint256 vestingReleaseTime,
        string memory stakeholderType
    ) external onlyAllowedRoles {
        stakeholders[stakeholder] = StakeholderInfo(vestingAmount, vestingReleaseTime, stakeholderType);
        emit StakeholderAdded(stakeholder, vestingAmount, vestingReleaseTime, stakeholderType);
    }

    function claimTokens() external onlyRegisteredOrgOrWhitelisted {
        require(stakeholders[msg.sender].vestingAmount > 0, "No tokens to claim");
        StakeholderInfo storage stakeholder = stakeholders[msg.sender];
        require(block.timestamp >= stakeholder.vestingReleaseTime, "Tokens are still locked");
    
        uint256 additionalAmount = calculateAdditionalAmount(stakeholder.vestingReleaseTime, stakeholder.vestingAmount);
    
        // Get the organization token associated with the stakeholder
        address orgTokenAddress = organizationToToken[msg.sender];
        require(orgTokenAddress != address(0), "No associated organization token");
    
        OrganizationToken orgToken = OrganizationToken(orgTokenAddress);
        orgToken.mint(msg.sender, additionalAmount); 
    
        emit TokensClaimed(msg.sender, additionalAmount);
        stakeholder.vestingAmount = 0; 
    }
    

    function calculateAdditionalAmount(uint256 releaseTime, uint256 initialAmount) internal view returns (uint256) {
        if (block.timestamp <= releaseTime) {
            return 0;
        }

        uint256 timeElapsedInMinutes = (block.timestamp - releaseTime) / 60;
        uint256 ratePerMinute = 1;

        uint256 additionalAmount = timeElapsedInMinutes * ratePerMinute;
        uint256 totalAmount = additionalAmount + initialAmount;
        return totalAmount;
    }
     // Method to get the organization name for a given address
     function getOrganizationName(address organization) public view returns (string memory) {
        return organizationNames[organization];
    }

    // Method to get the token address for a given organization
    function getOrganizationTokenDetails(address organization) public view returns (address, string memory) {
        address tokenAddress = organizationToToken[organization];
        require(tokenAddress != address(0), "Token does not exist for this organization");

        
        OrganizationToken orgToken = OrganizationToken(tokenAddress);
        string memory tokenName = orgToken.TokenName();  // Call the name() function

        return (tokenAddress, tokenName);
    }
    
    function getStakeholderDetails(address stakeholder) public view returns (uint256 vestingAmount, uint256 vestingReleaseTime, string memory stakeholderType) {
        StakeholderInfo memory info = stakeholders[stakeholder];
        return (info.vestingAmount, info.vestingReleaseTime, info.stakeholderType);
    }
}
