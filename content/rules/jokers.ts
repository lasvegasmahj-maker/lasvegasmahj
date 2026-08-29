import type { RulesTopic } from "./types";

export const JOKERS: RulesTopic = {
  slug: "jokers",
  title: "Jokers",
  qa: [
    {
      id: "substitute",
      q: "What tiles can jokers substitute for?",
      a: "Jokers can substitute for any tile in a set of three or more identical tiles: a pung (3), kong (4), quint (5), or sextet (6). They cannot substitute in pairs or single tiles. So jokers work in groups, never alone or in twos.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "pair",
      q: "Can jokers be used in a pair?",
      a: "No. Jokers cannot be used in pairs under any circumstance. A pair must be two real, identical tiles. This is one of the most common misconceptions for newer players.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "single",
      q: "Can jokers be used in a single tile slot?",
      a: "No. A single tile position on the card requires a real tile. Jokers only work in groups of three or more.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "exchange",
      q: "Can I swap a real tile for a joker in another player's exposed set?",
      a: "Yes, but only on your own turn: after you pick or claim a tile and before you discard. You may exchange a real tile for a joker sitting in any player's exposed pung, kong, or quint. You take the joker and leave the real tile in its place. You cannot do it during another player's turn.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "singles-pairs-hand",
      q: "Can I use a joker in a Singles and Pairs hand?",
      a: "No. Singles and Pairs hands (hands with all single tiles and pairs) are joker-free by definition. No jokers anywhere in those hands.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "joker-free",
      q: "What is a joker-free hand and what does it pay?",
      a: "A joker-free hand is any complete mahjong hand that contains zero jokers. These hands pay double from all three players, meaning you collect twice the normal amount. This applies to self-drawn wins too. The one exception is Singles and Pairs hands, which never use jokers and do not get the doubling.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "call-with-joker",
      q: "Can I call another player's discard and use a joker to complete the set?",
      a: "Yes. When you call a discard to complete a pung, kong, or quint, you can use jokers to fill the remaining tiles in that exposed group. The called tile itself must be a real tile; jokers from your hand may stand in for the rest of the group.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "wall-game",
      q: "What happens to jokers at the end of a wall game?",
      a: "In a wall game (nobody wins), there is no payment for jokers specifically. Each player pays the others based on house rules; some groups pay a flat amount per player per wall game.",
      kind: "house",
      evidence: "unverified",
    },
  ],
};
