## NFT Escrow

### Description:

Transferring NFTs between two people requires one of them to trust the other party. Suppose person A wants to transfer/sell his NFT directly to person B at some price they agreed upon.  In this case, either A has to trust B that B will pay him the agreed amount or B has to trust A that A will transfer the NFT after paying the agreed amount. Either A or B can easily get scammed here. That is where the P2P NFT escrow service DApp comes into the picture. Through this app, A and B can safely transfer the NFT even if they are strangers. They need to know only the wallet addresses of each other for the transfer.

If A wants to transfer his NFT to B, first A transfers NFT to escrow smart contract along with B’s wallet address and price for the NFT. Our DApp notifies B that A has transferred his NFT to escrow. B can now inspect the NFT and make sure that it is really the one B wanted. If everything is ok, B can make the payment. As soon as B makes the payment smart contract transfers NFT to B’s wallet and price to A’s wallet. DApp notifies A and B that the transfer has been completed.

At the core of this project is the NFTEscrow smart contract. This smart contract mainly consists of two functions: depositNFT and receiveNFT. The sender can invoke the depositNFT function from the front end (which is using Moralis SDK). This transfers the NFT from the sender's wallet to the escrow smart contract. Now the front end notifies the receiver that NFT is waiting for him in the escrow. The receiver can invoke the receiveNFT function and pay the required price. Then the smart contract confirms the price and transfers the NFT to the receiver's wallet and price to the sender's wallet and the transfer is complete. This project uses Moralis SDK for authenticating the users and interacting with the smart contract.

IMPORTANT: This project is not finished yet. It was planned to be a mobile app using React Native. But due to time constraints and some errors with the boilerplate code, I decided to go with a web app for now. The send functionality (interacting with smart contract) is not in the working condition.

#### Steps to run the project:

Deploy the smart contract.
Edit Moralis app ID, server url and contract address.
Open index.html.
Login using WalletConnect or MetaMask.
