"""Copy Claude's notes on how Jemma likes to work into the project, so they're backed up on GitHub with everything else (19 Nov, her ask).

    python -X utf8 tools/sync_notes.py

Claude Code keeps them outside the project (C:\\Users\\Jemma\\.claude\\projects\\<this project>\\memory\\*.md; since the move to
Jemma's Journals, 21 Nov: C--Users-Jemma-Documents-JemmasJournals-sim-world, worked out from where the project is). This mirrors that
folder into claude-notes/: new and changed notes are copied, notes deleted there are deleted here (claude-notes/README.md stays).
The weekly Gallery refresh runs it before its automatic save. To restore on a new PC, copy claude-notes/*.md (not README.md)
back into that memory folder.
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, write_text


def memory_folder(root=ROOT):
    """Claude Code's memory folder for a project: its full path with every character that isn't a letter or digit turned into
    "-" (C:\\Users\\Jemma\\Documents\\JemmasJournals\\sim-world -> C--Users-Jemma-Documents-JemmasJournals-sim-world). Worked out
    from where the project is, so it follows a move (22 Nov review: it still read the old SimTracker folder after the move)."""
    return os.path.join(os.path.expanduser('~'), '.claude', 'projects', re.sub(r'[^A-Za-z0-9]', '-', os.path.abspath(root)), 'memory')


MEMORY = memory_folder()
OUT = os.path.join(ROOT, 'claude-notes')
KEEP = {'README.md'}


def sync(src=MEMORY, out=OUT):
    """Returns (copied, removed) file names. Does nothing if the memory folder isn't there (e.g. on another PC)."""
    if not os.path.isdir(src): return [], []
    os.makedirs(out, exist_ok=True)
    notes = {f for f in os.listdir(src) if f.endswith('.md') and f not in KEEP}
    copied, removed = [], []
    for f in sorted(notes):
        text = open(os.path.join(src, f), encoding='utf-8').read()
        dest = os.path.join(out, f)
        if not os.path.exists(dest) or open(dest, encoding='utf-8').read() != text:
            write_text(dest, text); copied.append(f)
    for f in sorted(os.listdir(out)):
        if f.endswith('.md') and f not in notes and f not in KEEP:
            os.remove(os.path.join(out, f)); removed.append(f)
    return copied, removed


if __name__ == '__main__':
    c, r = sync()
    print(f"Claude's notes: {len(c)} copied, {len(r)} removed" + (f" ({', '.join(c + r)})" if c or r else ""))
