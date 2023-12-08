
# DAPP

## Overview
Ethereum Wallet Connector is a web application designed to interact with the Ethereum blockchain. It allows users to connect their Ethereum wallets, check whitelisting status, claim tokens, and perform administrative tasks like adding or removing stakeholders and managing organization details.

## Features
- Connect to Ethereum wallets using Web3Modal.
- Display connected wallet address and contract status.
- Check and display whitelisting status for the connected address.
- Claim tokens (for whitelisted addresses).
- Add or remove addresses from the whitelist.
- Fetch and display organization and token details.
- Manage stakeholders.

## Prerequisites
- Node.js
- npm or yarn
- Ethereum wallet (e.g., MetaMask)

## Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Osiyomeoh]
   ```
2. Navigate to the project directory:
   ```bash
   cd ethereum-wallet-connector
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Usage
1. Start the application:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```
2. Open `http://localhost:3000` in your web browser.
3. Connect your Ethereum wallet using the "Connect Wallet" button.
4. Interact with the application's features as desired.

## Contract Interaction
The application interacts with a smart contract on the Ethereum blockchain. The contract allows for various operations like registering organizations, creating tokens, adding stakeholders, and more.

## Contributing
Contributions to the project are welcome. Please follow the standard fork, branch, and pull request workflow.

## License
This project is licensed under the MIT License 
