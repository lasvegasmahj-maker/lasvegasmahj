import type { RulesTopic } from "./types";

export const WINNING: RulesTopic = {
  slug: "winning",
  title: "Winning",
  qa: [
    {
      id: "deal",
      q: "How many tiles does each player start with?",
      a: "Each player starts with 13 tiles (except East, the dealer, who starts with 14). East is already holding a full hand and discards first to begin play.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "valid",
      q: "What makes a valid mahjong?",
      a: "A valid mahjong is a complete hand of 14 tiles that exactly matches one of the hands on the current year's NMJL card. Every tile and every suit must fit that one hand, and anything you exposed must be part of it. If any element is off, it is not a valid mahjong.",
      kind: "standard",
      evidence: "owner",
    },
    {
      id: "discard-win",
      q: "Can I win on a tile I called (not my own draw)?",
      a: "Yes. You can win by calling a discarded tile (other than a joker) from any other player to complete your hand. This is called a 'discard win.' You declare mahjong, expose your full winning hand, and collect payment.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "self-drawn",
      q: "Can I win on my own draw?",
      a: "Yes. Drawing the tile you need from the wall to complete your hand is called a 'self-drawn win.' Self-drawn wins still pay the standard amount, though some groups play that self-drawn pays double; confirm your group's house rules.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "wall-game",
      q: "What is a wall game and how does it pay?",
      a: "A wall game occurs when all tiles in the wall are drawn and no one has won. Play ends immediately when the last tile is drawn. In a wall game, nobody collects a win payment. Each player typically pays a flat amount to every other player (house rules determine the amount), or in some groups no money changes hands.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "false-mahjong",
      q: "What is a false mahjong and what is the penalty?",
      a: "A false mahjong is calling mahjong when your hand does not actually complete a valid hand on the card. If you have not exposed your hand and every other hand is intact, play continues with no penalty. If you exposed all or part of your hand, your hand is dead. If your call led one other player to expose their hand, the game continues between the two players whose hands are intact; if more than one other player exposed, the game cannot continue and you pay double the value of the incorrect hand to the one player whose hand is still intact. That is why players should not throw in their hands until a mahjong is verified.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "change-mind",
      q: "Can I declare mahjong and then change my mind?",
      a: "It depends on whether you exposed. If you declared mahjong but exposed nothing and every other hand is still intact, play continues with no penalty. Once you expose all or part of your hand, the declaration stands; if the hand is not valid, your hand is dead. Do not call mahjong until you are certain.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "passed-winning-tile",
      q: "What happens if a player passes on their winning tile during the charleston?",
      a: "This happens! If you accidentally pass a tile you could have used to win, you can simply continue play. There is no penalty; you just do not have that tile anymore.",
      kind: "standard",
      evidence: "unverified",
    },
  ],
};
