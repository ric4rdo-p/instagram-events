# Instagram Events: Making Instagram Where the Night Begins

*By Ricardo Pena and Tiffany Johnson · Built at HackTX 2026 for Meta's "Bringing people closer together with AI" track*

**For years, Instagram has been where we share the night after it happens. We want it to be where the night begins.**

Instagram Events is our concept for bringing real event discovery into the app our generation already uses, so people find things happening near them, including from hosts they don't follow yet, and actually show up.

## The problem

Young people already look for things to do on Instagram, but events don't have a real place there. Posts from hosts you follow get buried among everything else in your feed. The event posts the recommendation system shows you from other accounts are rarely near you, happening soon, or what you're in the mood for. Facebook has a mature events system, but most of our generation isn't on it.

As social events coordinators, we feel this from the host's side every week. Our flyers reach our followers, and the people who'd love the event most never see it. A friend of ours found her dance community only by luck, through a friend of a friend, because the group only posts on Facebook. Finding your people shouldn't depend on luck.

## How it works

People stay home for four reasons, and each one has an answer in the product. Muse, Meta's AI, does the work on both sides.

**They never hear about it.** Muse ranks events near you and happening soon, from any host, and tells you why it picked each one, like "Because you follow sf.funcheap."

**They don't know who's going.** Friends' RSVPs show up as stories, so you see who's in before you decide.

**They're unsure what to expect.** Muse sums up each event, reads the comments to tell you how people feel about it, and answers questions like "Can I go solo?" or "Is parking easy?"

**Hosts can't reach anyone new.** A host describes the event in a few words, and Muse writes the listing, makes the cover, Reel, flyer, Story and ads, and shares it to Instagram and Facebook Events.

After the event, posts and Reels that tag it show up on the event page, which helps the next first-timer decide to go. Events opens from a calendar icon on Home, a "Happening near you" row can be shrunk or hidden, and the events you went to can be kept private.

## Why Meta

Meta already has every piece: Instagram's audience and social graph, Facebook Events' supply and host tools, and Muse to rank, summarize and create. Instagram Events connects them, giving Facebook Events a new audience and giving Instagram a reason to leave the house.

## How we'd measure it

The north star is events attended per person each month, not time spent in the app. Alongside it we'd watch RSVPs to hosts people didn't already follow, repeat visits to the same host, and posts and Reels shared from each event. If reports, hides of the Home events row or dismissed recommendations climb, the recommendations are reaching the wrong people.

## Where it stands

Instagram Events is a design concept. We built it as a clickable prototype in React Native with Expo, and it isn't meant to be a working backend: the events and people are demo data, and Muse's responses are scripted. Every AI feature already goes through one module, so real Muse Spark and Muse Image calls could replace the scripted ones without changing the screens.

The code is on GitHub: [github.com/ric4rdo-p/instagram-events](https://github.com/ric4rdo-p/instagram-events)

## What we'd love your take on

We're still working through three questions. How should events be ranked when someone's friend graph is thin? How do you recommend events from hosts people don't follow without it feeling like an ad? And how do you keep attendance private and real-world events safe?

If you're on the Instagram, Facebook Events or Muse teams at Meta, we'd value your perspective, and we'd love to build this with you.

*Instagram Events is a student concept from HackTX 2026 and is not affiliated with Meta.*
