---
sidebar_position: 9
title: Data sourcing
vega_network: MAINNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Vega's data sourcing framework enables the Vega protocol to acquire and consume data, for example, to settle a market, or to terminate trading at a market's expiry. 

It accepts data from several source types, including Ethereum mainnet, EVM chains that support Ethereum RPC calls, off-chain data signed by a known key, and data from Vega itself.

The data sourcing framework can also process data from specific, selected fields out of a larger data object, filtering out irrelevant or potentially erroneous data.
 
The information produced by data sourcing is relevant to market settlement, risk models, and other features that require specific data which must come from somewhere, often completely external to Vega. For example, a perpetuals market based on the price of Bitcoin needs a trustworthy and reliable source of the price of Bitcoin for its settlement schedule to calculate funding payments.

The types of data sources that Vega can accept are described below.

## Choosing and verifying data
Whether it's when voting for a market, or when choosing a market to trade on, it's important to verify the data source specification for the market. Voters and traders should verify that you trust the public key signing the data, as well as the data filters being used.

Those proposing a market/providing data should verify that the data source they're using is reliable and will provide accurate information for network participants.

For a market proposer looking to choose which data source is best for their market, it's recommended to use data that's already on Ethereum or in Open Oracle format with a signature, if it exists. If the relevant market/asset data doesn't exist on Ethereum or in Open Oracle, then create and use a signed JSON message.

## Sources of data
Inputs to the data sourcing framework can come from:
* Any chain or layer 2 chain that supports Ethereum RPC calls and runs an EVM
* Ethereum smart contracts
* Signed message data source, part of the [Open Oracle ↗](https://github.com/compound-finance/open-oracle) feed
* Specially formatted and signed JSON messages
* Data internal to Vega's state (for example the latest block timestamp)

When looking for or building a data source, ensure the following information is provided if you're looking to verify the source, or searching for/creating a data source to use for a market proposal.

Data sources must provide:
* Type of data source (e.g. `vega.builtin.timestamps`, `Open Oracle`, `Ethereum Call`)
* Data type (e.g. float for a price)
* Data source specific details

### What's in a data source specification
Data source specifications include the particular information to be processed for the market that the data source is targeting. The specifications are enumerated when the market is proposed.

When looking for or building a data source, ensure the following types are available, so the information can be used in a market proposal.

Data sources must be able to emit the following data types:
* Number - for prices or in filter comparisons
* String - to be used to compare against in filters
* Date/Time - to compare against in filters
* Structured data records - such as a set of key and value pairs (inputs to filters)

## EVM data sources
EVM oracles bridge Ethereum- or any EVM-based data sources in to Vega, enabling markets to be settled or priced using data that is verified on a chain that supports Ethereum RPC calls. Data can only be read from a smart contract based on a timed trigger.

Each chain needs to be supported in the network parameter:
<NetworkParameter frontMatter={frontMatter} param="blockchains.ethereumRpcAndEvmCompatDataSourcesConfig" hideValue="true" />, and by the validators running the network. 

Use a [network parameter proposal](../../tutorials/proposals/network-parameter-proposal.md) to get a new data source chain added to the network.

Validators can set up their nodes to support the chains by following the [config instructions](../../node-operators/get-started/setup-validator.md#support-evm-chains-for-oracle-data).

When the contract call is triggered by the data source, Vega validator nodes read the selected data from the chain and submit a transaction that includes the filtered data. When that data is verified by enough validators, the market's data source specification then acts on the submitted data.

An EVM data source specification must include:

- Contract address
- ABI in JSON format for the contract (or a subset, covering the parts relevant to fetching data)
- Name of the function call, along with any parameters that must be passed through

This data can be used for filters, or used as the oracle data itself.

All data sourced from Ethereum and EVM chains is structured as an object containing both a payload and chain metadata. Specifically:

- Block height at which the data was observed/event occurred
- Block timestamp when the data was observed/event occurred

## Signed message data sources
Signed message data sources are a source of off-chain data. They introduce a Vega transaction that represents a data result that is validated by ensuring the signed message is provided by the Vega or Ethereum public key provided in the market’s proposal.

A signed message data source specification must include:
* Public keys that can sign and submit values for this oracle, as well as the key algorithm to be used, if required
* Type of data to be supplied in the transaction, and filters for the data

Vega supports two signed message data sources:
* Open Oracle data source
* JSON messages 

### Open Oracle data
The signer of the signed message data source is equivalent to the reporter in [Compound’s Open Price Feed ↗](https://medium.com/compound-finance/announcing-compound-open-oracle-development-cff36f06aad3). As Open Oracle reports include signatures, the data can still be verified against its source. The poster equivalent is the Vega key that submits the signed message to the Vega chain for the market to act on it.

For example, a [message taken from Coinbase's Price Oracle ↗](https://blog.coinbase.com/introducing-the-coinbase-price-oracle-6d1ee22c7068) would have the signatures verified, and the ABI encoded data will be transformed into the following format (note: the precise representation will vary based on which API you're using):

```json
[
	{
		"name": "prices.BTC.timestamp",
		"value": "1661273220"
	},
	{
		"name": "prices.ETH.timestamp",
		"value": "1661273220"
	},
	{
		"name": "prices.ETH.value",
		"value": "1635165000"
	},
  {
		"name": "prices.BTC.value",
		"value": "21420285000"
	}
]
```

### Signed JSON message
Signed JSON messages are an alternative to using *Open Oracle signed message data sources*, which are best used for off-chain prices that are available using that format. Some markets need data other than prices, and some markets need prices that are not available with Open Oracle. For that flexibility Vega also supports arbitrary JSON messages, signed by a Vega key. Data from these types is only as reliable as the Vega public key that publishes the data, whereas signed message data sources have signed data. The advantage is that the format is less rigid than signed messages: any properties can be specified, including strings, booleans or non-price numbers.

Data from these messages is only as reliable as the Vega public key that publishes the data, thus confirming the reliability of the signer is imperative for the community to consider when voting for, or taking part in a market. 

The advantage is that the format is less rigid than Open Oracle data: any properties can be specified, including strings, booleans or non-price numbers.

The data sourcing framework takes in these JSON messages and presents them similarly to the other data formats:

```json
[
	{
		"name": "trading.terminated.ETH-2",
		"value": "true"
	},
	{
		"name": "prices.AAPL-2.value",
		"value": "2000000000"
	}
]

```

:::note Read more
[Tutorials: Using data sources](./../../tutorials/using-data-sources.md)
:::

## Internal data source
An internal data source provides information that comes from within Vega, rather than an external source. They are defined and used in the same way as external data sources, but are triggered by the relevant event in the protocol rather than by an incoming transaction.

Vega provides a timestamp source, which can be used to trigger a market event (such as trading termination or final settlement) at a set date and time. The `vegaprotocol.builtin.timestamp` is used by the market proposer to provide a Unix timestamp in seconds of the Vega time, which is to say the time agreed via consensus. 

As the name implies, an internal data source event is generated automatically inside Vega when the time changes (i.e. once per block) and will then be processed by a data source definition (e.g. to filter the events so that trading terminated is only triggered after a certain date/time is reached).

For example, a single timestamp event will appear as follows. Note: the precise representation will vary based on which API you're using):

```json
[
	{
		"name": "vega.builtin.timestamp",
		"value": "1661273220"
	}
]
```

### Repeating time trigger
The repeating time triggered oracle is another internal data source, specifically for perpetual futures markets. Defining a set of repeating times allows for scheduling when price data is delivered. It can be a repeating, predictable schedule or a fixed number of events at pre-determined times.

For example, a scheduled time trigger could be every day at 04:00, 12:00 and 20:00. A fixed number could be 01/02/2023 at 08:52, 11/03/2023 at 15:45, 20/04/2023 at 21:37. 

## Using a data source: Filtering
Data source filters allow the market proposer to specify, for a given "root" data source (for example all messages signed by a given public key), which of its messages are relevant.

Products on Vega use data to drive actions like settlement and to progress through the market lifecycle. The two key transitions controlled by data sources for cash settled futures are the termination of trading, and settlement of the market. For cash settled perpetuals markets, the data source provides prices for the settlement schedule. These are configured when the market is proposed by providing a data source specification that covers the root source and any filters required to select the specific data or trigger event.

As a smart contract or a public key may provide many messages, a filter is used to extract the required message - for example trading on a futures market could terminate at a specific date and time, and so the filters would ensure that only data provided on or after the specified date and time would trigger termination.

When a market is proposed, the market proposal must include details for filters to be applied to the chosen data source(s). Those filters are applied to the source of structured data records that are used as input and determine how data is emitted: such as the specific value for a named field, to return `BTCUSD_PRICE` from a record containing many prices, for example; or price data on/after a certain time.

## Submitting data for a market
When using an EVM oracle, there is no need to submit data once the EVM oracle is specified in the market proposal.

For other data source types, any Vega keypair can submit settlement and market termination data to the chain. The creator of an instrument for a market has chosen in advance a price source, which data fields the market requires to settle and terminate, and filters that determine when the data is used.

The data can be broadcast at any and all points, but if the market isn't looking for data, based on the filters, then the data doesn't make it to the chain and has no effect. The market is only listening when the filters signal that the data should be processed and used.

:::tip Try it out
[Tutorial: Submit data and configure markets](./../../tutorials/using-data-sources.md) 
:::