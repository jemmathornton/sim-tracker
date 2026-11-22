"""The test server for the site tests (playwright.config.js starts it): site/ on 127.0.0.1:8011.

Python's own `-m http.server` only queues 5 waiting connections, and on Windows the rest are refused, so with several
test browsers opening the app at once some of its scripts failed to load. This one queues 128 and doesn't log.

Since 22 Nov 2026 the page loads the family's shared code from Jemma's Journals at /family/ (her decision: one copy, in
JemmasJournals/site/family/), as the family server (tools/serve_all.py, port 8050) and the site online do, so this
server answers /family/... from there too (only files inside that folder; nothing else of the parent).
"""
import functools, http.server, os, posixpath, sys, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = os.path.join(ROOT, 'site')
FAMILY = os.path.join(os.path.dirname(ROOT), 'site', 'family')   # JemmasJournals/site/family (sim-world sits inside JemmasJournals)
PORT = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 8011


def family_file(path, family=FAMILY):
    """The file in the family folder that a /family/... address names, or None if it isn't one (or would leave the folder)."""
    p = urllib.parse.unquote(urllib.parse.urlsplit(path).path)
    if not p.startswith('/family/'):
        return None
    parts = [x for x in posixpath.normpath(p[len('/family/'):]).split('/') if x not in ('', '.')]
    if not parts or any(x == '..' or ':' in x or '\\' in x for x in parts):
        return None
    full = os.path.realpath(os.path.join(family, *parts))
    base = os.path.realpath(family)
    return full if full.startswith(base + os.sep) and os.path.isfile(full) else None


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


class Quiet(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if urllib.parse.urlsplit(path).path.startswith('/family/'):
            return family_file(path) or os.path.join(FAMILY, '__not-found__')   # an address outside the folder is simply not found
        return super().translate_path(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')   # always the latest shared code
        super().end_headers()

    def log_message(self, *a): pass


if __name__ == '__main__':
    Server(('127.0.0.1', PORT), functools.partial(Quiet, directory=SITE)).serve_forever()
