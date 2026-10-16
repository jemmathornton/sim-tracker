# Weekly Gallery refresh: health check (17 Oct, research only)

Before its first run on its own (Sunday 18 Oct, 08:54). Nothing was changed: no app, data, tools or Windows settings, and the refresh wasn’t run. Read: `tools/gallery_refresh.py`, `tools/common.py`, `tools/build.py`, the Windows task (read only), `logs/gallery-refresh.log`, the Gallery data files and git history.

## Short answer

- **It should run on Sunday** if the laptop is on and she’s signed in. Asleep or off is fine too: it doesn’t wake the laptop, but it runs soon after she next wakes it or signs in.
- **Her past numbers are safe in almost every failure** (no internet, EA down, rate limits, a deleted upload): the script either stops before writing anything or keeps last week’s numbers for the uploads it couldn’t read.
- **One real bug:** if a *new* upload is listed but can’t be read, the run stops after saving the numbers but before linking lots and rebuilding the site.
- **Two quiet risks:** if EA renames a field, favourites, downloads or comments would be saved as 0 without a warning; and a run by hand during the Sunday run isn’t stopped.
- **It doesn’t commit to git.** Sunday’s results stay uncommitted until the next session.
- **Clock change:** the start time was saved with the summer-time offset, so from 25 Oct it will probably run at 07:54. Harmless.

## 1. What a run does

1. Lists every upload a Gallery search for “JemmaTheSimmer” finds (EA’s public API at `drop-api.ea.com/ugx/the-sims-4`, no sign-in; 24 a page, about 10 pages).
2. Reads every upload it already knows plus each new one (226 now): title, type, lot type, size, price, beds, baths, packs, pictures, favourites, downloads, creator, and all comments. About 460 calls, with short pauses. Each call waits up to 30 seconds and is tried 3 times.
3. Saves `data/gallery/uploads.json` and `comments.json`, then rewrites `history.csv` (a second run on the same day replaces that day’s rows).
4. Links each new lot or room upload whose title names exactly one lot (a world hashtag breaks ties) into `data/worlds/<world>.json`. Anything else goes into `unlinked.json` with a reason. Households are skipped. `unlinked.json` is rewritten every run, even with nothing new.
5. Adds a Gallery picture (`site/gallery/<world>/<lot>.jpg`) for linked lots with no screenshots and no picture yet.
6. Runs `tools/build.py` (rewrites `site/js/data.js`).
7. Adds a short report to `logs/gallery-refresh.log`, even after an error (but not if the process is killed). It reports success only if every upload was read and the build worked.

It touches nothing outside the project and never runs git.

## 2. When things go wrong

| Situation | What happens | Her data |
|---|---|---|
| No internet, or EA down, at the start | The listing fails after 3 tries; “Stopped with an error” in the log | Nothing written. Safe |
| EA fails partway | Uploads it can’t read keep last week’s numbers; the log says how many, not why | Safe; that week’s history has fewer rows |
| Rate limit (EA says “too many requests”) | Treated like any error: 2 quick retries (2 s, 4 s), no waiting as long as EA asks | As above. Never happened so far |
| EA changes the listing, or shows a maintenance page | Stops with an error | Nothing written. Safe |
| EA renames a field on the upload page | Missing title or type: that upload counts as failed (safe). Missing favourites, downloads, pictures or comments: **saved as 0 or empty, no warning** | That week overwritten with zeros; recoverable from git |
| An upload is deleted | Marked “gone” only if EA answers “not found”. EA seems to keep answering: the Asphalt Abodes copy she removed on 13 Oct dropped off the listing but still answered on 14 Oct, so it was never marked, and its numbers (1 favourite, 26 downloads) are still in the totals. The site doesn’t use “gone” anyway | Safe; totals slightly high |
| New upload whose title names no lot, or several | Goes into `unlinked.json` (“no lot in the plan has this name” or “could be …”), one log line | Safe. Not shown in the app; she only finds out from the log or a session |
| New upload of a lot that already has one | Linked as a second upload; the site shows the more popular copy (usually the old one) until a session sorts it, as with Midtown Meadows on 14 Oct. The log doesn’t say it’s a second copy | Safe, but goes against “the latest” until sorted |
| New upload listed but unreadable (EA hiccup, or deleted between listing and reading) | **Bug:** crash in the linking step, after the numbers are saved. No links, no pictures, no rebuild | Safe, but the site isn’t rebuilt. If that upload stays unreadable, every Sunday stops the same way |
| Laptop asleep or off at 08:54 | Not woken (the task doesn’t wake it, and wake timers are off in her power plan). “Run as soon as possible after a missed start” is on, so it runs after she wakes it. History gets that day’s date | Safe |
| Signed out at 08:54 | The task runs only while she’s signed in; it catches up after she signs in | Safe |
| No network at that moment | The task waits for a network | Safe; the least certain catch-up |
| Laptop sleeps during a run | The run pauses; some calls may time out after waking, so those uploads keep last week’s numbers | Safe |
| Two runs at once | Windows won’t start a second copy of the task. A hand run (a session, or `python tools/gallery_refresh.py`) during the Sunday run isn’t stopped: both write the same files and the last one wins. A new upload can be linked twice (its comments then count twice on that lot) | Small risk |
| Power cut or crash while a file is being written | Files are emptied and rewritten in place, so a cut at that moment leaves a broken file. Later runs and `build.py` then stop until it’s restored from git | Very short window (all data files were written within a hundredth of a second on 14 Oct), but `history.csv` and `unlinked.json` (her reasons) can’t be fetched again |
| Run longer than 45 minutes | Windows stops it. Most likely while still reading, so nothing written, but **no log entry** either (the report is written only at the end) | Safe, but silent |
| Listing never ends (if EA ever ignores the page number) | Keeps asking until EA refuses or Windows stops it at 45 minutes | Nothing written; possibly silent |

## 3. Ways it could lose or spoil data (most likely first)

1. **Silent zeros** after an EA change (above). Nothing checks that the numbers look sensible.
2. **Uncommitted results lost.** After Sunday, `data/gallery/*`, `site/js/data.js` and maybe a world file and new pictures sit uncommitted. A session that throws away changes or switches branch would lose that day’s history rows for good (EA can’t give that day’s numbers again). A session could also sweep them into an unrelated commit. It writes into whatever is checked out in the main folder.
3. **A lost link.** If another program (e.g. a session) saves a world file it read before the refresh linked an upload there, the link is overwritten. The upload is no longer “new”, so it’s never retried and isn’t in `unlinked.json` either. Checked today: every upload is on a lot or in `unlinked.json`, except the six household uploads (by design).
4. **A doubled link** from two runs at once.
5. **A broken file** after a power cut mid-write.
6. **A stranger’s upload taken as hers.** The listing is a text search for her name and the creator isn’t checked. If someone credits “JemmaTheSimmer” in their own upload, it would be counted as hers and linked if its title matches a lot. Today: 218 uploads by JemmaTheSimmer, 8 by lilsimsie (her shell-challenge uploads).
7. **Wrong auto-links.** 2 of the 7 so far were undone by hand: Hallow Slough (SoupShell) and Bubble World.

## 4. The Windows task (read 17 Oct)

| Setting | Value | Note |
|---|---|---|
| When | Weekly, Sunday 08:54, from 13 Oct | Next run 18 Oct 08:54 |
| Program | `…\Python313\pythonw.exe -X utf8 "…\tools\gallery_refresh.py"` | No window. Same Python as the other tools; Pillow 12.3.0 is in Python’s own folder (checked with the user folder switched off) |
| Start in | The project folder | The script uses full paths anyway |
| Runs as | Jemma, only while signed in, normal rights | “Run whether user is logged on or not” is off |
| Wake the computer to run | Off | Her power plan also has wake timers off (mains and battery) |
| Run as soon as possible after a missed start | On | |
| Only if a network is available | On | |
| On battery | Allowed, and not stopped on battery | |
| Stop if it runs longer than | 45 minutes | Normal run about 6–8 minutes |
| If already running | Don’t start another | |
| Retry on failure | No | |
| Last run | 13 Oct 18:53:18, result 0 (success), started by hand | Never yet started by its own schedule |
| Missed runs | 0 | |
| Windows’ task history | Off | Only her log and “last run” show anything |
| Start time saved as | `2026-10-13T08:54:00+01:00` | With an offset, Windows keeps it at the same UTC time, so probably 07:54 once clocks go back on 25 Oct |

Her laptop sleeps after 60 minutes idle on mains, 3 minutes on battery.

## 5. The log

| Run | How | Result |
|---|---|---|
| 13 Oct 18:27 | By hand, without the build | OK: 221 uploads, 2 new linked (both later undone by hand). About 8 minutes (committed 18:35) |
| 13 Oct 18:46 | Probably the task | Stopped: Pillow not found. Fixed that evening by installing it into Python’s own folder |
| 13 Oct 18:53 | The task (matches its last run time) | OK, site rebuilt |
| 14 Oct 20:29, 20:44, 21:51, 21:59 | By hand, during sessions | All OK; 5 new uploads linked, 1 picture added. The 21:59 run took about 6½ minutes (files saved 22:05:29; linking and the build took under a second) |

No warnings so far: no failed uploads, nothing “no longer on the Gallery”, nothing unlinked. Since 14 Oct one stored upload has been off the listing (probably the removed Asphalt Abodes copy). The log has start times only, no end times or durations, and lives in `logs/`, which git ignores (not backed up).

## 6. What to look at after Sunday

- `logs/gallery-refresh.log`: a “Gallery refresh, 18 Oct 2026” block ending in “Wrote site\js\data.js …”, with no “couldn’t be fetched” and no “Stopped with an error”.
- The app’s home footer: “Gallery numbers as of 18 Oct 2026”.
- Rockridge Springs’ new rental upload should be linked now (TODO §2 expects it).
- `Get-ScheduledTaskInfo`: last run 18 Oct, result 0. Result 1 means some uploads weren’t read or the build failed; any other number means it didn’t start (e.g. Python missing).
- Next run: 25 Oct at 07:54 or 08:54 (settles the clock-change question).
- `git status`: commit the refresh’s files on their own (“Weekly Gallery refresh, 18 Oct”) before other work.

## 7. Suggestions (her call, or for later)

**Obvious bug** (fine to fix straight away under her rules, in a session that isn’t research only):
- In the linking step, skip new uploads that weren’t read. One line.

**Safer writing:**
- Write each file to a temporary copy, then swap it in, so a power cut can’t leave a broken file.
- A lock file, so a hand run and the Sunday run can’t overlap.
- A sense check before saving: if favourites or downloads drop by more than a tenth on last week, or every comment vanishes, keep last week’s numbers and say so in the log.
- Stop the listing after 30 pages, or when a page brings nothing new.

**A more useful log:**
- A “started” line straight away, and the time taken at the end.
- Why uploads failed (at least the first error).
- Which stored uploads have dropped off the listing (probably deleted).
- When a new upload joins a lot that already has one (“needs her choice”).

**Needs her judgement:**
- Auto-link only uploads by JemmaTheSimmer (and lilsimsie, for her shell-challenge uploads); list anyone else’s in `unlinked.json`.
- Let the refresh commit its own files after each run, or leave that to the next session.
- A notice in the app when the last refresh failed or is more than 8 days old (e.g. by the footer date, or on Stats → On the Gallery), perhaps with new unlinked uploads listed for her. Wording and place her call.
- Task settings: start-when-available is already on. Wake-to-run isn’t worth it on a laptop (it would also need wake timers on). To keep 08:54 all year, the start time could be saved without the offset. “Run whether logged on or not” isn’t needed (and would store her password).
- The old claude.ai task “Weekly Gallery stats refresh” is still on her list to turn off (TODO §0). It only updated the old claude.ai page, so it can’t clash with this one. It couldn’t be seen from here.
