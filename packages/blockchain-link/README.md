# @trezor/blockchain-link

blockchain-link is a client and unified interface for several backends (_BE_ further on) of various blockchain networks. Currently, there are implementations for
- [blockbook](https://github.com/trezor/blockbook): BE developed and deployed by SatoshiLabs. Provides access to Bitcoin(like) and Ethereum(like) networks.
- [ripple](https://xrpl.org/): third party BE that provides access to the Ripple network.

## API

The API aims to be identical across all backends and networks. However, this isn't entirely possible and there are some discrepancies which are noted below.

All methods can fail and return an error eg. in case the BE is offline.

- `getInfo`: Get general information about the network, like current block-height, name, smallest possible division, etc.
- `getBlockHash`: Get hash of a block of given height.
- `getAccountInfo`: Get info about an account, eg. derived addresses, balance, transaction history etc.
- `getAccountUtxo`: Get unspent inputs for given account. Only bitcoin(like) networks.
- `getAccountBalanceHistory`: Get historical progression of given account's balance. Used for rendering a graph in Suite's dashboard.
- `getCurrentFiatRates`: Get current fiat rates.
- `getFiatRatesForTimestamps`: Get historical fiat rates, only some networks support this.
- `getFiatRatesTickersList`: Get fiat currencies for which rates are available.
- `estimateFee`: Get ‘recommended’ fee value inferred from current traffic in the network.
- `subscribe`: Subscribe for live changes in
    - blockchain i.e new blocks mined.
    - accounts, addresses i.e. new transactions broadcasted or mined.
    - fiatRates
    - connection to BE (HANDSHAKE, CONNECT, DISCONNECT)
    
    Handling subscription state is left to the user. (Hence the purpose of HANDSHAKE, CONNECT and DISCONNECT notifications.)
- `unsubscribe`: Cancel existing subscription.
- `getTransaction`: Get info about a given transaction. Return value of this method is not identical across networks; this method exposes the specific transaction format.
- `pushTransaction`: Broadcast given transaction to the network.

## Usage

Add blockchain-link to your dependencies.

```shell
yarn add @trezor/blockchain-link
```

And use it.

```javascript
import BlockchainLink from '@trezor/blockchain-link';

const link = new BlockchainLink({
    name: 'Name used in logs.';
    worker: 'path/to/the/worker.js';
    server: ['url1.of.the.be', 'url2.of.the.be'];
    debug: true;
});

try {
    const resp = link.getInfo();
} catch(error) {

}
```

## Development

This package provides a simple testing UI for playing around with various implementations and BEs. Run it with

```shell
yarn
yarn dev
```

### Build

```
yarn lint
yarn test
yarn build
```

### Workers compilation

Workers are already built and minified inside `@trezor/blockchain-link/build/` directory.

Set your project to compile and provide those workers into blockchain-link instance.
A webpack configuration example using `worker-loader` can be found [here](./webpack/dev.babel.js).

