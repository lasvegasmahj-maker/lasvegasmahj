import type { RulesTopic } from "./types";

export const ETIQUETTE: RulesTopic = {
  slug: "etiquette",
  title: "Etiquette",
  qa: [
    {
      id: "take-back",
      q: "Can I take back a discard once it leaves my hand?",
      a: "No. Once a tile is placed face-up on the table as a discard, it cannot be taken back. As soon as it is correctly named, other players may call it; a tile cannot be claimed until it is named correctly, so name every discard clearly. Be certain before you discard.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "table-talk",
      q: "What counts as table talk?",
      a: "Table talk is any verbal communication that gives information about your hand or strategy to other players, or that influences how others play. Examples: announcing what you need, commenting on another player's discard choices, or reacting to tiles in a way that signals your hand. Table talk is generally prohibited in competitive play. In casual home games, groups set their own rules.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "call-window",
      q: "How fast do I have to call a discarded tile?",
      a: "You may claim a discard until the next player has picked a tile from the wall and racked it, or has discarded. Once that player has picked and racked, the window to call the previous discard is closed. There is no strict timer, but call promptly and say it out loud; hesitating too long is considered poor etiquette.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "disputes",
      q: "Who resolves rules disputes during a game?",
      a: "In a home game, all four players agree together (majority rules or unanimity, depending on the group). In a league or club setting, a designated rule referee or club leader makes the call. If no resolution is possible mid-game, the safest option is to replay the hand.",
      kind: "house",
      evidence: "unverified",
    },
    {
      id: "see-exposed",
      q: "Can I ask to see another player's exposed tiles?",
      a: "Yes. Exposed tiles (those placed face-up on the table after a call) are always visible and any player may look at them at any time. Concealed tiles in another player's rack are private.",
      kind: "standard",
      evidence: "owner",
    },
    {
      id: "house-vs-nmjl",
      q: "What is the difference between a house rule and an NMJL rule?",
      a: "NMJL rules are the official rules published by the National Mah Jongg League and apply to all standard American Mahjong play. House rules are variations or additions agreed upon by a specific group that are not part of the official rules. House rules are fine for casual play; just make sure all players agree before the game starts. When in doubt about what is 'official,' the NMJL card and published guidelines are the authority.",
      kind: "standard",
      evidence: "owner",
    },
  ],
};
