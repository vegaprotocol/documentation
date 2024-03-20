---
title: Troubleshoot issues
hide_title: false
sidebar_position: 6
---

## Troubleshoot the local service

### Is it a commonly seen issue?
Before going any further, verify your problem is not in the list of [common issues](../../vega-wallet/common-issues.md).

### Check the logs

#### 1. Locate the log folder

The best way to locate the log folder is to use the Vega CLI:

```bash
vega paths list | grep WalletServiceLogsHome
```

The output will be the paths to the log folder on your machine, for a given Vega home.

#### 2. Find the right log file

Each instance of the local service creates a brand new log file on every startup. The name of the log file is formatted as follows:

```
<YYYY>-<MM>-<DD>-<HH>-<MM>-<SS>-<PID>.log
```

**Example:** `2023-03-16-12-07-13-99563.log`

Sort by date, then pick the one with the process ID matching the process you want to troubleshoot.

Or, if you know the PID, you can use the following command:

```bash
ls <LOG_FOLDER> | grep <PID>
```

#### 3. Read the log file
The content of the log file is in JSON. Optionally, you can read it in combination with `jq` to make it clearer.

```bash
cat <LOG_FILE> | jq
```

