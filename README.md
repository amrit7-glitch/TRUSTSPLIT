# TrustSplit

> A trading platform that combines the performance of a traditional centralized backend with the integrity of blockchain-based audit logging.

## Overview

TrustSplit is a trading platform inspired by modern broker applications such as Zerodha. Rather than attempting to decentralize the entire trading system, it adopts a hybrid architecture where performance-critical operations remain off-chain while blockchain is used selectively to create an immutable audit trail.

User accounts, balances, orders, and trading logic are processed by a centralized backend to ensure low latency and scalability. Critical trading events are simultaneously anchored on-chain through a Solidity smart contract, making them tamper-evident and independently verifiable.

The objective is to demonstrate how blockchain can enhance transparency and trust without compromising the speed and efficiency expected from modern trading platforms.

---

## Why TrustSplit?

Traditional trading platforms typically store all trading activity in centralized databases. While this provides excellent performance, audit records remain under the complete control of the platform.

TrustSplit introduces a blockchain-backed audit layer that records important trading events, allowing anyone with access to the blockchain to verify that those events have not been altered after they were recorded.

Instead of replacing centralized infrastructure, blockchain is used only where it provides measurable value.

---

## Key Features

* User authentication using JWT and HTTP-only cookies
* Secure user management
* RESTful backend APIs
* Order management
* Portfolio and balance management
* MongoDB-based persistent storage
* Immutable blockchain audit log
* Smart contracts written in Solidity
* Backend deployment on Render
* Frontend deployment on Vercel

---

## Blockchain Audit Layer

Unlike conventional trading systems, TrustSplit records critical trading events on-chain.

Examples of events include:

* Order placement
* Order execution
* Order cancellation (if implemented)
* Other important trading activities

The blockchain is **not** responsible for processing trades or storing application data.

Instead, it serves as an immutable audit ledger that provides:

* Tamper-evident records
* Improved traceability
* Independent verification
* Increased transparency
* Minimal on-chain storage

This hybrid approach preserves the performance benefits of centralized architecture while leveraging blockchain for accountability.

---

## Architecture

```text
                 React Frontend
                        │
                 REST API Requests
                        │
                Node.js + Express
                        │
        ┌───────────────┴───────────────┐
        │                               │
    MongoDB                     Solidity Smart Contract
(Application Data)             (Immutable Audit Log)

        │                               │
 Users, Orders,                 Critical Trading Events
 Balances, Trades               Stored On-chain
```

---

## Technology Stack

### Backend

* Node.js
* Express.js
* JavaScript
* REST API

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* HTTP-only Cookies

### Blockchain

* Solidity
* Foundry

### Deployment

* Render (Backend)
* Vercel (Frontend)

---

## Design Philosophy

TrustSplit intentionally avoids placing the entire trading workflow on blockchain.

Only audit-related events are stored on-chain because:

* Trading systems require very low latency.
* Blockchain transactions introduce additional cost.
* Public blockchains are not suitable for storing sensitive user data.
* Centralized databases remain significantly faster for order processing.

This architecture combines the strengths of both technologies:

**Centralized Backend**

* Fast execution
* Scalable
* Low latency
* Private user data

**Blockchain**

* Immutable audit trail
* Transparent verification
* Tamper resistance
* Trust enhancement

---

## Future Improvements

* Real-time market data
* WebSocket support
* Advanced order types
* Risk management engine
* Trade analytics dashboard
* Multi-chain audit support
* Comprehensive audit verification tools

---

## License

This project is intended for educational and portfolio purposes.


## GETTING STARTED

### Prerequisites

Make sure you have the following installed:

* Node.js (v18 or later)
* npm
* MongoDB (local or MongoDB Atlas)
* Git
* Foundry (for smart contract development)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/TrustSplit.git
cd TrustSplit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the required variables.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

CLIENT_URL=http://localhost:5173

RPC_URL=your_blockchain_rpc_url
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
```

Update the values according to your local environment.

### 4. Start the backend server

```bash
npm run dev
```

or

```bash
npm start
```

The backend will be available at:

```
http://localhost:5000
```

---

## Smart Contract

If you want to deploy the audit contract locally using Foundry:

Build the contracts:

```bash
forge build
```

Run the tests:

```bash
forge test
```

Deploy the contract:

```bash
forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

After deployment, update the `CONTRACT_ADDRESS` in your `.env` file.

---

## API

Example base URL:

```
http://localhost:5000/api/v1
```

---

## Contributing

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request.

---

## Project Status

TrustSplit is currently under active development. New features and improvements are continuously being added.
