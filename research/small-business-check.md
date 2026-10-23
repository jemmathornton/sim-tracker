# Small business check (16–17 Oct)

> Out of date since 19 Oct: lots now use the game’s two names, Small Business Residential and Small Business Venue; the Greenburgs live at Rockridge Springs. See TODO.md “Small business lots”.

For TODO §5: “check the small business lot types… It must stay obvious a business is run from the lot, not just a home.” Recommendations only; nothing is changed.

**Sources:**
- Her plan, and lot types from her Building save and the Gallery (research/data/plan-vs-game.json, shared lots only).
- The game’s own text and tuning.
- The Sims Wiki’s Small business, Gammelvik and Iverstad pages.

## What the game does with each type

**Small Business Residential:** a home with a registered business.
- **Rooms:** each is zoned Residential (household only), Public or Employees only.
- **Opening:** the owner opens it (§75 each time) and customers come while it’s open.
- **Limits:**
  - One open business per household.
  - Up to 5 activities.
  - Not allowed on a Residential Rental. Tiny Home and Haunted House lots are fine.
- **NPC-run ones:** Nordhaven’s three are the game’s own (Koffieboon, Terra-Potta, Spilled Neon). She has visited Koffieboon while it was open.
- **How it shows:**
  - In the lot type list it’s just **Residential**, so the save and the Gallery call these lots Residential.
  - But **“Small Business Residential” is in the game’s own text** (found 16 Oct). EA Help and the Wiki use it too.
  - So the TODO’s “her own label” isn’t quite right: it is a game name.

**Small Business Venue:** a community lot bought by a household that has registered a business.
- **Nobody lives there:** EA Help says the Residential zone is only on Small Business Residential lots.
- **Opening:** it opens when its owner opens it, so it needs a named owner household.
- **Limits:**
  - No furniture or mannequin clothes for sale (Retail can), only items on displays.
  - No automatic restocking.
  - Food is self-serve, with no waiters.
- **The plan’s name:** “Small Business” is the plan’s short form; the game says **Small Business Venue**.

## Every small business lot

**Small Business Venue** (the plan says “Small Business”):

| Lot | World | Run by | Home? | Built / shared | Clear it’s a business? |
|---|---|---|---|---|---|
| Optimist’s Outlook | Newcrest | **nobody named** | No | Yes / Yes (save and Gallery: Small Business Venue) | Type yes; not what kind |
| The Llama Picturehouse | Magnolia Promenade | **nobody named** | No | Yes / Yes (save: Bar; leading upload: Small Business Venue) | Yes (two types) |
| Magnolia Mall | Magnolia Promenade | a rich family, to pick | No | No | Type yes; not what kind |
| Plumbob Pictures Museum | Del Sol Valley | **nobody named** | No | No | Yes (note in brackets) |
| Mystic Crossroads | Ravenwood | owner to pick | No | No | Yes (note in brackets) |
| Canal Corner | Evergreen Harbor | the Tinkers (they live at Pigulock Manor) | No | No | Type yes, but “residents: Tinker” reads as if they live there |
| The Portsmouth Promenade | Evergreen Harbor | the Greenburgs | No, so **Mary and Blossom have no home** | Yes / Yes (save and Gallery: Small Business Venue) | Same problem |
| Greenwood Hamlet Residence | Innisgreen (not owned) | Todd Attenberry; residents “Enchanted Lovers” | Type says no, residents say yes | No | Mixed |

**Small Business Residential:**

| Lot | World | Run by | Home? | Built / shared | Clear it’s a business? |
|---|---|---|---|---|---|
| The Quarry Building | Evergreen Harbor | the Sterling Ricos (Jules and Bess) | Yes | No | Yes; not what kind |
| Koffieboon | Nordhaven | the Lodens (as in the game) | Yes | No | Yes; not what kind |
| Fisherman’s Wharf | Nordhaven | the Johanssons (live upstairs) | Yes | Yes / Yes (save and Gallery: Residential, as expected) | Yes |
| Canalside Daycare | Nordhaven | **“?”** | Yes (upstairs flat) | Yes / Yes (Residential, as expected) | Yes (the name says it) |
| Terra-Potta | Nordhaven | the Koopmans (as in the game) | Yes | No | Yes; not what kind |
| Spilled Neon | Nordhaven | the Sarpongs (as in the game) | Yes | No | Yes; not what kind |
| Giardino Del Grandioso | Ondarion | the Altos (to create) | Yes | No | Yes; not what kind |

The TODO counted 6 Small Business Residential and 3 plain Small Business lots. Today it’s 7 and 8 (with the Llama Picturehouse and the newer Ravenwood, Magnolia Mall and Innisgreen choices).

**Not small businesses, but the same question:** Cookies ’n’ Cream (Newcrest) is **Retail (Bakery & Ice Cream)**. Retail also opens only with its owners, and it names none.

## Findings

1. **The Portsmouth Promenade:**
   - **The problem:** it’s a Small Business Venue in the plan, the save and the Gallery, so nobody can live there. In the game it’s the Greenburgs’ home. The plan moves Knox to Stonestreet #3 but gives Mary and Blossom nowhere to live.
   - **Fix with no rebuild:** they rent a unit at Rockridge Springs (empty, same world; rental-units.md).
   - **The other fix:** make it Small Business Residential and give them rooms upstairs. That changes a built, shared lot and needs a re-upload.
2. **Canal Corner and The Portsmouth Promenade show their owners as residents.** On a venue lot, “Run by the Tinkers” (not “residents”) would make it clear nobody lives there. That’s site wording, her call.
3. **Owners missing:**
   - Optimist’s Outlook, The Llama Picturehouse (Small Business version), Plumbob Pictures Museum and Canalside Daycare.
   - Also Mystic Crossroads and Magnolia Mall, which are already on the list.
   - Without an owner a venue never opens, so the Picturehouse would be better as a plain **Bar** (it runs itself).
4. **One business per lot:** Optimist’s Outlook (“filled with small businesses”) and Fisherman’s Wharf (tattoos, pottery and a candy café) are each one business with several activities in the game. That’s fine: woodworking, pottery, tattoos, music and so on fit within 5 activities.
5. **Greenwood Hamlet Residence** (not owned): if the Enchanted Lovers live there, it should be **Small Business Residential**. If Todd only runs it, the residents should go. Decide when she owns Innisgreen.
6. **Canalside Daycare:** check in game how far a small business can do childcare. The activity list has toddler toys and kids’ play, but nothing for minding children on their own. Custom Venues have a Child Care preset, but that would mean nobody lives there.

## Recommendations

1. **Use the game’s two names:**
   - **Small Business Venue** for the community lots (now “Small Business”).
   - **Small Business Residential** for the home lots (already right).
   - This follows her official-names rule, and the type alone then says whether anyone lives there.
2. **Add what’s run there in brackets, her “Restaurant (Seafood)” style.** The wording is hers; first ideas:

   | Lot | Note |
   |---|---|
   | Koffieboon | (Café) |
   | Terra-Potta | (Pottery) |
   | Spilled Neon | (Tattoos) |
   | Fisherman’s Wharf | (Tattoos, Pottery & Sweets) |
   | Giardino Del Grandioso | (Vineyard) |
   | Optimist’s Outlook | (Crafts, Tattoos & Music) |
   | The Portsmouth Promenade | (Classes) |
   | Magnolia Mall | (Shops) |

   The Quarry Building, Canal Corner and Canalside Daycare need her answer on what they sell.
3. **The Greenburgs:** Mary and Blossom rent at Rockridge Springs, so The Portsmouth Promenade stays as built.
4. **Name the owners:**
   - Picked for her in undecided-lots.md: Judith Ward (Plumbob Pictures Museum), the Landgraabs (Magnolia Mall), the Izadi-Gomes household (Mystic Crossroads).
   - Still open: Optimist’s Outlook, Canalside Daycare and the Picturehouse.
5. **The Llama Picturehouse:** keep the Small Business version only if it gets an owner; otherwise lead with the Bar version, which runs itself.

## Decisions for her

- Rename “Small Business” to **Small Business Venue**?
- Bracket notes on each business (her wording)?
- Mary and Blossom Greenburg: rent at Rockridge Springs, or make The Portsmouth Promenade their home?
- “Run by” instead of “residents” on venue lots?
- Owners:
  - Optimist’s Outlook.
  - Canalside Daycare.
  - The Llama Picturehouse (or switch it to Bar).
