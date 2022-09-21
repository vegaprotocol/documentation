---
sidebar_position: 8
title: Data sourcing
hide_title: false
---
Vega's data sourcing framework is the system that standardises and publishes information that can be useful in the operation of markets. The system broadly includes oracles that may exist on other chains, data produced in the operation of other markets, or off-chain data.

The information produced by data sourcing is relevant to market settlement, risk models, and other features that require specific data which must come from somewhere, often completely external to Vega. For example, a market based on the price of Bitcoin on a specific date needs a trustworthy and reliable source of the price of Bitcoin.

The types of data sources that Vega can accept in the current implementation is limited to those listed below. The APIs and protocol are expected to support a wider range of data source standards in the future.

## Sources of data
Inputs to the data sourcing framework can come from:
* Signed message data source, part of the [Open Oracle ↗](https://github.com/compound-finance/open-oracle) feed
* Specially formatted and signed JSON messages
* Internal data

### What's in a data source
Data sources must provide:
* Type of data source (e.g. `vega.builtin.timestamps`, `Open Oracle`)
* Data type (e.g. float for a price)
* Data source specific details

Data sources must be able to emit the following data types:
* Number - for prices or in filter comparisons
* String - to be used to compare against in filters
* Date/Time - to compare against in filters
* Structured data records - such as a set of key value pairs (inputs to filters)

## Signed message data source
Signed message data sources are a source of off-chain price data, and can be used for settling and terminating a market. They introduce a Vega transaction that represents a data result that is validated by ensuring the signed message is provided by the Ethereum public key provided in the market’s proposal.

Specifically, Signed Message Data Sources are equivalent to Posters in [Compound’s Open Price Feed](https://medium.com/compound-finance/announcing-compound-open-oracle-development-cff36f06aad3), taking signed price reports and posting them to the Vega chain. As Open Oracle reports include signatures, the data can still be verified against its source. 

A signed message data source must include:
* Public keys that can sign and submit values for this oracle, as well as the key algorithm to be used, if required
* Type of data to be supplied in the transaction
* ABI encoded data

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

## Internal data source
Vega provides a timestamp source, which can be used to trigger a market event (such as trading termination or final settlement) at a set date and time. The `vegaprotocol.builtin.timestamp` is used by the market proposer to provide a Unix timestamp in seconds of the Vega time, which is to say the time agreed via consensus. 

As the name implies, an internal data source is generated inside Vega and is submitted automatically when the time is reached.

For example, a single timestamp event will appear as follows. Note: the precise representation will vary based on which API you're using):

```json
[
	{
		"name": "vega.builtin.timestamp",
		"value": "1661273220"
	}
]
```

## Signed JSON message
Signed JSON messages are an alternative to using *signed message data sources*, which are best used for off-chain prices. Some markets need data other than prices, and for that flexibility Vega also supports arbitrary JSON messages, signed by a Vega key. Data from these types is only as reliable as the Vega public key that publishes the data, whereas signed message data sources have signed data. The advantage is that the format is less rigid than signed messages: any properties can be specified, including strings, booleans or non-price numbers.

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

## Using a data source: Filtering
Data source filters allow the market proposer to specify which data sources it is listening for, and which of their messages are relevant.

Markets require data to progress through the market lifecycle. The two key transitions controlled by data sources are the termination of trading, and settlement of the market. These are both configured when the market is proposed, using data source filters.

As a public key may provide many messages, a filter is used to extract the required message - for example trading could terminate at a specific date and time, and so the filters would ensure that only data provided on or after the specified date and time would trigger termination. Similarly for settlement, only price data *after* trading has terminated would be relevant.

When a market is proposed, it must specify filters for the chosen data source(s). Those filters are applied to the source of structured data records used as input and emit only the value of a named field - such as to return `BTCUSD_PRICE` from a record containing many prices. 

:::tip Try it out
The **[submitting data and configuring markets](./../../tutorials/using-data-sources.md)** guide describes how to encode oracle data and configure a market to use it. 
:::
