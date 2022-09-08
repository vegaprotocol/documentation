---
sidebar_position: 8
title: Data sourcing
hide_title: false
---
Vega's Data Sourcing framework is the system that standardises and publishes information that can be useful in the operation of any markets. The system broadly includes Oracles that may exist on other chains, data produced in the operation of other markets, or off-chain data.

The information produced by data sourcing is relevant to market settlement, risk models, and other features that require specific data which must come from somewhere, often completely external to Vega. For example, a market based on the price of Bitcoin on a specific date needs a trustworthy and reliable source of the price of Bitcoin.

The types of data sources that Vega can accept in the current implementation is limited to those listed below, however the APIs and protocol are expected to support a wider range of data source standards in the future.

## Sources of data

Inputs to the data sourcing framework can come from:

- Signed Message data source, part of the Open Oracle specification
- Specially formatted and signed JSON messages
- Internal data

Currently this means that the many reliable data sources available on the Ethereum network must be 'copied' over to the Vega network manually, but as Open Oracle signed messages include signatures, the data can still be verified against its source. In future, this will be able to happen automatically through the Ethereum bridge.

# What's in a data source

Data sources must provide:

* Type of data source (e.g. `vega.builtin.timestampz`, `Open Oracle`)
* Data type (e.g. float for a price)
* Data source specific details

Data sources must be able to emit the following data types:

* Number - for prices or in filter comparisons
* String - to be used to compare against in filters
* Date/Time - to compare against in filters
* Structured data records - such as a set of key value pairs (inputs to filters)

Data sources nominated for use by Vega may refer to other data sources. For instance, one that takes a source of structured data records as input and emits only the value of a named field (e.g. to return BTCUSD_PRICE from a record containing many prices) or one that takes another data source as input and emits only data that matches a set of defined filters (e.g. to return only records with specific values in the timestamp and ticket symbol fields).

## What's in a signed message data source

Signed message data sources are the first external data source to be supported on Vega, and can be nominated for settling a market. They introduce a Vega transaction that represents a data result. The result is validated by ensuring the signed message is signed by one of a set of public keys provided in a market’s proposal.

A signed message data source must include:

* Public keys that can sign and submit values for this oracle, as well as the key algorithm to be used, if required
* Type of data to be supplied in the transaction.
* ABI encoded data

For example, a [message taken from Coinbase's Price Oracle](https://blog.coinbase.com/introducing-the-coinbase-price-oracle-6d1ee22c7068) would have the signatures verified, and the ABI encoded data will be transformed in to the following format (note: the precise representation will vary based on which API you're using):

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

## What's in an internal data source

Vega provides a timestamp source, which can be used to terminate a futures market at a set date. `vegaprotocol.builtin.timestamp` provides a Unix timestamp of the Vega time, which is to say the time agreed via consensus. 

As the name implies, a built in data source is generated inside Vega, and cannot be submitted by other keys.

For example, a single timestamp event will appear as follows (note: the precise representation will vary based on which API you're using):

```json
[
	{
		"name": "vega.builtin.timestamp",
		"value": "1661273220"
	}
]
```

## What's in a signed JSON message

JSON messages. What they lack is the same verification path as the Signed Message Data Source. Data from these types is only as reliable as the Vega public key that publishes the data, whereas Signed Message data sources have signed data. The advantage is that the format is less rigid than Signed Messages. Any properties can be specified.

The Data Sourcing framework takes in these JSON messages and presents them similarly to the other data formats:

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

For a more thorough example of how to produce, sign and submit data in this format, see [Tutorials: Submitting oracle data](#)

# Using a data source: filtering

Markets require data to progress through the Market Lifecycle. The two key transitions controlled by data sources are the termination of trading and settlement of the market. These are both configured when the market is proposed, using Data Source Filters.

As a public key may provide many messages, it's likely a filter is needed to extract the required message - for example trading could terminate at a specific date & time, and so the filters would ensure that only data provided on or after the specified date & time would trigger termination. Similarly for settlement, only price data *after* trading has terminated would be relevant. The data source filters allow the market proposer to specify *which* data sources it is listening for, and which of their messages are relevant.

**TODO: More about filter format, link to tuitorial for configuring formats**

:::note title=Read more

* Submitting data & configuring markets
* Proposing markets

:::