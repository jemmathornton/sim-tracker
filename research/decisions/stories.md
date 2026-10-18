# Household bios and timelines: what to decide (18 Oct)

**In short**
- EA’s bios are in your game’s own text, but we can only link 3 of the 101 EA households on the site to theirs so far (about 74 more look findable). Your own households have almost no bios: 2 of your Library households on the site have one, and they’re short.
- The household page already has a “Their story” slot, just below the family tree; it stays hidden until there’s something in it.
- My suggestion: start with a bio only (yours, with EA’s in a few words of our own underneath), and add a short timeline later for the households you actually play.

Builds on `research/household-stories.md` and the prototype `for-jemma/prototypes/stories/index.html` (the Montys and the Goths).

---

## 1. What text there is

| Source | What’s there | How many |
|---|---|---|
| EA’s households, in the game’s English text | A 2–3 sentence bio for each family (checked: the Goths, the Landgraabs) | 101 EA households on the site. **3** are linked now (BFF, Landgraab, Spencer-Kim-Lewis). A rough name match finds likely text for **about 74** more. The other 27 (e.g. Caliente, Capp, Benali, Bjergsen, Broke) need checking. |
| Your Library (household files) | The bio box you can fill in when you save a household | 5 of your 56 Library households have one (Henley twice). **2 are on the site** (Henley, Watson-Holmes), and they’re 18 words and 1 word long |
| Your Gallery household uploads | The same bio box | 1 of 6 (“Spectra”, Ella leaving home) |
| Your plan, TODO.md and chat | Notes like “from Ondarion”, the Montys’ move, the Cadberry legacy | Bits for maybe 10–15 households |

The EA link is missing because the reader we use (`tools/research/premades.py`) only finds a bio when it’s written straight into the household file, and that’s only true for 3 of them. The rest sit in the game’s text under a key we haven’t traced yet. It’s a small research job, not a guess.

## 2. Where it would go on the page

The household page goes: banner, facts (world, home, origin, played…), **The Sims**, **Family tree**, **Their story**, Neighbours.

- **Bio:** inside “Their story”, as the opening lines. It only shows when there’s text, so empty households stay tidy.
- **Timeline:** in the same section, under the bio, as a short list (the prototype’s line with icons).
- **Whole-save timeline:** a page of its own later (like Stats), not on household pages.

## 3. EA’s words: a copyright note

**Her call (19 Oct):** EA’s bios are fine to show word for word (they’re in the game and on the wiki everywhere). Use EA’s own text, read from her game.

EA’s bios are EA’s writing. Showing them on a private site, for a game you own, is your call, and the risk is low while it stays on your PC. **If the site ever goes online,** copying them word for word for 100 families is the bit to think twice about.
The safe option is **a one-line summary in our own words**, with a link to the family’s Sims Wiki page (the prototype already does this).

---

## 4. Bio: the options

| Option | Good | Not so good |
|---|---|---|
| **A. Yours first, EA’s in our words underneath** | Your words lead; EA’s part is short and fine online | EA’s part has to be written (by me, about 100 one-liners) |
| B. Yours first, EA’s exact text underneath | EA’s exact words; nothing for us to write | About 74 now, the rest need tracing; think twice before going online |
| C. EA’s until you write yours | Every EA household has a bio from day one | Reads as if EA’s story is your save’s story |
| D. Yours only | Simple, all yours | Almost every page stays empty for now |

Your own households: your bio only (Library bios brought in where there is one, for you to check).

## 5. Timeline: the options

| Option | Good | Not so good |
|---|---|---|
| **By the month you played it** (“Oct 2026”) | Matches real life and your Gallery dates; easy to sort | Says nothing about the Sims’ own ages |
| By story time (“Year 1, Spring”) | Reads like a story | You keep the count yourself (the game has seasons but no years) |
| Both (month always, story time when you add it) | Best of both | One more thing to fill in |

Starting points that need no typing: the **10 “moved world” events** from your plan (BFF, Roomies, Johnny Zest, Bjergsens, Villareals, Behrs, the Bro household, Venessa Jeong, Eclectic Arts, the Montys), and the date each home was shared on the Gallery.

Whole-save timeline: the same events on one page, filtered by world or family. Worth it once there are more than those 10 moves.

---

## 6. My recommendation (start small)

1. **Bio, option A:** your bio first, then “In the game:” with one line of ours and a link to the wiki. Start with the households you’ve already told a story about (the Montys and Monticapps, Goths, Cadberrys), not all 101.
2. **Timeline:** **by the month you played**, with an optional story time you can add later. Only on households that have at least one real event; start with the 10 world moves.
3. **Whole-save timeline:** not yet. Revisit when you’ve played a few households.
4. Writing: you tell me in chat, I add it (as now).

---

## 7. Decisions (yes or no)

1. Bio: your words first, EA’s underneath? 
2. EA’s part as **our own one-line summary with a wiki link** (not EA’s exact text)? 
3. If no to 2: is EA’s exact text fine while the site stays on your PC? 
4. Bring in the Library bios for Henley and Watson-Holmes, for you to check? 
5. Timeline dated by **the month you played**? 
6. Add story time (“Year 1, Spring”) as an extra, only when you give one? 
7. Start each timeline with the “moved world” events from your plan? 
8. Show when the home was shared on the Gallery as a timeline event? 
9. A whole-save timeline page later (not now)? 
10. Should I trace where the other 98 EA bios are in the game files (report only, no site change)?
