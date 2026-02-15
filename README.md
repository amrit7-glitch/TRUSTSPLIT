I’m working on a trading platform inspired by Zerodha — not a clone, but something with a slightly different approach under the hood.

Most broker platforms keep everything, including audits, completely off-chain. In this project, the core trading data (users, orders, balances) still stays off-chain for speed and privacy, but I’m experimenting with a blockchain-based audit layer to anchor important actions like order placement and execution.
The goal isn’t to “decentralize everything”, but to use blockchain where it actually adds value:

•Making critical actions tamper-evident

•Improving traceability and trust

•Keeping the on-chain footprint minimal

The backend handles the trading logic, and the smart contract is used purely as an immutable audit log.
