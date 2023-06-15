---
sidebar_position: 11
title: How to restart data-node from the network history
sidebar_label: Restart data-node from the network history
hide_title: false
---


## Why would you start/restart your data node from network history?

- Your data-node crashed
- You are starting a data node when the network has a lot of blocks, and replaying from block 0 is a long process (up to several days) 
- Your data-node state got corrupted.

## What is a network history?

A network history is a mechanism in the data node that allows sharing of parts of information between other data nodes in the network. For example, when you are interested in a specific period of data from the Vega network, you can use network history to download this data from other nodes **if they have it**. Usually, you are interested in the last few blocks required to start a new data node or a data node after a crash - in those cases, you do not need full the network history.

