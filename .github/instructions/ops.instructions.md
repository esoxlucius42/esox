# Privilege & Sudo Rules

## When you encounter permission errors

If a command fails with "Permission denied", "Operation not permitted", or exit code 1
due to a missing sudo password, **stop immediately and use `ask_user`** to explain what
is needed and ask how to proceed. Do NOT retry the same failing command in a loop.

Examples that require escalation:
- `kill` on a process owned by another user
- Writing to directories owned by root
- `systemctl` commands without a passwordless sudoers rule in place

## Privileged commands available without a password

The following `sudo` commands are configured passwordless for this project:

```
sudo systemctl start esox-app
sudo systemctl stop esox-app
sudo systemctl restart esox-app
sudo systemctl status esox-app
```

Use these to manage the running application. Do NOT use `nohup`, PID files, or
manual `kill` to manage the app — always go through `systemctl`.

## Deploying changes

To build and redeploy after code changes:
```bash
bash /home/esox/dev/java/esox/deploy.sh
```

This script builds the JAR with Maven and restarts the service via `sudo systemctl restart esox-app`.
