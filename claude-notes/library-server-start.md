---
name: library-server-start
description: "Restart Jemma's library server only through explorer.exe and its Startup shortcut, never from Claude's shell"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 685a58b9-e30d-4ad0-8d37-bec5690d9700
  modified: 2026-10-31T23:49:24.246Z
---

Jemma's library app (Documents\HomeLibrary) needs its server, tools/serve.py on localhost:8020, to be running. If it is restarted from Claude's own shell (Start-Process, or running pythonw directly), it belongs to Claude's session and stops when that session ends. The app then stops working for her; this happened on 31 Oct 2026.

**Why:** a server started from Claude's shell is part of Claude's process tree, so it dies with the session.

**How to apply:**
- Restart the server with `explorer.exe "<Startup>\Jemma's Library server.lnk"`, so that Windows owns it.
- Check that its parent process is explorer.exe.
- A scheduled task to keep it running was blocked by auto mode (persistence). Only make one if she asks and allows it.
