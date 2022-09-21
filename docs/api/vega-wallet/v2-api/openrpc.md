---
    title: OpenRPC Wallet API
---
- [session.connect_wallet](#sessionconnect_wallet): Initiates a connection between a wallet and a third-party application.
- [session.disconnect_wallet](#sessiondisconnect_wallet): Ends the connection between the third-party application and the wallet.
- [session.get_permissions](#sessionget_permissions): Returns the permissions set on the wallet for the third-party application.
- [session.request_permissions](#sessionrequest_permissions): Requests permissions update for the third-party application.
- [session.list_keys](#sessionlist_keys): Returns the keys the client has allowed the third-party application to have access to.
- [session.sign_transaction](#sessionsign_transaction): Sign a transaction without sending it.
- [session.send_transaction](#sessionsend_transaction): Send a transaction to the network.
- [session.get_chain_id](#sessionget_chain_id): Returns the chain ID of the network in use.
- [admin.create_wallet](#admincreate_wallet): Creates a wallet with its first key-pair.
- [admin.import_wallet](#adminimport_wallet): Import a wallet with its first key-pair with a recovery phrase and a version.
- [admin.describe_wallet](#admindescribe_wallet): Returns the wallet base information.
- [admin.list_wallets](#adminlist_wallets): Returns the list of the wallets present on the computer.
- [admin.remove_network](#adminremove_network): Removes a network from the computer.
- [admin.list_networks](#adminlist_networks): Returns the list of all registered networks.
- [admin.describe_network](#admindescribe_network): Returns the network information.
- [admin.import_network](#adminimport_network): Import a network configuration from a file or an URL.
- [admin.remove_wallet](#adminremove_wallet): Removes a wallet from the computer.
- [admin.generate_key](#admingenerate_key): Generates a key on the specified wallet.
- [admin.describe_key](#admindescribe_key): Returns key's information.
- [admin.list_keys](#adminlist_keys): Returns all generated key of the specified wallet.
- [admin.annotate_key](#adminannotate_key): Attaches metadata to a key.
- [admin.isolate_key](#adminisolate_key): Isolate a key to a specific wallet.
- [admin.rotate_key](#adminrotate_key): Builds a transaction to rotate key on the network.
- [admin.taint_key](#admintaint_key): Marks the specified public key as tainted.
- [admin.untaint_key](#adminuntaint_key): Remove the taint from the specified public key.
- [admin.describe_permissions](#admindescribe_permissions): Returns the permissions set for the specified wallet and hostname.
- [admin.list_permissions](#adminlist_permissions): Returns the permissions summary for all set hostnames.
- [admin.update_permissions](#adminupdate_permissions): Updates the permissions for the specified wallet and hostname.
- [admin.revoke_permissions](#adminrevoke_permissions): Revokes the permissions set in the specified hostname.
- [admin.purge_permissions](#adminpurge_permissions): Purges all the permissions set for all hostname.

---



## `session.connect_wallet`

This method initiates a connection between a wallet and a third-party application.

The client has to review the request, and, if they accept it, select the wallet they want to use for this connection.

A connection token is generated and returned to the third-party application. This token is meant to be used in protected methods.

**Supported connections:**
- Multiple wallets connected for the same hostname. Each connection will have a different token.
- A single wallet connected to multiple hostnames. Each connection will have a different token.
- Combination of the above setups.

However, it's not possible to have multiple connections on the same wallet for the same hostname. The previous connection will be terminated and a new token will be generated.

This method should be the entry point of every third-party application. Once connected, see the method `get_permissions`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **hostname** | string | The name of the third-party application initiating the connection. |

### Result: `token`

### Errors
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Accepting a connection from "vega.xyz"
The third-party application "vega.xyz" requests a connection to a wallet and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.connect_wallet",
    "params": {
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

---


## `session.disconnect_wallet`

This method ends the connection between the third-party application and the wallet. The token is, then, no longer valid.

Calling this method with an invalid token doesn't fail.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |

### Result: `No result`



### Examples
#### Disconnection from "vega.xyz"
The third-party application "vega.xyz" requests a disconnection to a wallet using a valid token.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.disconnect_wallet",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `session.get_permissions`

This method returns the permissions set on the wallet for the third-party application.

This method should be called, by the third-party application, right after it successfully connected to a wallet, to ensure it has sufficient permissions to call the method it relies on. If the third-party application doesn't have enough permissions, see the method `request_permissions`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| public_keys | string | The different access modes a permission can have. | The different access modes a permission can have.} |



### Examples
#### Get permissions set for "vega.xyz"
The third-party application "vega.xyz" wants to know the permissions that have been set on the wallet in use.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.get_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKeys": "read"
    }
}
```

---


## `session.request_permissions`

This method allows a third-party application to request new permissions to access the methods it requires.

All permissions the third-party relies on have to be specified. If a permission is omitted, it will be considered as no longer required and, as a result, be automatically revoked.

The client has to review the permissions.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |
| **requestedPermissions** | object | The description of the permissions a third-party application has.<br /><br />`{ "public_keys": "read" }`<br />`{ "public_keys": "none" }` |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| public_keys | string | The different access modes a permission can have. | The different access modes a permission can have.} |

### Errors
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Updating permissions for "vega.xyz"
The third-party application "vega.xyz" requests an update of its permissions and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.request_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "requestedPermissions": {
            "publicKeys": "read"
        }
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "publicKeys": "read"
        }
    }
}
```


#### Updating permissions for "vega.xyz" with omitted permission
The third-party application "vega.xyz" omits a permission during the update and the client accepts. This automatically marks the omitted permission as revoked.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.request_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "requestedPermissions": {}
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "publicKeys": "none"
        }
    }
}
```

---


## `session.list_keys`

This method returns the keys the client has allowed the third-party application to have access to.

It requires a `read` access on `public_keys`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |

### Result: `Success`

### Errors
- **Application error** (2000): a "read" access on public keys is required

### Examples
#### List keys allowed on "vega.xyz"
The third-party application "vega.xyz" wants to list the public keys it has access to.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.list_keys",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "keys": [
            {
                "name": "Key 1",
                "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
            },
            {
                "name": "Key 2",
                "publicKey": "988eae323a07f12363c17025c23ee58ea32ac3912398e16bb0b56969f57adc52"
            }
        ]
    }
}
```

---


## `session.sign_transaction`

This method signs a transaction and returns it to the third-party application, without sending it to the network. What happens with the transaction is up to the third-party application.

The client has to review the transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |
| **publicKey** | string | The Vega public key to use. |
| **encodedTransaction** | string | The transaction encoded using base-64. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| transaction | object | A transaction that has been signed by the wallet. | A transaction that has been signed by the wallet.} |

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): could not get information about the last block on the network
- **Application error** (2000): the public key is not allowed to be used
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Signing a transaction for "vega.xyz"
The third-party application "vega.xyz" requests to sign a transaction and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.sign_transaction",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "publicKey": "3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80",
        "sendingMode": "TYPE_SYNC",
        "encodedTransaction": "ewogICAgInZvdGVTdWJtaXNzaW9uIjogewogICAgICAgICJwcm9wb3NhbElkIjogImViMmQzOTAyZmRkYTljM2ViNmUzNjlmMjIzNTY4OWI4NzFjNzMyMmNmM2FiMjg0ZGRlM2U5ZGZjMTM4NjNhMTciLAogICAgICAgICJ2YWx1ZSI6ICJWQUxVRV9ZRVMiCiAgICB9Cn0K"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "receivedAt": "2021-02-18T21:54:42.123Z",
        "sentAt": "2021-02-18T21:54:42.123Z",
        "txHash": "E8C167126D1FC8D92898AB9C07C318161DF68753A1316A69ABDC9ADC557723B3"
    }
}
```

---


## `session.send_transaction`

This method sends a transaction to the network.

The client has to review the transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |
| **publicKey** | string | The Vega public key to use. |
| **sendingMode** | string | The chosen mode to send the transaction:<br />- `TYPE_SYNC` returns the result of running the transaction.<br />- `TYPE_ASYNC` returns right away without waiting to hear if the transaction is even valid.<br />- `TYPE_COMMIT` waits until the transaction is committed in a block or until some timeout is reached or returns return right away if the transaction is not valid. |
| **encodedTransaction** | string | The transaction encoded using base-64. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| receivedAt | string | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present.} |
| sentAt | string | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present.} |
| transactionHash | string | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it.} |
| transaction | object | A transaction that has been signed by the wallet. | A transaction that has been signed by the wallet.} |

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): could not get information about the last block on the network
- **Network error** (1000): the transaction failed
- **Application error** (2000): the public key is not allowed to be used
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Sending a transaction for "vega.xyz"
The third-party application "vega.xyz" requests to send a transaction and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.send_transaction",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "publicKey": "3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80",
        "sendingMode": "TYPE_SYNC",
        "encodedTransaction": "ewogICAgInZvdGVTdWJtaXNzaW9uIjogewogICAgICAgICJwcm9wb3NhbElkIjogImViMmQzOTAyZmRkYTljM2ViNmUzNjlmMjIzNTY4OWI4NzFjNzMyMmNmM2FiMjg0ZGRlM2U5ZGZjMTM4NjNhMTciLAogICAgICAgICJ2YWx1ZSI6ICJWQUxVRV9ZRVMiCiAgICB9Cn0K"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "receivedAt": "2021-02-18T21:54:42.123Z",
        "sentAt": "2021-02-18T21:54:42.123Z",
        "txHash": "E8C167126D1FC8D92898AB9C07C318161DF68753A1316A69ABDC9ADC557723B3"
    }
}
```

---


## `session.get_chain_id`

This method returns the chain ID of the network in use.

It should be called by every third-party application to know from which network it should fetch data.

### Parameters

None required

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| chainID | string | The chain identifier | The chain identifier} |

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): could not get information about the last block on the network

### Examples
#### Fetching the chain ID
An example of requesting the chain's ID

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.get_chain_id",
    "params": []
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "chainID": "test-chain-Thz9c6"
    }
}
```

---


## `admin.create_wallet`

This method creates a HD wallet (version 2) and generates its first key-pair the cryptographic algorithm ed25519.

The passphrase will be used to encrypt the wallet and its keys.

If successful, the wallet is ready to use for sending transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallet | object | the newly generated wallet | the newly generated wallet} |
| key | object | the first public key generated | the first public key generated} |



### Examples
#### Creating a wallet
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.create_wallet",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallet": {
            "name": "my-wallet",
            "version": 2,
            "recoveryPhrase": "swing ceiling chaos green put insane ripple desk match tip melt usual shrug turkey renew icon parade veteran lens govern path rough page render",
            "filePath": "some/path/to/my-wallet"
        },
        "key": {
            "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
            "algorithm": {
                "name": "vega/ed25519",
                "version": 1
            },
            "metadata": [
                {
                    "key": "name",
                    "value": "my-wallet key 1"
                }
            ]
        }
    }
}
```

---


## `admin.import_wallet`

This method imports a wallet using the specified recovery phrase and wallet version, and generates its first key-pair.

The passphrase will be used to encrypt the wallet and its keys.

If successful, the wallet is ready to use for sending transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **recoveryPhrase** | string | - |
| **version** | number | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallet | object | the imported wallet | the imported wallet} |
| key | object | the first public key generated | the first public key generated} |



### Examples
#### Importing a wallet
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.import_wallet",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "recoveryPhrase": "swing ceiling chaos green put insane ripple desk match tip melt usual shrug turkey renew icon parade veteran lens govern path rough page render",
        "version": "2"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallet": {
            "name": "my-wallet",
            "version": 2,
            "filePath": "some/path/to/my-wallet"
        },
        "key": {
            "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
            "algorithm": {
                "name": "vega/ed25519",
                "version": 1
            },
            "metadata": [
                {
                    "key": "name",
                    "value": "my-wallet key 1"
                }
            ]
        }
    }
}
```

---


## `admin.describe_wallet`

This method returns the wallet base information such as its name, ID, type and version. It doesn't return the keys nor the permissions.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| name | string | - | -} |
| version | number | - | -} |
| id | string | - | -} |
| type | string | - | -} |



### Examples
#### Getting wallet base information
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_wallet",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "name": "my-wallet",
        "version": 2,
        "type": "HD Wallet",
        "ID": "7ffa36b2fb99d8404e9448f0d2ce944055e64c36d895d1fde044c867bfdf779f"
    }
}
```

---


## `admin.list_wallets`

This method returns the list of the wallets present on the computer. It is alphabetically sorted.

### Parameters

None required

### Result: `Success`



### Examples
#### Getting the list of wallets
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_wallets",
    "params": []
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallets": [
            "wallet-1",
            "wallet-2"
        ]
    }
}
```

---


## `admin.remove_network`

This method removes a network from the computer.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |

### Result: `Success`



### Examples
#### Remove a network
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.remove_network",
    "params": {
        "network": "fairground"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {}
}
```

---


## `admin.list_networks`

This method returns the list of the registered networks.

### Parameters

None required

### Result: `Success`



### Examples
#### Getting the list of networks
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_networks",
    "params": []
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "networks": [
            "mainnet",
            "fairground",
            "local-network"
        ]
    }
}
```

---


## `admin.describe_network`

This method returns the network information.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| name | string | - | -} |
| level | number | - | -} |
| tokenExpiry | string | - | -} |
| port | integer | - | -} |
| host | string | - | -} |
| api | object | The API configuration for the network. | The API configuration for the network.} |



### Examples
#### Describing a network
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_network",
    "params": {
        "name": "local-network"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "name": "local-network",
        "level": "info",
        "tokenExpiry": "168h0m0s",
        "port": "1789",
        "host": "localhost",
        "api": {
            "grpcConfig": {
                "hosts": [
                    "localhost:3028"
                ],
                "retries": 5
            },
            "graphQLConfig": {
                "hosts": [
                    "localhost:3028"
                ]
            },
            "restConfig": {
                "hosts": [
                    "localhost:3029"
                ]
            }
        }
    }
}
```

---


## `admin.import_network`

Import a network configuration from a file or an URL.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| name _(Optional)_ | string | - |
| **filePath** | string | - |
| **url** | string | - |
| **overwrite** | boolean | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| name | string | - | -} |
| filePath | string | - | -} |



### Examples
#### Importing a network
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.import_network",
    "params": {
        "name": "local-network",
        "filePath": "/Users/username/local-network.toml"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "name": "local-network",
        "filePath": "/Users/username/vega-home/wallet-service/networks/local-network.toml"
    }
}
```

---


## `admin.remove_wallet`

This method removes a wallet from the computer.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |

### Result: `Success`



### Examples
#### Remove a wallet
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.remove_wallet",
    "params": {
        "wallet": "my-wallet"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {}
}
```

---


## `admin.generate_key`

This method generates a key on the specified wallet.

Metadata can be attached to this key.

A special metadata `name` can be provided to name the key. If no `name` is provided, a default name is generated.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **metadata** | object | The key's metadata.<br /><br /><br /> |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| publicKey | string | The Vega public key to use. | The Vega public key to use.} |
| algorithm | object | The algorithm used to generate the key. | The algorithm used to generate the key.} |
| metadata | object | The key's metadata. | The key's metadata.} |



### Examples
#### Generating a key
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.generate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "metadata": [
            {
                "name": "portfolio",
                "value": "btc"
            }
        ]
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "algorithm": {
            "name": "vega/ed25519",
            "version": 1
        },
        "metadata": [
            {
                "key": "portfolio",
                "value": "btc"
            },
            {
                "key": "name",
                "value": "Key 1"
            }
        ]
    }
}
```

---


## `admin.describe_key`

This method returns the information of the specified key.

It doesn't return the private key for security reasons.  If you need something that requires a private key, you should use the available endpoints and let them handle the private key for you.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| publicKey | string | The Vega public key to use. | The Vega public key to use.} |
| algorithm | object | The algorithm used to generate the key. | The algorithm used to generate the key.} |
| metadata | object | The key's metadata. | The key's metadata.} |
| isTainted | boolean | Tells if the key is tainted or not. A tainted key cannot be used for signing and sending transaction, for example. | Tells if the key is tainted or not. A tainted key cannot be used for signing and sending transaction, for example.} |



### Examples
#### Getting key base information
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "algorithm": {
            "name": "vega/ed25519",
            "version": 1
        },
        "metadata": [
            {
                "key": "portfolio",
                "value": "btc"
            },
            {
                "key": "name",
                "value": "Key 1"
            }
        ],
        "isTainted": false
    }
}
```

---


## `admin.list_keys`

This method returns all generated key of the specified wallet with their respective name.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| keys | array | - | -} |



### Examples
#### Listing the keys
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_keys",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "keys": [
            {
                "name": "Key 1",
                "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
            }
        ]
    }
}
```

---


## `admin.annotate_key`

This method attaches metadata to the specified key.

A special metadata `name` can be provided to name the key. If no `name` is provided, a default name is generated.

This method **replaces** the existing metadata by the specified ones. It does **not** update in place.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **public_key** | string | The Vega public key to use. |
| **metadata** | object | The key's metadata.<br /><br /><br /> |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| metadata | object | The key's metadata. | The key's metadata.} |



### Examples
#### Annotating the key
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.annotate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "public_key": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "metadata": [
            {
                "name": "portfolio",
                "value": "btc"
            }
        ]
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "metadata": [
            {
                "key": "portfolio",
                "value": "btc"
            },
            {
                "key": "name",
                "value": "Key 1"
            }
        ]
    }
}
```

---


## `admin.isolate_key`

This method isolates a key in a specific wallet called an "isolated wallet". This isolated wallet contains a single key. It can't generate keys, and is stripped of the master key. Generally, it can only sign transactions.

This is a security feature that **lowers** the impact of having a wallet stolen. If a wallet is stolen and the attacker breaks into it, he has access to all keys. On an isolated wallet, it can only retrieve the isolated key.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **public_key** | string | The Vega public key to use. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallet | undefined | Name of the generated isolated wallet | Name of the generated isolated wallet} |
| filePath | undefined | Path to the isolated wallet file | Path to the isolated wallet file} |



### Examples
#### Isolating a key
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.isolate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallet": "my-wallet.b5fd9d3c.isolated",
        "filePath": "some/path/to/my-wallet.b5fd9d3c.isolated"
    }
}
```

---


## `admin.rotate_key`

This method builds a transaction to rotate key on the network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **fromPublicKey** | string | The current public key |
| **toPublicKey** | string | The next public key to rotate to |
| **chainID** | string | The chain identifier |
| **submissionBlockHeight** | string | The block height (approximation) at which the transaction will be submitted |
| **enactmentBlockHeight** | string | The block height at which the rotation should happen |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| masterPublicKey | undefined | The master public key of the wallet used to sign the transaction | The master public key of the wallet used to sign the transaction} |
| encodedTransaction | undefined | The base64-encoded key rotation transaction | The base64-encoded key rotation transaction} |



### Examples
#### Rotating a key
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.rotate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "fromPublicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "toPublicKey": "988eae323a07f12363c17025c23ee58ea32ac3912398e16bb0b56969f57adc52",
        "chainID": "test-chain-Thz9c6",
        "submissionBlockHeight": 10,
        "enactmentBlockHeight": 15
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "masterPublicKey": "9df682a3c87d90567f260566a9c223ccbbb7529c38340cf163b8fe199dbf0f2e",
        "filePath": "CqsBdGVzdC1jaGFpbi1UaHo5YzYACPfdurmpppHlogEQCqp9iAEIAhAPGkA5ODhlYWUzMjNhMDdmMTIzNjNjMTcwMjVjMjNlZTU4ZWEzMmFjMzkxMjM5OGUxNmJiMGI1Njk2OWY1N2FkYzUyIkA4MWFhZjk2NmU4ZjUxNDIzZjBiZDFkOTMzYWQ0NmY5NjJlMjNiY2Q3MTg4ZWQzZmUwZjUzZjRkYThhMzJhOWVlEpMBCoABYzg3NDVkODhlMWQ1YTBhOGE3NGI5YzRmN2QyMzQ3ZmQ5ZDY1NzIwYTQ3ZmYwNWU3YTZmZmYyOTA0NzhmOTU0M2NjM2E4MzJkNjBmYTJiNmY3ZTQ3YWJlMjE0MGIwOTEyNzBlNTAxZTA5MjVjNDg3NzEwMjViOTkyYTg1ZTAxMDQSDHZlZ2EvZWQyNTUxORgBgH0D0j5AOWRmNjgyYTNjODdkOTA1NjdmMjYwNTY2YTljMjIzY2NiYmI3NTI5YzM4MzQwY2YxNjNiOGZlMTk5ZGJmMGYyZQ=="
    }
}
```

---


## `admin.taint_key`

This method marks the specified public key as tainted. It makes it unusable for transaction signing.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`



### Examples
#### Tainting a key
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.taint_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.untaint_key`

This method removes the taint from the specified public key.

If you tainted a key for security reasons, you should not use it.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`



### Examples
#### Remove the taint from a key
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.untaint_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.describe_permissions`

This method returns the permissions set for the specified wallet and hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **hostname** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | The full description of the permissions a third-party application has. | The full description of the permissions a third-party application has.} |



### Examples
#### Describe the permissions
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKeys": {
            "access": "read",
            "restrictedKeys": [
                "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
            ]
        }
    }
}
```

---


## `admin.list_permissions`

This method returns the permissions summary for all set hostnames.

For a detailed description of the permissions on a given hostname, see `admin.describe_permissions`

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | - | -} |



### Examples
#### List the permissions
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "vega.xyz": {
                "public_keys": "read"
            },
            "token.vega.xyz": {
                "public_keys": "none"
            }
        }
    }
}
```

---


## `admin.update_permissions`

This method updates the permissions for the specified wallet and hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **hostname** | string | - |
| **permissions** | object | The full description of the permissions a third-party application has.<br /><br /> |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | The full description of the permissions a third-party application has. | The full description of the permissions a third-party application has.} |



### Examples
#### Update the permissions
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.update_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "hostname": "vega.xyz",
        "permissions": {
            "publicKeys": {
                "access": "read",
                "restrictedKeys": [
                    "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
                ]
            }
        }
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKeys": {
            "access": "read",
            "restrictedKeys": [
                "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
            ]
        }
    }
}
```

---


## `admin.revoke_permissions`

This method revokes the permissions set in the specified hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **hostname** | string | - |

### Result: `Success`



### Examples
#### Revoke the permissions
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.revoke_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.purge_permissions`

This method purges all the permissions set for all hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`



### Examples
#### Purge the permissions
undefined

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.purge_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```


