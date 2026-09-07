# rosario

![npm version](https://img.shields.io/npm/v/rosario)

A tiny Holy Rosary prayer engine for web apps, providing programmatic access to the prayers and mysteries.

## Languages

- English (en)
- Latin (la)
- Italian (it)
- Spanish (es)
- Portuguese (pt)
- French (fr)
- German (de)
- Arabic (ar)

## Installation

```bash
npm install rosario
```

## Usage

```javascript
import rosario from 'rosario';

const r = await rosario({
  mystery: 'joyful',
  lang: 'en',
});

while (!r.done()) {
  console.log(r.current());
  r.next();
}
```

`current()` returns `key` and `text`. Decade prayers also include `mystery` (`set`, `key`, `text`, `decade` 1–5). Opening and concluding prayers omit it.

`total` is the number of prayers in the session (73 by default, 71 when `includeConcludingPrayers` is `false`). It is not on `current()`.

`includeConcludingPrayers` is optional and defaults to `true`. Hail Holy Queen and the closing prayer follow the fifth decade. Pass `false` to stop after the fifth Fatima prayer.

`done()` is true after `next()` on the last prayer (the closing prayer, or the fifth Fatima prayer when concluding prayers are omitted). `current()` still returns that last prayer.
