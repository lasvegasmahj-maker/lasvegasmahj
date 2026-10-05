// The concept vocabulary: one definition per game action, referenced everywhere.
//
// Both release gates found the same shape of defect. The first found entries that answered a
// scene their text does not cover. The second found the narrower and more embarrassing version:
// "call mahjong during the charleston" is answered correctly, "declare mahjong during the
// charleston" is answered with the opposite ruling, because one verb was in a matcher and its
// synonym was not. A player who says "declare" instead of "call" is asking the same question.
//
// So the synonyms for a game action live here, once. Matchers compose these rather than
// spelling out their own verb lists, which is what let the two drift apart. Adding a synonym
// to a family fixes every entry that uses it, in one edit, and the metamorphic tests
// (tests/metamorphic.test.ts) then prove the whole family routes alike.
//
// Rules for this file:
//   * A family is a SEMANTIC family, not a spelling variant list. "declare" belongs with
//     "call" because they name the same act, not because they look alike.
//   * Nothing here may be so broad that an ordinary sentence trips it. Each family is a verb
//     or noun phrase for something that happens at a mahjong table.
//   * Never inline a synonym at a call site. If a word belongs to a family, add it here.

// ---------------------------------------------------------------------------
// Claiming a discard
// ---------------------------------------------------------------------------

/** Taking a tile somebody else threw. */
export const CLAIM_WORDS = "call|calls|called|calling|claim|claims|claimed|claiming|take|takes|took|taking|grab|grabs|grabbed|grabbing";

// ---------------------------------------------------------------------------
// Declaring mahjong
// ---------------------------------------------------------------------------

/**
 * Saying you have won. The gate of 2026-09-07 found "declare" missing from the claim verbs
 * while "call" was present, so the two phrasings of one question got opposite rulings.
 */
export const DECLARE_WORDS = "declare|declares|declared|declaring|call|calls|called|calling|announce|announces|announced|announcing|shout|shouts|shouted|yell|yells|yelled";
/**
 * Reporting verbs. These name declaring mahjong ONLY when bound to the word itself: "say
 * mahjong" is a declaration, "my teacher says" is a person being quoted. Keeping them out of
 * the free-standing claim vocabulary is what stops "the card says the discarder pays double"
 * from being read as a claim.
 */
export const SAY_WORDS = "say|says|said|saying|shout|shouts|shouted|yell|yells|yelled";

/** The word for the win itself. */
export const MAHJONG_WORDS = "mah ?jong+|mahj|maj";

/** Declaring mahjong, in any of its phrasings. */
export const DECLARE_MAHJONG = new RegExp(
  `(?:\\b(?:${DECLARE_WORDS}|${SAY_WORDS})\\b[^.?!,;]{0,16}\\b(?:${MAHJONG_WORDS})\\b|\\b(?:${MAHJONG_WORDS})\\b[^.?!,;]{0,16}\\b(?:${DECLARE_WORDS}|${SAY_WORDS})\\b)`,
  "i",
);

// ---------------------------------------------------------------------------
// Discarding, drawing, exposing, passing, exchanging
// ---------------------------------------------------------------------------

/** Putting a tile out. */
export const DISCARD_WORDS = "discard|discards|discarded|discarding|throw|throws|threw|thrown|throwing|toss|tosses|tossed|tossing|put down|puts down|putting down|play|plays|played";

/** Taking a tile from the wall. */
export const DRAW_WORDS = "draw|draws|drew|drawing|pick|picks|picked|picking|take|takes|took|taking";

/** Putting a group face up on the rack. */
export const EXPOSE_WORDS = "expose|exposes|exposed|exposing|exposure|exposures|meld|melds|melded|put up|puts up|putting up|lay out|lays out|laid out|lay down|lays down|laid down";

/** Moving tiles in the Charleston. */
// "hand over" needs its object, or "is the hand over?" becomes a Charleston pass.
export const PASS_WORDS = "pass|passes|passed|passing|send|sends|sent|sending|hand(?:s|ed|ing)? (?:it|them|those|tiles?|three|3) over|hand(?:s|ed|ing)? over to|slide|slides|slid|sliding";

/** Swapping a real tile for a joker in an exposure. */
export const EXCHANGE_WORDS = "exchange|exchanges|exchanged|exchanging|redeem|redeems|redeemed|redeeming|swap|swaps|swapped|swapping|trade|trades|traded|trading";

/** A hand that is out of the deal. */
export const DEAD_WORDS = "dead|killed|disqualified|out of the (?:hand|deal|game)|no longer in";

// ---------------------------------------------------------------------------
// Permission and question framing
// ---------------------------------------------------------------------------

/**
 * The many ways a player asks whether something is allowed. Used by the router's rules-ask
 * test, so "am I allowed to", "what happens if I" and "can I" are one concept.
 */
export const PERMISSION_FRAME =
  /\b(?:can|could|may|might|should|must|am i allowed to|are we allowed to|is (?:it|that) (?:ok|okay|allowed|legal|permitted|against the rules)|do i have to|does everyone have to|do(?:es)? (?:my|our|the|a|his|her|their|each|every) \w+ have to|are you allowed to|is (?:a|the) player allowed to|what happens (?:if|when)|what if|is there a rule)\b/i;

/**
 * Asking anything at all about how the game works. Broader than PERMISSION_FRAME and used the
 * same way: with a supporting corpus entry it makes a rules ASK, which outranks a site frame.
 * "How does the charleston work" is a rules question; without this the compound sentence
 * "how does the charleston work and when is your next beginner class" lost its rules half.
 */
export const QUESTION_FRAME =
  /\b(?:how|what|when|why|which|who|whose)\b[^.?!]{0,40}\b(?:do|does|did|is|are|was|were|work|works|mean|means|happen|happens|go|goes|count|counts|apply|applies|sits?|deals?|makes?|causes?|kills?|allows?|requires?|say|says)\b|\b(?:explain|describe|tell me about)\b/i;

/** Who is doing it. A rule does not change because the player asked about somebody else. */
export const PLAYER_REF = /\b(?:i|we|you|she|he|they|someone|somebody|anyone|anybody|a player|the player|another player|my (?:partner|neighbou?r|friend|mom|mother|aunt)|east|west|north|south|the dealer)\b/i;

/** Politeness and filler a player wraps a question in. Never changes what is being asked. */
export const FILLER =
  /\b(?:please|just|actually|so|well|hi|hello|hey|thanks|thank you|quick question|one more thing|sorry|um|uh|ok(?:ay)?|by the way|btw|real quick|if you (?:know|can))\b/i;

// ---------------------------------------------------------------------------
// Composed concept matchers
// ---------------------------------------------------------------------------

export const CLAIM_CONCEPT = new RegExp(`\\b(?:${CLAIM_WORDS})\\b`, "i");
export const DISCARD_CONCEPT = new RegExp(`\\b(?:${DISCARD_WORDS})\\b`, "i");
export const DRAW_CONCEPT = new RegExp(`\\b(?:${DRAW_WORDS})\\b`, "i");
export const EXPOSE_CONCEPT = new RegExp(`\\b(?:${EXPOSE_WORDS})\\b`, "i");
export const PASS_CONCEPT = new RegExp(`\\b(?:${PASS_WORDS})\\b`, "i");
export const EXCHANGE_CONCEPT = new RegExp(`\\b(?:${EXCHANGE_WORDS})\\b`, "i");
export const DEAD_CONCEPT = new RegExp(`\\b(?:${DEAD_WORDS})\\b`, "i");

/** Every family, for the metamorphic tests to enumerate. */
export const CONCEPT_FAMILIES: ReadonlyArray<{ name: string; words: string[] }> = [
  { name: "claim", words: CLAIM_WORDS.split("|") },
  { name: "say", words: SAY_WORDS.split("|") },
  { name: "declare", words: DECLARE_WORDS.split("|") },
  { name: "discard", words: DISCARD_WORDS.split("|") },
  { name: "draw", words: DRAW_WORDS.split("|") },
  { name: "expose", words: EXPOSE_WORDS.split("|") },
  { name: "pass", words: PASS_WORDS.split("|") },
  { name: "exchange", words: EXCHANGE_WORDS.split("|") },
  { name: "dead", words: DEAD_WORDS.split("|") },
];
