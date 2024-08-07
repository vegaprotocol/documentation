---
sidebar_position: 11
title: How to save disk space
sidebar_label: Save disk space
hide_title: false
---

## Clean up and disable the CometBFT indexer


* Suitable for: data node

* Downtime required: up to 2 min
* 

### How to check if you really need it


To check if you need to clean the transactions index for CometBFT (formerly Tendermint), navigate to the `COMETBFT_HOME/data` and see how big are files there:


```shell
# cd COMETBFT_HOME/data

# du -sh ./*
du -sh ./*
59G     ./blockstore.db
215M    ./cs.wal
18K     ./evidence.db
512     ./priv_validator_state.json
265M    ./state.db
61G     ./tx_index.db
```

In the above scenario, we could save about 61 GB of the storage on our server.


### Cleanup instructions

1. Stop the node: `sudo systemctl stop vegavisor`
2. Open the CometBFT config (`COMETBFT_HOME/config/config.toml`) and disable the `tx_indexer.indexer` by setting it to `null`


```toml
[tx_index]
indexer = "null"
```

3. Navigate to `COMETBFT_HOME/data` and rename `tx_index.db` to something else. This step allows you to easily recover if something goes wrong.

```shell
# cd COMETBFT_HOME/data

# mv tx_index.db tx_index.db.tmp
```

4. Create the empty `tx_index.db` directory in the `COMETBFT_HOME/data`


```shell
# cd COMETBFT_HOME/data

# mkdir tx_index.db
```

5. Start your node and make sure everything is fine
6. Remove big directory created in the step 3.

```shell
# cd COMETBFT_HOME/data

# rm -r tx_index.db.tmp
```