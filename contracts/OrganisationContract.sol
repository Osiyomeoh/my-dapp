// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OrganizationContract is ERC20 {
    address public owner;
    mapping(address => bool) public admins;
    mapping(address => bool) public registeredOrganizations;
    mapping(address => bool) public whitelist;

    struct StakeholderInfo {
        uint256 vestingAmount;
        uint256 vestingReleaseTime;
        string stakeholderType;
    }

    mapping(address => StakeholderInfo) public stakeholders;
    mapping(address => string) public organizationNames;

    event WhitelistUpdated(address indexed user, bool status);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event TokensClaimed(address indexed claimant, uint256 amount);
    event OrganizationRegistered(address indexed organization, string name, string symbol, uint256 initialSupply);
    event StakeholderAdded(address indexed stakeholder, uint256 vestingAmount, uint256 vestingReleaseTime, string stakeholderType);

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        owner = msg.sender;
        admins[msg.sender] = true;
        _mint(msg.sender, initialSupply);
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
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) external onlyAdmin {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        require(_initialSupply > 0, "Initial supply must be greater than 0");

        _mint(organizationAddress, _initialSupply);
        organizationNames[organizationAddress] = _name;
        registeredOrganizations[organizationAddress] = true;
        emit OrganizationRegistered(organizationAddress, _name, _symbol, _initialSupply);
    }

    function addToWhitelist(address user) external onlyAdmin {
        whitelist[user] = true;
        emit WhitelistUpdated(user, true);
    }

    function removeFromWhitelist(address user) external onlyAdmin {
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
        _mint(msg.sender, additionalAmount);
        emit TokensClaimed(msg.sender, additionalAmount);
        stakeholder.vestingAmount = 0; // Reset vesting amount after claiming
    }

    function calculateAdditionalAmount(uint256 releaseTime, uint256 initialAmount) internal view returns (uint256) {
        if (block.timestamp <= releaseTime) {
            return 0;
        }

        uint256 timeElapsedInMinutes = (block.timestamp - releaseTime) / 60;
        uint256 ratePerMinute = 1; // Define your rate here

        uint256 additionalAmount = timeElapsedInMinutes * ratePerMinute;
        uint256 totalAmount = additionalAmount + initialAmount;
        return totalAmount;
    }
}
