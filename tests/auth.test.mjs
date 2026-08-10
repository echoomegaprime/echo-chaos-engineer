import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app, timingSafeEqual, authMiddleware } from '../src/index.ts';

test('timingSafeEqual: identical strings match', () => {
  assert.equal(timingSafeEqual('a-real-secret-key', 'a-real-secret-key'), true);
});

test('timingSafeEqual: different values of equal length do not match', () => {
  assert.equal(timingSafeEqual('a-real-secret-key', 'a-fake-secret-key'), false);
});

test('timingSafeEqual: different-length values do not match', () => {
  assert.equal(timingSafeEqual('short', 'a-much-longer-value'), false);
});

test('timingSafeEqual: null/undefined never match, in either position', () => {
  assert.equal(timingSafeEqual(undefined, 'secret'), false);
  assert.equal(timingSafeEqual('secret', undefined), false);
  assert.equal(timingSafeEqual(null, 'secret'), false);
  assert.equal(timingSafeEqual(undefined, undefined), false);
});

test('authMiddleware: fails closed when ECHO_API_KEY is unset, even with no header at all', () => {
  const env = { ECHO_API_KEY: '' };
  const result = authMiddleware(undefined, undefined, env);
  assert.notEqual(result, null);
  assert.equal(result.status, 401);
});

test('authMiddleware: rejects a wrong key', () => {
  const env = { ECHO_API_KEY: 'real-secret' };
  const result = authMiddleware('wrong-secret', undefined, env);
  assert.notEqual(result, null);
  assert.equal(result.status, 401);
});

test('authMiddleware: accepts the correct key', () => {
  const env = { ECHO_API_KEY: 'real-secret' };
  const result = authMiddleware('real-secret', undefined, env);
  assert.equal(result, null);
});

// End-to-end tests via app.request() -- exercise the actual global auth
// middleware and route table, not a reimplementation of it.

const ENV = { ECHO_API_KEY: 'real-secret' };

test('GET / (root) remains public with no credentials', async () => {
  const res = await app.request('/', {}, ENV);
  assert.equal(res.status, 200);
});

test('GET /experiments without credentials is rejected', async () => {
  const res = await app.request('/experiments', {}, ENV);
  assert.equal(res.status, 401);
});

test('GET /stats without credentials is rejected', async () => {
  const res = await app.request('/stats', {}, ENV);
  assert.equal(res.status, 401);
});

test('GET /safety without credentials is rejected', async () => {
  const res = await app.request('/safety', {}, ENV);
  assert.equal(res.status, 401);
});

test('POST /experiments/:id/run without credentials is rejected -- cannot trigger a chaos experiment unauthenticated', async () => {
  const res = await app.request('/experiments/fake-id/run', { method: 'POST' }, ENV);
  assert.equal(res.status, 401);
});

test('POST /experiments/:id/run with a valid key but no X-Commander-Override still passes the auth boundary (may 404 on the missing experiment, but must not be 401)', async () => {
  const res = await app.request(
    '/experiments/fake-id/run',
    { method: 'POST', headers: { 'X-Echo-API-Key': 'real-secret' } },
    ENV,
  );
  assert.notEqual(res.status, 401);
});

test('GET /experiments with a wrong key is rejected', async () => {
  const res = await app.request('/experiments', { headers: { 'X-Echo-API-Key': 'wrong-secret' } }, ENV);
  assert.equal(res.status, 401);
});

test('every protected route fails closed when ECHO_API_KEY is unset, even with a header equal to the string "undefined"', async () => {
  const res = await app.request(
    '/experiments',
    { headers: { 'X-Echo-API-Key': 'undefined' } },
    { ECHO_API_KEY: undefined },
  );
  assert.equal(res.status, 401);
});
