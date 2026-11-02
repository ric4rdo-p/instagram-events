// Muse: the one place the app asks for AI.
//
// Screens import only from here, never from the implementation. Today every
// function is scripted in ./mock.js so the demo works offline. Connecting real
// Muse means replacing one function at a time without touching the UI.
//
// | Function             | Used on              | Would be backed by |
// | -------------------- | -------------------- | ------------------ |
// | searchEvents         | Events, Search       | Muse Spark         |
// | searchPool           | Search (accounts...) | Muse Spark         |
// | summarizeComments    | Event page           | Muse Spark         |
// | answerQuestion       | Event page, Ask Muse | Muse Spark         |
// | similarEvents        | Event page           | Muse Spark         |
// | suggestTitle         | Create               | Muse Spark         |
// | suggestDescription   | Create               | Muse Spark         |
// | coverLooks           | Create, Muse Studio  | Muse Image         |
//
// Contracts (keep these shapes when swapping in real calls):
//   searchEvents(query, pool?)          -> Event[]  (never empty: falls back to pool)
//   searchPool(query, items, textOf)    -> items[]  (never empty: falls back to items)
//   summarizeComments(comments)         -> { message, count } | null
//   answerQuestion(question, event)     -> string
//   similarEvents(event, pool?, limit?) -> { event, reason }[]
//   suggestTitle(text)                  -> string | null  (null = nothing to suggest)
//   suggestDescription(text)            -> string | null
//   coverLooks                          -> { id, label, tint }[]
//
// Real calls will be async; the screens will need to await them and show a
// loading state. That change is deliberately left for when Muse is connected.

export {
  searchEvents,
  searchPool,
  summarizeComments,
  answerQuestion,
  similarEvents,
  suggestTitle,
  suggestDescription,
  coverLooks,
} from "./mock";
