# Why the taskbar icon is blurry, and what fixes it (16 Oct, research only)

> Out of date since 22 Oct: fixed (her check) without the local server: the shortcuts now carry the app’s own taskbar id (19 Oct).

Nothing was changed: no shortcut, no file, no setting. Sources are at the end of each section. Web pages were read as reference only.

## Short answer

- **It's Chrome, not Windows' icon cache, so a restart probably won't help.** A plain `chrome.exe --app=…` window gives Windows a picture made from the page's **16px favicon**. It ignores the bigger icons the page links to and never uses the shortcut's `icon.ico`. Windows then stretches that small picture up to taskbar size.
- **Her screen makes it worse.** Her PC runs at **200% display scaling** (3200 × 2000 screen). At 200% the taskbar wants a 48px icon, so a 16px (at best 32px) picture is stretched two to three times.
- **The reliable fix is making it an installed Chrome app.** Chrome then builds its own icon file from big pictures (up to 256px), its own shortcuts and its own taskbar identity. That needs the site served from `http://127.0.0.1:<port>` instead of `file://`, plus a small web manifest.
- **The cheaper trick (untested):** give her own shortcut the same taskbar ID (AppUserModelID) that Chrome gives the window, then pin that shortcut. The taskbar button should then show `icon.ico`. Alt+Tab and the window's title bar would still show the small favicon.

What her PC has (checked 16 Oct, read only):
- Display scaling: 200% (AppliedDPI 192).
- Chrome: 155, in Program Files, one profile ("Default"). It already has a few installed web apps, so she's seen what one looks like.
- Pinned to the taskbar: only File Explorer and Chrome. "Jemma's Sim World" isn't pinned. So the button she sees is the running window's own icon, which comes from Chrome.
- Last restart: 14 Oct. The icon cache files were last written 16 Oct, 18:07.

## 1. How Chrome picks the icon for a plain `--app` window

- **The window icon is the favicon.** Chrome's window code uses the app's own icon only for installed apps. Any other app window gets the current page's favicon.
- **The favicon is a 16px icon.** Chrome looks at every `<link rel="icon" sizes=…>` but only to choose the best source for a 16 "device-independent" pixel favicon: 16px at 100%, 32px at 200%. Our 48, 64, 96 and 192px links don't make it any bigger.
- **Windows gets that picture stretched.** Chrome sets the window's small and big icons by resizing the favicon to Windows' sizes (the big one is 64px at 200%). So the big icon is an upscaled favicon, which is the blur she sees.
- **The shortcut's `.ico` is only for the shortcut.** For `--app` windows Chrome sets no "relaunch icon", so Windows has nothing better to show for the running window.
- **Its own taskbar ID.** Chrome gives each `--app` window its own AppUserModelID (AUMID), made from the page's host and path. That's why it gets a taskbar button apart from Chrome's, but one that doesn't match her shortcut.
- **Others have the same problem.** Python's Eel apps, which open Chrome the same way, report the same blurry taskbar icon, with no fix.

Sources: Chromium source `chrome/browser/ui/views/frame/browser_view.cc` (GetWindowIcon), `components/favicon/core/favicon_handler.cc`, `ui/views/win/hwnd_message_handler.cc` (SetWindowIcons), `chrome/browser/ui/views/frame/browser_window_property_manager_win.cc`; https://chromium.googlesource.com/chromium/src/+/main/docs/windows_shortcut_and_taskbar_handling.md ; https://github.com/python-eel/Eel/issues/304

## 2. Windows' side: scaling and the icon cache

- **Sizes Windows wants on the taskbar:** 24px at 100%, 30 at 125%, 36 at 150% and 48 at 200%. Title bars want 16 to 32px. Our `icon.ico` has all of these, but only shortcuts and pinned buttons use it.
- **A pinned shortcut beats the window's icon.** When a running window's taskbar ID matches a pinned shortcut, Windows shows the shortcut's icon on the button. With no match, it shows the window's own icon, which is the blurry favicon here.
- **The icon cache** (`%LOCALAPPDATA%\Microsoft\Windows\Explorer\iconcache_*.db`) can keep an old shortcut icon until a restart or a rebuild (`ie4uinit.exe -show`). That matters for the Desktop and Start menu shortcuts after the icon changed. It isn't why the running window is blurry. A restart is still worth a look for the shortcuts themselves.

Sources: https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-construction ; https://learn.microsoft.com/en-us/windows/win32/properties/props-system-appusermodel-relaunchiconresource ; https://learn.microsoft.com/en-us/windows/win32/shell/appids ; https://elevenforum.com/t/rebuild-icon-cache-in-windows-11.2049/

## 3. Making it an installed Chrome app

### What's needed

1. **A local web server.** Chrome won't install a `file://` page; `http://localhost` and `http://127.0.0.1` count as safe. Python's built-in server is enough: `pythonw.exe -m http.server 8765 --bind 127.0.0.1 --directory site`. `pythonw` runs without a console window and is already in her Python folder.
   - **Bind to 127.0.0.1** so only her own PC can reach it. Without `--bind` it listens on her whole network.
   - **Use a fixed port that nothing else uses.** 8000–8002 are the preview servers, so e.g. 8765. The app is tied to the exact address: `localhost` and `127.0.0.1`, or a different port, would count as a different app.
   - **Better: a small `tools/serve.py`** (standard Python, nothing to install) that does the same and also tells the browser not to keep stale copies of `index.html` ("Cache-Control: no-cache"). Python's plain server lets Chrome reuse `index.html` for a while by its own rules. After a rebuild, that could show old data until a reload. Pictures and code are safe already, because they carry `?v=` fingerprints.
2. **A web manifest** (`site/manifest.webmanifest`) and one line in `index.html` linking it. It needs the name ("Jemma’s Sim World"), a short name, `start_url` (`./`), `display: "standalone"`, the theme colour (`#2A1D40`, which also colours the window's title bar) and the icons. At least 192 and 512px; better, every size `make_icons.py` already draws, so Chrome uses a properly drawn picture for each size rather than shrinking the 512.
3. **A service worker isn't needed** to install from Chrome's menu (dropped in Chrome 112). Without one, Chrome shows its own "you're offline" page if the server isn't running. Not worth adding: caching 100 MB of pictures would also make data refreshes harder.

### Installing (she does this herself, once)

With the server running, she opens `http://127.0.0.1:8765/` in Chrome and clicks the install icon at the right of the address bar (or ⋮ › Cast, save and share › Install page as app). Chrome then:
- makes its own icon file in her Chrome profile (`Web Applications\_crx_<id>\…ico`), with sizes from 16 to 256px, each made from the nearest manifest picture;
- makes Desktop and Start menu shortcuts that run `chrome_proxy.exe --profile-directory=Default --app-id=<id>`, with the app's own taskbar ID, so the running window, its shortcut and a pinned button all match and all show the sharp icon;
- lists it under chrome://apps, where it can be uninstalled at any time.

### Who starts the server

Chrome's own Start menu entry and taskbar pin open the app directly. If the server isn't running, she gets Chrome's offline page. Two ways round it:
- **A sign-in task (recommended):** a Windows task, like the weekly Gallery task, starts the server hidden whenever she signs in. It uses almost nothing and serves only the `site` folder to her own PC. Every shortcut then just works.
- **A launcher shortcut:** `make_shortcuts.ps1` makes shortcuts that start the server if it isn't running, then open the installed app (`chrome_proxy.exe … --app-id=<id>`). This works only from those shortcuts, not from Chrome's own entries or a pin made from the running window.

### What she would see

The same site in its own window, with no address bar (as now). The title bar would be in the site's purple, with a small ⋮ menu. The app would have its own Start menu entry and a sharp taskbar icon, pinnable. Opening it would feel the same as today.

### Pros

- A sharp icon on the taskbar, in Alt+Tab and in the title bar, at every scaling.
- Proper Start menu and taskbar entries that Chrome keeps up to date.
- An `http` address is how the site would run online later, so the manifest is a step towards that, not throwaway work.

### Cons

- It depends on a tiny Python server running (a sign-in task, or the launcher). If it's not running, she sees an offline page.
- **"New since you looked" starts afresh once.** The browser keeps what she's seen per address, so the record kept under `file://` isn't carried over to `http://127.0.0.1:8765`.
- The app belongs to her Chrome profile. If Chrome is reset or the profile is removed, she reinstalls it (one click).
- A few more moving parts: a manifest, a server script, a task. Her opening the site from the folder (`index.html`) still works as before.
- Changes to Windows set-up (a sign-in task, installing an app) need her OK, and the install is a click she makes herself.

Sources: https://chromium.googlesource.com/chromium/src/+/main/docs/webapps/concepts.md ; https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_Installable ; https://web.dev/articles/install-criteria ; https://developer.chrome.com/blog/update-install-criteria ; https://developer.chrome.com/blog/how_chrome_helps_users_install_the_apps_they_value ; https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/windows_pwa_integration.md ; Chromium source `chrome/browser/web_applications/os_integration/web_app_shortcut_win.cc`; https://docs.python.org/3/library/http.server.html

## 4. Simpler alternatives

- **Match the shortcut's taskbar ID to the window (no server, untested).** While the app window is open, read its AUMID with a short PowerShell script; this reads only. Then write the same ID into her "Jemma's Sim World" shortcut (`System.AppUserModel.ID`), and pin that shortcut from the Start menu. The running window should then group under the pinned button, which shows `icon.ico`.
  - Fixes only the taskbar button: Alt+Tab and the title bar keep the blurry favicon.
  - The ID is built from the page's path, so it breaks if the project folder moves. A Chrome update could change how the ID is made.
  - Worked out from Chromium's code, but not tried on her PC. Chrome itself sometimes rewrites the ID on pinned `--app` shortcuts to match, but only now and then, so that can't be relied on.
  - Needs her OK, as it changes her shortcuts.
- **Edge** (`msedge.exe --app=…`) runs the same Chromium code, so I'd expect the same blur. Not worth switching for this.
- **A restart or rebuilding the icon cache** may sharpen the Desktop and Start menu shortcut icons. It shouldn't change the running window. It costs nothing, so the TODO check after her next restart can stay, but expect it not to fix the taskbar.
- **Bigger favicons in the page** don't help: Chrome only ever makes a 16px favicon from them.
- **Chrome flags:** `--app-id` works only for installed apps; there's no flag that sets a plain `--app` window's icon.
- **"Create shortcut… Open as window"** is now "Install page as app", which is the installed app above, and doesn't work on `file://` either.

## Recommendation

Make it an **installed Chrome app**, served from `http://127.0.0.1:8765`:
- a small `tools/serve.py` (no-cache for `index.html`), started hidden by a Windows sign-in task;
- `site/manifest.webmanifest` with every icon size;
- she clicks Install once;
- `make_shortcuts.ps1` changed to open the installed app, or just use Chrome's shortcuts.

It's the only fix that is certain and covers the taskbar, Alt+Tab and the title bar. It's also a step towards putting the site online.

If she'd rather not have a server running, try the **shortcut taskbar ID** trick first: it's quick to try and easy to undo, but it's untested and fixes the taskbar button only.

Either way it's her call (TODO §0). The task, the install and any shortcut change need her OK first.
