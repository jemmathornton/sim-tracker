# Live site snapshot

This is a full offline copy of the live site as it stood on 13 Oct 2026. It was
taken from the published claude.ai artifact (version 1791846631-1ae4) and
includes the page, every published file and every picture in the gallery.

## What's here

| Path | Count | What it is |
|---|---|---|
| `index.html` | 1 (about 506 KB) | the page itself |
| `maps/` | 60 | world maps (full size plus `.thumb.jpg`) |
| `shots/` | 390 | lot screenshots, as `shots/<world>/<lot>/<name>.jpg` plus thumbs |
| `_blob/` | 203 + `index.tsv` | gallery pictures from the artifact's asset store, named by asset id with no file extension |

`_blob/index.tsv` lists each asset as `id<TAB>content type<TAB>size in bytes`.
The page references 200 of the 203 assets. The other three
(`145535e3…`, `749b0501…`, `8759f2ea…`) are in the store but not used by
the page. They are kept here anyway.

## Viewing it locally

```
cd live-site
python3 -m http.server 8000
```

Then open http://localhost:8000/.

The page loads gallery pictures from absolute `/_blob/<id>` paths, so you have
to serve it from this folder's root, as shown above. If you open
`index.html` directly as a file, or serve it from a parent folder, the gallery
pictures won't load. The maps and shots use relative paths.

The blobs have no file extension, so `http.server` sends them as
`application/octet-stream`. Browsers still render them in `<img>` tags.
