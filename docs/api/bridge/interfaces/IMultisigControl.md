# IMultisigControl
> 👤 Vega Protocol
```
MultisigControl Interface
```


### 📋 Notice

Implementations of this interface are used by the Vega network to control smart contracts without the need for Vega to have any Ethereum of its own.To do this, the Vega validators sign a MultisigControl order to construct a signature bundle. Any interested party can then take that signature bundle and pay the gas to run the command on Ethereum




### 🎟 Events


#### SignerAdded
| Name | Indexed | Type |
|:-:|:-:|:-:|
| new_signer | `false` | `address` |
| nonce | `false` | `uint256` |


#### SignerRemoved
| Name | Indexed | Type |
|:-:|:-:|:-:|
| old_signer | `false` | `address` |
| nonce | `false` | `uint256` |


#### ThresholdSet
| Name | Indexed | Type |
|:-:|:-:|:-:|
| new_threshold | `false` | `uint16` |
| nonce | `false` | `uint256` |



## `set_threshold`

>👀 `nonpayable`

### 📋 Notice

Sets threshold of signatures that must be met before function is executed.See MultisigControl for more about signaturesEthereum has no decimals, threshold is % * 10 so 50% == 500 100% == 1000signatures are OK if they are >= threshold count of total valid signers


### 🔎 Details

MUST emit ThresholdSet event

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `uint16` | Vega-supplied signature bundle of a validator-signed order |



## `add_signer`

>👀 `nonpayable`

### 📋 Notice

Adds new valid signer and adjusts signer count.See MultisigControl for more about signatures


### 🔎 Details

MUST emit &#39;SignerAdded&#39; event

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `remove_signer`

>👀 `nonpayable`

### 📋 Notice

Removes currently valid signer and adjusts signer count.See MultisigControl for more about signatures


### 🔎 Details

MUST emit &#39;SignerRemoved&#39; event

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `verify_signatures`

>👀 `nonpayable`

### 📋 Notice

Verifies a signature bundle and returns true only if the threshold of valid signers is met,this is a function that any function controlled by Vega MUST call to be securely controlled by the Vega networkmessage to hash to sign follows this pattern:abi.encode( abi.encode(param1, param2, param3, ... , nonce, function_name_string), validating_contract_or_submitter_address);Note that validating_contract_or_submitter_address is the the submitting party. If on MultisigControl contract itself, it&#39;s the submitting ETH addressif function on bridge that then calls Multisig, then it&#39;s the address of that contractNote also the embedded encoding, this is required to verify what function/contract the function call goes to



### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `get_valid_signer_count`

>👀 `view`




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint8` |



## `get_current_threshold`

>👀 `view`




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint16` |



## `is_valid_signer`

>👀 `view`




### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signer_address | `address` | target potential signer address |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `is_nonce_used`

>👀 `view`




### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| nonce | `uint256` | Nonce to lookup |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



