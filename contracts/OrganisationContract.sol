// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OrganizationContract is ERC20 {
    address public owner;
    mapping(address => bool) public admins;

    struct VestingInfo {
        uint256 amount;
        uint256 releaseTime;
    }

    struct StakeholderInfo {
        address organization;
        uint256 vestingAmount;
        uint256 vestingReleaseTime;
        string stakeholderType; // Added stakeholderType
    }

    mapping(address => VestingInfo) public vestingBalances;
    mapping(address => bool) public whitelist;
    mapping(address => StakeholderInfo) public stakeholders;
    mapping(address => string) public organizationNames;

    event WhitelistUpdated(address indexed user, bool status);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event OrganizationRegistered(address indexed organization, string name, string symbol, uint256 initialSupply);
    event StakeholderAdded(address indexed organization, string indexed organizationName, address indexed stakeholder, uint256 vestingAmount, uint256 vestingReleaseTime, string stakeholderType); // Updated event

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

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Address not whitelisted");
        _;
    }

    function registerOrganization(
        address organizationAddress,
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        require(_initialSupply > 0, "Initial supply must be greater than 0");

        _mint(organizationAddress, _initialSupply);
        organizationNames[organizationAddress] = _name;
        emit OrganizationRegistered(organizationAddress, _name, _symbol, _initialSupply);
    }

    function addVesting(
        address user,
        uint256 amount,
        uint256 releaseTime
    ) external onlyAdmin {
        vestingBalances[user] = VestingInfo(amount, releaseTime);
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

    function addToWhitelist(address user) external onlyAdmin {
        whitelist[user] = true;
        emit WhitelistUpdated(user, true);
    }

    function removeFromWhitelist(address user) external onlyAdmin {
        whitelist[user] = false;
        emit WhitelistUpdated(user, false);
    }

    function addStakeholder(
        address organization,
        address stakeholder,
        uint256 vestingAmount,
        uint256 vestingReleaseTime,
        string memory organizationName,
        string memory stakeholderType // Added stakeholderType
    ) external onlyAdmin {
        stakeholders[stakeholder] = StakeholderInfo({
            organization: organization,
            vestingAmount: vestingAmount,
            vestingReleaseTime: vestingReleaseTime,
            stakeholderType: stakeholderType // Set stakeholderType
        });

        emit StakeholderAdded(organization, organizationName, stakeholder, vestingAmount, vestingReleaseTime, stakeholderType);
    }

    function claimTokens() external {
        require(whitelist[msg.sender] || admins[msg.sender], "Not whitelisted or admin");

        VestingInfo storage info = vestingBalances[msg.sender];
        require(block.timestamp >= info.releaseTime, "Tokens are still locked");

        _mint(msg.sender, info.amount);
    }
}
