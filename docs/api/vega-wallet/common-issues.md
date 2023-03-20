---
title: Common issues
hide_title: false
sidebar_position: 6
---

## I can't connect to the local service

1. Verify the service has started successfully
2. Verify it's exposed of the host and port your application expect.

## An application is already served on...

Verify you don't already have a service running somewhere:

```bash
lsof -i :1789
```

..., grab the PID, and terminate the process:
```bash
kill -9 <PID>
```

Use `sudo` if there is no result. If it still doesn't show, use more advance tools to locate it, or simply reboot your computer.

## I can't connect using my long-living token

Be sure you start your service with the flag `--load-tokens`.

More details on ["Bootstrap local service" page](./how-to/bootstrap-local-service.md#8-start-the-service).

## My JSON-RPC requests always return `201 No Content`

Be sure to specify the `id` property in your JSON-RPC request.

More details on ["JSON-PRC basics" page](./reference/core/json-rpc-basics.md#json-rpc-api-introduction).


