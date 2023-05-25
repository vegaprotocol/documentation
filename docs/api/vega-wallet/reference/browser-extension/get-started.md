---
title: Build with the browser extension 
hide_title: false
vega_network: TESTNET
sidebar_position: 1
---
import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## Vega Browser Wallet

dApps and websites can communicate with the Vega browser wallet over 
JSON-RPC 2.0, however the browser extension also provides
a high-level Javascript API, injected into web pages.

### Detecting the extension

The Vega browser wallet injects methods on the global `vega` object,
hence the presence of the extension can be detected by checking that
this object is defined:

```js
if (window.vega != null) {
    // Vega is installed
} else {
    // Prompt the user to install the extension
}
```

### Connecting to the extension

To start communicating with the extension, a dApp must first request
a connection:

```js
try {
    await vega.connectWallet()
} catch (err) {
    // The user potentially rejected the connection    
}
```

Connecting to the wallet may require user intervention in the extension,
eg. reviewing permissions.

Once a dApp is finished talking to the wallet it can call 
`await vega.disconnectWallet()`.

### Detecting the network in use

The Vega browser wallet allows users to have multiple network
configurations installed at the same time, to allow switching between
different entry points into the network or different networks entirely 
(eg. `mainnet`, `fairground`, etc.)

A dApp can detect the network in use by checking the `chainID` in use:

```js
const { chainID } = await vega.getChainId()
```

Note that `chainID` is not an indefinite constant but may change with
network restarts. However it can assumed to constant during a session.

If the dApp is using data from other data-nodes, the `chainID` is a
great way to compare whether the wallet and dApp are using data from
the same network.

### Listing available keys

After a successful connection has been established, a dApp can request
a list of keys approved by the user. The list will include the public key
and the user given name for the key:

```js
const keys = await vega.listKeys()

for (const key of keys) {
    console.log(key.name, key.publicKey)   
}
```

The list of keys is useful for dApps to provide contextual information that
is relevant to the user and a valid public key from the list is required to
send transactions.

### Sending a transaction

After a successful connection has been establised, a dApp can propose
transactions for the user to send via their wallet. Note that only
public keys that appear in the `await vega.listKeys()` list are
available for the dApp to propose transactions with:

```js
const res = await vega.sendTransaction({
  sendingMode: 'TYPE_SYNC', // one of TYPE_ASYNC, TYPE_SYNC, TYPE_COMMIT. See below
  publicKey: '...', // One of the keys from `listKeys()`
  transaction: { /* ... */ }
})
```

`sendingMode` decides when the Vega node returns a response to the transaction
submission. `TYPE_ASYNC` will run validation checks by the network in cases 
where this is possible, but will return fast. `TYPE_SYNC` is the perferred mode.
This mode will return once the transaction has passed validation checks and 
entered the mempool.  `MODE_COMMIT` is only available for debug purposes and 
will require your own node with this mode enabled. This will cause the 
submission to wait until the transaction has been mined.

`publicKey` must be a key the user has made available to the dApp, otherwise
the wallet will error with unknown public key.

Transactions in Vega are protocol buffers. The browser wallet provides a JSON
interface which translates to protobuf fields. As a general rule fields are
camel-cased, falsy values are not encoded (they map to protobuf default values)
and optional values can be set to `null` to signify explicit absence.

Below are sample transactions and links to their corresponding `.d.ts` files and
protobuf comments.
The full list of transaction types (commands) understood by the Vega browser
wallet can be seen in the following [Type Definition](https://github.com/vegaprotocol/js-protos/blob/main/dist/vega/commands/v1/InputData.d.ts#L34-L60)

#### Transfer

Example below shows how to make an immediate one-off transfer from the signing
vega keys' general account to another keys' general account.

- [Type Definition](https://github.com/vegaprotocol/js-protos/blob/main/dist/vega/commands/v1/Transfer.d.ts)
- [Protobuf definition](../../../grpc/vega/commands/v1/commands.proto.mdx#transfer)

```js
{
  transfer: {
    // string | number; One of the account types
    fromAccountType: 'ACCOUNT_TYPE_GENERAL',
    // string; hex encoded vega public key
    to: '',
    toAccounType: 'ACCOUNT_TYPE_GENERAL',
    // string; $VEGA (fairground) asset id
    asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    // string; 1 $VEGA
    amount: (1n * 18n).toString(),
    // string; optional reference
    reference: 'My first transfer!',
    // Make this a one-off transfer
    kind: { 
      oneOff: {
        // bigint (u64); Optional delivery time in nanoseconds since UNIX epoch
        // defaults to 0 (deliver now)
        deliveryOn: 0n
      } 
    }
  }
}
```

#### Delegate Stake

Example below shows how to delegate 1 $VEGA from the signing vega key to
the validator Marvin on Fairground.

- [Type Definition](https://github.com/vegaprotocol/js-protos/blob/main/dist/vega/commands/v1/DelegateSubmission.d.ts)
- [Protobuf Definition](../../../grpc/vega/commands/v1/commands.proto.mdx#delegatesubmission)

```js
{
  delegateSubmission: {
    // string; Stake to Marvin on Fairground
    nodeId: 'bb1822715aa86ce0e205aa4c78e9b71cdeaec94596ce72d366f0d50589eb1bf5',
    // string; 1 $VEGA
    amount: (1n * 18n).toString()
  }
}
```

#### Minimal Order Submission

Example below shows how to submit a post-only, limit order that is 
Good-till-cancelled of 1 unit. Price must be represented as an integer string.
Note that some fields have been left out. The order message is complex and
hence some fields are only relevant if other fields are present or have a
specific value. Consult the Protobuf Definition to see the exact rules.

- [Type Definition](https://github.com/vegaprotocol/js-protos/blob/main/dist/vega/commands/v1/OrderSubmission.d.ts)
- [Protobuf Definition](../../../grpc/vega/commands/v1/commands.proto.mdx#ordersubmission)


```js
{
  orderSubmission: {
    marketId: '',
    price: '',
    size: 1n,
    side: 'SIDE_BUY',
    timeInForce: 'TIME_IN_FORCE_GTC',
    type: 'TYPE_LIMIT',
    reference: '',
    postOnly: true
  }
}

```

#### Minimal Order Ammendment

In this example we increase our order with 1 unit. For more options see the 
Protobuf Definition

- [Type Definition](https://github.com/vegaprotocol/js-protos/blob/main/dist/vega/commands/v1/OrderAmmendment.d.ts)
- [Protobuf Definition](../../../grpc/vega/commands/v1/commands.proto.mdx#orderammendment)

```js
{
  orderAmmendment: {
    orderId: '',
    marketId: '',
    sizeDelta: 1n
  }
}
```

#### Order Cancellation

Order cancellation only requires the `orderId` and `marketId`.

- [Type Definition](https://github.com/vegaprotocol/js-protos/blob/main/dist/vega/commands/v1/OrderCancellation.d.ts)
- [Protobuf Definition](../../../grpc/vega/commands/v1/commands.proto.mdx#ordercancellation)

```js
{
  orderCancellation: {
    orderId: '',
    marketId: ''
  }
}
```

### Raw JSON-RPC communication

A dApp may wish to implement it's own high-level API on the JSON-RPC protocol
supported by the Vega browser wallet. Below is a bare-bones example of what
this could look like. A reference may be the implementation of the 
[injected Vega API found here](https://github.com/vegaprotocol/vegawallet-browser/blob/main/web-extension/common/in-page.js).

The browser extension will listen to messages sent on the `window` object
and forward any JSON-RPC requests and notifications to the extension.
The extension does not currently support batch requests. The `id` can
be any unique string or numeric value.

```js
window.addEventListener('message', (event) => {
  // somehow avoid catching own message

  const response = event.data

  if (response.error) return console.error(response.error)

  console.log(response.result)
})

window.postMessage({
  jsonrpc: '2.0',
  id: '1',
  method: 'vega.connect_wallet',
  params: null
}, '*')
```
