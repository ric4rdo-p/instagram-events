// Scripted stand-ins for Muse. Every function here returns the same shape a real
// Muse call would, using simple rules over the demo data so the demo runs offline.
// Replace these one at a time with Muse Spark / Muse Image calls (see ./index.js).
import { feedEvents, weekdayFull } from "../ui/data";

// ---------- Search ----------

// Keep matches, fall back to everything so a results section is never empty
export function searchPool(query, pool, textOf) {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const matches = pool.filter((item) => words.some((w) => textOf(item).toLowerCase().includes(w)));
  return matches.length ? matches : pool;
}

export function searchEvents(query, pool = feedEvents) {
  return searchPool(query, pool, (e) => `${e.title} ${e.place} ${e.reason} ${e.about}`);
}

// ---------- Comment mood ----------

const POSITIVE = /love|great|amazing|fun|welcom|best|chill|easy|worth|so good|unreal|beautiful|friendly/i;
const NEGATIVE = /rough|crowded|packed|bad|boring|expensive|disorganized|too loud|cold/i;
const PRAISE = [
  { re: /music|dj|set|band|playlist/i, phrase: "the music" },
  { re: /welcom|friendly|crowd|solo|friends/i, phrase: "how welcoming the crowd is" },
  { re: /lesson|beginner|easy|jump in/i, phrase: "how easy it is to join in" },
  { re: /food|potluck|snack|truck/i, phrase: "the food" },
  { re: /space|lawn|view/i, phrase: "the space" },
];
const CONCERNS = [
  { re: /parking|train/i, phrase: "parking" },
  { re: /crowded|packed|line/i, phrase: "crowds later in the night" },
  { re: /cold|fog|wind/i, phrase: "the weather" },
];

export function summarizeComments(comments) {
  const guests = comments.filter((c) => !c.isHost);
  if (guests.length === 0) return null;
  const positive = guests.filter((c) => POSITIVE.test(c.text));
  const negative = guests.filter((c) => NEGATIVE.test(c.text));
  const praise = PRAISE.filter((p) => positive.some((c) => p.re.test(c.text))).map((p) => p.phrase).slice(0, 2);
  const concern = CONCERNS.find((p) => guests.some((c) => p.re.test(c.text)))?.phrase;
  const liked = praise.length ? praise.join(" and ") : "the overall feel";
  let message;
  if (positive.length === 0 && negative.length === 0) message = "People are mostly asking questions so far, and the host is answering them.";
  else if (negative.length === 0) message = `People are excited about this one, especially ${liked}.`;
  else if (positive.length > negative.length) message = `Most people are feeling good about it and talk about ${liked}.`;
  else message = `Feelings are mixed. People like ${liked}, but not everyone had a great time.`;
  if (concern) message += ` A few suggest planning ahead for ${concern}.`;
  return { message, count: guests.length };
}

// ---------- Event summary ----------

// What to expect: cost, vibe, who it's for. In the demo each event carries its summary.
export function summarizeEvent(event) {
  return event.summary;
}

// ---------- Ask Muse ----------

export function answerQuestion(question, event) {
  const q = question.toLowerCase();
  const venue = event.place.split(" • ")[0];
  if (/solo|alone|by myself|myself|know anyone/.test(q)) return `Yes. Most people at ${event.title} come solo or in pairs, and the host keeps it welcoming. ${event.social.split(" and ")[0]} will be there if you want a familiar face.`;
  if (/wear|dress|outfit|bring/.test(q)) return "Casual and comfortable. Past attendees posted sneakers and layers. It gets cooler after sunset, so bring a jacket.";
  if (/park|parking|drive|get there|transit|bart|bus/.test(q)) return `Street parking near ${venue} fills up quickly. Transit or a bike is easier, and there’s a rack by the main entrance.`;
  if (/cost|price|free|ticket|pay|\$/.test(q)) return event.price === "Free" ? "It’s free. The host asks people to RSVP so they can plan for the headcount." : `Tickets are ${event.price} at the door. RSVPing on Instagram holds your spot.`;
  if (/time|when|start|late|end/.test(q)) return `It starts at ${event.time} on ${weekdayFull[event.weekday]}. The first 30 minutes are the easiest time to meet people.`;
  return `From the host’s posts and past events: ${event.summary} Ask me about cost, dress code, parking, or going solo for specifics.`;
}

// ---------- Similar events ----------

const SIMILAR_STOP = new Set(["about", "their", "there", "with", "from", "your", "every", "level", "people", "after", "takes", "right"]);
const keywords = (e) => new Set(`${e.title} ${e.about}`.toLowerCase().match(/[a-z]{5,}/g)?.filter((w) => !SIMILAR_STOP.has(w)) ?? []);
const FRIENDS = /maya|jordan|sofia|friend/i;

function similarScore(a, b) {
  const ka = keywords(a);
  let score = [...keywords(b)].filter((w) => ka.has(w)).length;
  if (a.price === b.price) score += 1;
  if (FRIENDS.test(b.social)) score += 1;
  return score;
}

function similarReason(a, b) {
  if (FRIENDS.test(b.social)) return b.social.replace(/ and \d+ others/, " and others");
  if (a.price === "Free" && b.price === "Free") return "Also free • Similar crowd";
  return "Popular with people going to this";
}

export function similarEvents(event, pool = feedEvents, limit = 4) {
  return pool
    .filter((e) => e.id !== event.id)
    .map((e) => ({ event: e, score: similarScore(event, e), reason: similarReason(event, e) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(({ event: e, reason }) => ({ event: e, reason }));
}

// ---------- Writing help for hosts ----------

const SMALL_WORDS = new Set(["a", "an", "and", "at", "for", "in", "of", "on", "or", "the", "to", "with", "vs"]);
function toTitleCase(text) {
  return text
    .split(" ")
    .map((word, i) => {
      if (/[A-Z]/.test(word.slice(1))) return word; // keep acronyms like DJ, UT
      const lower = word.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function suggestTitle(title) {
  const cleaned = title.trim().replace(/\s+/g, " ").replace(/[.!]+$/, "");
  if (cleaned.length < 3) return null;
  const suggestion = toTitleCase(cleaned);
  return suggestion === title.trim() ? null : suggestion;
}

export function suggestDescription(description) {
  const cleaned = description.trim().replace(/\s+/g, " ");
  if (cleaned.length < 15) return null;
  let suggestion = cleaned.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead, ch) => lead + ch.toUpperCase());
  suggestion = suggestion.replace(/\bi\b/g, "I");
  if (!/[.!?]$/.test(suggestion)) suggestion += ".";
  if (!/welcome|solo|everyone/i.test(suggestion)) suggestion += " Come solo or bring a friend. Everyone is welcome.";
  return suggestion === description.trim() ? null : suggestion;
}

// ---------- Muse Studio ----------

// Cover "looks" stand in for generated images. Native images can't take CSS
// filters, so each look is a color wash laid over the photo.
export const coverLooks = [
  { id: "golden", label: "Golden hour", tint: "rgba(255,170,60,0.24)" },
  { id: "film", label: "Film", tint: "rgba(120,90,50,0.26)" },
  { id: "vivid", label: "Vivid", tint: "rgba(255,0,120,0.10)" },
  { id: "dusk", label: "Dusk", tint: "rgba(70,40,160,0.30)" },
];

// ---------- Search summary ----------

export function summarizeSearch(results) {
  const count = results.length;
  return { count, text: "that match. They’re close by, fit your usual saves, and friends are interested in some of them." };
}

// ---------- Event drafting for hosts ----------

export function draftEventDetails() {
  return {
    title: "Golden Hour Community Picnic",
    description: "Meet us on the lawn for live music, picnic blankets, and golden hour with your neighbors. Come solo or bring a friend. Everyone is welcome.",
  };
}

export function audienceMatch(audience, venue) {
  return audience === "Public"
    ? "Your event will be recommended to local people who engage with community, music, and outdoor events, not just your followers."
    : `Muse will only recommend it to ${audience.toLowerCase()}${venue ? ` near ${venue.name}` : ""} who engage with events like yours.`;
}

// ---------- Promo Kit copy ----------

export function reelCaptions(draft) {
  return [draft.title || "Your event", draft.range, "RSVP on Instagram"];
}

export function adVariations(draft) {
  const title = draft.title || "Your event";
  return [
    { id: "adA", headline: `${title} • ${draft.range.split(" • ")[0]}`, body: `Your next favorite night out is at ${draft.venueName || "a spot near you"}. ${draft.price}. Grab a friend and RSVP.`, cta: "RSVP now" },
    { id: "adB", headline: "Come solo, leave with friends", body: `${title} brings people together ${draft.range.toLowerCase().includes("sat") ? "this Saturday" : "soon"}. Spots are filling up.`, cta: "Learn more" },
  ];
}

// ---------- Feed ranking ----------

// Orders events for this person: near them, happening soon, matching their
// interests and what friends are going to. The demo data is already in that order.
export function rankEvents(pool = feedEvents) {
  return pool;
}

// Why Muse picked an event for this person. In the demo each event carries its reason.
export function recommendationReason(event) {
  return event.reason;
}
