---
title: Patch your node for fix at block 41090347
sidebar_label: v0.74.10-fix.1
---


There is a bug in the vega code. To fix it, We need to use binary with fix. You can see the [fix diff here](https://github.com/vegaprotocol/vega/pull/11018).

Steps to fix the issue are:

1. Stop your node.
2. Run tm rollback for a single block: vega tm rollback --home <tendermint_home>
3. Replace vega binary with [this one](https://github.com/vegaprotocol/vega/releases/tag/v0.74.10)
4. Update config/flag to your node from the one before last snapshot.
    a. If you use the Visor you can add the following path to the run-config.toml(<vegavisor_home>/current/run-config.toml>) file: "--snapshot.load-from-block-height", "41090047", 
    b. If you do not use the visor, you can add the following flag to your start command: --snapshot.load-from-block-height 41090047
    c. You can also update core config(`<vega_home>/config/node/config.toml`): Snapshot.StartHeight = 41090047
5. Start node
6. When your node is stable, and it is running revert change applied in the step 4.

:::note Examples
You can find example configs below:

```toml title="vegavisor_home/current/run-config.toml
name = "v0.74.10"

[vega]
  [vega.binary]
    path = "vega"
    args = ["start", "--home", ".../vega_home", "--tendermint-home", "...tendermint_home", "--nodewallet-passphrase-file", ".../vega_home/all-wallet-passphrase.txt", "--snapshot.load-from-block-height", "41090047"]
  [vega.rpc]
    socketPath = "/home/vega/run/vega.sock"
    httpPath = "/rpc"

[data_node]
  [data_node.binary]
    path = "vega"
    args = ["datanode", "start", "--home", "/home/vega/vega_home"]
```

```toml title="vega_home/config/node/config.toml
...
[Snapshot]
  ...
  StartHeight = 41090047

```

:::