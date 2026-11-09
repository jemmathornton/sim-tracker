"""The test server for the site tests (playwright.config.js starts it): site/ on 127.0.0.1:8011.

Python's own `-m http.server` only queues 5 waiting connections, and on Windows the rest are refused, so with several
test browsers opening the app at once some of its scripts failed to load. This one queues 128 and doesn't log.
"""
import functools, http.server, os, sys
SITE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'site')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8011


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass


if __name__ == '__main__':
    Server(('127.0.0.1', PORT), functools.partial(Quiet, directory=SITE)).serve_forever()
