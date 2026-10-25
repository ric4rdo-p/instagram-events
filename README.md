# Instagram Events

<img alt="Instagram Logo" src="./assets/images/header-logo.png" width="60%">

A hackathon demo that adds **Events** to Instagram: discover events, see what friends are going to, and host your own event with a Muse-assisted creation flow and promo kit.

This project is a fork of [instagram-clone-app](https://github.com/hernanhawryluk/instagram-clone-app) by [Hernán Hawryluk](https://github.com/hernanhawryluk), who wrote the original Instagram clone it started from. His commit history is preserved in this repository, and his work is used under the MIT License (see [LICENSE](./LICENSE)).

## Status

The app runs entirely on built-in demo data (`src/ui/data.js`). Nothing is saved, and it does not connect to a backend yet.

## Running it

```bash
npm install
npm start
```

Then press `i` for the iOS Simulator, `a` for an Android emulator, or scan the QR code with Expo Go on your phone.

## Project layout

- `App.js`: app entry
- `src/ui/`: every screen and component in the demo
- `src/services/`, `supabase/`, `scripts/smoke-test.mjs`: Supabase backend groundwork, not used by the app yet

## License

MIT. Original work © 2023 Hernán Pablo Hawryluk.
