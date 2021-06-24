# @trezor/blockchain-link

blockchain-link is a client and unified interface for several backends (_BE_ further on) of various blockchain networks. Currently, there are implementations for
- [blockbook](https://github.com/trezor/blockbook): BE developed and deployed by SatoshiLabs. Provides access to Bitcoin(like) and Ethereum(like) networks.
- [ripple](https://xrpl.org/): third party BE that provides access to the Ripple network.

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

For complete API see the methods of `BlockchainLink` class in [index.ts](./src/index.ts).

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

