// Structural site intent: the one surface where a site may take a question away from the
// shared rules engine.
//
// The release gate of 2026-09-06 confirmed nineteen routing blockers with a single shape
// between them: a site route won because one ordinary English word was present. "when do you
// start the charleston" reached the lessons page because the studio vocabulary owned the words
// "when do you start"; "does a dead hand cost anything" reached it because the studio owned
// "cost"; a rules question that merely named Las Vegas reached it because the studio owned its
// own city. In the other direction a national directory answered "what rules can a director
// change at a tournament" by inventing a town called "A Tournament".
//
// So a site may claim a question only on STRUCTURAL evidence: a site OBJECT (a lesson, a class,
// a teacher, a club, an event, the studio itself) bound by a site FRAME (find it, book it,
// price it, where is it, when are you open). A place name alone is not discovery intent. A
// rules noun alone is not rules intent. A generic verb decides nothing by itself.
//
// Both sites' vocabulary lives here, in the shared core, for the reason the gate's twentieth
// blocker gives: while each site owned its own matcher in its own repository, nothing anywhere
// could compare the two, and the sites diverged behind byte-identical cores and identical
// fingerprints. Here one test can run every probe through both.

import type { SiteId } from "../site.ts";
import { COURSE_CONTENT } from "./topic.ts";
import { CONTACT_SENSE, MAHJ_ONLY_NOUN } from "../corpus/matchers.ts";

export type SiteIntentKind = "discovery" | "local";

export type SiteIntentResult = {
  // Which site surface wants this question, or null when nothing structural was found.
  kind: SiteIntentKind | null;
  // True only on object + frame evidence. A site route may never win without it.
  structural: boolean;
  // A site object or a booking word is present without a frame binding it. Never enough to
  // route, but it decides who answers when the rules engine reaches nothing: a question that
  // names a lesson gets the site's own reply, one that names none gets asked which rule it is
  // about, because a studio pointer is a worse answer to "what does consecutive run mean"
  // than a question is.
  weak: boolean;
  // Which rule fired, for tests, logs, and the conformance harness.
  reason: string;
};

// ---------------------------------------------------------------------------
// Objects
// ---------------------------------------------------------------------------

// Things you buy, book, or look up. None of these is a mahjong rules noun, so a strong object
// plus any frame is enough.
const OBJECT_STRONG =
  /\b(lessons?|class(?:es)?|courses?|workshops?|seminars?|studios?|venues?|clubs?|meet ?ups?|teachers?|instructors?|tutors?|coach(?:es)?|open play|private (?:lesson|event|party|group)|corporate (?:event|group|booking)|team ?building|birthday part(?:y|ies)|memberships?|gift cards?|wait ?lists?|reservations?|parking|directions|newsletter|retreats?|cruises?|openings?|availability|business hours?|address|directory|listings?|wait ?lists?|(?:extra|spare|second|new) (?:tile )?sets?)\b/i;

// Words both domains use. A weak object needs a search, booking, or price frame; a place or a
// clock alone is never enough, because "how does the charleston work tonight" is a rules
// question and "our game last night" is a story.
const OBJECT_WEAK = /\b(games?|groups?|events?|tournaments?|sessions?|seats?|spots?|part(?:y|ies)|players to play with|fourth|4th)\b/i;

// ---------------------------------------------------------------------------
// Frames
// ---------------------------------------------------------------------------

const FIND_FRAME =
  /\b(find|finds|finding|search(?:ing)? for|looking for|look for|where can i|where could i|where do i|where should i|where are|where is|is there|are there|any|know of|show me|list of|recommend|suggest|nearest|closest|who (?:can|does|teaches|offers|runs|hosts)|anyone (?:who|near|in)|someone (?:to|who))\b/i;
// "near me", "in Phoenix", "around 89138". A bare lowercase noun after a preposition is not a
// place: "at a tournament" and "in a pair" are rules phrases.
// States, spelled out or abbreviated, make a lowercase town name a place: real players type
// "soap lake wa" and "mahjong in wind gap pa", not "Soap Lake, WA".
const PLACE_FRAME = /\b(near|nearby|around)\b\s+(?:me\b|my area\b|here\b|[A-Z]|\d{5})|\b(?:in|at|around|near|outside|by|from|for|of)\s+(?:the\s+)?(?:[A-Z][a-z]+|\d{5})\b|\bmy area\b|\bzip\b|\bnear me\b|\bdowntown\b|\b(?:in|near|around|at|from)\s+[a-z][a-z.'-]{2,}(?:\s+[a-z.'-]+){0,2}\s+(?:a[lkzr]|c[aot]|de|fl|ga|hi|i[adln]|k[sy]|la|m[adeinost]|n[cdehjmvy]|o[hkr]|pa|ri|s[cd]|t[nx]|ut|v[at]|w[aivy]|alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/;
const BOOK_FRAME =
  /\b(book|books|booking|sign ?ups?|sign(?:ing)? up|register|registering|registration|reserve|reserving|enrol(?:l|ling)?|rsvp|attend|drop ?in|walk ?in|give (?:me|us)|set up|schedule|cancel|cancellation|refund|no.?show|money back|call ahead|swap my|switch my|skip (?:my|the|a|this) (?:class|lesson|session|week)|miss (?:my|the|a) (?:class|lesson|session)|reschedul\w+)\b/i;
const PRICE_FRAME =
  /\b(how much|cost|costs|costing|price|prices|priced|pricing|rates?|fees?|charge|charges|deposit|discount|refund|pay|pays|pay for|payment plan|per (?:class|lesson|session|person|hour))\b/i;
const OFFER_FRAME =
  /\bdo(?:es)? (?:you|they|the studio|your (?:studio|team))\b[^.?!]{0,24}\b(?:offer|run|teach|host|sell|provide|do|give|allow|take)\b|\bdo you have (?:a|an|any|anything|the|room|space|openings?|parking|availability|gift)\b|\bdo(?:es)? (?:you|your studio) deal with\b|\bwhat do you (?:offer|teach|have)\b|\bcan you (?:do|come|host|run|bring|teach me)\b/i;
// Reaching the business rather than the table. "what's the best way to contact you about a
// corporate event" is a booking enquiry, not a strategy question.
const CONTACT_FRAME = /\b(contact|reach|email|message|get in touch|call)\b[^.?!]{0,16}\b(you|your|the studio|the shop)\b/i;
const POSSESS_FRAME = /\b(?:your|my|our)\b/i;
// "when are you open", "what are your hours". Never "when do you start the charleston": the
// blocked context below takes the rules senses away from this frame.
const HOURS_FRAME =
  /\b(what time|opening hours|hours of operation|your hours|when (?:are|is) (?:you|your|the studio|the shop) (?:open|closed)|when do you (?:open|close)|are you open|open (?:today|now|tomorrow|on \w+day))\b/i;
const WHERE_FRAME = /\bwhere (?:is|are) (?:you|your|the studio|the shop)\b|\bhow do i get (?:there|to you)\b|\bwhat'?s? your address\b|\bwhich direction\b|\bhow far\b/i;
// A clock or a calendar. Never enough on its own ("how does the charleston work tonight" is a
// rules question), but beside something the site plainly sells it names a session to attend.
const TIME_FRAME =
  /\b(today|tonight|tomorrow|this (?:weekend|week|month|morning|afternoon|evening)|next (?:week|month)|(?:mon|tues|wednes|thurs|fri|satur|sun)days?|weekends?|weeknights?|mornings?|afternoons?|evenings?|\d{1,2}(?::\d{2})?\s?(?:am|pm))\b/i;
// The activity names itself: "where can I play", "somewhere to play".
const PLAY_SEARCH =
  /\bwhere (?:can|could|do|should) (?:i|we) (?:play|go|learn|practi[cs]e|take (?:a )?(?:class|lesson))\b|\bsomewhere to play\b|\bplaces? to play\b|\bwant to (?:join|play with)\b|\bjust moved\b|\b(?:is|are) there (?:any )?mah ?jongg?\b|^\s*\d{5}\s*$/i;
// Looking for a person to teach you. "who in dallas teaches beginners to read the card" is the
// directory's most commercially important query and must never reach the copyright guard.
const TEACH_SEARCH =
  /\bwho\b[^.?!]{0,24}\bteach(?:es|ing)?\b|\bteachers?\b[^.?!]{0,12}\b(?:near|in|around|who|available)\b|\bwho teaches\b|\banyone teaching\b|\b(?:does|do)\s+(?:anyone|anybody|someone|somebody|\w+)\b[^.?!]{0,24}\bteach(?:es)?\b|\bteach(?:es|ing)?\b[^.?!]{0,20}\b(?:near me|nearby|in \d{5}|on (?:mon|tues|wednes|thurs|fri|satur|sun)days?)\b/i;
// Addressed to the business itself. The direct-object guard keeps the rules senses out:
// "do you teach the charleston" is a player asking when the Charleston is taught at the table.
// How many people the room holds, not how many play the game. "How many people can the studio
// hold for a party?" used to be answered with the four-players rule.
const CAPACITY_FRAME = /\b(hold|holds|fit|fits|seat|seats|accommodate|accommodates|capacity|max(?:imum)?)\b/i;
// Naming your own group is a question about your group, not about calling mahjong.
const NAMING_OWN_GROUP =
  /\bwhat (?:should|shall|do|would|could) (?:i|we|you) (?:call|name)\b[^.?!]{0,30}\b(?:groups?|clubs?|teams?|leagues?|business|page|table)\b/i;
// The website, the booking system, the phone: this site's own machinery, never the table.
const SITE_MACHINERY =
  /\b(phones?|voicemail|emails?|texts?|websites?|apps?|forms?|links?|passwords?|logins?|accounts?|newsletters?|calendars?|invoices?|receipts?)\b/i;
// Buying the equipment. A shop question names tiles and sets, so the rules nouns in it decide
// nothing: "where can I buy a set with blanks" is not a question about blank tiles.
// Whether the game or a class suits a particular person. Not a rule; a question for whoever
// runs the group.
const FIT_FRAME =
  /\b(suits?|suited|good for|right for|ok(?:ay)? for|work for|works for|too hard for|hard for)\b[^.?!]{0,20}\b(beginners?|new players?|newbies|kids?|children|seniors?|us|me|my (?:mom|mother|husband|wife|group))\b/i;
const MUST_BUY = /\b(have to|has to|need to|needs to|must|required to|do i need|does everyone need|obliged)\b/i;
const SHOP_FRAME =
  /\b(buy|buying|purchase|purchasing|order|ordering|shop|store|sell|sells|selling|for sale|in stock|donate|donating)\b[^.?!]{0,24}\b(sets?|tiles?|racks?|mats?|cases?|bags?)\b|\b(sets?|tiles?|racks?|mats?)\b[^.?!]{0,24}\b(to buy|for sale|at the (?:shop|store)|in stock|to donate)\b/i;
// A listing that is wrong, out of date, or needs fixing: the directory's own upkeep.
const CORRECTION_FRAME = /\b(is wrong|incorrect|out of date|outdated|fix|fixes|fixed|update|updates|report|reports|remove|claim)\b/i;
// A proper noun sitting directly beside something the site lists: "Charlestown mahjong groups?".
const PROPER_PLACE_ADJACENT =
  /\b(?!What|Where|When|Who|How|Why|Which|Is|Are|Was|Were|Do|Does|Did|Can|Could|Should|Would|Must|May|The|This|That|These|Those|My|Our|Your|Any|Some|If|In|At|On|For|And|But|Not|You|We|They|She|He|It|American|Mahjong|Mahjongg|Find|Looking|Need|Want|Please|Hi|Hello|Thanks)[A-Z][a-z]{2,}\b[^.?!]{0,16}\b(?:mahjong |mah ?jongg? )?(?:groups?|games?|clubs?|teachers?|instructors?|class(?:es)?|lessons?|events?|tournaments?|meet ?ups?|venues?|studios?)\b/;
// "Does the Jokers Wild club in Henderson have mahjong?", "is kong still running the thursday
// game": a venue or a person is asked about by name, and the tile word is part of that name.
const VENUE_HAS =
  /\b(?:do|does|is|are|did|has|have)\b[^.?!]{0,44}\b(?:have|has|host|hosts|run|runs|running|play|plays|offer|offers|still)\b[^.?!]{0,24}\b(?:mah ?jongg?|games?|groups?|clubs?|tables?|nights?)\b/i;
// A listing noun modified by the game's name is a listing: "wall street mahjong club nyc".
const LISTING_NOUN =
  /\b(?:mah ?jongg?|mahj)\s+(?:clubs?|groups?|games?|class(?:es)?|lessons?|teachers?|instructors?|studios?|venues?|meet ?ups?|leagues?|nights?|tables?)\b/i;
// An honorific plus a name: a person the directory might list.
const PERSON_NAMED = /\b(?:mrs?|ms|mr|dr)\.?\s+[a-z][a-z'-]+/i;
const OFFER_SELF =
  /\bdo(?:es)? (?:you|your studio) (?:teach|offer|sell|host|provide)\b(?!\s+(?:the|a|an|us|me|to)?\s*(?:charleston|walls?|hands?|tiles?|jokers?|pass(?:es|ing)?|deal|kongs?|pungs?|discards?|exposures?)\b)|\bwhat do you (?:teach|offer|charge)\b|\bcan you (?:teach|show|walk) (?:me|us)\b(?!\s+(?:the )?(?:charleston|wall|deal)\b)/i;

// ---------------------------------------------------------------------------
// Blocked contexts
// ---------------------------------------------------------------------------

// Quoting a person is not searching for one. "my teacher said jokers cannot be passed, is that
// right" is a rules question that happens to name a teacher.
// Reporting verbs only, behind a possessive or a definite article. "a teacher in Naples who
// teaches new players to read the card" is a search; "my teacher said jokers cannot be passed"
// is a rules question. Teaching verbs are deliberately absent: a teacher who teaches is who a
// directory is for.
const ATTRIBUTION =
  /\b(?:my|our|the|her|his|their|this)\s+(?:\w+\s+){0,2}?(teachers?|instructors?|tutors?|coach(?:es)?|class|classes|group|friend|aunt|uncle|mother|mom|mum|sister|brother|partner|neighbou?r|table|club)\b[^.?!]{0,32}\b(said|says|say|told|tells|swears?|thinks?|claims?|insists?|mentioned|argued|argues|believes?|reckons?)\b/i;
// "what class of hands can use jokers": a category of hands, not a lesson.
const CLASS_OF = /\bclass(?:es)? of\b|\bhigh ?class\b|\bfirst ?class\b/i;
// "at the League", "league rules": the National Mah Jongg League, not a local league to join.
const LEAGUE_SENSE = /\b(?:the |nmjl |national (?:mah ?jongg?|mahjong) )league\b|\bleague (?:rules?|law|says|standard|play|rulebook)\b/i;
// A frame word whose object is a rules noun rather than a site object.
// Nouns that name something at the table. Deliberately excludes the game's own name and the
// everyday words every directory query carries: "do I have to pay to play mahjong in Naples"
// names a town and no rule.
const TABLE_NOUN =
  /\b(charleston|walls?|racks?|exposures?|discards?|jokers?|kongs?|pungs?|quints?|sextets?|bams?|craks?|dots?|dragons?|flowers?|soap|winds?|dead hands?|tiles?)\b/i;
const RULES_OBJECT =
  /\b(charleston|walls?|hands?|tiles?|racks?|exposures?|discards?|jokers?|pass(?:es|ing)?|deal|kongs?|pungs?|quints?|sextets?|bams?|craks?|dots?|dragons?|flowers?|soap|winds?|tables?|mahjong|mahj|maj|card)\b/i;

// ---------------------------------------------------------------------------
// Proximity
// ---------------------------------------------------------------------------

const NEAR = 55;

// Does a frame bind to an object, in either order, within one clause's reach? Token distance,
// not a lookaround, so the two matchers stay independently readable and testable.
function binds(q: string, frame: RegExp, object: RegExp): boolean {
  const f = frame.exec(q);
  const o = object.exec(q);
  if (!f || !o) return false;
  const fEnd = f.index + f[0].length;
  const oEnd = o.index + o[0].length;
  const gap = f.index <= o.index ? o.index - fEnd : f.index - oEnd;
  return gap <= NEAR;
}

// Every frame that can carry a weak object. A place or a time alone cannot.
const STRONG_FRAMES: Array<[string, RegExp]> = [
  ["find", FIND_FRAME],
  ["book", BOOK_FRAME],
  ["price", PRICE_FRAME],
  ["offer", OFFER_FRAME],
  ["contact", CONTACT_FRAME],
];
const ALL_FRAMES: Array<[string, RegExp]> = [...STRONG_FRAMES, ["place", PLACE_FRAME], ["possessive", POSSESS_FRAME], ["time", TIME_FRAME]];

const KIND: Record<SiteId, SiteIntentKind> = { fmg: "discovery", lvm: "local" };

/**
 * Structural site intent for one site. `structural` is the only field a router may act on.
 */
export function siteIntent(question: string, site: SiteId): SiteIntentResult {
  const kind = KIND[site];
  const weak =
    OBJECT_STRONG.test(question) ||
    BOOK_FRAME.test(question) ||
    PLAY_SEARCH.test(question) ||
    PRICE_FRAME.test(question) ||
    OFFER_FRAME.test(question) ||
    CONTACT_FRAME.test(question) ||
    TEACH_SEARCH.test(question) ||
    WHERE_FRAME.test(question) ||
    HOURS_FRAME.test(question) ||
    PLACE_FRAME.test(question) ||
    SITE_MACHINERY.test(question) ||
    LISTING_NOUN.test(question) ||
    (SHOP_FRAME.test(question) && !MUST_BUY.test(question)) ||
    CONTACT_SENSE.test(question) ||
    FIT_FRAME.test(question) ||
    COURSE_CONTENT.test(question);
  const no = (reason: string): SiteIntentResult => ({ kind: null, structural: false, weak, reason });

  if (ATTRIBUTION.test(question)) return no("attribution: a person is quoted, not sought");
  if (CLASS_OF.test(question)) return no("class-of: a category of hands, not a lesson");

  // Self-standing frames. "where is your studio", "what are your hours", "where can I play" name
  // the site outright. The rules senses of the same words ("when do you open the wall") are kept
  // out by the object test that follows.
  const yes = (reason: string): SiteIntentResult => ({ kind, structural: true, weak: true, reason });
  if (WHERE_FRAME.test(question) && !RULES_OBJECT.test(question)) return yes("where-frame");
  if (HOURS_FRAME.test(question) && !RULES_OBJECT.test(question)) return yes("hours-frame");
  if (PLAY_SEARCH.test(question)) return yes("play-search");
  // "your signup form goes blank when I hit register" is about the website, not blank tiles.
  if (binds(question, POSSESS_FRAME, BOOK_FRAME)) return yes("possessive+booking");
  if (TEACH_SEARCH.test(question)) return yes("teach-search");
  if (OFFER_SELF.test(question)) return yes("offer-self");
  if (COURSE_CONTENT.test(question)) return yes("course-syllabus");
  if (NAMING_OWN_GROUP.test(question)) return yes("naming-own-group");
  if (SHOP_FRAME.test(question) && !MUST_BUY.test(question)) return yes("shop-frame");
  if (LISTING_NOUN.test(question)) return yes("listing-noun");
  if (VENUE_HAS.test(question) && (PLACE_FRAME.test(question) || TIME_FRAME.test(question) || OBJECT_STRONG.test(question))) return yes("venue-has");
  // An explicit search frame beside a real place is a search even when no listing noun is
  // named: "any joker friendly beginner tables in katy tx".
  if (FIND_FRAME.test(question) && PLACE_FRAME.test(question)) return yes("find+place");
  if (PERSON_NAMED.test(question) && (OBJECT_STRONG.test(question) || OBJECT_WEAK.test(question))) return yes("person-named");
  if (FIT_FRAME.test(question)) return yes("fit-frame");
  // A phone call is the business's phone. "How long do I wait for a call back about lessons"
  // was reaching the call-window rule, which is about claiming a discard.
  if (CONTACT_SENSE.test(question) && !MAHJ_ONLY_NOUN.test(question)) return yes("contact-sense");
  if (PROPER_PLACE_ADJACENT.test(question)) return yes("proper-place-adjacent");

  const strongObject = OBJECT_STRONG.test(question) && !(LEAGUE_SENSE.test(question) && !OBJECT_STRONG.test(question.replace(LEAGUE_SENSE, " ")));
  if (strongObject) {
    for (const [name, frame] of ALL_FRAMES) {
      if (binds(question, frame, OBJECT_STRONG)) return yes(`strong-object+${name}`);
    }
    if (binds(question, CAPACITY_FRAME, OBJECT_STRONG)) return yes("strong-object+capacity");
    if (binds(question, CORRECTION_FRAME, OBJECT_STRONG)) return yes("strong-object+correction");
  }
  if (OBJECT_WEAK.test(question)) {
    for (const [name, frame] of STRONG_FRAMES) {
      // Money at the table is the one collision worth guarding: "does anybody pay in a wall
      // game" is a rule. A search is not disqualified by the tile word in a place name.
      if (name === "price" && TABLE_NOUN.test(question)) continue;
      if (binds(question, frame, OBJECT_WEAK)) return yes(`weak-object+${name}`);
    }
    // A weak object with a place still searches: "any tournaments in Florida", "games in 89138".
    if (binds(question, PLACE_FRAME, OBJECT_WEAK)) return yes("weak-object+place");
  }
  return no("no structural site intent");
}

/**
 * A question that names a real place and asks nothing about a rule. A rule noun beside a town
 * is not a rules question (release gate, root problem B), so the directory takes it.
 */
export function placeOnlySearch(question: string, hasRulesProposition: boolean): boolean {
  if (hasRulesProposition) return false;
  return PLACE_FRAME.test(question) && !TABLE_NOUN.test(question.replace(PLACE_FRAME, " "));
}

// The player is done with the current thread. Only a switch this explicit may take a
// conversation away from an active rules topic.
export const TOPIC_SWITCH_PHRASE =
  /\b(never ?mind|nevermind|forget (?:it|that|this)|different question|new question|another question|change (?:of )?subject|unrelated|ok(?:ay)?,? (?:forget|but)|anyway,)\b/i;

export const SITE_INTENT_INTERNALS = {
  OBJECT_STRONG,
  OBJECT_WEAK,
  FIND_FRAME,
  PLACE_FRAME,
  BOOK_FRAME,
  PRICE_FRAME,
  OFFER_FRAME,
  HOURS_FRAME,
  WHERE_FRAME,
  PLAY_SEARCH,
  TEACH_SEARCH,
  LISTING_NOUN,
  VENUE_HAS,
  CONTACT_FRAME,
  OFFER_SELF,
  ATTRIBUTION,
  RULES_OBJECT,
};
