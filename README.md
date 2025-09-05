# Bitcoin Tales

This app is a VERY simple demo of the Bitcoin economy. 
It is currently deployed to vercel, you can visit: https://bitcoin-tales.vercel.app/

Please click through the app from beginning to the end and see how you are interacting with a bitcoin node. Of course, the network is Regtest so the addresses and coins are only for demo purpose. 

## Run locally:

You will need 3 services:
1. This one 
2. Back end service: which communicates to the bitcoin network (regtest)
    https://github.com/kuba-04/coin-comic-tales-rs
3. Bitcoin node:
    it is explained in the abovementioned repo how to run it, they can be run together as docker containers

#### Run this project locally:

```sh

# Install the necessary dependencies.
npm i

# Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Changelog

v1.0.0 is is a minimum working version that shows:
- mining request
- wallet and address creation
- sending bitcoin
- checking mempool and confirmed transaction on blockchain  