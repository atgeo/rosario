# rosario

![npm version](https://img.shields.io/npm/v/rosario)

## Installation

```bash
npm install rosario
```

## Usage

```bash
import rosario from 'rosario';

const r = await rosario({
  mystery: 'joyful',
  lang: 'en',
});

console.log(r.current());

r.next();
console.log(r.current());
```
