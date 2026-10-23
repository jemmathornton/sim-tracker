# Placing rentals and apartments in the new save

Web research, 23 Oct 2026. Game fully updated; For Rent and City Living owned. Where nothing official says it, it's marked **unconfirmed**. I found no Reddit thread on these exact points; the sources are EA's own pages, EA and Steam forums, and fan sites.

## At a glance

1. A rental placed from the Gallery or Library keeps its lot type and its units, but unit details (names, traits, rent) are not reliably kept. Nobody has reported your exact "traits shifted by one unit" bug, and there is no fix for it in any patch notes up to Oct 2026.
2. Safest order: place the lot, check the unit outlines, then set every unit's name and traits in Unit Configuration yourself, then move households in. Treat whatever came with the lot as a starting point.
3. Each unit has its own lot traits (up to 3) and challenges. Set them in Build mode, Venue Info, Unit Configuration, "Unit Traits and Challenges" tab.
4. Households go into a unit through Manage Households (move in) or the For Lease sign's Tenant Applications. The household living on the lot when it becomes a rental is the owner; an owner can also live elsewhere.
5. San Myshuno apartments stay City Living apartments (For Rent doesn't change them). You can't place a whole lot there, only Rooms inside each unit: bulldoze the unit's contents first, place the Room, then put back any walls you knocked out to upload it.

## 1. Rentals from the Gallery or Library

**What survives (as far as is known)**
- Lot type (Residential Rental) and the units' rooms: yes, the lot comes in as a rental with its units.
- Unit names, unit traits and challenges, rent: **unconfirmed**. No source says they are kept. Fan tips from Jan 2024 deal with rentals that arrive with broken names and rent by removing and redoing the units.
- Landlord: never comes with the lot. Whoever lives there (or whoever you make owner) is the landlord in your save.
- EA fixed one related problem on 3 Sep 2024: traits and challenges are now kept on units when a Residential or venue lot is **converted** to a rental. That fix is about converting a lot, not placing one.

**Your 5-unit rental (unit 1 got unit 2's traits, the others blank)**
- I found no report of this exact bug. **Unconfirmed guess:** the game keeps unit details by the unit's position, and placing a lot can renumber units, so details slide along by one or drop off. There is a known older bug where you can't go past 5 units: making a 6th replaced the 5th unit's colour instead (EA bug forum).
- In practice: after placing any rental, open Unit Configuration and check each unit's name and traits against the site before anyone moves in.

**Best order of steps**
1. Back up the save (EA and players both advise this for rentals; rental lots have been linked to white screens and missing lots, still being fixed as of Oct 2026).
2. Place the lot from your Library or Gallery onto an empty lot. Use bb.moveobjects if you built it with it on, or things can go missing.
3. Turn on Unit Outlines in Build mode and check every room is in the right unit (and shared rooms are shared).
4. Build mode, Venue Info, Unit Configuration: for each unit set the name, then the Unit Traits and Challenges tab.
5. Set rent and lease terms (For Lease sign) before anyone moves in.
6. Move the households in (section 2).
7. If names or rent look wrong, the common fix is to switch the lot to Residential and back to Residential Rental, then redo the units (fan tip, Jan 2024; **unconfirmed** whether it keeps traits).

Don't bother setting the lot type first and placing over it: placing a lot from the Library uses the saved lot's own type.

**How many traits per unit**
- Up to 3 lot traits per unit, each unit separate (from earlier research in research/lot-trait-ideas.md; EA's guide confirms traits are per unit but gives no number). Challenges sit on the same tab.
- Up to 6 units per rental, 8 Sims per unit, 99 units in a save (EA's For Rent FAQ, 27 Nov 2023). Players warn against going over 6.

## 2. Households into a specific unit, and the landlord

**Putting a household in a chosen unit**
1. Set the unit up first (name, traits, rent, lease).
2. Either: Manage Households, pick the household, Move in, choose the rental and then the unit. A player on EA's forum calls this the easiest way, as you can move several households at once.
3. Or, playing the owner: the For Lease sign, Tenant Agreement, then Tenant Applications, and pick a household. EA's guide shows this way.
4. You can switch between units with "Switch to Household" on a unit's door, or through Manage Worlds.

**Landlord living in a unit**
- The household living on a lot when it becomes a rental automatically becomes the property owner (EA guide).
- The owner's own unit is ticked as "Home Unit" in Unit Configuration. Family can be charged no rent.

**Landlord who owns it from elsewhere**
- Possible: For Rent lets a household own rentals it doesn't live on, and manage them through the Owned Business panel ("Travel to Unit") or its phone ("Become Owner" is the fan tip for when rent isn't collected).
- How best to make a household the owner of an empty rental in a brand-new save without playing it: **unconfirmed**. Simplest known way: move the owner household in, convert or set up the rental, then move them out to their own home. Check they're still owner afterwards.
- Since 4 Nov 2025 a rental can be turned back into a Residential lot even when the active Sim isn't in the main unit.

## 3. San Myshuno apartments (City Living)

**What you can do**
- Regular San Myshuno apartments are not lots you can replace. You can only edit inside each unit, and only Rooms can go into one.
- For Rent didn't change them: "Existing apartments in City Living or Eco Lifestyle remain unique and separate" from the new rental type (EA FAQ, 27 Nov 2023). They also can't be made into Residential Rentals.
- Penthouses are the exception: a whole lot from the Gallery can go on a penthouse, as long as it meets the penthouse rules such as an elevator (Sim Guru, Sept 2016). EA says penthouses don't work as rentals, though a Nov 2025 patch fixed a crash when "changing a Penthouse lot type to Residential Rental" (**unconfirmed** whether that is now allowed).

**Least painful way to get your apartments in**
1. In the new save, go into the apartment unit (e.g. Medina Studios) in Build mode.
2. Bulldoze or sell everything inside first. Placing a Room on top of the old one just stacks the objects.
3. Turn on bb.moveobjects if you used it when building.
4. Gallery or Library, Rooms, pick your upload (e.g. "Medina Studios"), place it inside the unit. Rotate until it lines up with the unit's walls.
5. Put back any walls and doors you removed so it would save as one Room.
6. If it won't place ("outside the lot"), players found a one-tile strip along the wall shared with the next-door apartment had to be cleared. Another fix: place it on an empty lot, tidy it, save it to the Library again, then try.
7. Parts on platforms may not save with the rest and need saving and placing as separate Rooms (a Gallery creator's note on Medina Studios).

This applies to Culpepper House, Medina Studios, Hakim House, ZenView, 21 Chic Street, Alto Apartments, Landgraab Apartments, Jasmine Suites and Spire Apartments. If any of them is a penthouse, that one can take a whole lot instead (**unconfirmed** which of yours are penthouses: check in game).

**Changes 2025–2026**
- No change to how apartments are placed or shared.
- 30 Jun 2026: walls-down and ceiling display fixes in classic apartments, and a fix for endless loading when placing some Gallery lots that used many placement cheats.
- Due 27 Oct 2026 (announced, not out yet on 23 Oct): a fix for white screens in worlds with rental lots, and more for Gallery lots built with heavy bb.moveobjects. EA warns some lot details may need rebuilding after it, so set unit details after this patch if you can wait.

## Sources

- EA Help, "How to create Residential Rentals in The Sims 4 For Rent" (undated, For Rent came out Dec 2023): https://help.ea.com/en/help/the-sims/the-sims-4/for-rent-residential-rentals-guide/
- EA, "For Rent FAQ with Devs", 27 Nov 2023: https://www.ea.com/games/the-sims/the-sims-4/news/for-rent-faq-with-devs
- SimsCommunity, For Rent rental build guide, 15 Dec 2023: https://simscommunity.info/2023/12/15/sims-4-for-rent-rental-build-guide/
- SimsCommunity, For Rent property management, 16 Nov 2023: https://simscommunity.info/2023/11/16/sims-4-for-rent-property-management/
- EA Laundry List, 3 Sep 2024 (traits kept when converting to rental): https://www.ea.com/games/the-sims/the-sims-4/news/laundry-list-september-3rd-2024
- EA update notes, 4 Nov 2025: https://www.ea.com/en/games/the-sims/the-sims-4/news/update-11-4-2025
- SimsCommunity on EA's Laundry List, 25 Nov 2025: https://simscommunity.info/2025/11/25/sims-4-laundry-list-dec-2-patch/
- EA update notes, 30 Jun 2026: https://www.ea.com/games/the-sims/the-sims-4/news/update-6-30-2026
- The Click, fixes due 27 Oct 2026 (from EA's 20 Oct Laundry List), 20 Oct 2026: https://www.theclick.gg/the-sims-4-white-screen-infinite-loading-october-27/
- Simsational, For Rent workarounds, Jan 2024: https://www.simsationalchannel.com/2024/01/tipsworkaroundforforrent.html
- EA bug forum, can't have more than 5 units (undated, could not open): https://forums.ea.com/idea/the-sims-4-bug-reports-en/cant-have-more-than-5-units-in-for-rent/4983945
- EA forum, getting your own families into your rentals (undated, could not open; quoted from search): https://forums.ea.com/discussions/the-sims-4-general-discussion-en/rental-pack-how-can-you-get-your-own-npc-families-into-your-own-rentals/455706
- Steam, "For Rent // Sep 2025 – is it fixed?", Sep 2025: https://steamcommunity.com/app/1222670/discussions/0/746030524012940342/
- Steam, rentals with more than 6 units (undated): https://steamcommunity.com/app/1222670/discussions/0/596269981728018563
- EA forum, City Living: cannot place apartments correctly from the Gallery (undated, could not open): https://forums.ea.com/discussions/the-sims-4-gameplay-en/city-living-cannot-place-apartments-correctly-from-the-gallery/8766914
- EA forum, 630 Medina Studios not placing correctly (undated, could not open): https://forums.ea.com/discussions/the-sims-4-gameplay-en/630-medina-studios-not-placing-correctly-cl/8589896
- Mod The Sims, replacing apartments from the Gallery, 21 Nov to 1 Dec 2016: https://modthesims.info/showthread.php?t=585981
- SimsCommunity, City Living: how to save apartments to the Gallery intact, 6 Nov 2016: https://simscommunity.info/2016/11/06/city-living-how-to-save-apartments-to-the-gallery-intact/
- SimsCommunity, City Living Q&A with SimGurus (Gallery lots on penthouses), 24 Sep 2016: https://simscommunity.info/2016/09/24/the-sims-4-city-living-qa-with-simgurus-about-apartments-traits-and-more-part-2/
