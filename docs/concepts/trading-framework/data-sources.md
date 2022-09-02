---
sidebar_position: 8
title: Data sources
hide_title: false
---
Data sources, which include oracles and data originating on the Vega network, are essential to markets created on Vega.

Market settlement, risk models, and other features require a supplied price, or other data, which must come from somewhere, usually completely external to Vega. Specifically for settlement values, Vega currently requires external data.

The types of data sources that Vega can accept in the current implementation is limited to those listed below.

However, the APIs and protocol are expected to support a wider range of data source standards in the future.

The framework is designed to be flexible to make it easy to create and combine oracles, and therefore to design markets on almost anything, and the software will grow to fulfil that goal. 

The current implementation requires that a market proposal defines two data sources, and the price based on those sources is final.

## Data sourcing framework
Vega supports three data source types, though not all three can be used to settle markets. Internal data sources cannot be nominated for settling a market, but are used to emit an event or value at/after a given Vega time to trigger 'trading terminated', for example.

Data sources must be able to emit four types of data:
* Number
* String
* Date/Time
* Structured data records, such  as a set of key-value pairs

## Data source requirements
Multiple instruments can rely on the same data source, and can settle based on the same `SubmitData` message.

Data sources must provide:

* Type of data source (signed message, internal Vega market data, date/time, Ethereum, etc.)
* Data type (e.g. float for a price) - this must be compatible with the usage of the data source (if it is a settlement price, a numeric value would be required; for a trading termination trigger which consumes no data then any data type, etc.). Note that it is possible to have more than one “compatible” type, for instance it might be that a number could be a string or a raw numeric value in a JSON data source.
* Data source specific details (for signed message, public key of sender; for Ethereum, contract address, method name; etc.)

Data sources must be able to emit the following data types:

* Number (for prices or in filter comparisons)
* String (to be used to compare against in filters)
* Date/Time (to compare against in filters)
* Structured data records, such as a set of key value pairs (inputs to filters)

Data sources nominated for use by Vega may refer to other data sources. For instance, one that takes a source of structured data records as input and emits only the value of a named field (e.g. to return BTCUSD_PRICE from a record containing many prices) or one that takes another data source as input and emits only data that matches a set of defined filters (e.g. to return only records with specific values in the timestamp and ticket symbol fields).

## Signed message data sources
Signed message data sources are the first external data source to be supported on Vega, and can be nominated for settling a market. They introduce a Vega transaction that represents a data result. The result is validated by ensuring the signed message is signed by one of a set of public keys provided in a market’s proposal.

:::info
There are no rewards associated with being a signed message data source, nor are there fees associated with being or using a signed message data source.
:::

A signed message data source must include:

* Public keys that can sign and submit values for this oracle, as well as the key algorithm to be used, if required
* Type of data to be supplied in the transaction. Supported types are a simple native Vega transaction (i.e. protobuf message) containing one or more key/value pairs of data fields with values that are expressed in the data types listed above
* ABI encoded data

## Filtered data source
As a public key may provide many messages, it's likely a filter is needed to extract the required message. A field select would then be used to extract the required field (‘price’ or ‘temperature’, etc.).

A filtered data source includes another data source definition within its own definition, and outputs a modified stream of data. It contains one or more conditions that are applied to data to determine whether that data is emitted.

Multiple products can filter the same data source differently and settle based on different SubmitData messages. Multiple products can filter the same data source differently and settle based on different fields from the same SubmitData message.

A filtered data source must specify:

* Data: Another data source that defines the input data
* Filters: A list of at least one filter to apply to the data

A filter specifies a condition to apply to the data. If all filters match, the data is emitted. The filter types are defined in the Operator field of a market proposal.

Filter condition types:

* Equals: Data must exactly match the filter, i.e. Equals key = ticker, value = TSLA
* Greater / greater or equal to: Data can be greater than or equal to the filter, i.e. GreaterOrEqual key = timestamp, value = 2021-12-31T23:59:59
* Less / less or equal to: Data can be less than or equal to the filter, i.e. LessOrEqual key = timestamp, value = 2021-12-31T23:59:59

## Internal data source
An internal data source provides information that comes from within Vega, rather than an external source. They are defined and used in the same way as external data sources, but are triggered by the relevant event in protocol rather than by an incoming transaction.

There is currently one type of data that can come from internal data sources: time-triggered.

### Internal data source: Timestamp
Vega provides a timestamp source, which can be used to terminate a futures market at a set date. `vegaprotocol.builtin.timestamp` provides a Unix timestamp of the Vega time, which is to say the time agreed via consensus. 

As the name implies, a built in data source is generated inside Vega, and cannot be submitted by other keys.

This data source is used to emit an event or value, at or after the given time printed on the block.

<!--### Internal data source: Value [WIP]
This data source provides an immediate value, and is used where a data source is required, but the value is already known at the time of definition.

Any code expecting to be triggered when a value is received on a data source would be triggered immediately by a data source of this type, for instance as soon as a market parameter change is enacted, if it contained a value type data source for final settlement, final settlement would occur.

'Value' can be used to submit a governance change proposal to update a futures market's settlement data source to a price value. This would happen if the defined data source fails and tokenholders choose to vote to accept a specific value to be used for settlement.

Example:
`value { type: number, value: 1400.5 }`-->

<!-- notes: 
(highlight shortcomings of trading termination as a way to extract data from a payload. no way to add computation on top of it. maybe it's worth adding some internal oracle data into the market proposal)

ideally: only have property emission time, filter on it, get the oracle data, and then say if data is greater than/equal, to timestamp, set termination to true. or make extra computations, such as settlment price that's average of a price range -->