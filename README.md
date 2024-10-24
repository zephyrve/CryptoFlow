# CryptoFlow

## Overview

**CryptoFlow**, is a decentralized finance (DeFi) application designed to simplify financial transactions and investment opportunities within the cryptocurrency space. The platform enables users to manage both one-time and recurring payments through a secure smart contract infrastructure.


 **Project Website**: [CryptoFlow](https://crypto-flow-app.vercel.app/)

 **Video demo** : [Demo  video](https://vimeo.com/1017128833)


## Key Features

- **One-Time Payments**: Send money to multiple recipients instantly or schedule payments for a later date.
- **Recurring Payments**: Set up scheduled payments based on predefined criteria (e.g., frequency, unlock amount).
- **Invoice Generation**: Create and send invoices to clients for crypto payments.
- **Address Book Management**: Simplify the payment process by managing recipient addresses.
- **Balance Management**: Deposit and manage tokens in a smart contract.
- **CSV Upload**: Upload payment data for multiple recipients simultaneously.
- **User Permissions**: Assign privileges for canceling or transferring payments.
- **Reporting & Statistics**: View reports on sent and received payments and manage invoices.
- **MongoDB Integration**: Used to store and manage user data such as addresses, address groups, and invoices, ensuring efficient backend data handling.
- **Statistics Dashboard**: Integrated a statistics dashboard for transaction tracking.

| ![Image 1](https://github.com/zephyrve/CryptoFlow/blob/main/client/public/docs/address-book.png)        | ![Image 2](https://github.com/zephyrve/CryptoFlow/blob/main/client/public/docs/new-invoice.png)           |
|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| ![Image 3](https://github.com/zephyrve/CryptoFlow/blob/main/client/public/docs/new-one-time-payment.png) | ![Image 4](https://github.com/zephyrve/CryptoFlow/blob/main/client/public/docs/new-recurring-payment.png) |
| ![Image 5](https://github.com/zephyrve/CryptoFlow/blob/main/client/public/docs/statistics.png) | ![Image 6](https://github.com/zephyrve/CryptoFlow/blob/main/client/public/docs/balance.png)               |


## Installation Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later) - [Download Node.js](https://nodejs.org/)
- **Yarn** (optional, but recommended) - [Install Yarn](https://www.npmjs.com/package/yarn)
- **Foundry** - Follow the instructions [here](https://book.getfoundry.sh/getting-started/installation.html) to install Foundry.


### Setting Up the Project 

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/zephyrve/CryptoFlow
   ```

### Setting Up Smart Contracts (Foundry)

1. **Navigate to the Contracts Directory**:

   ```bash
   cd CryptoFlow/contracts
   ```

2. **Install Dependencies:**:

    ```bash
    yarn install
    ````

3. **Configure Environment Variables:**:

* Copy the `.env.example` file to `.env` and fill in the variables.

4. **Import your private keys into Foundry's encrypted keystore:**

    ```bash
    source .env
    cast wallet import $TESTNET_DEPLOYER_NAME --interactive
    ```

5. **Compile the Smart Contracts:**:

      ```bash
      yarn build
      ````

6. **Deploy the Smart Contracts on TESTNET:**:

      ```bash
      yarn deploy:testnet
      ````

## Setting Up the Frontend (Next.js)

1. **Navigate to the Client Directory**:

   ```bash
   cd CryptoFlow/client
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**:

- Copy the `.env.example` file to `.env` and fill in the variables.

4. **Run the Development Server:**

   ```bash
   yarn dev
   ```

  * This will start the Next.js application at http://localhost:8080.

5. **Build for Production:** To create an optimized production build, run:

   ```bash
   yarn build
   ```

6. **Start the Production Server:** After building the project, you can start the production server using:

   ```bash
   yarn start
   ```
 

## Project Goals

**CryptoFlow** aims to simplify financial transactions within the decentralized finance (DeFi) ecosystem, enabling users to seamlessly manage both one-time and recurring payments through a secure smart contract infrastructure.

## Future Plans

* **Multi-Currency Support**: Enable payments in various cryptocurrencies.
* **Advanced Reporting Tools**: Allow users to export financial records in multiple formats.
* **User-Friendly Dashboard**: Redesign for better usability.
* **Community and Support Features**: Create a support center with FAQs, tutorials, and user guides to assist new users.
* **SEO Optimization**: Enhance visibility through improved SEO strategies and keyword targeting.
* **Mobile Application**: Develop a mobile version for on-the-go transactions. 
* **Data Management**: MongoDB is used to store and manage user data, such as recipient addresses, address groups, and invoices, ensuring efficient and scalable data handling.
## License

This project is licensed under the MIT License. See the LICENSE file for details.
