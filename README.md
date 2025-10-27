# Lab Queue (simple)

A small Flask app that provides:

- Student page (`/`) where a student enters a numeric ID to join the queue.
- Instructor page (`/instructor`) with a "Pop" button to remove the next student.
- JSON endpoints: `/join`, `/queue`, `/pop`.

This implementation uses an in-memory queue (no persistence). It's intended for small lab use.

How to run (macOS / zsh):

```bash
cd /Users/tea/Documents/eecs280/LabQueue
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
python3 app.py
```

Open `http://localhost:5000/` in a browser for students and `http://localhost:5000/instructor` for instructor.

Notes and next steps:
- No authentication — instructor page is unprotected; add auth if needed.
- Queue is in memory — restart clears it. Persist to a DB for durability.
- Consider WebSocket or Server-Sent Events for push updates instead of polling.
# LabQueue
