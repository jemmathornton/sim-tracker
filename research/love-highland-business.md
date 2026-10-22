# Love Highland: Getaways and a small business (22 Oct, report only)

**At a glance**
1. A small business can only open on a home (residential, tiny home, haunted house) or a Small Business Venue. Not on a Custom Venue, a bar, a spa or any other community lot type.
2. The “community lot with a ticket kiosk” in EA Help really means buying that lot as a Small Business Venue: the game turns it into one. Custom Venues can’t be bought this way.
3. A Small Business Venue can’t host Getaways. A home can, and a Getaway at your own home earns money and lets guests tip you.
4. “Small Business (Residential)” is just the label a home gets when a business runs there. It’s still a residential lot, so Getaways work there.
5. Best fit for the game: Love Highland as the Addams’ home, running Getaways and a business. Story-only Custom Venue (as now) earns them nothing.

## 1. Where a small business can open

From the game’s own tuning (Businesses & Hobbies files):

- Opening a business (ticket kiosk, Open sign, phone, computer) runs one check, `testSet_SmallBusiness_CanOpenBusiness`. Every part must pass. One part is a list of allowed lot types, `testSetInstance_Venue_AllowableSmallBusinessVenues`. It has only four:
  - Residential
  - Tiny Home
  - Haunted House (residential)
  - Small Business Venue
- **Custom Venue is not on it.** Nor is Bar, Spa, Gym or any other community type.
- The business must also be assigned to a lot the household owns (game text: “Select on which of your household’s owned lots to operate this business”).
- Ticket kiosk entry fees are only paid by Sims in the “small business customer” role.

What EA Help calls running on “an existing community lot” is the **Buy Small Business Venue** option (phone, computer, business panel). Game text: “Sims can purchase Unowned Community Lots, Unoccupied Residential Lots, or Unowned Small Business Venues as Small Business Venues.” The lot then becomes a Small Business Venue. It isn’t a bar with a kiosk any more.

Lot types you can buy this way: Residential, Tiny Home, Haunted House, Small Business Venue, Bar, Beach, Nightclub, Forest Park, Generic, Gym, Library, Lounge, Museum, Playground, Park, Pool, Visitors Allowed, Wedding venue, Spa, Café, Arts Centre, Karaoke Bar, Community Lot, Onsen, Thrift Store, Rec Centre, Cemetery, Garden, Maker Space, Market, both university Commons, Penthouses, and the rentable types. **Custom Venue is the one community type left out.**

## 2. Can a household own a Custom Venue?

No. The Custom Venue tuning has no ownership or business settings, and it isn’t on the list of lots you can buy. To own Love Highland as a business it would first have to be changed to another type in Build mode, and then it stops being a Custom Venue (its schedule and roles stop working).

## 3. Money from Getaways and tickets

- **Small Business Venue:** no Getaways at all (not on the Getaway list; checked earlier today).
- **Custom Venue run by the Addams:** Getaways are allowed, but the planner pays a daily fee. Nobody can run a business there, so no tickets. Guests can’t tip the Addams either: the tip needs the host to own the lot.
- **Their own home:** Getaways allowed. The game pays the household (lot value × guests from outside the household), and guests can tip the hosts. A business can also be registered and opened there. The lot shows as “Small Business (Residential)” but is still residential, which is on the Getaway list.
- **Tickets during a Getaway:** Getaway guests won’t buy tickets. Only Sims who come as business customers pay entry. Nothing in the tuning stops a business being open during a Getaway (the Open check only blocks fires and burglars). But planning a Getaway needs the game to allow a new event, and whether an open business counts against that is in the game’s code, not its tuning. So: test it.

## 4. Options, ranked

1. **Love Highland becomes the Addams’ home (residential), running Getaways and a small business.** This is how the game ships it (their home). They earn from Getaways and tips at home, and from the business when it’s open. Change to the plan: they leave Miner’s Manse, which needs a new use or household. Small change to the game; closest to EA’s lore.
2. **Addams stay at Miner’s Manse; Love Highland stays a Custom Venue run “as story”.** As her plan is now. In the game they earn nothing from it, and whoever plans a Getaway there pays. Fine if the money doesn’t matter to her. A business could still run from Miner’s Manse (Small Business (Residential)).
3. **Addams stay at Miner’s Manse and buy Love Highland as a Small Business Venue** (after changing it from Custom Venue in Build mode). Real business income from tickets, but no Getaways there and no Custom Venue schedule. Loses what makes Love Highland special.

A household can only live on one residential lot, so “home at Miner’s Manse plus Love Highland as a second home” isn’t possible.

## Still to test in game

- Plan a Getaway at home while the household’s business is open: is it allowed, and do business customers still come and pay?
- Open a business while a Getaway is running at home.
- How much a home Getaway pays in practice (lot value × guests), and whether tips arrive.
- That Love Highland as a home still lets the Custom Venue-style Getaway schedule be used (Getaway schedules are set in the Getaway planner, so they should).
- That Buy Small Business Venue really doesn’t list Love Highland while it’s a Custom Venue.

## Sources

- Game tuning (Simulation packages, read with `tools/research/tuning.py`): `testSet_SmallBusiness_CanOpenBusiness` (383889), `testSetInstance_Venue_AllowableSmallBusinessVenues` (402348), `map_Picker_BuyOwnableSmallBusinessVenue` (394962, converts to `venue_SmallBusiness` 394911), `customVenue_Venue` (455703), `EV007_ticketMachineCounter_CheckIn_Entry`, `EV007_ticketMachineCounter_SmallBusiness_Open`, `give_Tip_GetawayHost`, `getawayPlayerFacingSituation`. Game text strings “Small Business Residential”, “Business Lot Assignment”.
- [EA Help: How to set up a Small Business](https://help.ea.com/en/articles/the-sims/the-sims-4/how-to-set-up-a-small-business/)
- [EA Help: How do Getaways work](https://help.ea.com/en/articles/the-sims/the-sims-4/getaway-guide/)
- [Sims Wiki: Ticket machine](https://sims.fandom.com/wiki/Ticket_machine)
- [EA Forums: Cannot create small business residential](https://forums.ea.com/discussions/the-sims-4-gameplay-en/cannot-create-small-business-residential/12383966)
