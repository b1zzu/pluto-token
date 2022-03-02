# PlutoToken

PlutoToken is a ER20 token with the following additional conditions:

1. The max supply of the token is 8888
2. Any address can mint this token, however:
   a. Each address can only mint 8 tokens maximum
   b. Each address can only mint once every 24 hours
3. Bonus points: Only 888 tokens can be minted every year.

This porject is based on [hardhat](https://hardhat.org/) to test and deploy the PlutoToken locally, on testnet or on the mainnet.

## Deploy the token locally

Start a local node with hardhat:

```
npx hardhat node
```

After starting the local network JSON-RPC endpoint is `http://127.0.0.1:8545/` and can be added to wallets like MetaMask.

Hardhat will also create 20 accounts with well known private-keys that will be preloaded with 10000 ETH each that can be used for paying the gas fee on the network.

After starting the local node the PlutoToken can be deployed on the local net with this command:

```
npx hardhat run scripts/deploy.ts --network localhost
```

Afte building and deploying the PlutoToken contract it will print the token address which can be used to import the token to wallets like MetaMask.

## Mint tokens

To semplify the action of minting token on the local net the hardhat mint script can be used like this:

```
npx hardhat mint --contract CONTRACT_ADDRESS --account ACCOUNT_ADDRESS AMOUNT
```

Where the `CONTRACT_ADDRESS` is the address printed by hardhat after deploying the contract, the `ACCOUNT_ADDRESS` is the private-key of the account to which to add the tokens, while `AMOUNT` is the number of PlutoToken to mint.

You can than check the account balance using the following command:

````
npx hardhat balance --contract CONTRACT_ADDRESS --account ACCOUNT_ADDRESS```
````
