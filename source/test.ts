/* tslint:disable:await-promise */
import test from 'ava';
import delay from 'delay';
import mapAgeCleaner = require('.');

interface Context {
	map: Map<string, {maxAge: number; data: any}>;
}

test.beforeEach(t => {
	t.context.map = new Map();
});

test('auto removal on initial Map', async t => {
	const map = new Map([
		['unicorn', {maxAge: Date.now() + 1000, data: '🦄'}]
	]);
	mapAgeCleaner(map);

	t.true(map.has('unicorn'));

	await delay(400);

	t.true(map.has('unicorn'));

	await delay(605);

	t.false(map.has('unicorn'));
});

test('auto removal', async t => {
	const {map} = t.context as Context;
	mapAgeCleaner(map);
	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄'});

	t.true(map.has('unicorn'));

	await delay(400);

	t.true(map.has('unicorn'));

	await delay(605);

	t.false(map.has('unicorn'));
});

test('return map instance', async t => {
	const map = mapAgeCleaner(new Map([
		['unicorn', {maxAge: Date.now() + 1000, data: '🦄'}]
	]));

	t.true(map.has('unicorn'));

	await delay(1005);

	t.false(map.has('unicorn'));
});

test('use other property name', async t => {
	const map = new Map([
		['unicorn', {timestamp: Date.now() + 1000, data: '🦄'}]
	]);

	mapAgeCleaner(map, 'timestamp');

	t.true(map.has('unicorn'));

	await delay(1005);

	t.false(map.has('unicorn'));
});

test('order on reset', async t => {
	const {map} = t.context as Context;
	mapAgeCleaner(map);

	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄'});

	await delay(400);
	map.set('rainbow', {maxAge: Date.now() + 1000, data: '🌈'});
	await delay(100);
	map.set('hooray', {maxAge: Date.now() + 1000, data: '🎉'});

	await delay(300);

	map.set('rainbow', {maxAge: Date.now() + 1000, data: '🌈🦄'});

	await delay(205);

	t.false(map.has('unicorn'));
	t.true(map.has('rainbow'));
	t.true(map.has('hooray'));
	t.is(map.size, 2);

	await delay(505);

	t.false(map.has('unicorn'));
	t.true(map.has('rainbow'));
	t.false(map.has('hooray'));
	t.is(map.size, 1);

	await delay(305);

	t.false(map.has('unicorn'));
	t.false(map.has('rainbow'));
	t.false(map.has('hooray'));
	t.is(map.size, 0);
});

test('reset currently processed item', async t => {
	const {map} = t.context as Context;
	mapAgeCleaner(map);

	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄'});
	await delay(200);
	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄🦄'});
	await delay(200);
	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄🦄🦄'});
	await delay(400);
	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄🦄🦄🦄'});
	await delay(300);

	t.true(map.has('unicorn'));
});

test('reset currently processed item and process next', async t => {
	const {map} = t.context as Context;
	mapAgeCleaner(map);

	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄'});
	await delay(500);
	map.set('rainbow', {maxAge: Date.now() + 1000, data: '🌈'});

	await delay(200);
	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄🦄'});
	await delay(200);
	map.set('unicorn', {maxAge: Date.now() + 1000, data: '🦄🦄'});
	await delay(400);

	t.true(map.has('unicorn'));
	t.true(map.has('rainbow'));
	t.is(map.size, 2);

	await delay(205);

	t.true(map.has('unicorn'));
	t.false(map.has('rainbow'));
	t.is(map.size, 1);

	await delay(405);

	t.false(map.has('unicorn'));
	t.false(map.has('rainbow'));
	t.is(map.size, 0);
});

test('cleanup items which have same expiration timestamp', async t => {
	const map = new Map([
		['unicorn', {maxAge: Date.now() + 1000, data: '🦄'}],
		['rainbow', {maxAge: Date.now() + 1000, data: '🌈'}]
	]);
	mapAgeCleaner(map);

	t.is(map.size, 2);

	await delay(1005);

	t.is(map.size, 0);
});
