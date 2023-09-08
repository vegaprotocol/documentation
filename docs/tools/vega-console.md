---
title: Console
vega_network: TESTNET
hide_title: false
description: Vega Console build instructions and IPFS hosting
---
[Vega Console ↗](https://console.vega.xyz) is a user interface designed for using the Vega protocol software to interact with markets. See existing markets, place trades and see your portfolio and positions.

If you’re interested in running Console locally, check out [the Community Guides section for instructions](../tutorials/community-created#self-hosting-console). The following section will guide you to hosting Console on IPFS.

## Hosting Console on IPFS
IPFS, the [Interplanetary File System ↗](https://ipfs.tech) is a decentralised file storage system. Hosting Vega Console on IPFS involves ‘pinning’ a JavaScript bundle that contains the dApp. Everyone who pins an identical version of the Console ensures the bundle is quick to retrieve for any user wherever they are. IPFS ensures the dApp has not been tampered with.

For either approach, you'll need:
- [Docker ↗](https://docs.docker.com/engine/install/) - run Virtual Machines in order to standardise the build environment
- [IPFS ↗](https://docs.ipfs.tech/install/) - host content on the Interplanetary File System

### Quick start

Every time a version of Console is ready for a release, a docker image containing a deployment bundle gets built. This gets pushed to [Dockerhub with a tag of `mainnet` ↗](https://hub.docker.com/r/vegaprotocol/trading/tags?page=1&name=mainnet).

```shell
# Fetch the latest tagged version
docker create --name vega-ipfs vegaprotocol/trading:mainnet
# Pull the files out of the build image
docker cp vega-ipfs:/usr/share/nginx/html .
# Add the files to your local IPFS node, and show the build's IPFS CIDv0 ¹
ipfs add -rQ html
# Start IPFS node
ipfs daemon
```
> **¹**  The IPFS CIDv0 & CIDv1 are shown on each individual release page. For example: [v0.20.24-core-0.71.6 ↗](https://github.com/vegaprotocol/frontend-monorepo/releases/tag/v0.20.24-core-0.71.6))

You have joined the swarm of nodes making the Console available on IPFS!

### Build from scratch

If you don’t want to depend on the Dockerhub image and instead want to build it from scratch, you can run the same build process locally. 

To provide reproducible builds, Console uses another Docker file that ensures that builds are consistent. Specifically this allows for identical JavaScript dependencies, build tools versions, and CPU architecture. Changes to **any** of those factors will produce a slightly different JavaScript bundle, which would produce a different IPFS CID.

```shell
# Get the source for Console and its related libraries
git clone https://github.com/vegaprotocol/frontend-monorepo
# Move in to the folder
cd frontend-monorepo
# Show the IPFS CIDv0 of the build. It should match the one on the release page¹
git checkout v0.20.24-core-0.71.6

# Build the Console application within the standardised build container 
docker build --build-arg APP=trading --build-arg NODE_VERSION=16.5.1 --build-arg ENV_NAME=mainnet -t vega-ipfs -f docker/node-inside-docker.Dockerfile .
# Show the IPFS CIDv0 of the build. It should match the one on the release page²
TAG=vega-ipfs make recalculate-ipfs

# Pull the files out of the build image
TAG=vega-ipfs make eject-ipfs-hash
# Add the files to your local IPFS node
ipfs add dist
# Start IPFS node
ipfs daemon
```

> **¹**  Find the tag want on the Vega front-end monorepo [Releases page ↗](https://github.com/vegaprotocol/frontend-monorepo/releases), or by running:
> ```shell
> git describe --tags $(git rev-list --tags --max-count=3)
> ```
> 
> **²**  The IPFS CIDv0 & CIDv1 are shown on each individual release page. For example: [v0.20.24-core-0.71.6 ↗](https://github.com/vegaprotocol/frontend-monorepo/releases/tag/v0.20.24-core-0.71.6))

This is like the [Quick Start version above](#quick-start), but the whole process happens on your machine, in a standardised build container. It will take a little longer than the Quick Start version. Inspect the details of the build container by [viewing `docker/node-inside-docker.Dockerfile` ↗](https://github.com/vegaprotocol/frontend-monorepo/blob/develop/docker/node-inside-docker.Dockerfile).
