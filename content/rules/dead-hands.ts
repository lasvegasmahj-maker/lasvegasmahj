import type { RulesTopic } from "./types";

export const DEAD_HANDS: RulesTopic = {
  slug: "dead-hands",
  title: "Dead Hands",
  qa: [
    {
      id: "triggers",
      q: "What makes a hand dead?",
      a: "The card's rules say a hand is dead when it has too few or too many tiles, or contains an incorrect exposure: an exposed group that cannot fit any hand on the card, or an exposure made with a wrongly named tile. Declaring mahjong in error makes your hand dead only if you exposed all or part of it; if you exposed nothing and every other hand is intact, play continues with no penalty.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "saved",
      q: "Can a hand be saved before it is officially declared dead?",
      a: "Sometimes. You may change the number and type of tiles in an exposure right up until you discard, so an exposure mistake caught before your discard can simply be fixed. Once you have discarded, an incorrect exposure makes the hand dead, and a hand with the wrong number of tiles is dead as soon as it is noticed. The key is catching it immediately.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "pays",
      q: "Does a player with a dead hand still pay if someone wins?",
      a: "Yes. A player whose hand is declared dead must still pay the winner if someone else wins. Their hand being dead does not excuse them from payment obligations for the rest of that game.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "draws",
      q: "Does a dead hand player continue drawing tiles?",
      a: "No. Once a hand is declared dead, that player does not draw or discard for the rest of the hand. They sit out until the next hand begins.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "two-dead",
      q: "What happens if two players have dead hands?",
      a: "Both sit out and still pay if one of the two active players wins. The card only stops play when three hands are dead, so with two dead hands the remaining two players continue.",
      kind: "standard",
      evidence: "card",
    },
  ],
};
