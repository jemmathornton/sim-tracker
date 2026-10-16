# Putting the site online, if she ever wants to (17 Oct, research only)

Nothing was changed: no app, data or tools, nothing uploaded, no accounts made. Web pages were read as reference only. Prices are as the hosts publish them (US dollars, roughly: $5 ≈ £4, $20 ≈ £15).

## Short answer

- **`site/` is nearly ready.** It would work on any web host as it is. It’s **102 MB in 743 files**, which fits every host below except a claude.ai artifact (511 files per version).
- **Private is possible for free** with **Cloudflare Pages + Cloudflare Access** (visitors type an email code; only addresses she lists get in) or GitLab Pages (visitors need a GitLab account). GitHub Pages and Neocities are always public. Netlify’s password costs $20 a month.
- **Before anything public:** take out other players’ comments and usernames, check with 20th Century Plumbob about showing the maps (their terms couldn’t be read from here), and add a line saying the site isn’t made or endorsed by EA.
- **Recommendation:** Cloudflare Pages with Access, private, uploaded by drag and drop. Details in §4.

## What’s in `site/` (checked 17 Oct)

| Part | Files | Size |
|---|---|---|
| Screenshots, full size (1920–2000px) | 233 | 56.1 MB |
| Screenshot thumbs | 233 | 9.9 MB |
| Maps, full size (about 3075px wide) | 30 | 25.7 MB |
| Map thumbs | 30 | 1.8 MB |
| Gallery pictures | 199 | 10.4 MB |
| Code and data (`data.js` 462 KB) | 5 | 0.6 MB |
| Icons | 13 | 0.2 MB |

Largest file: the Mt. Komorebi map, 1.3 MB. Six files aren’t used (3.6 MB): the full maps of the five worlds she doesn’t own (only their small pictures show) and `gallery/windenburg/von-windenburg-estate.jpg`.

**Works on a web host already:**
- Pages are `#` links inside one page, so no server set-up is needed. The data is inside `data.js`, nothing is fetched.
- Every path is relative, lowercase, with no spaces. All 719 picture links match their files exactly, capitals included. That matters: web servers treat `A.jpg` and `a.jpg` as different files, Windows doesn’t.
- No paths to her PC, no email address, and no hidden details in the pictures (no camera or location data; 51 Gallery pictures only carry a colour profile).
- The `?v=` fingerprints keep browsers off old copies online too. `site.css` must stay next to `index.html` (it already does).

**Things in it that belong to other people, or say something about her:**
- **34 Gallery comments by 33 other players**, with usernames and dates, shown on lot pages and in “Newest comments”.
- **Her own 3 Gallery replies** are in `data.js` too. The page hides them, but anyone online can open `data.js` and read everything in it.
- **Her Gallery username** (in 209 Gallery links) and her first name in the title. Her email isn’t anywhere in `site/`.
- **EA’s own text** (world blurbs, neighbourhood descriptions, highlights, weather, in-game lot names) and EA’s premade Sims, with links to the Sims Wiki.
- **30 maps from 20th Century Plumbob’s mod**, credited on every map and in the footer.
- **Fonts from Google Fonts**: each visitor’s browser contacts Google to fetch them.

## 1. Hosting choices

| Host | Cost | Limits | Updating from her PC | Private? | Own domain |
|---|---|---|---|---|---|
| **Cloudflare Pages** | Free | 20,000 files, 25 MiB a file, 500 uploads a month, no traffic limit | Drag the folder into the browser (up to 1,000 files, so 257 to spare) or the Wrangler command (needs Node.js, not installed) | **Yes, free:** Cloudflare Access emails a code to addresses she lists (free up to 50 people; sign-up may ask for a card even on the free plan) | Yes |
| **GitHub Pages** | Free | 1 GB site, 100 GB traffic a month (soft limits) | `git push` (Git is installed); the weekly task could push by itself | **No.** The free plan needs a public repository, and the site is public. Private sites need GitHub Enterprise | Yes |
| **GitLab Pages** | Free | 1 GB site, 400 build minutes a month, up to 5 members | `git push`, plus a small build file | **Yes, free:** only project members signed in to GitLab can see it | Yes |
| **Netlify** | Free: 300 credits a month. An upload costs 15, each GB of traffic 20 | About 4 weekly uploads plus about 11 GB of visits. When credits run out the site shows “Site not available” until the next month | Drag and drop, Git or command line | Only team members and invited reviewers on Free; a password needs Pro, **$20 a month** | Yes |
| **Neocities** | Free: 1 GB, 200 GB traffic. Supporter $5 a month: 50 GB | Free accounts take only common file types (ours are all fine) | Drag and drop in the browser, or its command line | **No**, it’s made for public personal sites | Supporter only |
| **claude.ai artifact** (how the site started) | In her Claude plan | 511 files a version (the site has 743), 255 an upload, 16 MB a page; extra pictures go in a separate store, as the old page did | Only through Claude: every update, weekly numbers included, is a Claude publish | **Yes**, private by default, can be shared with chosen people | No |

- Cloudflare now suggests its “Workers” for new projects. Pages still works, and the same folder goes up either way.
- An own domain costs about £5–15 a year from any registrar. Avoid “The Sims” or “Sims 4” in it: EA’s fansite terms rule out domains that copy its trademarks.

Sources: https://developers.cloudflare.com/pages/platform/limits/ ; https://developers.cloudflare.com/pages/get-started/direct-upload/ ; https://developers.cloudflare.com/pages/ ; https://www.cloudflare.com/en-au/products/cloudflare-access ; https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits ; https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site ; https://docs.gitlab.com/user/project/pages/pages_access_control/ ; https://docs.gitlab.com/user/gitlab_com/ ; https://www.netlify.com/pricing/ ; https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/ ; https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/ ; https://neocities.org/supporter . GitLab’s 400 minutes and 5 members come from third-party summaries; Cloudflare’s card question is unsettled (sources disagree).

## 2. Privacy and rights

- **Her screenshots, builds and Gallery pictures:** hers to show. EA’s content policy lets fans use game content “for personal uses or personal projects, including fan sites”, as long as nothing is sold or put behind a paywall (Patreon-only counts). Passive ads are allowed.
- **EA’s names, text and premade Sims:** covered by the same policy, as a free fan site. EA’s formal notice is only required when using its Fan Art Kit (logos, renders), which the site doesn’t. A short footer line is still good manners: not affiliated with or endorsed by Electronic Arts; The Sims is a trademark of Electronic Arts Inc.
- **“Data mining”:** EA’s policy asks fans not to get assets by data mining. The site shows text read from the game’s files (descriptions, weather, highlights, lot traits), but all of it is visible in the game, nothing is unreleased and no game art is taken. Low risk, worth knowing.
- **20th Century Plumbob’s maps:** a free mod on Patreon. No terms turned up in searches or in the mod folder, and Patreon blocks automated reading, so the posts themselves weren’t read. The site shows the whole map at the mod’s full size, credited. Fine while private. Before going public, she should read the “Map Replacement” directory post on their Patreon for terms, or send them a short message asking. If the answer is no, a public version would need another plan for the map banners (no AI art).
- **Other players’ comments:** EA’s User Agreement lets other users use Gallery content on EA’s own service only; nothing covers copying it onto her site. Usernames also count as personal data under UK data law. Fine on a private site. On a public one: leave out the names (or the comments) and show counts with a link to the Gallery.
- **Her Gallery username:** already public on the Gallery. Linking the site to it is her choice.
- **Lucide icons:** the ISC licence asks for its short copyright and licence notice to go with copies. `icons.js` only says “ISC licence”, so a licence file next to it would cover it.
- **Fonts:** both have free licences (OFL). Loading them from Google tells Google each visitor’s address. Keeping the two fonts in `site/` avoids that, and would make the app work offline too.

Sources: https://help.ea.com/au/articles/security-and-rules/ea-content-policy/ (via search; the page itself timed out) ; https://www.ea.com/en-gb/games/the-sims/fan-art-kit ; https://www.ea.com/legal/user-agreement ; https://www.patreon.com/20thCPlumbob/posts/map-replacement-134087179 (found, couldn’t be read) ; https://simscommunity.info/2025/07/09/sims-4-custom-map-replacements-2025/

## 3. What would need changing first (list only)

1. **Upload `site/` only, never the whole project.** The tools, notes and `data/` hold paths to her PC and details from her saves. For GitHub or GitLab that means a separate repository with just `site/` in it.
2. **The weekly Gallery refresh** rebuilds the site on her PC only. It would need an upload step afterwards (Wrangler, `git push`, or her dragging the folder in), otherwise the online numbers stay where they were.
3. **Public only:** a build that leaves other players’ comments and usernames, and her hidden replies, out of `data.js`. Hiding them on the page isn’t enough.
4. **Public only:** a look through what else `data.js` holds (planning notes such as “To be decided”, unshared lots, in-game names) to be sure she’s happy for anyone to read it.
5. **Notices:** EA line in the footer, Lucide licence file. The map credit is already there.
6. **Optional:** keep the two fonts in `site/` instead of Google. A “don’t list me” note for search engines if public but low-key (only a password really keeps it private).
7. **Optional slimming:** maps could be smaller for the web (they’re about 3075px wide, 25.7 MB together), screenshots too. Leave out the 6 unused files (3.6 MB).
8. **claude.ai only:** 743 files is over the 511 a version, so the pictures over the limit would have to go in the separate store and the build would have to write their new addresses.
9. **Small things:** a bookmark or shortcut for the online address. “New since you looked” starts afresh online (each browser remembers on its own). The phone layout is still parked, worth knowing if the point is seeing it on her phone.
10. **A bonus:** on a proper `https` address Chrome can install the site as an app, which is the reliable fix for the blurry taskbar icon (`research/taskbar-icon.md`; needs a small web manifest; untested behind Cloudflare Access).

## 4. Recommendation

- **For her alone there’s no need to go online.** The app on her PC already does everything.
- **To see it on other devices, or show a few friends: Cloudflare Pages with Cloudflare Access.** Free, room to grow (20,000 files against 743), private by email code, and the first upload is drag and drop with nothing to install. Weekly numbers: drag the folder in again whenever she likes, or later the refresh could upload by itself (needs Node.js installed; ask her first).
- **Public:** the same host without Access, but only after the three things in the short answer: comments and usernames out, a yes (or no terms) from 20th Century Plumbob, and the EA line.
- **Not recommended:** a claude.ai artifact (over its file limit, and every update goes through Claude), Netlify (password costs $20 a month; a free site can pause), GitHub Pages and Neocities (public only).
