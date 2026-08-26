import type { RulesTopic } from "./types";

export const SCORING: RulesTopic = {
  slug: "scoring",
  title: "Scoring",
  qa: [
    {
      id: "discard-pays",
      q: "Who pays when someone wins by calling a discard?",
      a: "When a player wins by calling a discard, the player who discarded that tile pays twice the normal amount (they pay for themselves and double). The other two players each pay the standard single amount. This is the standard NMJL payment structure, though some groups play 'all pay'; confirm with your group.",
      kind: "standard",
      evidence: "rulebook",
    },
    {
      id: "self-drawn-pays",
      q: "Who pays when someone wins on their own draw (self-drawn)?",
      a: "On a self-drawn win, all three other players each pay the full amount. No one discarded the winning tile, so the cost is shared equally among all three losers.",
      kind: "standard",
      evidence: "unverified",
    },
    {
      id: "game-value",
      q: "What is the standard game value and how do groups set it?",
      a: "The NMJL does not set a fixed dollar amount; groups agree on their own bet per hand before play begins. Common amounts range from 25 cents to $1 per point or per hand. Whatever your group agrees, that amount is what 'one unit' means for payment purposes.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "joker-free",
      q: "What is a joker-free bonus and how does it pay?",
      a: "A joker-free hand (one completed with zero jokers in the entire hand) pays double from all three players. If the normal win is $1, a joker-free win collects $2 from each of the other three players. This applies whether you win by discard or self-draw. The one exception is Singles and Pairs hands, which never use jokers and do not get the doubling.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "extra",
      q: "Do any hands pay extra beyond joker-free?",
      a: "Some groups play that certain named hands (like Singles and Pairs or Quint hands) pay double or triple by house agreement. Beyond joker-free doubling, the card itself names two more multipliers: a player who declared mahjong in error pays double the value of the incorrect hand when the game cannot continue, and a player who misnamed a tile that was then called for mahjong pays the claimant 4 times the value of the hand. Every hand's value is printed beside it on the card. Any other multiplier is a house rule and should be agreed on before the game.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "wall-game",
      q: "How does payment work in a wall game?",
      a: "In a wall game (no winner), the NMJL standard is that no money changes hands. However, most groups play a house rule where each player pays every other player a small flat amount. Decide your group's wall game rule before play begins so there is no dispute.",
      kind: "house",
      evidence: "rulebook",
    },
  ],
};
