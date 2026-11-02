# Instagram Events

<img alt="Instagram Logo" src="./assets/images/header-logo.png" width="60%">

**For years, Instagram has been where we share the night after it happens. We want it to be where the night begins.**

Instagram Events is a design concept for bringing event discovery into Instagram, so people find real-world events near them, including from hosts they don't follow yet, and actually show up. Muse, Meta's AI, does the work on both sides: it helps hosts create and promote an event from one sentence, and it helps people decide to go.

Built at **HackTX 2026** for Meta's **"Bringing people closer together with AI"** track by Ricardo Pena and Tiffany [ADD LAST NAME].

> **A design concept, not an official Meta product.** This project is not affiliated with, endorsed by or sponsored by Meta or Instagram. It's a purely designed, front-end demo of what an Events feature could look like. It is not meant to be a working backend for Instagram Events: every event, person and comment is demo data, and Muse's responses are scripted.

<p>
  <img src="docs/screenshots/01-home.jpg" width="19%" alt="Home feed with events near you">
  <img src="docs/screenshots/02-events.jpg" width="19%" alt="Events page with friends' RSVPs as stories">
  <img src="docs/screenshots/03-event.jpg" width="19%" alt="Event page with details at a glance">
  <img src="docs/screenshots/04-search.jpg" width="19%" alt="Search with Ask Muse and Browse by vibe">
  <img src="docs/screenshots/05-profile.jpg" width="19%" alt="Profile Events tab for hosts">
</p>

**Read more:** [Product brief](docs/product-brief.md) · [LinkedIn post](ADD-LINK) · [LinkedIn article](ADD-LINK) · [Demo video](ADD-LINK)

## Why Events in Instagram?

Young people look for things to do on Instagram, but events don't have a real place there. Posts from hosts you follow get buried in the feed, and the event posts the recommendation system shows from other accounts are rarely near you, happening soon or what you're in the mood for. Facebook has a mature events system, but most of our generation isn't on it.

We're both social events coordinators, and we feel this from the host's side too: our flyers reach our followers, and the people who'd love the event most never see it.

People stay home for four reasons, and each one has an answer in the design:

| Why people stay home | What Instagram Events does |
| --- | --- |
| They never hear about it | Muse ranks events near you and happening soon, from any host, and says why it picked each one |
| They don't know who's going | Friends' RSVPs show up as stories |
| They're unsure what to expect | Muse summarizes each event, reads the comments for how people feel, and answers questions like "Can I go solo?" |
| Hosts can't reach anyone new | A host writes one sentence, and Muse writes the listing and makes the cover, Reel, flyer, Story and ads |

After the event, posts and Reels that tag it show up on the event page, helping the next first-timer decide to go.

## What's in the demo

- **Home:** a "Happening near you" row and an Events button in the top bar. People can show fewer events on Home or hide them.
- **Events page:** search, friends' plans as stories, category chips, events near you and Muse-picked event cards that explain why they're there.
- **Event page:**
  - Map with drive time, who's going, a Muse summary and **Ask Muse**.
  - Comments, **Experiences** (posts and Reels that tag the event) and similar events.
  - Add to calendar, share and report.
- **Search:** plain-language search across events, accounts, posts and Reels, plus Browse by vibe.
- **Hosting:**
  - A three-step create flow, with Muse writing suggestions on the title and description.
  - Start and end times, location, tickets, links, and audience controls (public, followers only or verified students, approve RSVPs, safety filters).
  - A **Promo Kit**: a Reel, flyer, Story and two ads, each scheduled to post at its own time.
- **Profile:** an Events tab with Hosting, Past and Went to. "Went to" can be private, and any event can be hidden from it.

## How Muse fits

Every AI feature goes through one module, [`src/muse/`](src/muse/index.js). Screens import from `src/muse` and never from the implementation, so connecting real Muse means replacing one function at a time without touching the UI.

| Function | Where it's used | Would be backed by |
| --- | --- | --- |
| `searchEvents`, `searchPool` | Events and Search | Muse Spark |
| `summarizeComments` | Event page | Muse Spark |
| `answerQuestion` | Ask Muse | Muse Spark |
| `similarEvents` | Event page | Muse Spark |
| `suggestTitle`, `suggestDescription` | Create | Muse Spark |
| `coverLooks` | Create and Promo Kit | Muse Image |

Today these are scripted in [`src/muse/mock.js`](src/muse/mock.js) with simple rules over the demo data, so the demo works offline and never waits on the network. `src/muse/index.js` documents the inputs and outputs each function should keep when it's swapped for a real call.

## Running it

You need Node.js and either the Expo Go app on your phone or a simulator.

```bash
npm install
npm start
```

Then press `i` for the iOS Simulator or `a` for an Android emulator, or scan the QR code with Expo Go. No accounts, keys or environment variables are needed.

## Project layout

- `App.js`: the app's entry point
- `src/ui/`: every screen and component
  - `data.js`: all of the demo data
  - `EventsApp.jsx`: switches between screens
  - `HomeScreen`, `EventsScreen`, `DetailScreen`, `SearchScreen`, `ProfileScreen`, `CreateScreen`, `PromoKit`: one file per screen
- `src/muse/`: the Muse layer (`index.js` is the interface, `mock.js` the scripted version)
- `docs/`: the product brief and screenshots

## What we'd explore next

- Connect Ask Muse and search to Muse Spark, then the Promo Kit images to Muse Image.
- Ranking events when someone's friend graph is thin.
- Recommending events from hosts you don't follow without it feeling like an ad.
- Keeping attendance private and real-world events safe.

If you work on Instagram, Facebook Events or Muse and have thoughts on any of these, we'd love to hear them.

## Credits and license

This project started as a fork of [instagram-clone-app](https://github.com/hernanhawryluk/instagram-clone-app) by [Hernán Hawryluk](https://github.com/hernanhawryluk). His commit history is kept in this repository, and his work is used under the MIT License (see [LICENSE](./LICENSE)).

Instagram, Facebook and Muse are trademarks of Meta Platforms, Inc. This project is an independent student concept and is not affiliated with Meta.

MIT. Original work © 2023 Hernán Pablo Hawryluk.
