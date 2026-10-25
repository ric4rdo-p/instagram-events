// Demo-only content for the Events UI. Nothing here is read from or written to Supabase.

export const photos = {
  hero: "https://images.unsplash.com/photo-1624834464317-755945c33322?auto=format&fit=crop&w=1100&q=86",
  dance: "https://images.unsplash.com/photo-1624834465472-22964d0434e3?auto=format&fit=crop&w=900&q=84",
  music: "https://images.unsplash.com/photo-1511854085838-e8808da760f5?auto=format&fit=crop&w=900&q=84",
  market: "https://images.unsplash.com/photo-1659117253804-b1f726b3362e?auto=format&fit=crop&w=900&q=84",
  festival: "https://images.unsplash.com/photo-1587517947347-293792660d1f?auto=format&fit=crop&w=900&q=84",
};
export const photoList = Object.values(photos);

export const ME = "ahmed";

export const categories = ["For you", "Music", "Dance", "Food", "Art", "Outdoors"];

export const events = [
  {
    id: 1, image: photos.hero, weekday: "SAT", month: "MAR", day: "14", time: "4:00 PM",
    title: "Golden Hour in the Park", place: "Mission Dolores Park", social: "Maya, Jordan and 24 others are going",
    reason: "Because you follow sf.funcheap", host: "sfgoldenhour", avatar: "GH", gradient: "sunset", price: "Free",
    about: "Music, picnic blankets, and new friends as the sun sets over the city. Bring something to share. Everyone’s welcome.",
    summary: "Relaxed, social, and easy to join solo. Based on your saves, you’ll probably like the live indie set at 6 PM.",
  },
  {
    id: 2, image: photos.dance, weekday: "FRI", month: "MAR", day: "20", time: "7:30 PM",
    title: "Bay Area Open Dance Night", place: "ODC Theater • 1.8 mi", social: "Sofia and 11 others are interested",
    reason: "Popular with your friends", host: "bayareadance", avatar: "BA", gradient: "violet", price: "$15",
    about: "An open floor for every style and every level. A short warm-up lesson kicks things off, then the DJ takes over.",
    summary: "High energy but beginner friendly. Most people come without a partner. Two of your friends are interested.",
  },
  {
    id: 3, image: photos.music, weekday: "SUN", month: "MAR", day: "22", time: "1:00 PM",
    title: "Sunday Sessions: Live & Local", place: "The Bandshell • Golden Gate Park", social: "42 people are going",
    reason: "Matches music you save", host: "illuminatesf", avatar: "SF", gradient: "blue", price: "Free",
    about: "Four local acts on the bandshell stage, food trucks on the lawn, and plenty of room to spread out.",
    summary: "Laid-back afternoon with live music. Good for groups. Arrive early if you want a spot near the stage.",
  },
  {
    id: 4, image: photos.festival, weekday: "THU", month: "MAR", day: "19", time: "8:00 PM",
    title: "Rooftop Board Game Night", place: "The Hive Rooftop • 0.6 mi", social: "18 people are going",
    reason: "Hosted by you", host: ME, avatar: "A", gradient: "sunset", price: "Free",
    about: "Bring a game or play one of ours. Snacks provided, city views included.",
    summary: "Casual and low key. Great for meeting people one table at a time.",
  },
  {
    id: 5, image: photos.market, weekday: "SAT", month: "MAR", day: "28", time: "11:00 AM",
    title: "Neighborhood Swap Meet", place: "Precita Park • 2.3 mi", social: "9 people are going",
    reason: "Hosted by you", host: ME, avatar: "A", gradient: "violet", price: "Free",
    about: "Trade clothes, books, and plants with your neighbors. Leftovers go to a local donation center.",
    summary: "Family friendly morning market. Bring a bag or two of things to trade.",
  },
  {
    id: 6, image: photos.market, weekday: "FRI", month: "MAR", day: "27", time: "6:00 PM",
    title: "Mission Night Market", place: "Valencia Street • 0.9 mi", social: "58 people are interested",
    reason: "Popular near you", host: "missionmarkets", avatar: "MM", gradient: "blue", price: "Free",
    about: "Food stalls, local makers, and a DJ on the corner. Come hungry and bring friends.",
    summary: "Busy and lively. Come hungry, and bring cash for the smaller stalls.",
  },
  {
    id: 7, image: photos.dance, weekday: "SAT", month: "MAR", day: "21", time: "10:00 AM",
    title: "Saturday Morning Run Club", place: "Crissy Field • 4.5 mi", social: "Jordan and 15 others are going",
    reason: "Matches your saves", host: "sfrunclub", avatar: "RC", gradient: "violet", price: "Free",
    about: "An easy social 5K along the water with pace groups for every level, then coffee together.",
    summary: "Friendly and beginner welcoming. Most people come solo and stay for coffee.",
  },
];
export const feedEvents = events.filter((e) => e.host !== ME);
export const getEvent = (id) => events.find((e) => e.id === id) ?? events[0];
export const dateLabel = (e) => `${e.weekday}, ${e.month} ${e.day} • ${e.time}`;
export const weekdayFull = { SUN: "Sunday", MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday", SAT: "Saturday" };
export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LONG = Object.values(weekdayFull);
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Venues and maps
export const venues = [
  { name: "Mission Dolores Park", address: "19th St & Dolores St, San Francisco", lat: 37.7596, lng: -122.4269 },
  { name: "ODC Theater", address: "17th St, Mission District, San Francisco", lat: 37.7634, lng: -122.4166 },
  { name: "The Bandshell, Golden Gate Park", address: "Music Concourse Dr, San Francisco", lat: 37.7705, lng: -122.4683 },
  { name: "The Hive Rooftop", address: "[Street address], San Francisco", lat: 37.7649, lng: -122.4194 },
  { name: "Precita Park", address: "Precita Ave & Folsom St, San Francisco", lat: 37.747, lng: -122.411 },
  { name: "Valencia Street", address: "Valencia St & 20th St, San Francisco", lat: 37.7587, lng: -122.4214 },
  { name: "Crissy Field", address: "Crissy Field, San Francisco", lat: 37.8039, lng: -122.4643 },
];
const eventVenue = { 1: venues[0], 2: venues[1], 3: venues[2], 4: venues[3], 5: venues[4], 6: venues[5], 7: venues[6] };
export const venueFor = (e) => e.venue ?? eventVenue[e.id] ?? venues[0];

const aboutMore = {
  1: "The host will have a speaker set up near the top of the hill. Food is potluck style, and there’s a quiet corner for anyone who wants a calmer spot. The event goes ahead in light fog but moves to the following Saturday if it rains.",
  2: "The warm-up lesson starts right at 7:30, so come a few minutes early. Wear shoes you can move in. Water is available at the bar, and the floor stays open until 11.",
  3: "Sets start every 45 minutes. Blankets and low chairs are welcome on the lawn. The food trucks take cards, and there’s a free bike valet by the entrance.",
  4: "Games run from quick party games to longer strategy picks. Tables rotate every hour so you meet new people.",
  5: "Drop off items from 10:30. Anything left at the end gets donated.",
};
export const detailsFor = (e) => e.details ?? aboutMore[e.id];

// The demo persona lives in the Mission District; drive times are measured from there.
export const DEMO_ORIGIN = { lat: 37.7599, lng: -122.4148 };
export function kmBetween(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
// City driving estimate: road distance ~1.35x straight line at ~28 km/h, plus 2 min to park
export const driveMinutes = (km) => Math.max(3, Math.round(((km * 1.35) / 28) * 60) + 2);

export function eventStart(e) {
  if (e.startsAt) return new Date(e.startsAt);
  const m = /(\d+):(\d+)\s*(AM|PM)/i.exec(e.time);
  let hours = m ? Number(m[1]) % 12 : 12;
  if (m && m[3].toUpperCase() === "PM") hours += 12;
  // Seed events only store a weekday and date, so pick the next year where they line up
  const day = WEEKDAYS.indexOf(e.weekday);
  const thisYear = new Date().getFullYear();
  const candidates = Array.from({ length: 8 }, (_, i) => new Date(thisYear + i, MONTHS.indexOf(e.month), Number(e.day), hours, m ? Number(m[2]) : 0));
  return candidates.find((d) => d.getDay() === day && d.getTime() > Date.now() - 864e5) ?? candidates.find((d) => d.getDay() === day) ?? candidates[0];
}

// Event end times and links
const durationHours = { 1: 4, 2: 3.5, 3: 5, 4: 3, 5: 3, 6: 4, 7: 2 };
const eventLinks = {
  1: [
    { label: "Potluck sign-up sheet", url: "https://example.com/golden-hour-potluck" },
    { label: "Host’s sunset playlist", url: "https://example.com/golden-hour-playlist" },
  ],
  2: [{ label: "Tickets", url: "https://example.com/open-dance-night" }],
};
export const linksFor = (e) => e.links ?? eventLinks[e.id] ?? [];
export function eventEnd(e) {
  if (e.endsAt) return new Date(e.endsAt);
  return new Date(eventStart(e).getTime() + (durationHours[e.id] ?? 3) * 60 * 60 * 1000);
}

export const pad2 = (n) => String(n).padStart(2, "0");
export const sameDay = (a, b) => a.toDateString() === b.toDateString();
export const shortDay = (d) => `${WEEKDAY_SHORT[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
export const clock = (d) => `${d.getHours() % 12 || 12}:${pad2(d.getMinutes())} ${d.getHours() < 12 ? "AM" : "PM"}`;
export const weekdayShort = (d) => WEEKDAY_SHORT[d.getDay()];
export const monthShort = (d) => MONTH_SHORT[d.getMonth()];
export const monthLong = (d) => MONTH_LONG[d.getMonth()];
export function formatRange(start, end) {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Choose a start and end";
  return sameDay(start, end) ? `${shortDay(start)} • ${clock(start)} – ${clock(end)}` : `${shortDay(start)}, ${clock(start)} – ${shortDay(end)}, ${clock(end)}`;
}
export function rangeParts(start, end) {
  if (sameDay(start, end)) {
    return { title: `${WEEKDAY_LONG[start.getDay()]}, ${MONTH_LONG[start.getMonth()]} ${start.getDate()}`, detail: `${clock(start)} – ${clock(end)}` };
  }
  return { title: `${shortDay(start)} – ${shortDay(end)}`, detail: `${clock(start)} – ${clock(end)}` };
}
export const domainOf = (url) => url.replace(/^https?:\/\//i, "").split(/[/?#]/)[0].replace(/^www\./, "") || url;

export function nextSaturday(hours) {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  d.setHours(hours, 0, 0, 0);
  return d;
}

const GRADIENTS = ["violet", "blue", "sunset"];
export const initialsOf = (user) => user.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase();
export const gradientOf = (user) => GRADIENTS[[...user].reduce((n, ch) => n + ch.charCodeAt(0), 0) % GRADIENTS.length];

export const seedComments = {
  1: [
    { id: "c1", user: "maya.chen", text: "Went to the last one and it was so welcoming. The music at sunset was amazing!", ago: "2d", likes: 24 },
    { id: "c2", user: "luis.m", text: "Is it okay to come solo? Never been before.", ago: "1d", likes: 3 },
    { id: "c3", user: "sfgoldenhour", text: "@luis.m absolutely! Most people come solo. Look for the yellow blanket.", ago: "1d", likes: 11, isHost: true },
    { id: "c4", user: "nina.park", text: "Parking was rough last time, take the train if you can.", ago: "20h", likes: 6 },
    { id: "c5", user: "devon.r", text: "Best chill night in the city. Bringing friends this time.", ago: "5h", likes: 9 },
  ],
  2: [
    { id: "c6", user: "sofiakim", text: "The warm-up lesson made it so easy to jump in. Super fun crowd.", ago: "3d", likes: 14 },
    { id: "c7", user: "priya.s", text: "Gets crowded after 9 but worth it.", ago: "2d", likes: 4 },
  ],
  3: [{ id: "c8", user: "devon.r", text: "Great music and lots of space on the lawn.", ago: "4d", likes: 7 }],
};

export const seedExperiences = {
  1: [
    { id: "x1", kind: "reel", user: "maya.chen", image: photos.hero, caption: "sunset + strangers who became friends", tagHost: true, tagEvent: true, views: "8.2K" },
    { id: "x2", kind: "post", user: "jordanlee", image: photos.dance, caption: "Last month’s Golden Hour was unreal. See you Saturday.", tagHost: true, tagEvent: true },
    { id: "x3", kind: "reel", user: "sf.weekender", image: photos.festival, caption: "POV: you came solo and left with a picnic crew", tagHost: false, tagEvent: true, views: "21K" },
    { id: "x6", kind: "post", user: "nina.park", image: photos.music, caption: "The 6 PM set was everything", tagHost: true, tagEvent: true },
    { id: "x7", kind: "reel", user: "devon.r", image: photos.market, caption: "potluck spread was elite", tagHost: false, tagEvent: true, views: "4.6K" },
    { id: "x8", kind: "reel", user: "luis.m", image: photos.dance, caption: "first time going solo, 10/10", tagHost: true, tagEvent: true, views: "1.2K" },
    { id: "x9", kind: "post", user: "priya.s", image: photos.hero, caption: "golden hour did not disappoint", tagHost: false, tagEvent: true },
  ],
  2: [{ id: "x4", kind: "reel", user: "sofiakim", image: photos.dance, caption: "open floor energy", tagHost: true, tagEvent: true, views: "3.4K" }],
  3: [{ id: "x5", kind: "post", user: "devon.r", image: photos.music, caption: "Best free show in the city.", tagHost: false, tagEvent: true }],
};

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

// Muse reads the comments to describe how people feel about the event
export function commentMood(comments) {
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

export function searchEvents(query, pool = feedEvents) {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const matches = pool.filter((e) => words.some((w) => `${e.title} ${e.place} ${e.reason} ${e.about}`.toLowerCase().includes(w)));
  return matches.length ? matches : pool;
}

// Feed content that keeps loading as you scroll
export const postSeeds = [
  { user: "maya.chen", place: "Dolores Park, San Francisco", image: photos.dance, likes: "Liked by jordanlee and 3,241 others", caption: "Friday nights are for dancing with your people", comments: 48 },
  { user: "sf.weekender", place: "San Francisco, California", image: photos.market, likes: "2,806 likes", caption: "City weekends just hit different.", comments: 31 },
  { user: "jordanlee", place: "Golden Gate Park", image: photos.music, likes: "Liked by maya.chen and 912 others", caption: "Sunday sessions never miss.", comments: 12 },
  { user: "sofiakim", place: "Mission District", image: photos.festival, likes: "1,477 likes", caption: "Found my people at the night market.", comments: 22 },
  { user: "devon.r", place: "Bernal Heights", image: photos.hero, likes: "Liked by priya.s and 640 others", caption: "Golden hour, good company.", comments: 9 },
];

export const attendedEvents = [
  { id: "a1", image: photos.dance, title: "Sunset Salsa on the Pier", date: "SAT, FEB 21", host: "bayareadance" },
  { id: "a2", image: photos.market, title: "Night Market at the Plaza", date: "FRI, FEB 13", host: "sf.weekender" },
  { id: "a3", image: photos.music, title: "Open Mic Under the Lights", date: "THU, JAN 29", host: "illuminatesf" },
];

// Muse Studio looks (mocked image generation). Native images can't take CSS filters,
// so each look is a color wash laid over the photo.
export const looks = [
  { id: "golden", label: "Golden hour", tint: "rgba(255,170,60,0.24)" },
  { id: "film", label: "Film", tint: "rgba(120,90,50,0.26)" },
  { id: "vivid", label: "Vivid", tint: "rgba(255,0,120,0.10)" },
  { id: "dusk", label: "Dusk", tint: "rgba(70,40,160,0.30)" },
];

// Friends' RSVPs, shown as event stories
export const friendPlans = [
  { user: "maya.chen", initials: "MC", gradient: "violet", eventId: 1, status: "Going", ago: "2h" },
  { user: "jordanlee", initials: "JL", gradient: "blue", eventId: 1, status: "Going", ago: "5h" },
  { user: "sofiakim", initials: "SK", gradient: "sunset", eventId: 2, status: "Interested", ago: "1d" },
  { user: "devon.r", initials: "DR", gradient: "blue", eventId: 3, status: "Going", ago: "1d" },
  { user: "priya.s", initials: "PS", gradient: "violet", eventId: 2, status: "Going", ago: "2d" },
];

export const hostedPast = [
  { id: "p1", image: photos.market, date: "SAT, FEB 8", title: "Winter Warm-Up Potluck", stats: "38 attended" },
  { id: "p2", image: photos.festival, date: "SAT, JAN 18", title: "New Year Neighborhood Walk", stats: "22 attended" },
];
export const hostedStats = { 4: "18 going • 31 interested", 5: "9 going • 24 interested" };

export const reelViews = ["12.4K", "3.1K", "86.2K", "940", "21K", "5.7K"];

// ---------- Muse helpers (mocked locally so the demo never waits on the network) ----------

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

export function museAnswer(question, event) {
  const q = question.toLowerCase();
  const venue = event.place.split(" • ")[0];
  if (/solo|alone|by myself|myself|know anyone/.test(q)) return `Yes. Most people at ${event.title} come solo or in pairs, and the host keeps it welcoming. ${event.social.split(" and ")[0]} will be there if you want a familiar face.`;
  if (/wear|dress|outfit|bring/.test(q)) return "Casual and comfortable. Past attendees posted sneakers and layers. It gets cooler after sunset, so bring a jacket.";
  if (/park|parking|drive|get there|transit|bart|bus/.test(q)) return `Street parking near ${venue} fills up quickly. Transit or a bike is easier, and there’s a rack by the main entrance.`;
  if (/cost|price|free|ticket|pay|\$/.test(q)) return event.price === "Free" ? "It’s free. The host asks people to RSVP so they can plan for the headcount." : `Tickets are ${event.price} at the door. RSVPing on Instagram holds your spot.`;
  if (/time|when|start|late|end/.test(q)) return `It starts at ${event.time} on ${weekdayFull[event.weekday]}. The first 30 minutes are the easiest time to meet people.`;
  return `From the host’s posts and past events: ${event.summary} Ask me about cost, dress code, parking, or going solo for specifics.`;
}

// ---------- Search tab ----------

export const initialRecents = [
  { type: "query", label: "dance events under $20" },
  { type: "account", label: "bayareadance", sub: "Bay Area Dance Collective • Followed by sofiakim", initials: "BA", gradient: "violet" },
  { type: "event", label: "Golden Hour in the Park", sub: "Sat, Mar 14 • Mission Dolores Park", eventId: 1 },
  { type: "query", label: "live music this weekend" },
];
export const accounts = [
  { user: "bayareadance", name: "Bay Area Dance Collective", followers: "12.4K", gradient: "violet", note: "Followed by sofiakim", tags: "dance salsa night music" },
  { user: "sfgoldenhour", name: "Golden Hour SF", followers: "8,912", gradient: "sunset", note: "Followed by maya.chen + 3 more", tags: "park picnic sunset free live music" },
  { user: "illuminatesf", name: "Illuminate SF", followers: "31.2K", gradient: "blue", note: "Hosts Sunday Sessions", tags: "live music concerts free weekend" },
  { user: "missionmarkets", name: "Mission Night Markets", followers: "5,404", gradient: "blue", note: "Popular near you", tags: "food market night free" },
  { user: "sfrunclub", name: "SF Run Club", followers: "3,877", gradient: "violet", note: "Followed by jordanlee", tags: "run active outdoors free morning" },
  { user: "sf.weekender", name: "SF Weekender", followers: "46.1K", gradient: "sunset", note: "Things to do this weekend", tags: "weekend events social creative" },
  { user: "maya.chen", name: "Maya Chen", followers: "1,208", gradient: "violet", note: "Following", following: true, tags: "dance friends" },
  { user: "jordanlee", name: "Jordan Lee", followers: "984", gradient: "blue", note: "Following", following: true, tags: "music friends" },
  { user: "sofiakim", name: "Sofia Kim", followers: "2,311", gradient: "sunset", note: "Following", following: true, tags: "dance market friends" },
];

const allExperiences = Object.values(seedExperiences).flat();
export const searchPosts = [
  ...postSeeds.map((p, i) => ({ id: `sp${i}`, user: p.user, image: p.image, text: `${p.caption} ${p.place}` })),
  ...allExperiences.filter((x) => x.kind === "post").map((x) => ({ id: x.id, user: x.user, image: x.image, text: x.caption })),
];
export const searchReels = allExperiences.filter((x) => x.kind === "reel").map((x) => ({ id: x.id, user: x.user, image: x.image, text: x.caption, views: x.views }));

// Same rule as event search: keep matches, fall back to everything so a section is never empty
export function searchPool(query, pool, textOf) {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const matches = pool.filter((item) => words.some((w) => textOf(item).toLowerCase().includes(w)));
  return matches.length ? matches : pool;
}

export const searchSuggestions =["free events this weekend", "live music near me", "things my friends are going to"];

// ---------- Event detail ----------

export const attendees = [
  { user: "maya.chen", initials: "MC", gradient: "violet", note: "Going", following: true },
  { user: "jordanlee", initials: "JL", gradient: "blue", note: "Going", following: true },
  { user: "sofiakim", initials: "SK", gradient: "sunset", note: "Interested", following: true },
  { user: "luis.m", initials: "LM", gradient: "blue", note: "Going • Followed by maya.chen", following: false },
  { user: "nina.park", initials: "NP", gradient: "violet", note: "Interested • Followed by jordanlee", following: false },
];

const SIMILAR_STOP = new Set(["about", "their", "there", "with", "from", "your", "every", "level", "people", "after", "takes", "right"]);
const keywords = (e) => new Set(`${e.title} ${e.about}`.toLowerCase().match(/[a-z]{5,}/g)?.filter((w) => !SIMILAR_STOP.has(w)) ?? []);
export function similarScore(a, b) {
  const ka = keywords(a);
  let score = [...keywords(b)].filter((w) => ka.has(w)).length;
  if (a.price === b.price) score += 1;
  if (/maya|jordan|sofia|friend/i.test(b.social)) score += 1;
  return score;
}
export function similarReason(a, b) {
  if (/maya|jordan|sofia|friend/i.test(b.social)) return b.social.replace(/ and \d+ others/, " and others");
  if (a.price === "Free" && b.price === "Free") return "Also free • Similar crowd";
  return "Popular with people going to this";
}

export const reportReasons = ["It’s a scam or fake event", "Safety concern at this event", "Wrong date, place, or price", "Harassment or hate speech", "Something else"];

// ---------- Create ----------

// Promo kit items can each go out at a different time relative to the event
export const releaseOptions = [
  { id: "publish", label: "When I publish", days: null },
  { id: "week", label: "1 week before", days: 7 },
  { id: "three", label: "3 days before", days: 3 },
  { id: "day", label: "Day before", days: 1 },
  { id: "of", label: "Day of", days: 0 },
];
export const defaultRelease = { reel: "week", flyer: "publish", story: "day", adA: "week", adB: "three" };
// A release is either a preset id ("week") or a custom time ({ at: Date })
export const isCustomRelease = (r) => typeof r === "object" && r !== null;
export const releaseLabel = (r) => (isCustomRelease(r) ? "Custom time" : (releaseOptions.find((o) => o.id === r) ?? releaseOptions[0]).label);
export function defaultCustomRelease(start) {
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 2, 12, 0);
  if (d > new Date()) return { at: d };
  const soon = new Date(Date.now() + 60 * 60 * 1000);
  soon.setMinutes(Math.ceil(soon.getMinutes() / 15) * 15, 0, 0);
  return { at: soon };
}
export function releaseWhen(r, start) {
  if (isCustomRelease(r)) {
    if (r.at <= new Date()) return "That time has passed, so it posts when you publish";
    return `Posts ${shortDay(r.at)} at ${clock(r.at)}${r.at > start ? " (after the event starts)" : ""}`;
  }
  const id = r;
  const option = releaseOptions.find((o) => o.id === id) ?? releaseOptions[0];
  if (option.days === null) return "Posts when you publish the event";
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() - option.days, 9, 0);
  if (option.days === 0 && start.getHours() < 11) d.setHours(Math.max(0, start.getHours() - 2));
  if (d <= new Date()) return "That date has passed, so it posts when you publish";
  return `Posts ${shortDay(d)} at ${clock(d)}`;
}

export const audienceHelp = {
  Public: "Anyone on Instagram and Facebook can find it",
  "Followers only": "Only people who follow you",
  "Verified students": "Only people with a verified school email",
};
