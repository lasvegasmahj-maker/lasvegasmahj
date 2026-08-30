import type { RulesTopic } from "./types";

export const THE_CARD: RulesTopic = {
  slug: "the-card",
  title: "The Card",
  qa: [
    {
      id: "new-card",
      q: "When does the new NMJL card come out each year?",
      a: "The National Mah Jongg League releases a new card every spring, and the hands change every year, so players buy the new card each season directly from the League. You can order it at the NMJL website (nationalmahjonggleague.org).",
      kind: "standard",
      evidence: "owner",
    },
    {
      id: "numbers",
      q: "What do the numbers on the card mean?",
      a: "A digit printed in a hand on the card is usually the tile's number, not a group size: the card shows a group by repeating that tile, so three of the same digit is a Pung of that number and four is a Kong. The card's key defines a Pair as 2 like tiles, a Pung as 3, a Kong as 4, a Quint as 5, and a Sextet as 6. When you see a placeholder like 'any like number,' you pick the number yourself and use it consistently throughout that hand.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "like-number",
      q: "What does 'any like number' mean on the card?",
      a: "'Any like number' means you can choose any number (1 through 9) and use that same number across the required suits. For example, if the hand calls for 3 Bams, 3 Craks, and 3 Dots of 'any like number,' all three sets must use the same number (say, all 4s).",
      kind: "standard",
      evidence: "owner",
    },
    {
      id: "consecutive",
      q: "What does 'consecutive numbers' mean?",
      a: "Consecutive numbers are sequential: 1-2-3, or 4-5-6, etc. The hand will specify how many consecutive numbers you need and in which suits. You choose the starting number, but all tiles must follow in order without gaps.",
      kind: "standard",
      evidence: "owner",
    },
    {
      id: "open-closed",
      q: "What is the difference between an open and closed hand?",
      a: "An open hand allows you to call discards from other players to build exposed sets. A closed hand must be built from your own draws; you cannot call discards to build groups. The one exception is the tile that completes your mahjong: any tile except a joker may be called for mahjong, even for a concealed hand. On the card, concealed hands are marked C in the value column; check that mark before you call.",
      kind: "standard",
      evidence: "card",
    },
    {
      id: "last-year",
      q: "Can I play with last year's card?",
      a: "The League releases a new card every spring and the hands change, so play uses the current year's card. In casual home games, groups sometimes agree to use an older card; just make sure everyone is playing from the same card.",
      kind: "house",
      evidence: "unverified",
    },
  ],
};
