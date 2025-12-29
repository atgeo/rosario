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
});

console.log(r.current());

r.next();
console.log(r.current());
```
