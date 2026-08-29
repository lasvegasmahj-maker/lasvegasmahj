import type { RulesTopic } from "./types";

export const CHARLESTON: RulesTopic = {
  slug: "charleston",
  title: "The Charleston",
  qa: [
    {
      id: "passes",
      q: "How many passes are in the charleston?",
      a: "The first charleston has three mandatory passes: first right (3 tiles), first across (3 tiles), and first left (3 tiles). After the first charleston, players may continue into a second charleston with the same three passes in reverse order: second left, second across, last right. The second charleston is optional: once the first left pass is done, any single player may call to stop.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "stop",
      q: "Can I stop the charleston before it is finished?",
      a: "Not during the first charleston. The first charleston (right, across, left) is compulsory. Once the first left pass is done, any player may call to stop; the second charleston (left, across, right) only happens if no one stops it. The courtesy pass still applies either way.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "blind-pass",
      q: "What is a blind pass?",
      a: "A blind pass is allowed only on the last pass of each Charleston: First Left and, if a second Charleston is played, Last Right. If you do not want to pass three tiles from your own hand, you may take one, two, or all three tiles being passed to you and pass them onward without looking at them. You still pass three tiles total. A blind pass does not override the rule against passing jokers. Do not knowingly include a joker from your own hand. Tiles you pass on blindly must remain unseen.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "courtesy-pass",
      q: "What is a courtesy pass and is it optional?",
      a: "After the charleston ends, whether it stopped after the first left pass or ran through a second charleston, you and the player across from you may make an optional courtesy pass of 0, 1, 2, or 3 tiles. Both players must agree on how many tiles to exchange, and both pass at the same time. Either player can decline.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "look",
      q: "Can I look at tiles before passing them?",
      a: "Yes, always. You choose which 3 tiles to pass and you may look at anything in your hand. The blind pass on the first left or last right pass is simply an option to pass 1, 2, or 3 of the tiles you just received without looking at them; you may still look if you prefer.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "wrong-count",
      q: "What happens if someone passes fewer than 3 tiles?",
      a: "If a player passes the wrong number of tiles and it is caught before play begins, the pass should be corrected. If it is caught after the first tile is drawn, house rules typically apply. A common remedy is to correct the count if possible, or replay the charleston if necessary.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "pass-jokers",
      q: "Do I have to pass jokers?",
      a: "No, and you may not: jokers cannot be passed in the charleston at all. Any other 3 tiles may be passed, so hold your jokers and pass something else.",
      kind: "standard",
      evidence: "card",
    },
  ],
};
