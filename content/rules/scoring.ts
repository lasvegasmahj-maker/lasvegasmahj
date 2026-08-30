import type { RulesTopic } from "./types";

export const SCORING: RulesTopic = {
  slug: "scoring",
  title: "Scoring",
  qa: [
    {
      id: "discard-pays",
      q: "Who pays when someone wins by calling a discard?",
      a: "Groups settle this in one of two ways: the player who discarded the winning tile pays double while the other two pay the single amount, or all three pay the same. Payment conventions can vary by group. Confirm your table's payment rules before play.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "self-drawn-pays",
      q: "Who pays when someone wins on their own draw (self-drawn)?",
      a: "Whether a self-drawn win is paid the same as a win on a discard, or more, is settled by your group. Payment conventions can vary by group. Confirm your table's payment rules before play.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "game-value",
      q: "What is the standard game value and how do groups set it?",
      a: "The card prints a value beside each hand, but groups agree before play what those values are worth in money. Common amounts range from 25 cents to $1 per point or per hand. Whatever your group agrees, that amount is what 'one unit' means for payment purposes.",
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
      a: "Some groups play that certain named hands (like Singles and Pairs or Quint hands) pay double or triple by house agreement. Beyond joker-free doubling, the card itself names two more multipliers: a player who declared mahjong in error pays double the value of the incorrect hand when the game cannot continue, and a player who misnamed a tile that was then called for mahjong pays the claimant 4 times the value of the hand. Every hand's value is printed beside it on the card. Other multipliers, such as the discarder paying double, come from the League rule book or your table's agreement, not from the card itself.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "wall-game",
      q: "How does payment work in a wall game?",
      a: "In a wall game (no winner), nobody collects a win payment. Some groups pay every other player a small flat amount as a house rule, and others exchange nothing. Payment conventions can vary by group. Confirm your table's wall game rule before play.",
      kind: "house",
      evidence: "unverified",
    },
  ],
};
