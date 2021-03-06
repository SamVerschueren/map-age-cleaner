# map-age-cleaner

![CI](https://github.com/SamVerschueren/map-age-cleaner/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/SamVerschueren/map-age-cleaner/badge.svg?branch=master)](https://codecov.io/gh/SamVerschueren/map-age-cleaner?branch=master)

> Automatically cleanup expired items in a Map


## Install

```
$ npm install map-age-cleaner
```


## Usage

```js
import mapAgeCleaner = require('map-age-cleaner');

const map = new Map([
	['unicorn', {data: '🦄', maxAge: Date.now() + 1000}]
]);

mapAgeCleaner(map);

map.has('unicorn');
//=> true

// Wait for 1 second...

map.has('unicorn');
//=> false
```

> **Note**: Items have to be ordered ascending based on the expiry property. This means that the item which will be expired first, should be in the first position of the `Map`.


## API

### mapAgeCleaner(map, [property])

Returns the `Map` instance.

#### map

Type: `Map`

Map instance which should be cleaned up.

#### property

Type: `string`<br>
Default: `maxAge`

Name of the property which olds the expiry timestamp.


## Related

- [expiry-map](https://github.com/SamVerschueren/expiry-map) - A `Map` implementation with expirable items
- [expiry-set](https://github.com/SamVerschueren/expiry-set) - A `Set` implementation with expirable keys
- [mem](https://github.com/sindresorhus/mem) - Memoize functions


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)


---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-map-age-cleaner?utm_source=npm-map-age-cleaner&utm_medium=referral&utm_campaign=enterprise">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
