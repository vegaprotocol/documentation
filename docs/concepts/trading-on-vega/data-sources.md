---
sidebar_position: 8
title: Data sourcing
hide_title: false
---
Vega's data sourcing framework is the system that enables the acquisition and consumption of data by the Vega protocol, for example, for terminating trading at expiry or settling markets. It consists of a number of source types, initially including off-chain data signed by a known key and data from Vega itself. In future it will include more data types and sources, as well as the ability to source data from other chains, starting with Ethereum.

The data sourcing framework also includes the ability to process data by selecting specific fields from a larger data object, filtering out irrelevant or potentially erroneous data, etc. In future there will also be additional processing options available to transform, aggregate, and perform additional checks on data, among other things.

The information produced by data sourcing is relevant to market settlement, risk models, and other features that require specific data which must come from somewhere, often completely external to Vega. For example, a market based on the price of Bitcoin on a specific date needs a trustworthy and reliable source of the price of Bitcoin in order to settle.

The types of data sources that Vega can accept in the current implementation is limited to those listed below. As mentioned above, the APIs and protocol are expected to support a wider range of data sources and processing capbilities in the future.

## Sources of data
Inputs to the data sourcing framework can come from:
* Signed message data source, part of the [Open Oracle ↗](https://github.com/compound-finance/open-oracle) feed
* Specially formatted and signed JSON messages
* Data internal to Vega's state (for example the latest block timestamp)

### What's in a data source specification
Data source specifications include the particular information to be processed for the market that the data source is targeting. The specifications are ennumerated when the market is proposed.

When looking for or building a data source, ensure the following information is available. 

Data sources must provide:
* Type of data source (e.g. `vega.builtin.timestamps`, `Open Oracle`)
* Data type (e.g. float for a price)
* Data source specific details

Data sources must be able to emit the following data types:
* Number - for prices or in filter comparisons
* String - to be used to compare against in filters
* Date/Time - to compare against in filters
* Structured data records - such as a set of key value pairs (inputs to filters)

## Signed message data sources
Signed message data sources are a source of off-chain data. They introduce a Vega transaction that represents a data result that is validated by ensuring the signed message is provided by the Vega or Ethereum public key provided in the market’s proposal.

A signed message data source specification must include:
* Public keys that can sign and submit values for this oracle, as well as the key algorithm to be used, if required
* Type of data to be supplied in the transaction, and filters for the data

Vega supports two signed message data sources:
* Open Oracle data source
* JSON messages 

## Choosing and verifying data
Whether it's when voting for a market, or when choosing a market to trade on, it's important to verify the data source specification for the market. Voters and traders should verify that you trust the public key signing the data, as well as the data filters being used.

Those proposing a market/providing data should verify that the data source they're using is reliable and will provide accurate information for network participants.

For a market proposer looking to choose which signed message data source is best for their market, it's recommended use data that's already in Open Oracle format, with a signature, if it exists. If the relevant market/asset data doesn't exist in Open Oracle, then create and use a signed JSON message.

### Open Oracle data
Signed ABI encoded data sources, such as Open Oracle, are equivalent to Posters in [Compound’s Open Price Feed](https://medium.com/compound-finance/announcing-compound-open-oracle-development-cff36f06aad3), taking signed price reports and posting them to the Vega chain. As Open Oracle reports include signatures, the data can still be verified against its source. 

For example, a [message taken from Coinbase's Price Oracle](https://blog.coinbase.com/introducing-the-coinbase-price-oracle-6d1ee22c7068) would have the signatures verified, and the ABI encoded data will be transformed into the following format (note: the precise representation will vary based on which API you're using):

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
Signed JSON messages are an alternative to using *Open Oracle data sources*, which are best used for off-chain prices. Some markets need data other than prices, and for that flexibility Vega also supports arbitrary JSON messages, signed by a Vega key. 

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
For a more thorough example of how to produce, sign and submit data in this format, see [Tutorials: Using data sources](./../../tutorials/using-data-sources.md)
:::

## Internal data source
An internal data source provides information that comes from within Vega, rather than an external source. They are defined and used in the same way as external data sources, but are triggered by the relevant event in protocol rather than by an incoming transaction.

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

## Using a data source: Filtering
Data source filters allow the market proposer to specify, for a given "root" data source (for example all messages signed by a given public key), which of its messages are relevant.

Products on Vega use data to drive actions like settlement and to progress through the market lifecycle. The two key transitions controlled by data sources for cash settled futures are the termination of trading, and settlement of the market. These are both configured when the market is proposed by providing a data source specification that covers the root source and any filters required to select the specific data or trigger event.

As a public key may provide many messages, a filter is used to extract the required message - for example trading could terminate at a specific date and time, and so the filters would ensure that only data provided on or after the specified date and time would trigger termination. Similarly for settlement, only price data *after* trading has terminated would be relevant.

When a market is proposed, the market proposal must include details for filters to be applied to the chosen data source(s). Those filters are applied to the source of structured data records that are used as input and determine how data is emitted: such as the specific value for a named field, to return `BTCUSD_PRICE` from a record containing many prices, for example; or price data on/after a certain time.

## Submitting data for a market
Any Vega keypair can submit settlement and market termination data to the chain. The creator of an instrument for a market has chosen in advance a price source, which data fields the market requires to settle and terminate, and filters that determine when the data is used.

The data can be broadcast at any and all points, but if the market isn't looking for data, based on the filters, then the data doesn't make it to the chain and has no effect. The market is only listening when the filters signal that the data should be processed and used.

:::tip Try it out
The **[submitting data and configuring markets](./../../tutorials/using-data-sources.md)** guide describes how to encode oracle data and configure a market to use it. 
:::