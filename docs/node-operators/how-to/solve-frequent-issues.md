---
sidebar_position: 10
title: How to resolve common issues
sidebar_label: Resolve common issue
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Below is a list of common issues with running validator and data nodes, and their solutions. 

If you come across an issue you don't see addressed here - share it in the validator Discord channel, or on the [feedback board](https://github.com/vegaprotocol/feedback).

Some of the issues below will be addressed in future software versions, while others may be a result of mis-configurations.

## Problem: Data node fails to startup because it times out when `fetching history for segment`

```log
INFO	datanode.start.persistentPre	start/node_pre.go:121	Auto Initialising Datanode From Network History
INFO	datanode.start.persistentPre	networkhistory/initialise.go:61	got most recent history segment	{"segment": "from_height:136001 to_height:137000 history_segment_id:\"QmWtU5Xks8CewedyYtibLZ32tgSifoNozyQTLibYNmTmcV\" previous_history_segment_id:\"Qmc6uqPnLdMUTgLuvm5FmSGe3WarveJ9UvB1GvbEf6XsvT\"", "peer": "143.198.66.233:3007"}
INFO	datanode.start.persistentPre	start/node_pre.go:125	fetching history using as the first segment:{QmWtU5Xks8CewedyYtibLZ32tgSifoNozyQTLibYNmTmcV} and minimum blocks to fetch 1
INFO	datanode.start.persistentPre	networkhistory/initialise.go:81	fetching history for segment id:QmWtU5Xks8CewedyYtibLZ32tgSifoNozyQTLibYNmTmcV

failed to initialize datanode from network history: failed to fetch history blocks:failed to fetch history:could not write out the fetched history segment: context deadline exceeded
```

## Solution:

If the above issue happens, just try to start the `data-node` one more time.


## Problem: Data-node fails to startup with the following panic

```log
panic: runtime error: invalid memory address or nil pointer dereference [recovered]
        panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x44 pc=0x8791c4]
goroutine 144 [running]:
code.vegaprotocol.io/vega/cmd/vega/node.(*Command).Run.func1.1()
        /home/runner/work/vega/vega/cmd/vega/node/node.go:137 +0x59
panic({0x2d7fa00, 0x56540b0})
        /opt/hostedtoolcache/go/1.19.5/x64/src/runtime/panic.go:884 +0x212
github.com/cosmos/iavl.(*MutableTree).AvailableVersions(0x0)
        /home/runner/go/pkg/mod/github.com/cosmos/iavl@v0.19.4/mutable_tree.go:93 +0x64
code.vegaprotocol.io/vega/core/snapshot.(*Engine).CheckLoaded(0xc001339860)
        /home/runner/work/vega/vega/core/snapshot/engine.go:363 +0x59
code.vegaprotocol.io/vega/core/processor.(*App).Info(0xc001fe2840, {{0x76?, 0x63f14b18?}, 0xc003df6f40?, 0x7fffffffffffffff?})
        /home/runner/work/vega/vega/core/processor/abci.go:534 +0x1e2
code.vegaprotocol.io/vega/core/blockchain/abci.(*App).Info(0xe?, {{0x330f60b?, 0x1f?}, 0xc003dda7e8?, 0x40dd7f?})
        /home/runner/work/vega/vega/core/blockchain/abci/abci.go:27 +0x6b
code.vegaprotocol.io/vega/cmd/vega/node.(*appW).Info(0xc002dc0420?, {{0x330f60b?, 0xc00228dba0?}, 0x565f340?, 0xc003dda878?})
        /home/runner/work/vega/vega/cmd/vega/node/app_wrapper.go:33 +0x59
github.com/tendermint/tendermint/abci/client.(*localClient).InfoSync(0xc003dc8600, {{0x330f60b?, 0xc003dda930?}, 0x4e3625?, 0x1?})
        /home/runner/go/pkg/mod/github.com/informalsystems/tendermint@v0.34.25/abci/client/local_client.go:224 +0x107
github.com/tendermint/tendermint/proxy.(*appConnQuery).InfoSync(0x4e6e86?, {{0x330f60b?, 0xc003dda9f0?}, 0x4e6dc4?, 0xc0000b20c0?})
        /home/runner/go/pkg/mod/github.com/informalsystems/tendermint@v0.34.25/proxy/app_conn.go:155 +0x29
github.com/tendermint/tendermint/consensus.(*Handshaker).Handshake(0xc004c4eda8, {0x3b862b0, 0xc0022f0b60})
        /home/runner/go/pkg/mod/github.com/informalsystems/tendermint@v0.34.25/consensus/replay.go:244 +0x76
github.com/tendermint/tendermint/node.doHandshake({_, _}, {{{0xb, 0x1}, {0xc002373320, 0x7}}, {0xc00038f3c0, 0x1a}, 0x1, 0x6cf42, ...}, ...)
        /home/runner/go/pkg/mod/github.com/informalsystems/tendermint@v0.34.25/node/node.go:329 +0x1b8
github.com/tendermint/tendermint/node.NewNode(0xc001fe1540, {0x3b56970, 0xc0003f23c0}, 0xc001ffef70, {0x3b3bd40, 0xc001fd56b0}, 0x0?, 0x0?, 0xc001ffefb0, {0x3b5c5b0, ...}, ...)
        /home/runner/go/pkg/mod/github.com/informalsystems/tendermint@v0.34.25/node/node.go:777 +0x597
code.vegaprotocol.io/vega/core/blockchain/abci.NewTmNode({{0x0}, 0x1, 0x1, 0x0, 0x0, {0xc001e7c1f0, 0xa}, {{0x0}, {0xc001e1ae88, 0x15}}, ...}, ...)
        /home/runner/work/vega/vega/core/blockchain/abci/tm_node.go:78 +0x6a5
code.vegaprotocol.io/vega/cmd/vega/node.(*Command).startABCI(0xc0019c3c00, {0x3b80100, 0xc001fcda40}, {0x7ffef0370e93, 0x1a}, {0x0?, 0x0?}, {0x0?, 0x0?})
        /home/runner/work/vega/vega/cmd/vega/node/node.go:412 +0x1a7
code.vegaprotocol.io/vega/cmd/vega/node.(*Command).startBlockchain(0xc0019c3c00, {0x7ffef0370e93?, 0x0?}, {0x0, 0x0}, {0x0, 0x0})
        /home/runner/work/vega/vega/cmd/vega/node/node.go:299 +0x39a
code.vegaprotocol.io/vega/cmd/vega/node.(*Command).Run.func1()
        /home/runner/work/vega/vega/cmd/vega/node/node.go:140 +0x7e
created by code.vegaprotocol.io/vega/cmd/vega/node.(*Command).Run
        /home/runner/work/vega/vega/cmd/vega/node/node.go:131 +0x6af
```

### Solution
The above problem is caused by wrong file permissions for `snapshot` database.

To verify: list all files in `<vega-home>/state/node/snapshots/snapshot.db/` and check that all files should be owned by the user that runs `data-node` service.

To fix: change the ownership of all files in that directory to the user that runs `data-node` service. and start the service again.

Possilbe cause of issue:
You could have run the follwing command from a different user, e.g. `root`:
```bash
# list all the local snapshots
sudo ./vega tools snapshot
```
