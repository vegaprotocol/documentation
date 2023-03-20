---
title: How to troubleshoot
hide_title: false
sidebar_position: 6
---

## Troubleshoot the local service

### 1. A common issue?

Before going too far, verify your problem is not a [common issue](../../vega-wallet/common-issues.md).

### 2. Read the logs

#### 1. Locate the log folder

The best way to locate the log folder is to use the `vega` CLI:

```bash
vega paths list | grep WalletServiceLogsHome
```

It will output the paths to the log folder on your machine, for a given Vega home.

#### 2. Find the right log file

Each instance of the local service logs in a brand-new log file on every start up. The name of the log file is formatted as follows:

```
<YYYY>-<MM>-<DD>-<HH>-<MM>-<SS>-<PID>.log
```

**Example:** `2023-03-16-12-07-13-99563.log`

Sort by date, then pick the one with the PID matching the process you want to troubleshoot.

Or, if you know the PID, you can use the following command:

```bash
ls <LOG_FOLDER> | grep <PID>
```

#### 3. Read the log file

The content of the log file is in JSON. You can read it in combination with `jq` to make it clearer.

```bash
cat <LOG_FILE> | jq
```

