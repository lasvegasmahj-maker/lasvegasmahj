import type { RulesTopic } from "./types";

export const CALLING_TILES: RulesTopic = {
  slug: "calling-tiles",
  title: "Calling Tiles",
  qa: [
    {
      id: "pung-vs-kong",
      q: "What is the difference between a pung and a kong?",
      a: "A pung is a set of three identical tiles. A kong is a set of four. A quint is five, and a sextet is six (both require jokers unless they are made of flowers, since a set has 8 of those). On the card, a group is shown by repeating the tile that many times; the card's key defines a Pair as 2 like tiles, a Pung as 3, a Kong as 4, a Quint as 5, and a Sextet as 6.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "most-recent",
      q: "Can I call any discard or only the most recent one?",
      a: "You can only call the most recently discarded tile, the one that was just discarded by the player whose turn just ended. You cannot call a tile that was discarded earlier in the game.",
      kind: "standard",
      evidence: "owner",
    },
    {
      id: "two-callers",
      q: "What happens when two players call the same discarded tile?",
      a: "The player calling for mahjong (to win) has priority over all other calls regardless of seating position, even if the other caller has already exposed tiles. Among players calling for a pung, kong, quint, or sextet (not mahjong), the player who would receive the tile in the natural turn order takes priority (specifically, the player closest to the discarder going counterclockwise), unless the other caller has already claimed the tile by placing it on top of their rack or exposing tiles from their hand. The same tiebreak settles two players calling the same tile for mahjong.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "call-for-mahjong",
      q: "Can I call a tile to complete mahjong even if it is not my turn?",
      a: "Yes. Any player may call a discard to complete a winning hand (mahjong), except a discarded joker, as long as the next player has not yet picked and racked or discarded. A call for mahjong beats any call for an exposure, even one already placed on a rack. If two players call the same tile for mahjong, the player next in turn after the discarder gets it unless the other caller has already racked the tile or exposed.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "out-of-turn",
      q: "What is calling out of turn and what are the consequences?",
      a: "Calling a tile that is not the most recent discard, or calling before the discard is complete, is an out-of-turn call. The penalty varies by house rules but typically results in the hand being declared dead. At minimum, the call is void and play continues.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "concealed",
      q: "Can I call a tile for a concealed (unexposed) group?",
      a: "No. You can only call a discarded tile to complete a group that will be immediately exposed on the table. You cannot call a tile to add to a concealed section of your hand. The one exception is the tile that completes your mahjong: any tile except a joker may be called for mahjong, even for a concealed hand.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "expose",
      q: "Do I have to expose tiles immediately when I call?",
      a: "Yes. When you call a tile, you must immediately expose the completed group (pung, kong, quint, sextet, or the tiles for mahjong) on your rack. You may change the number and type of tiles shown in that exposure up until you discard; once you have discarded, the exposure is locked in and must be part of your final mahjong.",
      kind: "standard",
      evidence: "card",
    },
  ],
};
