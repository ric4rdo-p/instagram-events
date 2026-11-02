# Instagram Events: Product Brief

*A student design concept from HackTX 2026 (Meta track: "Bringing people closer together with AI"). Not an official Meta product, and not affiliated with Meta.*

Instagram Events brings Facebook-quality event discovery into the app our generation already uses, so people find real-world events near them, including from hosts they don't follow yet, and actually show up.

**For years, Instagram has been where we share the night after it happens. We want it to be where the night begins.**

## The problem

Young people look for things to do on Instagram, but events have no real place there. Posts from hosts you follow get buried in the feed, and the event posts the recommendation system surfaces from other accounts are rarely near you, happening soon, or what you're in the mood for. Facebook has a mature events system, but most of our generation isn't on it.

As social events coordinators, we feel this from the host's side: our flyers reach our followers, and the people who'd love the event most never see it. A friend of ours found her dance community only by luck, through a friend of a friend, because the group only posts on Facebook.

## How it works

People stay home for four reasons. Each one has an answer in the product, and Muse does the work on both sides.

| Why people stay home | What Instagram Events does |
| --- | --- |
| They never hear about it | Muse ranks events near you and happening soon, from any host, and explains each pick ("You've been saving dance reels") |
| They don't know who's going | Friends' RSVPs appear as stories |
| They're unsure what to expect | Muse summarizes each event, reads the comments for how people feel, and answers questions like "Can I go solo?" |
| Hosts can't reach anyone new | A host writes one sentence; Muse writes the listing, generates the cover, Reel, flyer and Story, and cross-posts to Facebook Events |

After the event, attendees' posts and Reels that tag it show up on the event page, helping the next first-timer decide to go. Events opens from a calendar icon on Home, with a "Happening near you" module people can shrink or hide, and attendance can be kept private.

## Why Meta

Meta already has every piece: Instagram's audience and social graph, Facebook Events' supply and host tools, and Muse to rank, summarize and create. Instagram Events connects them, giving Facebook Events a new audience and giving Instagram a reason to leave the house.

## How we'd measure it

The north star is **events attended per user per month**, not time in the app.

- **Supporting signals:** RSVPs to hosts the user didn't follow, repeat attendance with the same host, and posts and Reels shared per event.
- **Guardrails:** reports, hides of the Home events module, and dismissed recommendations.

## Where it stands

This is a design concept, built as a front-end demo in React Native with Expo. It is not meant to be a working backend for Instagram Events. Every event and person is demo data, and Muse's responses are scripted. Every AI feature already goes through one module (`src/muse/`), so real Muse Spark and Muse Image calls can replace the scripted ones without changing the screens.

## What we'd love help with

- How should events be ranked when someone's friend graph is thin?
- How do you recommend events from unknown hosts without it feeling like an ad?
- How do you keep attendance private and real-world events safe?

We'd love to build this with the Instagram, Facebook Events and Muse teams at Meta.
