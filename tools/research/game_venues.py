"""The game's lot types (venues) and their display names, read from the game's files (read only).

    python tools/research/game_venues.py

Each venue's SimData record (schema "Venue") holds its display_name text key. Ids are the venue tuning ids that a
save stores as a lot's venue_type_id_on_save. Writes research/data/game-venues.json.
"""
import json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import sims4files as s4
from common import ROOT


def main():
    text = s4.english()
    out = {}
    for i, rec in s4.simdata_records('Venue')['Venue'].items():
        key = rec['row'].get('display_name')
        name = re.sub(r'<[^>]+>', '', text.get(key[1], '')).strip() if isinstance(key, tuple) else ''
        if name: out[str(i)] = {"name": name, "tuning": rec['tuning']}
    with open(os.path.join(ROOT, 'research', 'data', 'game-venues.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump({"_note": "Lot types (venues) in the game, by the game's id, with their display names. From the game's own files.", "venues": out},
                  f, ensure_ascii=False, indent=1)
    return out


if __name__ == '__main__':
    print(len(main()), 'lot types')
