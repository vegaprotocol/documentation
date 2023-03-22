---
title: Common issues
hide_title: false
sidebar_position: 6
---

## Can't connect to the local service

1. Verify the service has started successfully
2. Verify it has exposed the host and port your application expects

## An application is already served on...

Verify you don't already have a service running somewhere using the following command:

```bash
lsof -i :1789
```

Then grab the PID, and terminate the process:

```bash
kill -9 <PID>
```

Use `sudo` if there is no result. If it still doesn't show, use more advanced tools to locate it, or as a final option, reboot your computer.

## Can't connect using long-living token

Make sure you start the service with the flag `--load-tokens`.

More details in the ["How to bootstrap the local service" guide](./how-to/bootstrap-local-service.md#8-start-the-service).

## My JSON-RPC requests always return '201 No Content'

Be sure to specify the `id` property in your JSON-RPC request.

More details on the ["JSON-RPC basics" page](./reference/core/json-rpc-basics.md#json-rpc-api-introduction).


