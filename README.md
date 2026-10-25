# Instagram Events

<img alt="Instagram Logo" src="./assets/images/header-logo.png" width="60%">

A hackathon demo that brings **Events** into Instagram. Find things to do near you, see which events your friends are going to, and host your own event without leaving the app.

This project is a fork of [instagram-clone-app](https://github.com/hernanhawryluk/instagram-clone-app) by [Hernán Hawryluk](https://github.com/hernanhawryluk), who wrote the original Instagram clone it started from. His commit history is kept in this repository, and his work is used under the MIT License (see [LICENSE](./LICENSE)).

## Why Events in Instagram?

Most plans start on Instagram already. People find a night market in a Reel, see a friend's story from a show, or DM a flyer to the group chat. Then they leave the app to buy tickets, find the address, check who else is going and remember the date.

Instagram Events keeps all of that in one place:

- **For people going out:** discover events through people you follow, see which friends are interested or going, and get the details in one tap.
- **For hosts:** turn your followers into an audience. Create an event in a few steps, let Muse (the built-in AI assistant) write the details and make the promo content, and schedule posts that sell the event for you.
- **For Instagram:** events turn scrolling into real-world plans, and give creators, venues and small businesses a reason to post more.

## Features

### Home feed
- An **events row** in the Home feed with events near you and events your friends are going to.
- **Sponsored event posts** show up in the feed with a **Get tickets** or **RSVP** button.
- Choose how many events appear on Home: all of them, fewer or none.

### Events tab
- **Search** events by name, place or vibe.
- **Friend plans** in a story-style row show what friends are going to. Tap one to watch it like a story and jump straight to the event.
- **Category chips** to filter by type of event.
- A **Happening near you** section, plus full event cards.
- One-tap **I'm interested** on every card.

### Event page
- A cover photo, the host, date and time, price, and interested and going counts.
- A **map** of the venue and its distance from you.
- **Who's going**, including friends.
- **Ask Muse:** ask questions about the event ("Is it kid-friendly?", "Where do I park?") and get an answer right away.
- **Comments** and **Experiences**, where attendees share photos and videos from the event.
- **Similar events** to keep exploring.
- Share, add to calendar or report the event, with anonymous reporting.

### Search
- Results for accounts, posts, reels and events in one place, with "See more" on each.
- A **Muse summary** of the matching events, with filters.

### Hosting an event
Tap **+** and choose **Event**, or tap **Host** on the Events tab.

1. **Basics:** add a cover photo, or have Muse generate one. Have Muse write the event name and description for you.
2. **Details:** pick the start and end time from a calendar and time picker, then set the location, free or paid tickets, links and audience (public, followers only or verified students). You can also require approval for RSVPs and turn on safety filters. Muse explains who the event will be recommended to.
3. **Review and share:** preview the event, choose where to share it (Instagram and Facebook Events), and build a **Promo Kit**.

### Promo Kit
- Muse makes a **Reel, a flyer, a story and two ads** for your event. You can regenerate any of them or upload your own photo or video.
- **Schedule each piece:** post it right away, a week before, three days before, a day before or the day of the event, or pick an exact date and time.
- Saved pieces are listed before you publish, with their scheduled time.

### Profile
- An **Events tab** on your profile with events you're **Hosting**, **Past** events and events you **Went to**.
- Make the "Went to" list private, or hide individual events from it.

## Status: demo only, no backend

The app **does not use a backend right now**. Every event, post, comment and person comes from built-in demo data in `src/ui/data.js`. Nothing you create or change is saved, and everything resets when the app restarts. Muse's answers, generated covers and promo content are scripted for the demo, not produced by real AI.

The repo still has some Supabase groundwork from earlier work: `src/services/`, `supabase/migrations/` and `scripts/smoke-test.mjs`. **The app doesn't load or call any of it.** It was written for the original clone (users, posts, stories, chats), and it has no tables for events. It's kept as a starting point for connecting a real backend later.

## Running it

You need Node.js and the Expo Go app (on your phone) or a simulator.

```bash
npm install
npm start
```

Then press `i` for the iOS Simulator, `a` for an Android emulator, or scan the QR code with Expo Go on your phone. No accounts, keys or `.env` file are needed.

## Project layout

- `App.js`: the app's entry point
- `src/ui/`: every screen and component in the demo
  - `data.js`: all the demo data
  - `EventsApp.jsx`: switches between screens
  - `HomeScreen`, `EventsScreen`, `DetailScreen`, `SearchScreen`, `ProfileScreen`, `CreateScreen`, `PromoKit`: one file per screen
- `src/services/`, `supabase/`, `scripts/`: unused backend groundwork (see above)

## License

MIT. Original work © 2023 Hernán Pablo Hawryluk.
