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

    mapping(address => VestingInfo) public vestingBalances;
    mapping(address => bool) public whitelist;

    event WhitelistUpdated(address indexed user, bool status);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event OrganizationRegistered(address indexed organization, string name, string symbol, uint256 initialSupply);

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
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) external {
        // Allow organizations to register themselves
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        require(_initialSupply > 0, "Initial supply must be greater than 0");
        
        _mint(msg.sender, _initialSupply);
        emit OrganizationRegistered(msg.sender, _name, _symbol, _initialSupply);
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

    function claimTokens() external onlyWhitelisted {
        VestingInfo storage info = vestingBalances[msg.sender];
        require(block.timestamp >= info.releaseTime, "Tokens are still locked");

        _mint(msg.sender, info.amount);
        delete vestingBalances[msg.sender];
    }
}
