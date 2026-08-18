# rosario

![npm version](https://img.shields.io/npm/v/rosario)

A tiny Holy Rosary prayer engine for web apps, providing programmatic access to the prayers and mysteries.

## Languages

- English (en)
- Latin (la)
- Italian (it)
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
  includeConcludingPrayers: true,
});

console.log(r.current());

r.next();
console.log(r.current());
```

`includeConcludingPrayers` is optional and defaults to `false`. When `true`, Hail Holy Queen and the closing prayer are appended after the fifth decade.
