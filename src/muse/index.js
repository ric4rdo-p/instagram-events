// Muse: the one place the app asks for AI.
//
// Screens import only from here, never from the implementation. Today every
// function is scripted in ./mock.js so the demo works offline. Connecting real
// Muse means replacing one function at a time without touching the UI.
//
// | Function             | Used on              | Would be backed by |
// | -------------------- | -------------------- | ------------------ |
// | rankEvents           | Home, Events         | Muse Spark         |
// | searchEvents         | Events, Search       | Muse Spark         |
// | searchPool           | Search (accounts...) | Muse Spark         |
// | summarizeEvent       | Event page           | Muse Spark         |
// | summarizeComments    | Event page           | Muse Spark         |
// | answerQuestion       | Event page, Ask Muse | Muse Spark         |
// | similarEvents        | Event page           | Muse Spark         |
// | suggestTitle         | Create               | Muse Spark         |
// | suggestDescription   | Create               | Muse Spark         |
// | coverLooks           | Create, Promo Kit    | Muse Image         |
// | summarizeSearch      | Events, Search       | Muse Spark         |
// | draftEventDetails    | Create               | Muse Spark         |
// | audienceMatch        | Create               | Muse Spark         |
// | reelCaptions         | Promo Kit            | Muse Spark         |
// | adVariations         | Promo Kit            | Muse Spark         |
// | recommendationReason | Home, Events         | Muse Spark         |
//
// Contracts (keep these shapes when swapping in real calls):
//   rankEvents(pool?)                   -> Event[]  (best first)
//   searchEvents(query, pool?)          -> Event[]  (never empty: falls back to pool)
//   searchPool(query, items, textOf)    -> items[]  (never empty: falls back to items)
//   summarizeEvent(event)               -> string
//   summarizeComments(comments)         -> { message, count } | null
//   answerQuestion(question, event)     -> string
//   similarEvents(event, pool?, limit?) -> { event, reason }[]
//   suggestTitle(text)                  -> string | null  (null = nothing to suggest)
//   suggestDescription(text)            -> string | null
//   coverLooks                          -> { id, label, tint }[]
//   summarizeSearch(results)            -> { count, text }
//   draftEventDetails(brief?)           -> { title, description }
//   audienceMatch(audience, venue?)     -> string
//   reelCaptions(draft)                 -> string[]
//   adVariations(draft)                 -> { id, headline, body, cta }[]
//   recommendationReason(event)         -> string
//
// Real calls will be async; the screens will need to await them and show a
// loading state. That change is deliberately left for when Muse is connected.

export {
  rankEvents,
  searchEvents,
  searchPool,
  summarizeComments,
  summarizeEvent,
  answerQuestion,
  similarEvents,
  suggestTitle,
  suggestDescription,
  coverLooks,
  summarizeSearch,
  draftEventDetails,
  audienceMatch,
  reelCaptions,
  adVariations,
  recommendationReason,
} from "./mock";
